
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock,
  Heart,
  MapPin,
  Sparkles,
  Tag,
} from "lucide-react";

import {
  destinations,
  formatPrice,
} from "../data/destinations";

import "../App.css";
import "./DestinationDetail.css";

const FAVORITES_KEY = "huetravel-favorites";

// Đọc danh sách yêu thích từ localStorage
function readFavorites(): number[] {
  try {
    const value = localStorage.getItem(FAVORITES_KEY);
    const parsed: unknown = value ? JSON.parse(value) : [];

    return Array.isArray(parsed)
      ? parsed.filter(
          (item): item is number =>
            typeof item === "number" &&
            Number.isFinite(item)
        )
      : [];
  } catch {
    return [];
  }
}

export default function DestinationDetail() {
  const { slug } = useParams<{ slug: string }>();

  const place = destinations.find(
    (item) => item.slug === slug
  );

  const [favorites, setFavorites] =
    useState<number[]>(readFavorites);

  // Đồng bộ danh sách yêu thích giữa các lần truy cập
  useEffect(() => {
    localStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify(favorites)
    );
  }, [favorites]);

  // Trường hợp không tìm thấy địa điểm
  if (!place) {
    return (
      <main className="destination-detail">
        <header className="detail-topbar">
          <Link to="/" className="detail-brand">
            <span className="detail-brand-icon">H</span>
            <span>
              Hue<span className="detail-brand-gold">Travel</span>
            </span>
          </Link>
        </header>

        <section className="detail-not-found">
          <MapPin size={42} />
          <h1>Không tìm thấy địa điểm</h1>
          <p>
            Địa điểm không tồn tại hoặc đường dẫn
            không chính xác.
          </p>
          <Link to="/" className="detail-button-primary">
            <ArrowLeft size={17} />
            Quay lại trang chủ
          </Link>
        </section>
      </main>
    );
  }

  const destinationId = place.id;
  const isFavorite = favorites.includes(destinationId);
  const tags = place.tags ?? [];

  function toggleFavorite() {
    setFavorites((current) =>
      current.includes(destinationId)
        ? current.filter((id) => id !== destinationId)
        : [...current, destinationId]
    );
  }

  return (
    <main className="destination-detail">
      {/* THANH ĐIỀU HƯỚNG */}
      <header className="detail-topbar">
        <Link
          to="/"
          className="detail-brand"
          aria-label="HueTravel - Trang chủ"
        >
          <span className="detail-brand-icon">H</span>
          <span>
            Hue<span className="detail-brand-gold">Travel</span>
          </span>
        </Link>

        <Link to="/destinations" className="detail-back">
          <ArrowLeft size={18} />
          <span>Tất cả địa điểm</span>
        </Link>
      </header>

      {/* ĐƯỜNG DẪN */}
      <nav
        className="detail-breadcrumbs detail-breadcrumbs-bar"
        aria-label="Đường dẫn"
      >
        <Link to="/">Trang chủ</Link>
        <span>/</span>
        <Link to="/destinations">Khám phá Huế</Link>
        <span>/</span>
        <span aria-current="page">{place.name}</span>
      </nav>

      {/* ẢNH BÌA */}
      <section className="detail-cover">
        <img
          className="detail-cover-image"
          src={place.image}
          alt={place.name}
        />

        <div className="detail-cover-overlay" />

        <div className="detail-cover-content">
          <span className="detail-category">
            <Sparkles size={15} />
            {place.category}
          </span>

          <p className="detail-eyebrow">
            HÀNH TRÌNH DI SẢN HUẾ
          </p>

          <h1>{place.name}</h1>

          <p className="detail-cover-description">
            {place.description}
          </p>

          <div className="detail-cover-meta">
            <span>
              <MapPin size={16} />
              Thành phố Huế
            </span>

            <span>
              <Clock size={16} />
              {place.duration || "Thời gian linh hoạt"}
            </span>
          </div>
        </div>
      </section>

      {/* NỘI DUNG */}
      <div className="detail-main">
        <article className="detail-article">
          {/* TIÊU ĐỀ */}
          <div className="detail-heading-row">
            <div>
              <span className="section-kicker">
                KHÁM PHÁ VẺ ĐẸP CỐ ĐÔ
              </span>

              <h2>{place.name}</h2>
            </div>

            <button
              type="button"
              className={
                isFavorite
                  ? "detail-favorite active"
                  : "detail-favorite"
              }
              onClick={toggleFavorite}
              aria-pressed={isFavorite}
            >
              <Heart
                size={19}
                fill={isFavorite ? "currentColor" : "none"}
              />

              {isFavorite
                ? "Đã yêu thích"
                : "Thêm yêu thích"}
            </button>
          </div>

          {/* GIỚI THIỆU */}
          <p className="detail-description">
            {place.details || place.description}
          </p>

          {/* TRẢI NGHIỆM */}
          <section className="detail-section">
            <span className="section-kicker">
              ĐỪNG BỎ LỠ
            </span>

            <h3>Điều bạn có thể trải nghiệm</h3>

            {tags.length > 0 ? (
              <div className="detail-tags">
                {tags.map((tag, index) => (
                  <span
                    className="detail-tag"
                    key={`${tag}-${index}`}
                  >
                    <Tag size={15} />
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <p className="detail-description">
                Khám phá kiến trúc, văn hóa và những
                câu chuyện đặc trưng của địa điểm này.
              </p>
            )}
          </section>

          {/* GỢI Ý */}
          <section className="detail-section">
            <h3>Gợi ý cho chuyến đi</h3>

            <div className="detail-note">
              Tham khảo thời tiết, giờ mở cửa và thông tin
              vé trước khi khởi hành. Chi phí hiển thị trên
              website có thể mang tính tham khảo.
            </div>
          </section>
        </article>

        {/* THÔNG TIN ĐỊA ĐIỂM */}
        <aside className="detail-sidebar">
          <div className="detail-sidebar-heading">
            <span>Thông tin tham quan</span>
            <h3>Lên kế hoạch ghé thăm</h3>
          </div>

          <div className="detail-facts">
            <div className="detail-fact">
              <span className="detail-fact-icon">
                <MapPin size={20} />
              </span>

              <div>
                <span className="detail-fact-label">
                  Địa chỉ
                </span>
                <strong className="detail-fact-value">
                  {place.address || "Thành phố Huế"}
                </strong>
              </div>
            </div>

            <div className="detail-fact">
              <span className="detail-fact-icon">
                <Clock size={20} />
              </span>

              <div>
                <span className="detail-fact-label">
                  Thời gian tham quan
                </span>
                <strong className="detail-fact-value">
                  {place.duration || "2–3 giờ"}
                </strong>
              </div>
            </div>

            <div className="detail-fact">
              <span className="detail-fact-icon">
                <Tag size={20} />
              </span>

              <div>
                <span className="detail-fact-label">
                  Chi phí tham khảo
                </span>
                <strong className="detail-fact-value">
                  {formatPrice(place.price)}
                </strong>
              </div>
            </div>
          </div>

          <div className="detail-sidebar-actions">
            <Link
              to="/itinerary"
              className="detail-button-primary"
            >
              <CalendarDays size={18} />
              Tạo lịch trình
              <ArrowRight size={17} />
            </Link>

            <Link
              to="/destinations"
              className="detail-button-secondary"
            >
              <ArrowLeft size={17} />
              Chọn địa điểm khác
            </Link>
          </div>
        </aside>
      </div>

      {/* CHÂN TRANG */}
      <footer className="detail-footer">
        <Link to="/" className="detail-brand">
          <span className="detail-brand-icon">H</span>
          <span>
            Hue<span className="detail-brand-gold">Travel</span>
          </span>
        </Link>

        <span>
          Khám phá Huế theo cách của riêng bạn.
        </span>

        <span>
          © 2026 <strong>HueTravel</strong>
        </span>
      </footer>
    </main>
  );
}
