import { listPages, loadPage, loadTabs } from '@/components/pageContent';

test("loadTabs_withOrderExports_sortsTabsByOrder", async () => {
  const tabs = await loadTabs();

  expect(tabs.map(x => x.path)).toEqual(['welcome', 'about', 'events', 'donate', 'contact']);
});

test("loadTabs_withTitleExport_usesTitle", async () => {
  const tabs = await loadTabs();

  expect(tabs.find(x => x.path === 'about')?.title).toBe('About Us');
});

test("loadPage_withoutPage_loadsTabIndex", async () => {
  const { title } = await loadPage('about');

  expect(title).toBe('About Us');
});

test("listPages_withNestedFile_returnsIndexAndNestedPage", async () => {
  const pages = await listPages();

  expect(pages).toContainEqual({ tab: 'about', page: [] });
  expect(pages).toContainEqual({ tab: 'about', page: ['history'] });
});
