
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  CalendarDays,
  Compass,
  Heart,
  Menu,
  X,
} from "lucide-react";
import { getFavorites } from "../utils/favorites";
import { getItinerary } from "../utils/itinerary";

export default function SiteHeader() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [itineraryCount, setItineraryCount] = useState(0);

  useEffect(() => {
    function refreshCounts() {
      setFavoriteCount(getFavorites().length);
      setItineraryCount(getItinerary().length);
    }

    refreshCounts();
    window.addEventListener("storage", refreshCounts);
    window.addEventListener("huetravel-data-updated", refreshCounts);

    return () => {
      window.removeEventListener("storage", refreshCounts);
      window.removeEventListener("huetravel-data-updated", refreshCounts);
    };
  }, [location.pathname]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { to: "/", label: "Trang chủ", end: true },
    { to: "/destinations", label: "Điểm đến", end: false },
    { to: "/favorites", label: "Yêu thích", end: false },
    { to: "/itinerary", label: "Lịch trình", end: false },
  ];

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="site-brand" aria-label="HueTravel - Trang chủ">
          <span className="site-brand-mark">H</span>
          <span className="site-brand-name">
            Hue<span>Travel</span>
          </span>
        </Link>

        <button
          type="button"
          className="site-menu-toggle"
          aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav
          className={`site-nav ${menuOpen ? "site-nav-open" : ""}`}
          aria-label="Điều hướng chính"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `site-nav-link ${isActive ? "site-nav-link-active" : ""}`
              }
            >
              {item.to === "/destinations" && <Compass size={16} />}
              {item.to === "/favorites" && <Heart size={16} />}
              {item.to === "/itinerary" && <CalendarDays size={16} />}

              <span>{item.label}</span>

              {item.to === "/favorites" && favoriteCount > 0 && (
                <span className="site-nav-count">{favoriteCount}</span>
              )}

              {item.to === "/itinerary" && itineraryCount > 0 && (
                <span className="site-nav-count">{itineraryCount}</span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
