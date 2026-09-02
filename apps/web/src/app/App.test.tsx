import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { App } from "./App";

function renderPath(path: string) {
  return renderToString(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );
}

describe("App", () => {
  it("renders the core Book Hub discovery experience", () => {
    const html = renderPath("/");

    expect(html).toContain("Find the books that stay with you.");
    expect(html).toContain("Books worth talking about");
    expect(html).toContain("Skip to main content");
  });

  it("renders the account layout with labeled authentication fields", () => {
    const html = renderPath("/login");

    expect(html).toContain("Continue your reading life.");
    expect(html).toContain('for="email"');
    expect(html).toContain('for="password"');
  });

  it("renders the administration layout and overview", () => {
    const html = renderPath("/admin");

    expect(html).toContain("Community overview");
    expect(html).toContain("Recent reports");
    expect(html).toContain("Administration");
  });

  it("renders the not-found state outside an application shell", () => {
    const html = renderPath("/missing-page");

    expect(html).toContain("This chapter is missing.");
  });
});
