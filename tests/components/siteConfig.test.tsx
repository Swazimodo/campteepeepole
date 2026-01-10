import { useSiteConfig } from "@/components/siteConfig";


test("getSiteConfig_withUndefinedCamp_shouldDefaultToTpp", () => {
  jest.mock('src/static/siteConfig.json', () => ({
    settings: 'someSetting'
  }), { virtual: true });
  const { useSiteConfig } = require('@/components/siteConfig');

  const siteConfig = useSiteConfig();

  expect(siteConfig.camp).toBe("campTeepeePole");
});
