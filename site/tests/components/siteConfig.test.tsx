beforeEach(() => {
  vi.resetModules();
});

test("getSiteConfig_withUndefinedCamp_shouldDefaultToTpp", async () => {
  vi.doMock('@/static/siteConfig.json', () => ({
    default: { settings: 'foo' }
  }));
  const { useSiteConfig } = await import('@/components/siteConfig');

  const siteConfig = useSiteConfig();

  expect(siteConfig.camp).toBe("campTeepeePole");
});

test("getSiteConfig_withCampTpp_shouldBeTpp", async () => {
  const camp = 'campTeepeePole'
  vi.doMock('@/static/siteConfig.json', () => ({
    default: { camp }
  }));
  const { useSiteConfig } = await import('@/components/siteConfig');

  const siteConfig = useSiteConfig();

  expect(siteConfig.camp).toBe(camp);
});

test("getSiteConfig_withCampCherith_shouldBeCampCherith", async () => {
  const camp = 'campCherith'
  vi.doMock('@/static/siteConfig.json', () => ({
    default: { camp }
  }));
  const { useSiteConfig } = await import('@/components/siteConfig');

  const siteConfig = useSiteConfig();

  expect(siteConfig.camp).toBe(camp);
});
