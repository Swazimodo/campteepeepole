import { renderHook } from "@testing-library/react";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { useS3DirectoryImages } from "@/components/gallery/useS3DirectoryImages";

const send = vi.fn();

vi.mock("@/components/awsWrappers/s3", () => ({
  useS3Client: () => ({ send }),
}));

vi.mock("@/components/siteConfig", () => ({
  useSiteConfig: () => ({
    awsConfig: { bucketName: "config-bucket" },
    thumbnailPrefix: "thumb_",
  }),
}));

const listing = (...keys: string[]) => ({
  Contents: keys.map(Key => ({ Key, Size: 1 })),
});

const getImages = (path = "gallery/") =>
  renderHook(() => useS3DirectoryImages(path)).result.current;

const url = (key: string, bucket = "config-bucket") => `https://${bucket}.s3.amazonaws.com/${key}`;

beforeEach(() => {
  send.mockReset();
  vi.unstubAllEnvs();
});

test("useS3DirectoryImages_withPath_shouldListBucketWithPathPrefix", async () => {
  send.mockResolvedValue(listing());

  await getImages("gallery/2024/");

  const command = send.mock.calls[0][0] as ListObjectsV2Command;
  expect(command.input).toEqual({ Bucket: "config-bucket", Prefix: "gallery/2024/" });
});

test("useS3DirectoryImages_withGalleryBucketEnv_shouldUseEnvBucket", async () => {
  vi.stubEnv("GALLERY_BUCKET", "env-bucket");
  send.mockResolvedValue(listing("gallery/a.jpg"));

  const images = await getImages();

  expect(send.mock.calls[0][0].input.Bucket).toBe("env-bucket");
  expect(images[0].url).toBe(url("gallery/a.jpg", "env-bucket"));
});

test("useS3DirectoryImages_withJpgPngSvg_shouldReturnEachImage", async () => {
  send.mockResolvedValue(listing("gallery/a.jpg", "gallery/b.png", "gallery/c.svg"));

  const images = await getImages();

  expect(images).toEqual([
    { url: url("gallery/a.jpg"), thumbUrl: undefined, alt: "a.jpg" },
    { url: url("gallery/b.png"), thumbUrl: undefined, alt: "b.png" },
    { url: url("gallery/c.svg"), thumbUrl: undefined, alt: "c.svg" },
  ]);
});

test("useS3DirectoryImages_withNonImageFiles_shouldExcludeThem", async () => {
  send.mockResolvedValue(listing("gallery/a.jpg", "gallery/notes.txt", "gallery/b.gif"));

  const images = await getImages();

  expect(images.map(x => x.alt)).toEqual(["a.jpg"]);
});

test("useS3DirectoryImages_withEmptyOrKeylessObjects_shouldExcludeThem", async () => {
  send.mockResolvedValue({
    Contents: [
      { Key: "gallery/a.jpg", Size: 1 },
      { Key: "gallery/empty.jpg", Size: 0 },
      { Key: "gallery/nosize.jpg" },
      { Size: 1 },
    ],
  });

  const images = await getImages();

  expect(images.map(x => x.alt)).toEqual(["a.jpg"]);
});

test("useS3DirectoryImages_withThumbnailAndImage_shouldPairThumbUrlWithImage", async () => {
  send.mockResolvedValue(listing("gallery/a.jpg", "gallery/thumb_a.jpg"));

  const images = await getImages();

  expect(images).toEqual([
    { url: url("gallery/a.jpg"), thumbUrl: url("gallery/thumb_a.jpg"), alt: "a.jpg" },
  ]);
});

test("useS3DirectoryImages_withThumbnailOnly_shouldExcludeIt", async () => {
  send.mockResolvedValue(listing("gallery/thumb_a.jpg"));

  const images = await getImages();

  expect(images).toEqual([]);
});

test("useS3DirectoryImages_withNoContents_shouldReturnEmpty", async () => {
  send.mockResolvedValue({});

  const images = await getImages();

  expect(images).toEqual([]);
});

test("useS3DirectoryImages_whenS3Throws_shouldLogErrorAndReturnEmpty", async () => {
  const error = new Error("denied");
  send.mockRejectedValue(error);
  const consoleError = vi.spyOn(console, "error").mockImplementation(() => { });

  const images = await getImages();

  expect(images).toEqual([]);
  expect(consoleError).toHaveBeenCalledWith(error);
  consoleError.mockRestore();
});
