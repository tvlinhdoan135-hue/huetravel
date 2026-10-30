
import { useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  CalendarDays,
  MapPin,
  Menu,
  Play,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import "./App.css";

const destinations = [
  {
    name: "Đại Nội Huế",
    category: "DI SẢN VĂN HÓA",
    description: "Khám phá dấu ấn hoàng cung triều Nguyễn.",
    image:
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Chùa Thiên Mụ",
    category: "VĂN HÓA TÂM LINH",
    description: "Nét bình yên bên dòng sông Hương thơ mộng.",
    image:
      "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Lăng Khải Định",
    category: "KIẾN TRÚC CUNG ĐÌNH",
    description: "Chiêm ngưỡng nghệ thuật kiến trúc độc đáo.",
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=85",
  },
];

function App() {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredDestinations = destinations.filter((place) =>
    place.name.toLowerCase().includes(search.toLowerCase())
  );

  function toggleFavorite(name: string) {
    setFavorites((old) =>
      old.includes(name)
        ? old.filter((item) => item !== name)
        : [...old, name]
    );
  }

  return (
    <main>
      <header className="navbar">
        <a className="brand" href="#home">
          <span className="brand-icon">H</span>
          <span>Hue<span className="brand-gold">Travel</span></span>
        </a>

        <button
          className="mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Mở menu"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          <a href="#home" onClick={() => setMenuOpen(false)}>Trang chủ</a>
          <a href="#destinations" onClick={() => setMenuOpen(false)}>Điểm đến</a>
          <a href="#experience" onClick={() => setMenuOpen(false)}>Trải nghiệm</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>Về Huế</a>
          <a className="nav-cta" href="#destinations">Khám phá ngay ↗</a>
        </nav>
      </header>

      <section className="hero" id="home">
        <div className="hero-overlay" />

        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
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
            Một hành trình đưa bạn qua những cung điện cổ kính,
            dòng sông thơ mộng và những câu chuyện vượt thời gian.
          </p>

          <div className="hero-actions">
            <a className="button-primary" href="#destinations">
              Khám phá Huế <ArrowRight size={18} />
            </a>

            <button
              className="button-video"
              onClick={() => setShowVideo(true)}
            >
              <span className="play-icon"><Play size={17} fill="currentColor" /></span>
              Xem phim giới thiệu
            </button>
          </div>
        </motion.div>

        <div className="hero-caption">
          <MapPin size={16} />
          <span>THÀNH PHỐ HUẾ · VIỆT NAM</span>
        </div>

        <a href="#destinations" className="scroll-indicator">
          CUỘN ĐỂ KHÁM PHÁ <ArrowDown size={15} />
        </a>

        <div className="hero-counter">
          <span>01</span> / 03
        </div>
      </section>

      <section className="search-section">
        <div className="search-heading">
          <span className="section-kicker">BẮT ĐẦU HÀNH TRÌNH</span>
          <h2>Huế đang chờ bạn khám phá</h2>
        </div>

        <div className="search-box">
          <Search size={21} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Bạn muốn khám phá nơi nào?"
            aria-label="Tìm kiếm địa điểm"
          />
          <a href="#destinations" className="search-button">
            Tìm kiếm
          </a>
        </div>
      </section>

      <section className="destinations section-wrap" id="destinations">
        <div className="section-header">
          <div>
            <span className="section-kicker">NHỮNG ĐIỂM ĐẾN ĐẶC SẮC</span>
            <h2>Vẻ đẹp vượt thời gian</h2>
            <p>Khám phá những điểm đến làm nên nét riêng của cố đô.</p>
          </div>
          <span className="destination-count">
            {filteredDestinations.length} ĐỊA ĐIỂM
          </span>
        </div>

        <div className="destination-grid">
          {filteredDestinations.map((place, index) => (
            <motion.article
              className="destination-card"
              key={place.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12, duration: 0.5 }}
            >
              <div className="destination-image">
                <img src={place.image} alt={place.name} loading="lazy" />
                <span className="place-category">{place.category}</span>
                <button
                  className={
                    favorites.includes(place.name)
                      ? "favorite active"
                      : "favorite"
                  }
                  onClick={() => toggleFavorite(place.name)}
                  aria-label={`Yêu thích ${place.name}`}
                >
                  {favorites.includes(place.name) ? "♥" : "♡"}
                </button>
              </div>

              <div className="destination-info">
                <h3>{place.name}</h3>
                <p>{place.description}</p>
                <a href="#experience" className="text-link">
                  Khám phá chi tiết <ArrowRight size={16} />
                </a>
              </div>
            </motion.article>
          ))}
        </div>

        {filteredDestinations.length === 0 && (
          <p className="empty-message">
            Không tìm thấy địa điểm phù hợp. Hãy thử từ khóa khác.
          </p>
        )}
      </section>

      <section className="experience" id="experience">
        <div className="experience-image" />
        <div className="experience-content">
          <span className="section-kicker">SỐNG CHẬM GIỮA CỐ ĐÔ</span>
          <h2>
            Không chỉ là một chuyến đi.
            <br />
            Đó là một cảm xúc.
          </h2>
          <p>
            Từ nhịp sống bên dòng Hương Giang đến hương vị ẩm thực
            truyền thống, mỗi trải nghiệm đều kể một câu chuyện về Huế.
          </p>
          <a className="button-primary" href="#about">
            Tìm hiểu thêm <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <section className="about section-wrap" id="about">
        <div className="about-icon">✳</div>
        <span className="section-kicker">HUẾ · MIỀN KÝ ỨC</span>
        <h2>Một cố đô, ngàn câu chuyện.</h2>
        <p>
          HueTravel kết nối di sản, văn hóa, ẩm thực và thiên nhiên
          trong một hành trình khám phá được thiết kế dành riêng cho bạn.
        </p>
        <div className="about-features">
          <div><MapPin /><strong>Điểm đến</strong><span>Di sản và thiên nhiên</span></div>
          <div><CalendarDays /><strong>Lịch trình</strong><span>Hành trình theo sở thích</span></div>
          <div><Play /><strong>Trải nghiệm</strong><span>Ảnh, phim và câu chuyện</span></div>
        </div>
      </section>

      <footer className="footer">
        <a className="brand" href="#home">
          <span className="brand-icon">H</span>
          <span>Hue<span className="brand-gold">Travel</span></span>
        </a>
        <p>Khám phá Huế theo cách của riêng bạn.</p>
        <span>© 2026 HueTravel · Dự án học tập FrontEnd</span>
      </footer>

      {showVideo && (
        <div className="video-modal" onClick={() => setShowVideo(false)}>
          <div
            className="video-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
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
              Hãy thêm video giới thiệu Huế vào
              public/videos/hue-intro.mp4 để phát tại đây.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
