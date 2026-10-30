
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Compass,
  Heart,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import DestinationCard from "../components/DestinationCard";
import {
  categories,
  destinations,
  type Category,
} from "../data/destinations";
import "../App.css";

type SortOption = "popular" | "name" | "price";

function readFavorites(): number[] {
  try {
    const saved = localStorage.getItem("huetravel-favorites");
    const parsed: unknown = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed)
      ? parsed.filter((item): item is number => typeof item === "number")
      : [];
  } catch {
    return [];
  }
}

export default function Destinations() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("Tất cả");
  const [sort, setSort] = useState<SortOption>("popular");
  const [favorites, setFavorites] = useState<number[]>(readFavorites);
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      "huetravel-favorites",
      JSON.stringify(favorites)
    );
  }, [favorites]);

  function toggleFavorite(id: number) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  const filteredDestinations = useMemo(() => {
    const keyword = search.trim().toLocaleLowerCase("vi");

    const result = destinations.filter((place) => {
      const matchesSearch = [
        place.name,
        place.description,
        place.address,
        place.category,
        ...place.tags,
      ]
        .join(" ")
        .toLocaleLowerCase("vi")
        .includes(keyword);

      const matchesCategory =
        category === "Tất cả" || place.category === category;

      const matchesFavorite =
        !favoritesOnly || favorites.includes(place.id);

      return matchesSearch && matchesCategory && matchesFavorite;
    });

    if (sort === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name, "vi"));
    } else if (sort === "price") {
      result.sort((a, b) => a.price - b.price);
    } else {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [search, category, sort, favoritesOnly, favorites]);

  function resetFilters() {
    setSearch("");
    setCategory("Tất cả");
    setSort("popular");
    setFavoritesOnly(false);
  }

  return (
    <main className="explore-page">
      <header className="explore-navbar">
        <Link to="/" className="brand">
          <span className="brand-icon">H</span>
          <span>Hue<span className="brand-gold">Travel</span></span>
        </Link>

        <nav className="explore-nav-links">
          <Link to="/">Trang chủ</Link>
          <Link to="/destinations" className="current">Khám phá</Link>
          <a href="/#experience">Trải nghiệm</a>
        </nav>

        <Link to="/" className="explore-back-home">
          <ArrowLeft size={16} /> Trang chủ
        </Link>
      </header>

      <section className="explore-hero">
        <div className="explore-hero-overlay" />

        <motion.div
          className="explore-hero-content"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="explore-eyebrow">
            <Compass size={16} /> HÀNH TRÌNH KHÁM PHÁ CỐ ĐÔ
          </span>

          <h1>
            Mỗi điểm đến,
            <br />
            <span>một câu chuyện Huế.</span>
          </h1>

          <p>
            Tìm cảm hứng cho chuyến đi của bạn qua những di sản,
            cảnh đẹp và hương vị đặc trưng của xứ Huế.
          </p>

          <a className="explore-hero-button" href="#explore-list">
            Khám phá ngay ↓
          </a>
        </motion.div>
      </section>

      <section className="explore-main" id="explore-list">
        <div className="explore-heading">
          <div>
            <span className="section-kicker">BẢN ĐỒ TRẢI NGHIỆM</span>
            <h2>Khám phá Huế</h2>
            <p>Chọn điểm đến phù hợp với hành trình của bạn.</p>
          </div>

          <button
            type="button"
            className={`favorites-filter ${favoritesOnly ? "active" : ""}`}
            onClick={() => setFavoritesOnly((value) => !value)}
          >
            <Heart
              size={17}
              fill={favoritesOnly ? "currentColor" : "none"}
            />
            Yêu thích ({favorites.length})
          </button>
        </div>

        <div className="explore-toolbar">
          <div className="explore-search">
            <Search size={19} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm địa điểm, hoạt động, đặc sản..."
              aria-label="Tìm kiếm địa điểm"
            />

            {search && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearch("")}
                aria-label="Xóa nội dung tìm kiếm"
              >
                <X size={17} />
              </button>
            )}
          </div>

          <label className="explore-sort">
            <SlidersHorizontal size={17} />
            <span className="sort-label">Sắp xếp:</span>
            <select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value as SortOption)
              }
            >
              <option value="popular">Đánh giá cao</option>
              <option value="name">Tên A–Z</option>
              <option value="price">Giá thấp trước</option>
            </select>
          </label>
        </div>

        <div className="category-filters" aria-label="Lọc danh mục">
          {categories.map((item) => (
            <button
              type="button"
              key={item}
              className={category === item ? "category-chip active" : "category-chip"}
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="explore-result-row">
          <p>
            Tìm thấy <strong>{filteredDestinations.length}</strong> địa điểm
          </p>

          {(search || category !== "Tất cả" || favoritesOnly || sort !== "popular") && (
            <button type="button" onClick={resetFilters} className="reset-filters">
              Xóa bộ lọc <X size={14} />
            </button>
          )}
        </div>

        <div className="explore-grid">
          <AnimatePresence mode="popLayout">
            {filteredDestinations.map((place) => (
              <DestinationCard
                key={place.id}
                destination={place}
                isFavorite={favorites.includes(place.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </AnimatePresence>
        </div>

        {filteredDestinations.length === 0 && (
          <motion.div
            className="explore-empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Search size={38} />
            <h3>Chưa tìm thấy địa điểm phù hợp</h3>
            <p>Thử đổi từ khóa hoặc chọn một danh mục khác nhé.</p>
            <button type="button" onClick={resetFilters}>
              Xem tất cả địa điểm
            </button>
          </motion.div>
        )}
      </section>

      <footer className="explore-footer">
        <Link to="/" className="brand">
          <span className="brand-icon">H</span>
          <span>Hue<span className="brand-gold">Travel</span></span>
        </Link>
        <p>Đi để cảm nhận. Trở về với những câu chuyện.</p>
        <span>© 2026 HueTravel · Dự án học tập</span>
      </footer>
    </main>
  );
}
