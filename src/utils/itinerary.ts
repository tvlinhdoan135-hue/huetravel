
export interface PlannedDestination {
  id: number;
  day: number;
}

const ITINERARY_KEY = "huetravel-itinerary";

export function getItinerary(): PlannedDestination[] {
  try {
    const stored = localStorage.getItem(ITINERARY_KEY);
    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is PlannedDestination =>
        typeof item === "object" &&
        item !== null &&
        typeof item.id === "number" &&
        typeof item.day === "number",
    );
  } catch {
    return [];
  }
}

export function addToItinerary(id: number): PlannedDestination[] {
  const current = getItinerary();

  if (current.some((item) => item.id === id)) {
    return current;
  }

  const updated = [...current, { id, day: 1 }];
  localStorage.setItem(ITINERARY_KEY, JSON.stringify(updated));

  return updated;
}

export function removeFromItinerary(id: number): PlannedDestination[] {
  const updated = getItinerary().filter((item) => item.id !== id);
  localStorage.setItem(ITINERARY_KEY, JSON.stringify(updated));
  return updated;
}

export function updateItineraryDay(
  id: number,
  day: number,
): PlannedDestination[] {
  const safeDay = Math.max(1, Math.min(14, Math.floor(day)));

  const updated = getItinerary().map((item) =>
    item.id === id ? { ...item, day: safeDay } : item,
  );

  localStorage.setItem(ITINERARY_KEY, JSON.stringify(updated));

  return updated;
}
