
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Heart, MapPin, Trash2 } from "lucide-react";
import { destinations, formatPrice } from "../data/destinations";
import {
  clearFavorites,
  getFavorites,
  toggleFavorite,
} from "../utils/favorites";
import "../App.css";

export default function Favorites() {
  const [favoriteIds, setFavoriteIds] = useState<number[]>(getFavorites);

  useEffect(() => {
    function refreshFavorites() {
      setFavoriteIds(getFavorites());
    }

    window.addEventListener("storage", refreshFavorites);

    return () => {
      window.removeEventListener("storage", refreshFavorites);
    };
  }, []);

  const favoriteDestinations = destinations.filter((place) =>
    favoriteIds.includes(place.id),
  );

  function removeFavorite(id: number) {
    setFavoriteIds(toggleFavorite(id));
  }

  function removeAllFavorites() {
    if (favoriteIds.length === 0) return;

    const confirmed = window.confirm(
      "Bạn có chắc muốn xóa toàn bộ địa điểm yêu thích?",
    );

    if (!confirmed) return;

    clearFavorites();
    setFavoriteIds([]);
  }

  return (
    <main className="favorites-page">
      <header className="favorites-heading">
        <Link to="/destinations" className="favorites-back">
          <ArrowLeft size={17} />
          Khám phá địa điểm
        </Link>

        <span className="favorites-eyebrow">BỘ SƯU TẬP CỦA BẠN</span>
        <h1>Địa điểm yêu thích</h1>
        <p>
          Lưu lại những nơi bạn muốn đến và biến chúng thành hành trình
          tiếp theo của mình.
        </p>

        <div className="favorites-count">
          <Heart size={18} />
          {favoriteDestinations.length} địa điểm đã lưu
        </div>
      </header>

      <section className="favorites-content">
        {favoriteDestinations.length === 0 ? (
          <div className="favorites-empty">
            <Heart size={42} strokeWidth={1.3} />
            <h2>Chưa có địa điểm yêu thích</h2>
            <p>
              Hãy khám phá Huế và lưu lại những địa điểm bạn muốn ghé thăm.
            </p>
            <Link to="/destinations" className="favorites-button">
              Khám phá ngay
            </Link>
          </div>
        ) : (
          <>
            <div className="favorites-toolbar">
              <span>Những nơi bạn đã chọn</span>

              <button
                type="button"
                className="favorites-clear"
                onClick={removeAllFavorites}
              >
                <Trash2 size={16} />
                Xóa tất cả
              </button>
            </div>

            <div className="favorites-grid">
              {favoriteDestinations.map((place) => (
                <article className="favorites-card" key={place.id}>
                  <Link
                    to={`/destinations/${place.slug}`}
                    className="favorites-card-link"
                  >
                    <img src={place.image} alt={place.name} loading="lazy" />

                    <div className="favorites-card-body">
                      <span className="favorites-category">
                        {place.category}
                      </span>

                      <h2>{place.name}</h2>

                      <p className="favorites-address">
                        <MapPin size={15} />
                        {place.address}
                      </p>

                      <div className="favorites-card-footer">
                        <span>{place.duration}</span>
                        <strong>{formatPrice(place.price)}</strong>
                      </div>
                    </div>
                  </Link>

                  <button
                    type="button"
                    className="favorites-remove"
                    aria-label={`Bỏ yêu thích ${place.name}`}
                    title="Bỏ yêu thích"
                    onClick={() => removeFavorite(place.id)}
                  >
                    <Heart size={17} fill="currentColor" />
                  </button>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
