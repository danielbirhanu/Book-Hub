import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import store from "./redux/store.js";
import { Provider } from "react-redux";
import { Route, RouterProvider, createRoutesFromElements } from "react-router";
import { createBrowserRouter } from "react-router-dom";

// Auth
import AdminRoute from "./pages/Admin/AdminRoute.jsx";
import GenreList from "./pages/Admin/GenreList.jsx";

// Restricted
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import PrivateRoute from "./pages/Auth/PrivateRoute.jsx";

import Home from "./pages/Home.jsx";
import Profile from "./pages/User/Profile.jsx";
import AdminBooksList from "./pages/Admin/AdminBooksList.jsx";
import UpdateBook from "./pages/Admin/UpdateBook.jsx";
import CreateBook from "./pages/Admin/CreateBook.jsx";
import AllBooks from "./pages/Books/AllBooks.jsx";
import BookDetails from "./pages/Books/BookDetails.jsx";
import AllComments from "./pages/Admin/AllComments.jsx";
import AdminDashboard from "./pages/Admin/Dashboard/AdminDashboard.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Public Routes */}
      <Route index element={<Home />} />
      <Route path="books" element={<AllBooks />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="books/:id" element={<BookDetails />} />

      {/* Private Routes (User) */}
      <Route element={<PrivateRoute />}>
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Admin Routes */}
      <Route path="admin" element={<AdminRoute />}>
        <Route path="books/genre" element={<GenreList />} />
        <Route path="books/create" element={<CreateBook />} />
        <Route path="books-list" element={<AdminBooksList />} />
        <Route path="books/update/:id" element={<UpdateBook />} />
        <Route path="books/dashboard" element={<AdminDashboard />} />
        <Route path="books/comments" element={<AllComments />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);