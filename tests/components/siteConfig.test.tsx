beforeEach(() => {
  jest.resetModules();
});

test("getSiteConfig_withUndefinedCamp_shouldDefaultToTpp", () => {
  jest.doMock('@/static/siteConfig.json', () => ({
    settings: 'foo'
  }));
  const { useSiteConfig } = require('@/components/siteConfig');

  const siteConfig = useSiteConfig();

  expect(siteConfig.camp).toBe("campTeepeePole");
});

test("getSiteConfig_withCampTpp_shouldBeTpp", () => {
  const camp = 'campTeepeePole'
  jest.doMock('@/static/siteConfig.json', () => ({
    camp
  }));
  const { useSiteConfig } = require('@/components/siteConfig');

  const siteConfig = useSiteConfig();

  expect(siteConfig.camp).toBe(camp);
});

test("getSiteConfig_withCampCherith_shouldBeCampCherith", () => {
  const camp = 'campCherith'
  jest.doMock('@/static/siteConfig.json', () => ({
    camp
  }));
  const { useSiteConfig } = require('@/components/siteConfig');

  const siteConfig = useSiteConfig();

  expect(siteConfig.camp).toBe(camp);
});
