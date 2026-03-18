import { test, expect } from "@playwright/test";

async function createAlbum(request, albumName, description = "") {
  const response = await request.post("/albums/", {
    data: {
      album_name: albumName,
      description,
    },
  });

  expect(response.ok()).toBeTruthy();
}

test.describe("visual regressions – mobile (iPhone 14)", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ page }) => {
    await page.route("https://fonts.googleapis.com/**", (route) => route.abort());
    await page.route("https://fonts.gstatic.com/**", (route) => route.abort());
  });

  test("album page with one captured image matches the baseline on mobile", async ({
    page,
    request,
  }) => {
    const albumName = "visual-album-mobile";
    const response = await request.post("/albums/", {
      data: { album_name: albumName, description: "Mobile snapshot album" },
    });
    expect(response.ok()).toBeTruthy();

    await page.goto(`/album/${albumName}`);
    await page.getByRole("button", { name: /Ta nytt bilde/i }).click();
    await expect(page.getByRole("img", { name: "Bilde 1" })).toBeVisible();

    await expect(page.locator("main")).toHaveScreenshot("album-with-image-main-mobile.png", {
      animations: "disabled",
      caret: "hide",
    });
  });
});

test.describe("visual regressions", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("https://fonts.googleapis.com/**", (route) => route.abort());
    await page.route("https://fonts.gstatic.com/**", (route) => route.abort());
  });

  test("qr code page with single qr code is centered", async ({ page }) => {
    await page.goto("/qr");
    await expect(page.getByRole("img", { name: "start_page_url" })).toBeVisible();

    await expect(page).toHaveScreenshot("qr-page-single-code.png", {
      animations: "disabled",
      caret: "hide",
    });
  });

  test("front page matches the baseline", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Velkommen til BildeBua" })).toBeVisible();
    await expect(page).toHaveScreenshot("front-page-main.png", {
      animations: "disabled",
      caret: "hide",
    });
  });

  test("album page with one captured image matches the baseline", async ({ page, request }) => {
    const albumName = "visual-album";
    await createAlbum(request, albumName, "Visual snapshot album");

    await page.goto(`/album/${albumName}`);
    await page.getByRole("button", { name: /Ta nytt bilde/i }).click();
    await expect(page.getByRole("img", { name: "Bilde 1" })).toBeVisible();

    await expect(page.locator("main")).toHaveScreenshot("album-with-image-main.png", {
      animations: "disabled",
      caret: "hide",
    });
  });
});
