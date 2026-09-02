import { BookOpenText } from "lucide-react";

import { AppLinkButton } from "../ui/Button";

export function NotFoundPage() {
  return (
    <main className="not-found-page">
      <BookOpenText aria-hidden="true" size={48} strokeWidth={1.3} />
      <p className="eyebrow">Page not found</p>
      <h1>This chapter is missing.</h1>
      <p>The page may have moved, or the address may not be quite right.</p>
      <AppLinkButton size="large" to="/">
        Return to Book Hub
      </AppLinkButton>
    </main>
  );
}
