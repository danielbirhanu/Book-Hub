import { expect, test } from "@playwright/test";

async function expectNoHorizontalOverflow(
  page: import("@playwright/test").Page
) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
}

test("public home renders its visual and remains within the viewport", async ({
  page,
}, testInfo) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Find the books that stay with you." })
  ).toBeVisible();
  const heroImage = page.getByRole("img", {
    name: "Shelves filled with books in a quiet library",
  });
  await expect(heroImage).toBeVisible();
  await expect(heroImage).toHaveJSProperty("complete", true);
  expect(
    await heroImage.evaluate((image: HTMLImageElement) => image.naturalWidth)
  ).toBeGreaterThan(1000);
  await expectNoHorizontalOverflow(page);

  await page.screenshot({
    fullPage: true,
    path: `test-results/home-${testInfo.project.name}.png`,
  });
});

test("mobile navigation opens and exposes primary routes", async ({
  page,
}, testInfo) => {
  test.skip(
    !testInfo.project.name.startsWith("mobile"),
    "Mobile navigation test"
  );
  await page.goto("/");

  const trigger = page.getByRole("button", { name: "Open navigation" });
  await trigger.click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Browse", exact: true })
  ).toBeVisible();
  await expect(
    page.locator('button[aria-controls="mobile-navigation"]')
  ).toHaveAttribute("aria-expanded", "true");
});

test("account and admin layouts expose their core controls", async ({
  page,
}, testInfo) => {
  await page.goto("/login");
  await expect(page.getByLabel("Email address")).toBeVisible();
  await expect(page.getByLabel("Password", { exact: true })).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await page.screenshot({
    fullPage: true,
    path: `test-results/login-${testInfo.project.name}.png`,
  });

  await page.goto("/admin");
  await expect(
    page.getByRole("heading", { name: "Community overview" })
  ).toBeVisible();
  await expect(page.getByText("Recent reports")).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await page.screenshot({
    fullPage: true,
    path: `test-results/admin-${testInfo.project.name}.png`,
  });
});
