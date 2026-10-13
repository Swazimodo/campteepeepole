import { act, renderHook } from "@testing-library/react";
import { useImageWindow } from "@/components/gallery/useImageWindow";
import { S3Image } from "@/components/gallery/useS3DirectoryImages";

const images: S3Image[] = [0, 1, 2, 3, 4, 5].map(i => ({ url: `full${i}`, thumbUrl: `thumb${i}`, alt: `${i}` }));

const render = (index: number, thumbnailCount: number, fullCount: number, list = images) =>
  renderHook(props => useImageWindow(list, props.index, { thumbnailCount, fullCount }), { initialProps: { index } });

const loadedThumbs = (items: { thumbSrc?: string }[]) => items.flatMap(x => x.thumbSrc ? [x.thumbSrc] : []);
const loadedFulls = (items: { fullSrc?: string }[]) => items.flatMap(x => x.fullSrc ? [x.fullSrc] : []);

test("useImageWindow_atStart_shouldLoadFirstThumbnailCountThumbs", () => {
  const { result } = render(0, 2, 0);

  expect(loadedThumbs(result.current.items)).toEqual(["thumb0", "thumb1"]);
});

test("useImageWindow_whenIndexAdvances_shouldLoadThumbsUpToIndexPlusThumbnailCount", () => {
  const { result, rerender } = render(0, 2, 0);

  rerender({ index: 3 });

  expect(loadedThumbs(result.current.items)).toEqual(["thumb0", "thumb1", "thumb2", "thumb3", "thumb4"]);
});

test("useImageWindow_whenIndexMovesBack_shouldKeepLoadedThumbs", () => {
  const { result, rerender } = render(3, 2, 0);

  rerender({ index: 0 });

  expect(loadedThumbs(result.current.items)).toEqual(["thumb0", "thumb1", "thumb2", "thumb3", "thumb4"]);
});

test("useImageWindow_withoutThumbUrl_shouldUseFullUrlAsThumbSrc", () => {
  const { result } = render(0, 1, 0, [{ url: "full", alt: "a" }]);

  expect(result.current.items[0].thumbSrc).toBe("full");
});

test("useImageWindow_withFullCount_shouldLoadFullsFromIndexToIndexPlusFullCount", () => {
  const { result } = render(2, 1, 2);

  expect(loadedFulls(result.current.items)).toEqual(["full2", "full3"]);
});

test("useImageWindow_whenIndexAdvances_shouldDropFullsBehindIndex", () => {
  const { result, rerender } = render(0, 1, 2);

  rerender({ index: 3 });

  expect(loadedFulls(result.current.items)).toEqual(["full3", "full4"]);
});

test("useImageWindow_withFullCount_shouldPreloadWindowFulls", () => {
  const preloaded: string[] = [];
  vi.stubGlobal("Image", class { set src(url: string) { preloaded.push(url) } });

  render(1, 1, 2);

  expect(preloaded).toEqual(["full1", "full2"]);
  vi.unstubAllGlobals();
});

test("useImageWindow_withZeroFullCount_shouldLoadNoFulls", () => {
  const { result } = render(0, 1, 0);

  expect(loadedFulls(result.current.items)).toEqual([]);
});

test("useImageWindow_whenLoadFullCalled_shouldLoadThatFull", () => {
  const { result } = render(0, 1, 0);

  act(() => result.current.loadFull(4));

  expect(loadedFulls(result.current.items)).toEqual(["full4"]);
});
