import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/users";
import { logout } from "../../redux/features/auth/authSlice";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="bg-[#2c3e50] shadow-sm border-b border-[#2c3e5073] w-full fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo/Brand - Left side */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-xl font-serif font-semibold"
            >
              Book Hub
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="hover:text-[#3498db] font-serif px-3 py-2 font-medium transition-colors border-b-2 border-transparent hover:border-[#3498db]"
            >
              Home
            </Link>
            <Link
              to="/books"
              className="hover:text-[#3498db] font-serif px-3 py-2 font-medium transition-colors border-b-2 border-transparent hover:border-[#3498db]"
            >
              Books
            </Link>
          </div>

          {/* Desktop User Controls - Right side */}
          <div className="hidden md:flex items-center">
            {userInfo ? (
              <div className="relative ml-4">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center text-sm rounded-full focus:outline-none"
                >
                  <span className="font-medium mr-1">
                    {userInfo.username}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4  transition-transform ${
                      dropdownOpen ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[hsl(204,64%,40%)] ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1 bg- rounded-md">
                      {userInfo.isAdmin && (
                        <Link
                          to="/admin/books/dashboard"
                          className="block px-4 py-2 text-sm hover:text-[#ffffffbd]"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Dashboard
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm  hover:text-[#ffffffbd]"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          logoutHandler();
                          setDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm hover:text-[#ffffffbd]"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className=" hover:text-[#3498db] font-serif px-3 py-2 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-[#3498db] hover:bg-[hsl(204,64%,40%)] font-serif text-white px-4 py-2 rounded font-medium transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className=" hover:text-[#3498db] focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#2980b9] border-t border-[#3a3939]">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 text-base font-medium  hover:text-[#3498db]"
              onClick={toggleMobileMenu}
            >
              Home
            </Link>
            <Link
              to="/books"
              className="block px-3 py-2 text-base font-medium  hover:text-[#3498db]"
              onClick={toggleMobileMenu}
            >
              Books
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-[#3a3939]">
            {userInfo ? (
              <>
                <div className="flex items-center px-5">
                  <div className="text-sm font-medium ">
                    {userInfo.username}
                  </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  {userInfo.isAdmin && (
                    <Link
                      to="/admin/books/dashboard"
                      className="block px-3 py-2 text-base font-medium  hover:text-[#3498db] hover:bg-[#f5ede2] rounded-md"
                      onClick={toggleMobileMenu}
                    >
                      Dashboard
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-base font-medium  hover:text-[#3498db] hover:bg-[#f5ede2] rounded-md"
                    onClick={toggleMobileMenu}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logoutHandler();
                      toggleMobileMenu();
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium  hover:text-[#3498db] hover:bg-[#f5ede2] rounded-md"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="px-5 py-3 space-y-2">
                <Link
                  to="/login"
                  className="block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md  bg-[#3498db] hover:bg-[hsl(204,64%,40%)]"
                  onClick={toggleMobileMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#3498db] hover:bg-[hsl(204,64%,40%)]"
                  onClick={toggleMobileMenu}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;