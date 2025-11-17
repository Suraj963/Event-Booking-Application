import { useState, useEffect, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { AuthContext } from "../../auth";

const Navbar = () => {
  const { login, logout, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState("");

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    logout(false);
    navigate("/login");
  };

  // Check login status when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    setRole(localStorage.getItem("role"));
    if (token) {
      login();
    }
  }, []);

  const getNavLinkClass = ({ isActive }) => {
    return isActive
      ? "bg-primary text-primary-foreground flex items-center px-4 py-2 rounded-lg text-sm font-medium"
      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors";
  };

  const getMobileNavLinkClass = ({ isActive }) => {
    return isActive
      ? "bg-primary text-primary-foreground block rounded-md px-3 py-2 text-base font-medium"
      : "text-muted-foreground hover:bg-muted hover:text-foreground block rounded-md px-3 py-2 text-base font-medium transition-colors";
  };

  const baseButtonClass =
    "text-muted-foreground hover:bg-muted/50 hover:text-foreground flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer";
  const mobileBaseButtonClass =
    "text-muted-foreground hover:bg-muted hover:text-foreground block rounded-md px-3 py-2 text-base font-medium transition-colors cursor-pointer";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border/20 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- CHANGE 1: Navbar height reduced to h-16 --- */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              {/* --- CHANGE 2: Logo height adjusted to h-10 --- */}
              <img
                src="/logo.png"
                alt="Golden Occasions Logo"
                className="h-14 w-auto" // Was h-12
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            {/* --- CHANGE 3: Alignment changed to items-center --- */}
            <div className="ml-10 flex items-center space-x-4"> {/* Was items-baseline */}
              <NavLink to="/" className={getNavLinkClass} end>
                Home
              </NavLink>
              <NavLink to="/events" className={getNavLinkClass}>
                Events
              </NavLink>

              {/* === CONDITIONAL LINKS/BUTTONS FOR DESKTOP === */}
              {isLoggedIn ? (
                <>
                  {role === "USER" ? (
                    <>
                      <NavLink to="/bookings" className={getNavLinkClass}>
                        Bookings
                      </NavLink>
                    </>
                  ) : (
                    <>
                      <NavLink
                        to="/all-users-bookings"
                        className={getNavLinkClass}
                      >
                        All User Bookings
                      </NavLink>
                    </>
                  )}

                  <NavLink to="/profile" className={getNavLinkClass}>
                    <UserIcon className="h-5 w-5 mr-2" />
                    Profile
                  </NavLink>
                  <button onClick={handleLogout} className={baseButtonClass}>
                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <NavLink to="/login" className={getNavLinkClass}>
                  Login
                </NavLink>
              )}
            </div>
          </div>

          {/* Mobile Menu Button  */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-muted inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (No changes needed here, it's already responsive) */}
      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink
              to="/"
              className={getMobileNavLinkClass}
              onClick={() => setIsOpen(false)}
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/events"
              className={getMobileNavLinkClass}
              onClick={() => setIsOpen(false)}
            >
              Events
            </NavLink>

            {/* === CONDITIONAL LINKS/BUTTONS FOR MOBILE === */}
            {isLoggedIn ? (
              <>
                {role === "USER" ? (
                  <>
                    <NavLink
                      to="/bookings"
                      className={getMobileNavLinkClass}
                      onClick={() => setIsOpen(false)}
                    >
                      Bookings
                    </NavLink>
                  </>
                ) : (
                  <>
                    <NavLink
                      to="/all-users-bookings"
                      className={getMobileNavLinkClass}
                      onClick={() => setIsOpen(false)}
                    >
                      All User Bookings
                    </NavLink>
                  </>
                )}

                <NavLink
                  to="/profile"
                  className={getMobileNavLinkClass}
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </NavLink>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className={`w-full text-left ${mobileBaseButtonClass}`}
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                className={getMobileNavLinkClass}
                onClick={() => setIsOpen(false)}
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;