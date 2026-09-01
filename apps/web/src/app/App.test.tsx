import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { App } from "./App";

describe("App", () => {
  it("renders the core Book Hub discovery experience", () => {
    const html = renderToString(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(html).toContain("Find the books that stay with you.");
    expect(html).toContain("Books worth talking about");
  });
});
