import { Route, Routes } from "react-router-dom";

import { AccountLayout } from "../layouts/AccountLayout";
import { AdminLayout } from "../layouts/AdminLayout";
import { PublicLayout } from "../layouts/PublicLayout";
import { AdminOverviewPage } from "../pages/AdminOverviewPage";
import { BookDetailPage } from "../pages/BookDetailPage";
import { BrowsePage } from "../pages/BrowsePage";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { PlaceholderPage } from "../pages/PlaceholderPage";
import { MyBooksPage } from "../pages/MyBooksPage";
import { ForgotPasswordPage } from "../pages/ForgotPasswordPage";
import { ResetPasswordPage } from "../pages/ResetPasswordPage";
import { AdminModerationPage } from "../pages/AdminModerationPage";
import { AdminBooksPage } from "../pages/AdminBooksPage";
import { AdminMembersPage } from "../pages/AdminMembersPage";
import { DiscoverPage } from "../pages/DiscoverPage";
import {
  InfoPage,
  aboutContent,
  guidelinesContent,
  privacyContent,
} from "../pages/InfoPage";

export function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="discover" element={<DiscoverPage />} />
        <Route path="browse" element={<BrowsePage />} />
        <Route path="books/:slug" element={<BookDetailPage />} />
        <Route path="my-books" element={<MyBooksPage />} />
        <Route path="about" element={<InfoPage {...aboutContent} />} />
        <Route
          path="guidelines"
          element={<InfoPage {...guidelinesContent} />}
        />
        <Route path="privacy" element={<InfoPage {...privacyContent} />} />
      </Route>
      <Route element={<AccountLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
      </Route>
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<AdminOverviewPage />} />
        <Route path="books" element={<AdminBooksPage />} />
        <Route path="reviews" element={<AdminModerationPage />} />
        <Route path="reports" element={<AdminModerationPage />} />
        <Route path="members" element={<AdminMembersPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
