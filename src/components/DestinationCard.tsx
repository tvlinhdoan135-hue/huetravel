
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, MapPin, ArrowUpRight } from "lucide-react";
import type { Destination } from "../data/destinations";
import { formatPrice } from "../data/destinations";

interface Props {
  destination: Destination;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}

export default function DestinationCard({
  destination,
  isFavorite,
  onToggleFavorite,
}: Props) {
  return (
    <motion.article
      className="explore-card"
      layout
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -7 }}
      transition={{ duration: 0.3 }}
    >
      <div className="explore-card-image">
        <Link
          to={`/destinations/${destination.slug}`}
          aria-label={`Xem ${destination.name}`}
        >
          <img
            src={destination.image}
            alt={destination.name}
            loading="lazy"
          />
        </Link>

        <span className="explore-category">{destination.category}</span>

        <button
          type="button"
          className={`explore-heart ${isFavorite ? "selected" : ""}`}
          onClick={() => onToggleFavorite(destination.id)}
          aria-label={
            isFavorite
              ? `Bỏ yêu thích ${destination.name}`
              : `Yêu thích ${destination.name}`
          }
          aria-pressed={isFavorite}
        >
          <Heart
            size={19}
            fill={isFavorite ? "currentColor" : "none"}
          />
        </button>

        <span className="explore-rating">★ {destination.rating}</span>
      </div>

      <div className="explore-card-body">
        <div className="explore-address">
          <MapPin size={14} />
          {destination.address}
        </div>

        <h3>
          <Link to={`/destinations/${destination.slug}`}>
            {destination.name}
          </Link>
        </h3>

        <p>{destination.description}</p>

        <div className="explore-card-bottom">
          <div>
            <span className="price-label">Chi phí tham khảo</span>
            <strong>{formatPrice(destination.price)}</strong>
          </div>

          <Link
            className="explore-detail-link"
            to={`/destinations/${destination.slug}`}
            aria-label={`Xem chi tiết ${destination.name}`}
          >
            <ArrowUpRight size={19} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
