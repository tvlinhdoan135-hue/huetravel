
import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  CalendarDays,
  Clock3,
  Heart,
  MapPin,
  Menu,
  Play,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import "./App.css";
import { destinations as destinationData } from "./data/destinations";

const FAVORITES_KEY = "huetravel-favorites";

const categoryLabels: Record<string, string> = {
  "Di tích": "DI SẢN VĂN HÓA",
  "Tâm linh": "VĂN HÓA TÂM LINH",
  "Thiên nhiên": "THIÊN NHIÊN",
  "Ẩm thực": "ẨM THỰC",
};

const destinations = destinationData.map((place) => ({
  ...place,
  category:
    categoryLabels[place.category] ?? place.category,
}));

function readFavorites(): number[] {
  try {
    const saved = localStorage.getItem(FAVORITES_KEY);
    if (!saved) return [];

    const parsed: unknown = JSON.parse(saved);

    if (!Array.isArray(parsed)) return [];

    return [
      ...new Set(
        parsed.filter(
          (id): id is number =>
            typeof id === "number" &&
            Number.isFinite(id)
        )
      ),
    ];
  } catch {
    return [];
  }
}

function App() {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [favorites, setFavorites] =
    useState<number[]>(readFavorites);

  // Đồng bộ danh sách yêu thích
  useEffect(() => {
    try {
      localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(favorites)
      );
    } catch {
      // Ứng dụng vẫn hoạt động nếu trình duyệt chặn localStorage.
    }
  }, [favorites]);

  // Đóng menu khi nhấn phím Escape
  useEffect(() => {
    if (!menuOpen && !showVideo) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setShowVideo(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen, showVideo]);

  // Tìm kiếm theo tên, mô tả và danh mục
  const filteredDestinations = useMemo(() => {
    const keyword = search.trim().toLocaleLowerCase("vi");

    if (!keyword) return destinations;

    return destinations.filter((place) =>
      [
        place.name,
        place.description,
        place.category,
      ].some((value) =>
        String(value ?? "")
          .toLocaleLowerCase("vi")
          .includes(keyword)
      )
    );
  }, [search]);

  function toggleFavorite(id: number) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <main className="huetravel-home">
      {/* THANH ĐIỀU HƯỚNG */}
      <header className="navbar">
        <a
          className="brand"
          href="#home"
          onClick={closeMenu}
          aria-label="HueTravel - Trang chủ"
        >
          <span className="brand-icon">H</span>
          <span>
            Hue<span className="brand-gold">Travel</span>
          </span>
        </a>

        <button
          type="button"
          className="mobile-menu"
          onClick={() => setMenuOpen((current) => !current)}
          aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>

        <nav
          className={menuOpen ? "nav-links open" : "nav-links"}
          aria-label="Điều hướng chính"
        >
          <a href="#home" onClick={closeMenu}>
            Trang chủ
          </a>

          <a href="#destinations" onClick={closeMenu}>
            Điểm đến
          </a>

          <a href="#experience" onClick={closeMenu}>
            Trải nghiệm
          </a>

          <a href="#about" onClick={closeMenu}>
            Về Huế
          </a>

          <Link
            to="/itinerary"
            className="nav-link"
            onClick={closeMenu}
          >
            <CalendarDays size={17} />
            Lịch trình
          </Link>

          <a
            className="nav-cta"
            href="#destinations"
            onClick={closeMenu}
          >
            Khám phá ngay <ArrowRight size={16} />
          </a>
        </nav>
      </header>

      {/* BANNER CHÍNH */}
<section className="hero" id="home">
  <video
    className="hero-video"
    autoPlay
    muted
    loop
    playsInline
    preload="auto"
    poster="/banner-hue.png"
  >
    <source src="/video/hue-banner.mp4" type="video/mp4" />
    Trình duyệt của bạn không hỗ trợ video.
  </video>

  <div className="hero-overlay" />

        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="eyebrow">
            <Sparkles size={15} />
            HÀNH TRÌNH DI SẢN VIỆT NAM
          </div>

          <h1>
            Chạm vào di sản,
            <br />
            <span>cảm nhận chất Huế.</span>
          </h1>

          <p>
            Khám phá cung điện cổ kính, những ngôi chùa
            trầm mặc, dòng sông thơ mộng và nét văn hóa
            làm nên linh hồn của cố đô.
          </p>

          <div className="hero-actions">
            <a className="button-primary" href="#destinations">
              Khám phá Huế
              <ArrowRight size={18} />
            </a>

          </div>
        </motion.div>

        <div className="hero-caption">
          <MapPin size={16} />
          <span>THÀNH PHỐ HUẾ · VIỆT NAM</span>
        </div>

        <a href="#destinations" className="scroll-indicator">
          CUỘN ĐỂ KHÁM PHÁ
          <ArrowDown size={15} />
        </a>

        <div className="hero-counter">
          <span>01</span> / 03
        </div>
      </section>

      {/* THANH TÌM KIẾM */}
      <section className="search-section">
        <div className="search-heading">
          <span className="section-kicker">
            BẮT ĐẦU HÀNH TRÌNH
          </span>

          <h2>Huế đang chờ bạn khám phá</h2>

          <p>
            Tìm địa điểm yêu thích và lên kế hoạch cho chuyến đi.
          </p>
        </div>

        <form
          className="search-box"
          onSubmit={(event) => {
            event.preventDefault();
            document
              .getElementById("destinations")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <Search size={21} />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tên địa điểm, văn hóa, ẩm thực..."
            aria-label="Tìm kiếm địa điểm"
          />

          {search && (
            <button
              type="button"
              className="search-clear"
              onClick={() => setSearch("")}
              aria-label="Xóa từ khóa tìm kiếm"
            >
              <X size={17} />
            </button>
          )}

          <button type="submit" className="search-button">
            Tìm kiếm
          </button>
        </form>
      </section>

      {/* DANH SÁCH ĐỊA ĐIỂM */}
      <section
        className="destinations section-wrap"
        id="destinations"
      >
        <div className="section-header">
          <div>
            <span className="section-kicker">
              NHỮNG ĐIỂM ĐẾN ĐẶC SẮC
            </span>

            <h2>Vẻ đẹp vượt thời gian</h2>

            <p>
              Mỗi điểm đến là một mảnh ghép trong câu chuyện
              của vùng đất cố đô.
            </p>
          </div>

          <span className="destination-count">
            {filteredDestinations.length} ĐỊA ĐIỂM
          </span>
        </div>

        <div className="destination-grid">
          {filteredDestinations.map((place, index) => {
            const isFavorite = favorites.includes(place.id);

            return (
              <motion.article
                className="destination-card"
                key={place.id}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{
                  delay: Math.min(index * 0.06, 0.3),
                  duration: 0.45,
                }}
              >
                <div className="destination-image">
                  <img
                    src={place.image}
                    alt={place.name}
                    loading="lazy"
                  />

                  <span className="place-category">
                    {place.category}
                  </span>

                  <button
                    type="button"
                    className={
                      isFavorite
                        ? "favorite active"
                        : "favorite"
                    }
                    onClick={() => toggleFavorite(place.id)}
                    aria-label={
                      isFavorite
                        ? `Bỏ yêu thích ${place.name}`
                        : `Yêu thích ${place.name}`
                    }
                    aria-pressed={isFavorite}
                  >
                    <Heart
                      size={19}
                      fill={isFavorite ? "currentColor" : "none"}
                    />
                  </button>
                </div>

                <div className="destination-info">
                  <h3>{place.name}</h3>

                  <p>{place.description}</p>

                  <Link
                    to={`/destinations/${place.slug}`}
                    className="text-link"
                  >
                    Khám phá chi tiết
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>

        {filteredDestinations.length === 0 && (
          <div className="empty-message">
            <Search size={28} />

            <h3>Chưa tìm thấy địa điểm phù hợp</h3>

            <p>
              Thử một từ khóa khác, chẳng hạn như Đại Nội,
              chùa, thiên nhiên hoặc ẩm thực.
            </p>

            <button
              type="button"
              className="button-primary"
              onClick={() => setSearch("")}
            >
              Xem tất cả địa điểm
            </button>
          </div>
        )}
      </section>

      {/* PHẦN TRẢI NGHIỆM */}
      <section className="experience" id="experience">
        <div className="experience-image">
          <div className="experience-image-caption">
            <span>HUE · VIETNAM</span>
            <span className="experience-caption-line" />
          </div>

          <div className="experience-image-badge">
            <Sparkles size={18} />

            <span>
              <strong>Chất Huế</strong>
              <small>Vẻ đẹp vượt thời gian</small>
            </span>
          </div>
        </div>

        <div className="experience-content">
          <span className="section-kicker">
            SỐNG CHẬM GIỮA CỐ ĐÔ
          </span>

          <h2>
            Không chỉ là một chuyến đi.
            <br />
            <span>Đó là một cảm xúc.</span>
          </h2>

          <p>
            Từ nhịp sống bên dòng Hương Giang đến hương vị
            ẩm thực truyền thống, mỗi trải nghiệm đều kể
            một câu chuyện riêng về Huế.
          </p>

          <div className="experience-highlights">
            <div className="experience-highlight">
              <span className="experience-highlight-icon">
                <MapPin size={20} />
              </span>

              <div>
                <strong>Khám phá di sản</strong>
                <p>
                  Tìm hiểu kiến trúc và lịch sử cung đình.
                </p>
              </div>
            </div>

            <div className="experience-highlight">
              <span className="experience-highlight-icon">
                <Sparkles size={20} />
              </span>

              <div>
                <strong>Thưởng thức ẩm thực</strong>
                <p>
                  Khám phá hương vị đặc trưng xứ Huế.
                </p>
              </div>
            </div>

            <div className="experience-highlight">
              <span className="experience-highlight-icon">
                <Clock3 size={20} />
              </span>

              <div>
                <strong>Sống chậm giữa thiên nhiên</strong>
                <p>
                  Tận hưởng vẻ bình yên của sông Hương.
                </p>
              </div>
            </div>
          </div>

          <div className="experience-actions">
            <a className="button-primary" href="#about">
              Tìm hiểu thêm
              <ArrowRight size={18} />
            </a>

            <span className="experience-note">
              Một hành trình, ngàn cảm xúc.
            </span>
          </div>
        </div>
      </section>

      {/* GIỚI THIỆU HUẾ */}
      <section className="about section-wrap" id="about">
        <div className="about-icon">✳</div>

        <span className="section-kicker">
          HUẾ · MIỀN KÝ ỨC
        </span>

        <h2>Một cố đô, ngàn câu chuyện.</h2>

        <p>
          HueTravel kết nối di sản, văn hóa, ẩm thực và thiên
          nhiên trong một hành trình khám phá dành riêng cho bạn.
        </p>

        <div className="about-features">
          <div>
            <MapPin />
            <strong>Điểm đến</strong>
            <span>Di sản và thiên nhiên</span>
          </div>

          <div>
            <CalendarDays />
            <strong>Lịch trình</strong>
            <span>Hành trình theo sở thích</span>
          </div>

          <div>
            <Play />
            <strong>Trải nghiệm</strong>
            <span>Ảnh, phim và câu chuyện</span>
          </div>
        </div>

        <div className="about-actions">
          <Link to="/itinerary" className="button-primary">
            <CalendarDays size={18} />
            Xem và tạo lịch trình
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* CHÂN TRANG */}
      <footer className="footer">
        <a className="brand" href="#home">
          <span className="brand-icon">H</span>
          <span>
            Hue<span className="brand-gold">Travel</span>
          </span>
        </a>

        <p>Khám phá Huế theo cách của riêng bạn.</p>

        <span>© 2026 HueTravel · Dự án học tập FrontEnd</span>
      </footer>

      {/* HỘP VIDEO GIỚI THIỆU */}
      {showVideo && (
        <div
          className="video-modal"
          role="presentation"
          onClick={() => setShowVideo(false)}
        >
          <div
            className="video-modal-content"
            role="dialog"
            aria-modal="true"
            aria-label="Phim giới thiệu Huế"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="video-close"
              onClick={() => setShowVideo(false)}
              aria-label="Đóng video"
            >
              <X />
            </button>

            <video
              controls
              autoPlay
              playsInline
              className="intro-video"
              src="/videos/hue-intro.mp4"
            >
              Trình duyệt của bạn không hỗ trợ video.
            </video>

            <p>
              Đặt video giới thiệu tại
              {" "}public/videos/hue-intro.mp4.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
