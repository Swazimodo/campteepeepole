afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

test("loadPageContent_withoutContentBaseUrl_readsLocalFile", async () => {
  vi.stubEnv('CONTENT_BASE_URL', '');
  const { loadPageContent } = await import('@/components/pageContent');

  const content = await loadPageContent('about');

  expect(content).toContain('# About Us');
});

test("loadPageContent_withContentBaseUrl_fetchesFromBaseUrl", async () => {
  vi.stubEnv('CONTENT_BASE_URL', 'https://example.com/content');
  const fetchMock = vi.fn().mockResolvedValue(new Response('# Remote'));
  vi.stubGlobal('fetch', fetchMock);
  const { loadPageContent } = await import('@/components/pageContent');

  const content = await loadPageContent('about');

  expect(fetchMock).toHaveBeenCalledWith('https://example.com/content/about.mdx');
  expect(content).toBe('# Remote');
});

test("loadPageContent_withContentBaseUrlAndMissingFile_throws", async () => {
  vi.stubEnv('CONTENT_BASE_URL', 'https://example.com/content');
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 404 })));
  const { loadPageContent } = await import('@/components/pageContent');

  await expect(loadPageContent('about')).rejects.toThrow('Content for "about" not found: 404');
});
