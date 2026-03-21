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

test("can create an album from the front page", async ({ page }) => {
  const albumName = "e2e-ui-album";

  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Velkommen til BildeBua" })).toBeVisible();
  await page.getByRole("button", { name: /Opprett nytt album/i }).click();
  await page.getByLabel("Albumnavn").fill(albumName);
  await page.getByLabel("Beskrivelse").fill("Laget fra Playwright");
  await page.getByRole("button", { name: "Opprett album" }).click();

  await expect(page).toHaveURL(new RegExp(`/album/${albumName}$`));
  await expect(page.getByRole("heading", { name: albumName })).toBeVisible();
  await expect(page.getByText("Laget fra Playwright")).toBeVisible();
});

test("can capture an image in an album", async ({ page, request }) => {
  const albumName = "e2e-capture-album";
  await createAlbum(request, albumName, "Album for bildeflyt");

  await page.goto(`/album/${albumName}`);

  await expect(page.getByRole("heading", { name: albumName })).toBeVisible();
  await expect(page.getByText("Ingen bilder ennå")).toBeVisible();
  await page.getByRole("button", { name: /Ta nytt bilde/i }).click();
  await expect(page.getByRole("img", { name: "Bilde 1" })).toBeVisible();
  await page.getByRole("button", { name: /Ta nytt bilde/i }).click();
  await expect(page.getByRole("img", { name: "Bilde 2" })).toBeVisible();
  await page.getByRole("button", { name: /Ta nytt bilde/i }).click();
  await expect(page.getByRole("img", { name: "Bilde 3" })).toBeVisible();

  await expect(page.getByText("Ingen bilder ennå")).toHaveCount(0);
});

test("shows QR codes on the qr page", async ({ page }) => {
  await page.goto("/qr");

  await expect(page.getByRole("img", { name: "start_page_url" })).toBeVisible();
  await expect(page.getByText("Scan this qr code to go to BildeBua!")).toBeVisible();
});
