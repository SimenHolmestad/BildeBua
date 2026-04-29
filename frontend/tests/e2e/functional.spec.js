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

test("can create an album from the admin page", async ({ page }) => {
  const albumName = "e2e-admin-new-album";

  await page.goto("/admin");

  await expect(page.getByRole("heading", { name: "Admin" })).toBeVisible();
  await page.getByRole("button", { name: /Lag nytt album/i }).click();
  await page.getByLabel("Albumnavn").fill(albumName);
  await page.getByLabel("Beskrivelse", { exact: true }).fill("Laget fra admin");
  await page.getByRole("button", { name: "Opprett album" }).click();

  await expect(page).toHaveURL(new RegExp(`/admin/album/${albumName}$`));
  await expect(page.getByRole("heading", { name: albumName })).toBeVisible();
});

test("can view admin settings page", async ({ page }) => {
  await page.goto("/admin");

  await expect(page.getByRole("heading", { name: "Admin" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Kamera" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Albuminnstillinger" })).toBeVisible();

  // Save button hidden until a change is made
  await expect(page.getByRole("button", { name: /Lagre innstillinger/i })).toHaveCount(0);

  // Change a setting and verify the save button appears
  await page.getByLabel("Forhåndsvisning (sek)").fill("5");
  await expect(page.getByRole("button", { name: /Lagre innstillinger/i })).toBeVisible();
});

test("can edit album description from admin album page", async ({ page, request }) => {
  const albumName = "e2e-admin-edit-desc";
  await createAlbum(request, albumName, "Opprinnelig beskrivelse");

  await page.goto(`/admin/album/${albumName}`);
  await expect(page.getByText("Opprinnelig beskrivelse")).toBeVisible();

  await page.getByRole("button", { name: "Rediger" }).click();
  const textarea = page.getByRole("textbox");
  await textarea.fill("Ny beskrivelse");
  await page.getByRole("button", { name: "Lagre" }).click();

  await expect(page.getByText("Ny beskrivelse")).toBeVisible();
  await expect(page.getByText("Opprinnelig beskrivelse")).toHaveCount(0);
});

test("can delete an image from admin album page", async ({ page, request }) => {
  const albumName = "e2e-admin-delete-album";
  await createAlbum(request, albumName, "Album for sletting");

  // Capture two images via API
  await request.post(`/albums/${albumName}`);
  await request.post(`/albums/${albumName}`);

  await page.goto(`/admin/album/${albumName}`);
  await expect(page.getByRole("heading", { name: albumName })).toBeVisible();
  await expect(page.getByText("2 bilder")).toBeVisible();

  // Click the delete button for the first image (inside the image card, not "Slett album")
  await page.locator("[data-testid='admin-image']").first().getByRole("button", { name: "Slett" }).click();

  await expect(page.getByText("1 bilder")).toBeVisible();
});

test("shows QR codes on the qr page", async ({ page }) => {
  await page.goto("/qr");

  await expect(page.getByText("Scan this qr code to go to BildeBua!")).toBeVisible();
  await expect(page.getByRole("article").getByRole("img")).toBeVisible();
});

test("can toggle banner on the qr page from admin", async ({ page, request }) => {
  const albumName = "e2e-banner-album";
  await createAlbum(request, albumName, "Album for banner-test");

  // Banner is hidden by default
  await page.goto("/qr");
  await expect(page.locator('[data-testid="qr-code-banner"]')).toHaveCount(0);

  // Enable banner + forced album from admin
  await page.goto("/admin");
  await page.getByLabel("Tving alle brukere til ett album").check();
  await page.locator("select").first().selectOption(albumName);
  await page.getByLabel("Vis banner nederst på QR-kode-siden").check();
  await page.getByLabel("Tekst i banneret").fill("Bli med på moroa!");
  await page.getByRole("button", { name: /Lagre innstillinger/i }).click();
  await expect(page.getByText("Innstillinger lagret!")).toBeVisible();

  // Banner now visible on /qr
  await page.goto("/qr");
  await expect(page.locator('[data-testid="qr-code-banner"]')).toBeVisible();
  await expect(page.getByText("Bli med på moroa!")).toBeVisible();

  // Disable banner and clear forced album to restore state
  await page.goto("/admin");
  await page.getByLabel("Vis banner nederst på QR-kode-siden").uncheck();
  await page.getByLabel("Tving alle brukere til ett album").uncheck();
  await page.getByRole("button", { name: /Lagre innstillinger/i }).click();
  await expect(page.getByText("Innstillinger lagret!")).toBeVisible();

  // Banner gone again
  await page.goto("/qr");
  await expect(page.locator('[data-testid="qr-code-banner"]')).toHaveCount(0);
});
