import { act, renderHook } from "@testing-library/react";
import { useS3DirectoryImages } from "@/components/gallery/useS3DirectoryImages";

vi.mock("@/components/siteConfig", () => ({
  useSiteConfig: () => ({
    awsConfig: { bucketName: "config-bucket", region: "us-west-2" },
    thumbnailPrefix: "thumb_",
  }),
}));

const fetchMock = vi.fn();
const bucketUrl = "https://config-bucket.s3.us-west-2.amazonaws.com";

const contents = (key: string, size = 1) => `<Contents><Key>${key}</Key><Size>${size}</Size></Contents>`;

const listing = (keys: string[], nextToken?: string) => ({
  ok: true,
  text: async () => `<?xml version="1.0" encoding="UTF-8"?>
    <ListBucketResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
      ${keys.map(key => contents(key)).join("")}
      ${nextToken ? `<NextContinuationToken>${nextToken}</NextContinuationToken>` : ""}
    </ListBucketResult>`,
});

const rawListing = (body: string) => ({ ok: true, text: async () => `<ListBucketResult>${body}</ListBucketResult>` });

const getImages = async (path = "gallery/") => {
  const { result } = renderHook(() => useS3DirectoryImages(path));
  await act(() => new Promise(resolve => setTimeout(resolve)));
  return result.current;
};

const requestedUrls = () => fetchMock.mock.calls.map(call => new URL(call[0]));

const url = (key: string, base = bucketUrl) => `${base}/${key}`;

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  vi.unstubAllEnvs();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

test("useS3DirectoryImages_withPath_shouldListBucketWithPathPrefix", async () => {
  fetchMock.mockResolvedValue(listing([]));

  await getImages("gallery/2024/");

  const [request] = requestedUrls();
  expect(request.origin).toBe(bucketUrl);
  expect(request.searchParams.get("list-type")).toBe("2");
  expect(request.searchParams.get("prefix")).toBe("gallery/2024/");
});

test("useS3DirectoryImages_withGalleryUrlEnv_shouldListAndLinkFromEnvUrl", async () => {
  vi.stubEnv("NEXT_PUBLIC_GALLERY_URL", "https://cdn.example.com");
  fetchMock.mockResolvedValue(listing(["gallery/a.jpg"]));

  const images = await getImages();

  expect(requestedUrls()[0].origin).toBe("https://cdn.example.com");
  expect(images[0].url).toBe(url("gallery/a.jpg", "https://cdn.example.com"));
});

test("useS3DirectoryImages_withContinuationToken_shouldListNextPage", async () => {
  fetchMock
    .mockResolvedValueOnce(listing(["gallery/a.jpg"], "page2"))
    .mockResolvedValueOnce(listing(["gallery/b.jpg"]));

  const images = await getImages();

  expect(requestedUrls()[1].searchParams.get("continuation-token")).toBe("page2");
  expect(images.map(x => x.alt)).toEqual(["a.jpg", "b.jpg"]);
});

test("useS3DirectoryImages_withJpgPngSvg_shouldReturnEachImage", async () => {
  fetchMock.mockResolvedValue(listing(["gallery/a.jpg", "gallery/b.png", "gallery/c.svg"]));

  const images = await getImages();

  expect(images).toEqual([
    { url: url("gallery/a.jpg"), thumbUrl: undefined, alt: "a.jpg" },
    { url: url("gallery/b.png"), thumbUrl: undefined, alt: "b.png" },
    { url: url("gallery/c.svg"), thumbUrl: undefined, alt: "c.svg" },
  ]);
});

test("useS3DirectoryImages_withNonImageFiles_shouldExcludeThem", async () => {
  fetchMock.mockResolvedValue(listing(["gallery/a.jpg", "gallery/notes.txt", "gallery/b.gif"]));

  const images = await getImages();

  expect(images.map(x => x.alt)).toEqual(["a.jpg"]);
});

test("useS3DirectoryImages_withEmptyOrKeylessObjects_shouldExcludeThem", async () => {
  fetchMock.mockResolvedValue(rawListing(
    contents("gallery/a.jpg") +
    contents("gallery/empty.jpg", 0) +
    "<Contents><Key>gallery/nosize.jpg</Key></Contents>" +
    "<Contents><Size>1</Size></Contents>"
  ));

  const images = await getImages();

  expect(images.map(x => x.alt)).toEqual(["a.jpg"]);
});

test("useS3DirectoryImages_withThumbnailAndImage_shouldPairThumbUrlWithImage", async () => {
  fetchMock.mockResolvedValue(listing(["gallery/a.jpg", "gallery/thumb_a.jpg"]));

  const images = await getImages();

  expect(images).toEqual([
    { url: url("gallery/a.jpg"), thumbUrl: url("gallery/thumb_a.jpg"), alt: "a.jpg" },
  ]);
});

test("useS3DirectoryImages_withThumbnailOnly_shouldExcludeIt", async () => {
  fetchMock.mockResolvedValue(listing(["gallery/thumb_a.jpg"]));

  const images = await getImages();

  expect(images).toEqual([]);
});

test("useS3DirectoryImages_withNoContents_shouldReturnEmpty", async () => {
  fetchMock.mockResolvedValue(listing([]));

  const images = await getImages();

  expect(images).toEqual([]);
});

test("useS3DirectoryImages_whenFetchRejects_shouldLogErrorAndReturnEmpty", async () => {
  const error = new Error("network");
  fetchMock.mockRejectedValue(error);
  const consoleError = vi.spyOn(console, "error").mockImplementation(() => { });

  const images = await getImages();

  expect(images).toEqual([]);
  expect(consoleError).toHaveBeenCalledWith(error);
  consoleError.mockRestore();
});

test("useS3DirectoryImages_whenResponseNotOk_shouldLogErrorAndReturnEmpty", async () => {
  fetchMock.mockResolvedValue({ ok: false, status: 403 });
  const consoleError = vi.spyOn(console, "error").mockImplementation(() => { });

  const images = await getImages();

  expect(images).toEqual([]);
  expect(consoleError).toHaveBeenCalledWith(new Error(`Listing ${bucketUrl} failed with 403`));
  consoleError.mockRestore();
});
