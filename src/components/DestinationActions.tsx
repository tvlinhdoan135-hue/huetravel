
import { useState } from "react";
import { Heart, CalendarPlus, Check } from "lucide-react";
import { destinations } from "../data/destinations";
import { getFavorites, toggleFavorite } from "../utils/favorites";
import { addToItinerary } from "../utils/itinerary";

type Destination = (typeof destinations)[number];

interface DestinationActionsProps {
  destination: Destination;
}

export default function DestinationActions({
  destination,
}: DestinationActionsProps) {
  const [favorite, setFavorite] = useState(() =>
    getFavorites().includes(destination.id),
  );

  const [added, setAdded] = useState(() =>
    typeof localStorage !== "undefined" &&
    JSON.parse(localStorage.getItem("huetravel-itinerary") || "[]").some(
      (item: { id: number }) => item.id === destination.id,
    ),
  );

  const [message, setMessage] = useState("");

  function handleFavorite() {
    const updated = toggleFavorite(destination.id);
    setFavorite(updated.includes(destination.id));
    setMessage(
      updated.includes(destination.id)
        ? "Đã thêm vào yêu thích"
        : "Đã bỏ khỏi yêu thích",
    );
  }

  function handleAddToItinerary() {
    const current = addToItinerary(destination.id);
    const exists = current.some((item) => item.id === destination.id);

    setAdded(exists);
    setMessage(
      exists
        ? "Địa điểm đã có trong lịch trình"
        : "Đã thêm địa điểm",
    );
  }

  return (
    <div className="destination-actions">
      <button
        type="button"
        className={`destination-action-button ${favorite ? "is-favorite" : ""}`}
        onClick={handleFavorite}
        aria-label={favorite ? "Bỏ yêu thích" : "Thêm yêu thích"}
        aria-pressed={favorite}
      >
        <Heart size={17} fill={favorite ? "currentColor" : "none"} />
        <span>{favorite ? "Đã yêu thích" : "Yêu thích"}</span>
      </button>

      <button
        type="button"
        className="destination-action-button destination-action-primary"
        onClick={handleAddToItinerary}
      >
        {added ? <Check size={17} /> : <CalendarPlus size={17} />}
        <span>{added ? "Đã có lịch trình" : "Thêm lịch trình"}</span>
      </button>

      {message && (
        <p className="destination-action-message" role="status">
          {message}
        </p>
      )}
    </div>
  );
}
