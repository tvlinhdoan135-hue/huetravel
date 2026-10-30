
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Compass,
  MapPin,
  Search,
  Sparkles,
} from "lucide-react";
import { destinations, formatPrice } from "../data/destinations";
import "../App.css";

const heroImage =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2200&q=90";

const categories = ["Tất cả", ...new Set(destinations.map((item) => item.category))];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("Tất cả");

  const featuredDestinations = useMemo(() => {
    return destinations.filter((item) => {
      const matchesKeyword = item.name
        .toLowerCase()
        .includes(keyword.trim().toLowerCase());

      const matchesCategory =
        category === "Tất cả" || item.category === category;

      return matchesKeyword && matchesCategory;
    });
  }, [keyword, category]);

  return (
    <main className="premium-home">
      <section
        className="premium-hero"
      >
        <video
          className="premium-hero-video"
          src="/video/hue-banner.mp4"
          poster={heroImage}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        <div className="premium-hero-overlay" />

        <div className="premium-hero-content">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.7 }}
          >
            <span className="premium-eyebrow">
              <Sparkles size={15} />
              KHÁM PHÁ VẺ ĐẸP CỐ ĐÔ
            </span>

            <h1>
              Huế trong tim.
              <br />
              <span>Trải nghiệm bất tận.</span>
            </h1>

            <p className="premium-hero-description">
              Chạm vào chiều sâu di sản, khám phá thiên nhiên thơ mộng
              và tạo nên hành trình mang dấu ấn riêng của bạn.
            </p>

            <div className="premium-hero-actions">
              <Link to="/destinations" className="premium-button premium-button-light">
                Khám phá điểm đến
                <ArrowRight size={18} />
              </Link>

              <a href="#featured" className="premium-text-link">
                Khám phá ngay
                <ArrowDown size={16} />
              </a>
            </div>
          </motion.div>
        </div>

        <div className="premium-hero-bottom">
          <span>DI SẢN · VĂN HÓA · THIÊN NHIÊN</span>
          <span>HUẾ, VIỆT NAM</span>
        </div>
      </section>

      <section className="premium-intro">
        <motion.div
          className="premium-intro-heading"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
        >
          <span className="premium-eyebrow premium-eyebrow-dark">
            <Compass size={16} />
            HÀNH TRÌNH CỦA BẠN
          </span>

          <h2>
            Không chỉ là một chuyến đi,
            <br />
            <span>mà là một câu chuyện.</span>
          </h2>

          <p>
            Tìm những địa điểm đáng nhớ, chọn trải nghiệm yêu thích
            và bắt đầu hành trình khám phá Huế theo cách của riêng bạn.
          </p>
        </motion.div>

        <div className="premium-stats">
          <div>
            <strong>{destinations.length.toString().padStart(2, "0")}+</strong>
            <span>Địa điểm khám phá</span>
          </div>
          <div>
            <strong>01</strong>
            <span>Cố đô ngàn năm</span>
          </div>
          <div>
            <strong>∞</strong>
            <span>Trải nghiệm đáng nhớ</span>
          </div>
        </div>
      </section>

      <section className="premium-featured" id="featured">
        <div className="premium-section-heading">
          <div>
            <span className="premium-eyebrow premium-eyebrow-dark">
              ĐIỂM ĐẾN DÀNH CHO BẠN
            </span>
            <h2>Điểm đến nổi bật</h2>
            <p>Những góc Huế xứng đáng để bạn dừng chân.</p>
          </div>

          <Link to="/destinations" className="premium-outline-button">
            Xem tất cả
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="premium-search-panel">
          <div className="premium-search-input">
            <Search size={19} />
            <input
              type="search"
              placeholder="Bạn muốn khám phá nơi nào?"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              aria-label="Tìm địa điểm"
            />
          </div>

          <div className="premium-category-list">
            {categories.map((item) => (
              <button
                type="button"
                key={item}
                className={`premium-category-chip ${
                  category === item ? "active" : ""
                }`}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {featuredDestinations.length > 0 ? (
          <motion.div
            className="premium-destination-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.08 }}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            {featuredDestinations.map((place, index) => (
              <motion.article
                className={`premium-destination-card ${
                  index === 0 ? "premium-destination-card-large" : ""
                }`}
                key={place.id}
                variants={fadeUp}
                transition={{ duration: 0.55 }}
                whileHover={{ y: -7 }}
              >
                <Link
                  to={`/destinations/${place.slug}`}
                  className="premium-destination-link"
                  aria-label={`Khám phá ${place.name}`}
                >
                  <div className="premium-destination-image-wrap">
                    <img
                      src={place.image}
                      alt={place.name}
                      className="premium-destination-image"
                      loading={index < 3 ? "eager" : "lazy"}
                    />
                    <span className="premium-destination-category">
                      {place.category}
                    </span>
                    <span className="premium-destination-arrow">
                      <ArrowRight size={19} />
                    </span>
                  </div>

                  <div className="premium-destination-info">
                    <h3>{place.name}</h3>

                    <p className="premium-destination-location">
                      <MapPin size={15} />
                      {place.address}
                    </p>

                    <div className="premium-destination-meta">
                      <span>{place.duration}</span>
                      <strong>{formatPrice(place.price)}</strong>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        ) : (
          <div className="premium-empty-state">
            <Search size={28} />
            <h3>Chưa tìm thấy địa điểm phù hợp</h3>
            <p>Thử từ khóa khác hoặc chọn danh mục khác nhé.</p>
            <button
              type="button"
              className="premium-outline-button"
              onClick={() => {
                setKeyword("");
                setCategory("Tất cả");
              }}
            >
              Xóa bộ lọc
            </button>
          </div>
        )}

        <div className="premium-featured-footer">
          <Link to="/destinations" className="premium-button premium-button-dark">
            Bắt đầu hành trình
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="premium-cta">
        <div className="premium-cta-content">
          <span className="premium-eyebrow">HUẾ ĐANG CHỜ BẠN</span>
          <h2>Một hành trình đẹp bắt đầu từ một lựa chọn.</h2>
          <p>Chọn điểm đến yêu thích và lên kế hoạch cho chuyến đi tiếp theo.</p>
          <Link to="/itinerary" className="premium-button premium-button-light">
            Lên lịch trình
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className="premium-footer">
        <Link to="/" className="premium-footer-brand">
          <span className="premium-brand-mark">H</span>
          <span>HueTravel</span>
        </Link>
        <p>Khám phá Huế bằng những trải nghiệm đáng nhớ.</p>
        <Link to="/destinations">Khám phá điểm đến</Link>
      </footer>
    </main>
  );
}
