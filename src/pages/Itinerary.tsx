
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowDown,
  ArrowUp,
  CalendarDays,
  Clock,
  MapPin,
  Plus,
  Printer,
  Trash2,
  Wallet,
  Route,
  CheckCircle2,
  RotateCcw,
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
const ITINERARY_KEY = "huetravel-itinerary";

const SAMPLE_ITINERARY = [
  { names: ["Đại Nội Huế"], day: 1 },
  { names: ["Chùa Thiên Mụ"], day: 1 },
  { names: ["Cầu Trường Tiền", "Cầu Tràng Tiền"], day: 1 },
  { names: ["Lăng Khải Định"], day: 1 },
  { names: ["Lăng Tự Đức"], day: 2 },
  { names: ["Chùa Từ Đàm"], day: 2 },
  { names: ["Nhà vườn An Hiên"], day: 2 },
  { names: ["Phố đi bộ Nguyễn Đình Chiểu"], day: 2 },
  {
    names: ["Bảo tàng Cổ vật Cung đình Huế", "Bảo tàng Cổ vật Cung đình"],
    day: 3,
  },
  { names: ["Lăng Minh Mạng"], day: 3 },
  { names: ["Hồ Thủy Tiên"], day: 3 },
  { names: ["Chợ Đông Ba"], day: 3 },
];

function getInitialDate(): string {
  try {
    return localStorage.getItem(START_DATE_KEY) || "";
  } catch {
    return "";
  }
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function getDateForDay(startDate: string, day: number): string {
  if (!startDate) return "";

  const date = new Date(`${startDate}T12:00:00`);

  if (Number.isNaN(date.getTime())) return "";

  date.setDate(date.getDate() + day - 1);

  return formatDate(date);
}

function normalizeName(name: string): string {
  return name
    .normalize("NFC")
    .trim()
    .toLocaleLowerCase("vi-VN")
    .replace(/\s+/g, " ");
}

export default function Itinerary() {
  const [planned, setPlanned] = useState<PlannedDestination[]>([]);
  const [startDate, setStartDate] = useState(getInitialDate);
  const [selectedId, setSelectedId] = useState("");
  const [selectedDay, setSelectedDay] = useState(1);
  const [notice, setNotice] = useState("");
  const [isCreatingSample, setIsCreatingSample] = useState(false);

  useEffect(() => {
    setPlanned(getItinerary());
  }, []);

  const availableDestinations = useMemo(
    () =>
      destinations.filter(
        (destination) =>
          !planned.some((item) => item.id === destination.id),
      ),
    [planned],
  );

  const resolvedItems = useMemo(
    () =>
      planned
        .map((item, originalIndex) => ({
          ...item,
          originalIndex,
          destination: destinations.find(
            (destination) => destination.id === item.id,
          ),
        }))
        .filter(
          (
            item,
          ): item is typeof item & {
            destination: (typeof destinations)[number];
          } => Boolean(item.destination),
        )
        .sort(
          (a, b) =>
            a.day - b.day || a.originalIndex - b.originalIndex,
        ),
    [planned],
  );

  const totalCost = resolvedItems.reduce(
    (sum, item) =>
      sum + Math.max(0, Number(item.destination.price) || 0),
    0,
  );

  const totalDays =
    resolvedItems.length > 0
      ? Math.max(1, ...resolvedItems.map((item) => item.day))
      : 0;

  const groupedDays = useMemo(
    () =>
      Array.from({ length: totalDays }, (_, index) => {
        const day = index + 1;
        const items = resolvedItems.filter(
          (item) => item.day === day,
        );

        return {
          day,
          date: getDateForDay(startDate, day),
          items,
          total: items.reduce(
            (sum, item) =>
              sum +
              Math.max(0, Number(item.destination.price) || 0),
            0,
          ),
        };
      }),
    [resolvedItems, startDate, totalDays],
  );

  function refresh() {
    setPlanned(getItinerary());
  }

  function handleStartDateChange(value: string) {
    setStartDate(value);
    setNotice("");

    try {
      if (value) {
        localStorage.setItem(START_DATE_KEY, value);
      } else {
        localStorage.removeItem(START_DATE_KEY);
      }
    } catch {
      setNotice("Không thể lưu ngày khởi hành trong trình duyệt.");
    }
  }

  function handleAdd() {
    if (!selectedId) {
      setNotice("Vui lòng chọn một địa điểm trước khi thêm.");
      return;
    }

    const id = Number(selectedId);

    if (!Number.isFinite(id)) {
      setNotice("Địa điểm được chọn không hợp lệ.");
      return;
    }

    if (planned.some((item) => item.id === id)) {
      setNotice("Địa điểm này đã có trong lịch trình.");
      return;
    }

    try {
      addToItinerary(id);
      updateItineraryDay(id, selectedDay);
      refresh();
      setSelectedId("");
      setNotice("Đã thêm địa điểm vào lịch trình.");
    } catch {
      setNotice("Không thể thêm địa điểm. Vui lòng thử lại.");
    }
  }

  function handleChangeDay(id: number, day: number) {
    if (!Number.isInteger(day) || day < 1 || day > 14) return;

    try {
      updateItineraryDay(id, day);
      refresh();
      setNotice(`Đã chuyển địa điểm sang ngày ${day}.`);
    } catch {
      setNotice("Không thể cập nhật ngày tham quan.");
    }
  }

  function handleMove(
    id: number,
    day: number,
    direction: -1 | 1,
  ) {
    const dayItems = resolvedItems.filter(
      (item) => item.day === day,
    );

    const currentIndex = dayItems.findIndex(
      (item) => item.id === id,
    );
    const targetIndex = currentIndex + direction;

    if (
      currentIndex < 0 ||
      targetIndex < 0 ||
      targetIndex >= dayItems.length
    ) {
      return;
    }

    const reorderedDay = [...dayItems];

    [
      reorderedDay[currentIndex],
      reorderedDay[targetIndex],
    ] = [
      reorderedDay[targetIndex],
      reorderedDay[currentIndex],
    ];

    const reorderedIds = reorderedDay.map((item) => item.id);
    const otherItems = planned.filter(
      (item) => item.day !== day,
    );

    const next = [
      ...otherItems,
      ...reorderedIds
        .map((orderedId) =>
          planned.find((item) => item.id === orderedId),
        )
        .filter(
          (item): item is PlannedDestination => Boolean(item),
        ),
    ];

    try {
      localStorage.setItem(ITINERARY_KEY, JSON.stringify(next));
      setPlanned(getItinerary());
      setNotice("Đã cập nhật thứ tự tham quan.");
    } catch {
      setNotice("Không thể lưu thứ tự mới.");
    }
  }

  function handleRemove(id: number) {
    try {
      removeFromItinerary(id);
      refresh();
      setNotice("Đã xóa địa điểm khỏi lịch trình.");
    } catch {
      setNotice("Không thể xóa địa điểm.");
    }
  }

  function handleClearAll() {
    if (planned.length === 0) return;

    const confirmed = window.confirm(
      "Bạn có chắc muốn xóa toàn bộ lịch trình?",
    );

    if (!confirmed) return;

    try {
      for (const item of getItinerary()) {
        removeFromItinerary(item.id);
      }

      refresh();
      setNotice("Đã xóa toàn bộ lịch trình.");
    } catch {
      setNotice("Không thể xóa toàn bộ lịch trình.");
    }
  }

  function handleCreateSampleItinerary() {
    if (isCreatingSample) return;

    const sampleItems: PlannedDestination[] = [];
    const missingNames: string[] = [];

    for (const sample of SAMPLE_ITINERARY) {
      const destination = destinations.find((item) =>
        sample.names.some(
          (name) =>
            normalizeName(item.name) === normalizeName(name),
        ),
      );

      if (!destination) {
        missingNames.push(sample.names[0]);
        continue;
      }

      if (sampleItems.some((item) => item.id === destination.id)) {
        continue;
      }

      sampleItems.push({
        id: destination.id,
        day: sample.day,
      });
    }

    if (sampleItems.length === 0) {
      setNotice(
        "Không tìm thấy địa điểm mẫu. Hãy kiểm tra tên trong src/data/destinations.ts.",
      );
      return;
    }

    const confirmed = window.confirm(
      `Tạo lịch trình mẫu 3 ngày với ${sampleItems.length} địa điểm? Lịch trình hiện tại sẽ được thay thế.`,
    );

    if (!confirmed) return;

    setIsCreatingSample(true);

    try {
      localStorage.setItem(
        ITINERARY_KEY,
        JSON.stringify(sampleItems),
      );

      setPlanned(sampleItems);
      setSelectedId("");
      setSelectedDay(1);

      if (missingNames.length > 0) {
        setNotice(
          `Đã tạo lịch trình với ${sampleItems.length} địa điểm. Một số địa điểm chưa có trong dữ liệu: ${missingNames.join(", ")}.`,
        );
      } else {
        setNotice("Đã tạo lịch trình mẫu 3 ngày thành công.");
      }
    } catch {
      setNotice("Không thể lưu lịch trình mẫu vào trình duyệt.");
    } finally {
      setIsCreatingSample(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  return (
    <main className="itinerary-page">
      <section className="itinerary-hero">
        <div className="itinerary-hero-overlay" />

        <div className="itinerary-hero-content">
          <Link to="/destinations" className="text-link no-print">
            <ArrowLeft size={16} />
            Khám phá điểm đến
          </Link>

          <p className="eyebrow">HÀNH TRÌNH CỦA BẠN</p>

          <h1>
            Lịch trình <span>du lịch Huế</span>
          </h1>

          <p>
            Lên kế hoạch cho chuyến đi, sắp xếp điểm đến theo
            từng ngày và theo dõi chi phí dễ dàng.
          </p>
        </div>
      </section>

      <div className="itinerary-container">
        <header className="itinerary-heading">
          <p className="section-kicker">KẾ HOẠCH DU LỊCH</p>
          <h2>Lịch trình của tôi</h2>
          <p>
            Chọn ngày khởi hành, thêm địa điểm và sắp xếp
            hành trình theo kế hoạch của bạn.
          </p>
        </header>

        <section className="itinerary-summary">
          <article>
            <CalendarDays size={23} />
            <span>Số ngày dự kiến</span>
            <strong>{totalDays} ngày</strong>
          </article>

          <article>
            <MapPin size={23} />
            <span>Số địa điểm</span>
            <strong>{resolvedItems.length} địa điểm</strong>
          </article>

          <article>
            <Wallet size={23} />
            <span>Tổng giá các địa điểm</span>
            <strong>{formatPrice(totalCost)}</strong>
          </article>
        </section>

        <section className="itinerary-add-panel no-print">
          <h3>
            <Plus size={21} />
            Thiết lập chuyến đi
          </h3>

          <div className="itinerary-form-row">
            <label className="itinerary-field">
              <span>Ngày khởi hành</span>
              <input
                type="date"
                value={startDate}
                onChange={(event) =>
                  handleStartDateChange(event.target.value)
                }
              />
            </label>

            <label className="itinerary-field">
              <span>Chọn địa điểm</span>
              <select
                value={selectedId}
                onChange={(event) =>
                  setSelectedId(event.target.value)
                }
              >
                <option value="">-- Chọn địa điểm --</option>

                {availableDestinations.map((destination) => (
                  <option
                    key={destination.id}
                    value={destination.id}
                  >
                    {destination.name} —{" "}
                    {formatPrice(destination.price)}
                  </option>
                ))}
              </select>
            </label>

            <label className="itinerary-field">
              <span>Thêm vào ngày</span>
              <select
                value={selectedDay}
                onChange={(event) =>
                  setSelectedDay(Number(event.target.value))
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
              className="itinerary-add-button"
              onClick={handleAdd}
              disabled={!selectedId}
            >
              <Plus size={16} />
              Thêm địa điểm
            </button>
          </div>

          {availableDestinations.length === 0 && (
            <p className="itinerary-empty-day">
              Tất cả địa điểm trong dữ liệu đã được thêm vào lịch trình.
            </p>
          )}
        </section>

        {notice && (
          <div className="itinerary-notice" role="status">
            <CheckCircle2 size={17} />
            <span>{notice}</span>
            <button
              type="button"
              aria-label="Đóng thông báo"
              onClick={() => setNotice("")}
            >
              ×
            </button>
          </div>
        )}

        <div className="itinerary-list-heading">
          <h3>Kế hoạch tham quan</h3>

          <div className="no-print itinerary-toolbar-actions">
            <button
              type="button"
              className="itinerary-add-button"
              onClick={handleCreateSampleItinerary}
              disabled={isCreatingSample}
            >
              <RotateCcw size={16} />
              {isCreatingSample
                ? "Đang tạo..."
                : "Lịch trình mẫu 3 ngày"}
            </button>

            <button
              type="button"
              className="itinerary-add-button"
              onClick={handlePrint}
            >
              <Printer size={16} />
              In / Lưu PDF
            </button>

            <button
              type="button"
              className="itinerary-clear-button"
              onClick={handleClearAll}
              disabled={planned.length === 0}
            >
              <Trash2 size={15} />
              Xóa tất cả
            </button>
          </div>
        </div>

        {resolvedItems.length === 0 ? (
          <div className="empty-message">
            <CalendarDays size={38} />
            <h3>Bạn chưa có lịch trình</h3>

            <p>
              Chọn địa điểm để bắt đầu xây dựng chuyến đi,
              hoặc tạo nhanh lịch trình mẫu 3 ngày.
            </p>

            <div className="empty-message-actions">
              <Link to="/destinations" className="text-link">
                Xem danh sách địa điểm
              </Link>

              <button
                type="button"
                className="itinerary-add-button"
                onClick={handleCreateSampleItinerary}
              >
                <Route size={16} />
                Tạo lịch trình mẫu
              </button>
            </div>
          </div>
        ) : (
          <div className="itinerary-list">
            {groupedDays.map(({ day, date, items, total }) => (
              <section
                className="itinerary-day-section"
                key={day}
              >
                <header className="itinerary-day-header">
                  <div className="itinerary-day-heading-main">
                    <span className="itinerary-day-number">
                      {day}
                    </span>

                    <div>
                      <span className="itinerary-day-label">
                        LỊCH TRÌNH NGÀY {day}
                      </span>

                      <h3>{date || `Ngày ${day}`}</h3>
                    </div>
                  </div>

                  <div className="itinerary-day-cost">
                    <span>{items.length} địa điểm</span>
                    <strong>{formatPrice(total)}</strong>
                  </div>
                </header>

                {items.length === 0 ? (
                  <p className="itinerary-empty-day">
                    Ngày này chưa có địa điểm. Bạn có thể thêm
                    địa điểm từ phần thiết lập chuyến đi.
                  </p>
                ) : (
                  items.map((item, index) => (
                    <article
                      className="itinerary-card"
                      key={item.id}
                    >
                      <Link
                        to={`/destinations/${item.destination.slug}`}
                        className="itinerary-card-image"
                      >
                        <img
                          src={item.destination.image}
                          alt={item.destination.name}
                          loading="lazy"
                        />
                      </Link>

                      <div className="itinerary-card-content">
                        <span className="itinerary-day-label">
                          ĐIỂM DỪNG {index + 1}
                        </span>

                        <Link
                          to={`/destinations/${item.destination.slug}`}
                          className="itinerary-place-title"
                        >
                          {item.destination.name}
                        </Link>

                        <p>
                          <MapPin size={14} />
                          <span>{item.destination.address}</span>
                        </p>

                        <div className="itinerary-meta">
                          <span>
                            <Clock size={14} />
                            {item.destination.duration}
                          </span>

                          <strong>
                            {formatPrice(item.destination.price)}
                          </strong>
                        </div>

                        <label className="itinerary-field no-print">
                          <span>Chuyển sang ngày khác</span>

                          <select
                            value={item.day}
                            onChange={(event) =>
                              handleChangeDay(
                                item.id,
                                Number(event.target.value),
                              )
                            }
                          >
                            {Array.from(
                              { length: 14 },
                              (_, dayIndex) => (
                                <option
                                  key={dayIndex + 1}
                                  value={dayIndex + 1}
                                >
                                  Ngày {dayIndex + 1}
                                </option>
                              ),
                            )}
                          </select>
                        </label>
                      </div>

                      <div className="itinerary-card-actions no-print">
                        <button
                          type="button"
                          className="itinerary-icon-button"
                          title="Di chuyển lên"
                          aria-label="Di chuyển địa điểm lên"
                          disabled={index === 0}
                          onClick={() =>
                            handleMove(item.id, day, -1)
                          }
                        >
                          <ArrowUp size={17} />
                        </button>

                        <button
                          type="button"
                          className="itinerary-icon-button"
                          title="Di chuyển xuống"
                          aria-label="Di chuyển địa điểm xuống"
                          disabled={index === items.length - 1}
                          onClick={() =>
                            handleMove(item.id, day, 1)
                          }
                        >
                          <ArrowDown size={17} />
                        </button>

                        <button
                          type="button"
                          className="itinerary-icon-button is-danger"
                          title="Xóa địa điểm"
                          aria-label="Xóa địa điểm khỏi lịch trình"
                          onClick={() => handleRemove(item.id)}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </section>
            ))}
          </div>
        )}

        <section className="itinerary-total-panel">
          <div>
            <span>TỔNG CHI PHÍ ĐỊA ĐIỂM</span>

            <p>
              Tổng giá được cộng từ các địa điểm đã thêm
              vào lịch trình.
            </p>
          </div>

          <strong>{formatPrice(totalCost)}</strong>
        </section>

        <p className="itinerary-disclaimer">
          Lưu ý: Đây là tổng giá địa điểm theo dữ liệu hiện tại,
          không phải giá tour trọn gói. Chi phí ăn uống, khách sạn,
          phương tiện và các khoản phát sinh chưa được tính.
        </p>
      </div>
    </main>
  );
}
