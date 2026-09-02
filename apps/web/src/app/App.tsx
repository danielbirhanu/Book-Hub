import { Route, Routes } from "react-router-dom";

import { AccountLayout } from "../layouts/AccountLayout";
import { AdminLayout } from "../layouts/AdminLayout";
import { PublicLayout } from "../layouts/PublicLayout";
import { AdminOverviewPage } from "../pages/AdminOverviewPage";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { PlaceholderPage } from "../pages/PlaceholderPage";

export function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="discover" element={<PlaceholderPage title="Discover" />} />
        <Route
          path="browse"
          element={<PlaceholderPage title="Browse books" />}
        />
        <Route path="my-books" element={<PlaceholderPage title="My books" />} />
      </Route>
      <Route element={<AccountLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route
          path="register"
          element={<PlaceholderPage title="Join Book Hub" />}
        />
      </Route>
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<AdminOverviewPage />} />
        <Route
          path="books"
          element={<PlaceholderPage title="Catalog" compact />}
        />
        <Route
          path="reviews"
          element={<PlaceholderPage title="Reviews" compact />}
        />
        <Route
          path="reports"
          element={<PlaceholderPage title="Reports" compact />}
        />
        <Route
          path="members"
          element={<PlaceholderPage title="Members" compact />}
        />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
