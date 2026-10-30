
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Plus,
  Printer,
  Trash2,
  Wallet,
} from "lucide-react";
import { destinations, formatPrice } from "../data/destinations";
import {
  addToItinerary,
  getItinerary,
  removeFromItinerary,
  updateItineraryDay,
} from "../utils/itinerary";
import type { PlannedDestination } from "../utils/itinerary";
import "../App.css";

const START_DATE_KEY = "huetravel-start-date";

function getTomorrow(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getSavedStartDate(): string {
  try {
    return localStorage.getItem(START_DATE_KEY) || getTomorrow();
  } catch {
    return getTomorrow();
  }
}

function getVisitDate(startDate: string, dayNumber: number): string {
  if (!startDate) return `Ngày ${dayNumber}`;

  const [year, month, day] = startDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + dayNumber - 1);

  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export default function Itinerary() {
  const [planned, setPlanned] = useState<PlannedDestination[]>(getItinerary);
  const [startDate, setStartDate] = useState(getSavedStartDate);
  const [selectedDestination, setSelectedDestination] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(START_DATE_KEY, startDate);
    } catch {
      // Trang vẫn hoạt động nếu trình duyệt chặn lưu trữ.
    }
  }, [startDate]);

  const plannedDestinations = useMemo(
    () =>
      planned
        .map((item) => ({
          ...item,
          destination: destinations.find(
            (place) => place.id === item.id,
          ),
        }))
        .filter(
          (
            item,
          ): item is PlannedDestination & {
            destination: (typeof destinations)[number];
          } => Boolean(item.destination),
        )
        .sort(
          (a, b) =>
            a.day - b.day ||
            a.destination.name.localeCompare(b.destination.name, "vi"),
        ),
    [planned],
  );

  const groupedDays = useMemo(() => {
    const groups: {
      day: number;
      date: string;
      items: typeof plannedDestinations;
    }[] = [];

    for (const item of plannedDestinations) {
      let group = groups.find((entry) => entry.day === item.day);

      if (!group) {
        group = {
          day: item.day,
          date: getVisitDate(startDate, item.day),
          items: [],
        };
        groups.push(group);
      }

      group.items.push(item);
    }

    return groups;
  }, [plannedDestinations, startDate]);

  const totalCost = plannedDestinations.reduce(
    (sum, item) => sum + Number(item.destination.price || 0),
    0,
  );

  const totalDays = plannedDestinations.length
    ? Math.max(...plannedDestinations.map((item) => item.day))
    : 0;

  function refreshItinerary(updated: PlannedDestination[]) {
    setPlanned(updated);
    window.dispatchEvent(new Event("huetravel-data-updated"));
  }

  function handleAddDestination() {
    const id = Number(selectedDestination);

    if (!selectedDestination || !Number.isFinite(id)) return;

    const exists = planned.some((item) => item.id === id);

    if (exists) {
      window.alert("Địa điểm này đã có trong lịch trình.");
      return;
    }

    refreshItinerary(addToItinerary(id));
    setSelectedDestination("");
  }

  function handleChangeDay(id: number, day: number) {
    refreshItinerary(updateItineraryDay(id, day));
  }

  function handleRemove(id: number, name: string) {
    if (!window.confirm(`Xóa "${name}" khỏi lịch trình?`)) return;

    refreshItinerary(removeFromItinerary(id));
  }

  function handleClearAll() {
    if (!planned.length) return;

    if (!window.confirm("Bạn có chắc muốn xóa toàn bộ lịch trình?")) return;

    const updated = destinations.length
      ? planned.filter((item) => !destinations.some((place) => place.id === item.id))
      : [];

    // Dùng hàm xóa hiện có để đảm bảo dữ liệu được lưu đúng khóa.
    let next = getItinerary();

    for (const item of next) {
      next = removeFromItinerary(item.id);
    }

    refreshItinerary(updated.length ? getItinerary() : []);
  }

  function handlePrint() {
    if (!plannedDestinations.length) {
      window.alert("Hãy thêm ít nhất một địa điểm trước khi in lịch trình.");
      return;
    }

    window.print();
  }

  return (
    <main className="itinerary-page">
      <section className="itinerary-hero">
        <div className="itinerary-hero-inner">
          <Link to="/destinations" className="itinerary-back no-print">
            <ArrowLeft size={17} />
            Khám phá địa điểm
          </Link>

          <span className="itinerary-eyebrow">HÀNH TRÌNH CỦA RIÊNG BẠN</span>
          <h1>Lịch trình khám phá Huế</h1>
          <p>
            Sắp xếp những điểm đến yêu thích thành hành trình riêng,
            theo dõi chi phí và lưu lịch trình để mang theo trong chuyến đi.
          </p>

          <div className="itinerary-start-date no-print">
            <CalendarDays size={19} />
            <label htmlFor="itinerary-start-date">Ngày khởi hành</label>
            <input
              id="itinerary-start-date"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="itinerary-container">
        <div className="itinerary-summary">
          <article className="itinerary-summary-card">
            <MapPin size={21} />
            <span>Địa điểm</span>
            <strong>{plannedDestinations.length}</strong>
          </article>

          <article className="itinerary-summary-card">
            <CalendarDays size={21} />
            <span>Số ngày dự kiến</span>
            <strong>{totalDays}</strong>
          </article>

          <article className="itinerary-summary-card">
            <Wallet size={21} />
            <span>Tổng chi phí tham khảo</span>
            <strong>{formatPrice(totalCost)}</strong>
          </article>
        </div>

        <div className="itinerary-add-panel no-print">
          <div>
            <span className="itinerary-section-kicker">LẬP KẾ HOẠCH</span>
            <h2>Thêm điểm đến</h2>
            <p>Chọn một địa điểm để bổ sung vào ngày đầu tiên.</p>
          </div>

          <div className="itinerary-add-controls">
            <select
              aria-label="Chọn địa điểm"
              value={selectedDestination}
              onChange={(event) => setSelectedDestination(event.target.value)}
            >
              <option value="">-- Chọn địa điểm --</option>
              {destinations
                .filter((place) => !planned.some((item) => item.id === place.id))
                .map((place) => (
                  <option key={place.id} value={place.id}>
                    {place.name}
                  </option>
                ))}
            </select>

            <button
              type="button"
              className="itinerary-primary-button"
              onClick={handleAddDestination}
              disabled={!selectedDestination}
            >
              <Plus size={17} />
              Thêm địa điểm
            </button>
          </div>
        </div>

        <div className="itinerary-list-heading">
          <div>
            <span className="itinerary-section-kicker">KẾ HOẠCH CHI TIẾT</span>
            <h2>Hành trình của bạn</h2>
          </div>

          <div className="itinerary-toolbar no-print">
            <button
              type="button"
              className="itinerary-outline-button"
              onClick={handlePrint}
              disabled={!plannedDestinations.length}
            >
              <Printer size={17} />
              In / Lưu PDF
            </button>

            <button
              type="button"
              className="itinerary-danger-button"
              onClick={handleClearAll}
              disabled={!planned.length}
            >
              <Trash2 size={16} />
              Xóa lịch trình
            </button>
          </div>
        </div>

        {plannedDestinations.length === 0 ? (
          <div className="itinerary-empty">
            <CalendarDays size={44} strokeWidth={1.3} />
            <h3>Lịch trình đang trống</h3>
            <p>
              Hãy chọn địa điểm ở phía trên để bắt đầu lên kế hoạch
              cho chuyến khám phá Huế.
            </p>
            <Link to="/destinations" className="itinerary-primary-link no-print">
              Khám phá các địa điểm
            </Link>
          </div>
        ) : (
          <div className="itinerary-days">
            {groupedDays.map((group) => (
              <section className="itinerary-day" key={group.day}>
                <header className="itinerary-day-header">
                  <span className="itinerary-day-number">
                    {String(group.day).padStart(2, "0")}
                  </span>
                  <div>
                    <h3>Ngày {group.day}</h3>
                    <p>{group.date}</p>
                  </div>
                  <span className="itinerary-day-count">
                    {group.items.length} địa điểm
                  </span>
                </header>

                <div className="itinerary-day-items">
                  {group.items.map(({ destination, day }) => (
                    <article className="itinerary-card" key={destination.id}>
                      <Link
                        to={`/destinations/${destination.slug}`}
                        className="itinerary-card-image"
                      >
                        <img
                          src={destination.image}
                          alt={destination.name}
                          loading="lazy"
                        />
                      </Link>

                      <div className="itinerary-card-content">
                        <span className="itinerary-card-category">
                          {destination.category}
                        </span>

                        <Link
                          to={`/destinations/${destination.slug}`}
                          className="itinerary-card-title"
                        >
                          {destination.name}
                        </Link>

                        <p className="itinerary-card-address">
                          <MapPin size={14} />
                          {destination.address}
                        </p>

                        <div className="itinerary-card-meta">
                          <span>
                            <Clock size={14} />
                            {destination.duration}
                          </span>
                          <strong>{formatPrice(destination.price)}</strong>
                        </div>

                        <div className="itinerary-card-controls no-print">
                          <label>
                            Ngày tham quan
                            <select
                              value={day}
                              onChange={(event) =>
                                handleChangeDay(
                                  destination.id,
                                  Number(event.target.value),
                                )
                              }
                            >
                              {Array.from({ length: 14 }, (_, index) => (
                                <option key={index + 1} value={index + 1}>
                                  Ngày {index + 1}
                                </option>
                              ))}
                            </select>
                          </label>

                          <button
                            type="button"
                            className="itinerary-remove-button"
                            onClick={() =>
                              handleRemove(destination.id, destination.name)
                            }
                          >
                            <Trash2 size={15} />
                            Xóa
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        <p className="itinerary-disclaimer">
          Chi phí là mức tham khảo theo dữ liệu địa điểm trong website,
          chưa bao gồm phương tiện di chuyển, ăn uống, lưu trú và các khoản
          phát sinh khác.
        </p>
      </section>
    </main>
  );
}
