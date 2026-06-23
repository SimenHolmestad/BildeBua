import { test, expect } from "@playwright/test";

const albumName = "Bryllup";

const pages = [
  { name: "front-page", url: "/" },
  { name: "qr-code-page", url: "/qr" },
  { name: "album-page", url: `/album/${albumName}` },
  { name: "image-detail-page", url: `/album/${albumName}/image/1` },
  { name: "last-image-page", url: `/album/${albumName}/last_image` },
  { name: "last-image-qr-page", url: `/album/${albumName}/last_image_qr` },
  { name: "admin-page", url: "/admin" },
  { name: "admin-album-page", url: `/admin/album/${albumName}` },
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

    test("admin-page-forced-album", async ({ page }) => {
      await page.goto("/admin");
      await page.waitForLoadState("networkidle");
      await page.getByLabel("Tving alle brukere til ett album").check();
      await expect(page).toHaveScreenshot(`admin-page-forced-album-${viewportName}.png`, {
        animations: "disabled",
        caret: "hide",
      });
    });

    test("admin-page-banner-enabled", async ({ page }) => {
      await page.goto("/admin");
      await page.waitForLoadState("networkidle");
      await page.getByLabel("Vis banner nederst på QR-kode-siden").check();
      await expect(page).toHaveScreenshot(`admin-page-banner-enabled-${viewportName}.png`, {
        animations: "disabled",
        caret: "hide",
      });
    });
  });
}

test.describe("admin-album-forced-other", () => {
  test.describe.configure({ mode: "serial" });

  for (const { name: viewportName, viewport } of viewports) {
    test(`admin-album-page-forced-other-${viewportName}`, async ({ page, request }) => {
      await page.setViewportSize(viewport);
      await page.route("https://fonts.googleapis.com/**", (route) => route.abort());
      await page.route("https://fonts.gstatic.com/**", (route) => route.abort());

      // Force a different album than the one we view, so its links render disabled
      const enableResponse = await request.put("/admin/config", { data: { forced_album: "Sommerfest" } });
      expect(enableResponse.ok()).toBeTruthy();

      try {
        await page.goto(`/admin/album/${albumName}`);
        await page.waitForLoadState("networkidle");
        await page.getByText("Ikke tilgjengelig mens et annet album er tvunget.").waitFor();

        await expect(page).toHaveScreenshot(`admin-album-page-forced-other-${viewportName}.png`, {
          animations: "disabled",
          caret: "hide",
        });
      } finally {
        await request.put("/admin/config", { data: { forced_album: "" } });
      }
    });
  }
});

test.describe("qr-page-banner", () => {
  test.describe.configure({ mode: "serial" });

  for (const { name: viewportName, viewport } of viewports) {
    test(`qr-code-page-with-banner-${viewportName}`, async ({ page, request }) => {
      await page.setViewportSize(viewport);
      await page.route("https://fonts.googleapis.com/**", (route) => route.abort());
      await page.route("https://fonts.gstatic.com/**", (route) => route.abort());

      const enableResponse = await request.put("/admin/config", {
        data: {
          forced_album: albumName,
          banner: {
            enabled: true,
            text: "Ta et bilde selv da vel!",
            height_vh: 15,
            image_count: 8,
            speed_px_per_sec: 80,
          },
        },
      });
      expect(enableResponse.ok()).toBeTruthy();

      try {
        await page.goto("/qr");
        await page.waitForLoadState("networkidle");
        await page.locator('[data-testid="qr-code-banner"]').waitFor();

        await expect(page).toHaveScreenshot(`qr-code-page-with-banner-${viewportName}.png`, {
          animations: "disabled",
          caret: "hide",
        });
      } finally {
        await request.put("/admin/config", {
          data: {
            forced_album: "",
            banner: {
              enabled: false,
              text: "Ta et bilde selv da vel!",
              height_vh: 15,
              image_count: 8,
              speed_px_per_sec: 80,
            },
          },
        });
      }
    });
  }
});
