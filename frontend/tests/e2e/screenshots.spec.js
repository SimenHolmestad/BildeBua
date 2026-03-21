import { test, expect } from "@playwright/test";

const albumName = "Bryllup";

const pages = [
  { name: "front-page", url: "/" },
  { name: "qr-code-page", url: "/qr" },
  { name: "album-page", url: `/album/${albumName}` },
  { name: "image-detail-page", url: `/album/${albumName}/image/1` },
  { name: "last-image-page", url: `/album/${albumName}/last_image` },
  { name: "last-image-qr-page", url: `/album/${albumName}/last_image_qr` },
];

const viewports = [
  { name: "desktop", viewport: { width: 1280, height: 1024 } },
  { name: "mobile", viewport: { width: 390, height: 844 } },
];

for (const { name: viewportName, viewport } of viewports) {
  test.describe(`screenshots – ${viewportName}`, () => {
    test.use({ viewport });

    test.beforeEach(async ({ page }) => {
      await page.route("https://fonts.googleapis.com/**", (route) => route.abort());
      await page.route("https://fonts.gstatic.com/**", (route) => route.abort());
    });

    for (const { name: pageName, url } of pages) {
      test(`${pageName}`, async ({ page }) => {
        await page.goto(url);
        await page.waitForLoadState("networkidle");

        await expect(page).toHaveScreenshot(`${pageName}-${viewportName}.png`, {
          animations: "disabled",
          caret: "hide",
        });
      });
    }
  });
}
