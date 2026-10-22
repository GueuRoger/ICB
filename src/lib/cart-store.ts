export type CartItem = {
  lineId: string;
  slug: string;
  quantity: number;
};

const STORAGE_KEY = "icb-cart";

function isItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;
  const item = value as CartItem;
  return (
    typeof item.lineId === "string" &&
    item.lineId !== "" &&
    typeof item.slug === "string" &&
    item.slug !== "" &&
    typeof item.quantity === "number" &&
    Number.isFinite(item.quantity) &&
    item.quantity > 0
  );
}

export function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter(isItem) : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function addCartItem(slug: string) {
  const items = loadCart();
  items.push({
    lineId: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${slug}-${Date.now()}`,
    slug,
    quantity: 1,
  });
  saveCart(items);
}

export function removeCartItem(lineId: string) {
  saveCart(loadCart().filter((item) => item.lineId !== lineId));
}

export function clearCart() {
  saveCart([]);
}
