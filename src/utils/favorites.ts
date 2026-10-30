
const FAVORITES_KEY = "huetravel-favorites";

export function getFavorites(): number[] {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);

    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is number =>
        typeof item === "number" && Number.isFinite(item),
    );
  } catch {
    return [];
  }
}

export function isFavorite(id: number): boolean {
  return getFavorites().includes(id);
}

export function toggleFavorite(id: number): number[] {
  const current = getFavorites();

  const updated = current.includes(id)
    ? current.filter((favoriteId) => favoriteId !== id)
    : [...current, id];

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));

  return updated;
}

export function clearFavorites(): void {
  localStorage.removeItem(FAVORITES_KEY);
}
