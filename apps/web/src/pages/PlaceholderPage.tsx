import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export function PlaceholderPage({
  compact = false,
  title,
}: {
  compact?: boolean;
  title: string;
}) {
  return (
    <main
      className={
        compact ? "placeholder-page placeholder-compact" : "placeholder-page"
      }
    >
      <p className="eyebrow">Coming in its delivery phase</p>
      <h1>{title}</h1>
      <p>The route and layout are ready for the complete product workflow.</p>
      <Link className="inline-link" to={compact ? "/admin" : "/"}>
        <ArrowLeft aria-hidden="true" size={17} /> Go back
      </Link>
    </main>
  );
}
