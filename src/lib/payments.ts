import { loadCart, clearCart } from "@/lib/cart-store";
import { formatCartTotal } from "@/lib/money";
import { supabase } from "@/lib/supabase";

const PENDING_KEY = "icb-pending-payments";
const INTENT_KEY = "icb-checkout-intent";
export const WHATSAPP_NUMBER = "2250705298727";

export type PaymentCourse = {
  slug: string;
  name: string;
};

type CreatedPayment = {
  payment_id: string;
  payment_reference: string;
  amount: number | string;
  payment_currency: string;
};

type CheckoutLine = {
  slug: string;
  name: string;
  quantity: number;
};

type CheckoutIntent = {
  method: "wave" | "card";
  items: { slug: string; quantity: number }[];
  returnTo: string;
};

export type PaymentCopy = {
  failure: string;
  requestTitle: string;
  name: string;
  email: string;
  courses: string;
  total: string;
  method: string;
  reference: string;
  wave: string;
  card: string;
  customer: string;
  currencySymbol: string;
  currencyCode: string;
};

export function readPaymentCopy(text: (key: string) => string): PaymentCopy {
  return {
    failure: text("failure_message"),
    requestTitle: text("request_title"),
    name: text("label_name"),
    email: text("label_email"),
    courses: text("label_courses"),
    total: text("label_total"),
    method: text("label_method"),
    reference: text("label_reference"),
    wave: text("method_wave"),
    card: text("method_card"),
    customer: text("customer_fallback"),
    currencySymbol: text("currency_symbol"),
    currencyCode: text("currency_code"),
  };
}

function safeNext(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\") || value.includes("://")) return "";
  return value;
}

function pendingIds() {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(PENDING_KEY) ?? "[]") as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string" && item !== "") : [];
  } catch {
    return [];
  }
}

function rememberPendingPayment(id: string) {
  const ids = pendingIds().filter((item) => item !== id);
  ids.push(id);
  window.localStorage.setItem(PENDING_KEY, JSON.stringify(ids.slice(-10)));
}

export function hasPendingPayment() {
  return pendingIds().length > 0;
}

function paymentFailure(message: string) {
  window.alert(message);
}

function courseLines(courses: PaymentCourse[]) {
  const names = new Map(courses.map((course) => [course.slug, course.name]));
  const lines = new Map<string, CheckoutLine>();
  for (const item of loadCart()) {
    const name = names.get(item.slug);
    if (!name) continue;
    const current = lines.get(item.slug);
    if (current) current.quantity += item.quantity;
    else lines.set(item.slug, { slug: item.slug, name, quantity: item.quantity });
  }
  return [...lines.values()];
}

function loadIntent(): CheckoutIntent | null {
  if (typeof window === "undefined") return null;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(INTENT_KEY) ?? "null") as CheckoutIntent | null;
    if (!parsed || (parsed.method !== "wave" && parsed.method !== "card") || !Array.isArray(parsed.items)) return null;
    const items = parsed.items.filter((item) => item && typeof item.slug === "string" && item.slug !== "" && item.quantity > 0);
    if (items.length === 0) return null;
    return { method: parsed.method, items, returnTo: safeNext(parsed.returnTo) || "/courses/global-fluency/payment" };
  } catch {
    return null;
  }
}

export function hasCheckoutIntent() {
  return loadIntent() !== null;
}

export function checkoutReturnPath() {
  return loadIntent()?.returnTo || "";
}

function saveIntent(method: "wave" | "card", lines: CheckoutLine[]) {
  const intent: CheckoutIntent = {
    method,
    items: lines.map((line) => ({ slug: line.slug, quantity: line.quantity })),
    returnTo: safeNext(window.location.pathname) || "/courses/global-fluency/payment",
  };
  window.localStorage.setItem(INTENT_KEY, JSON.stringify(intent));
}

async function createPayment(method: "wave" | "card", lines: CheckoutLine[], copy: PaymentCopy) {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) return "login" as const;

  const created = await supabase.rpc("create_pending_payment", {
    method,
    items: lines.map((line) => ({ slug: line.slug, quantity: line.quantity })),
  });
  const payment = (Array.isArray(created.data) ? created.data[0] : created.data) as CreatedPayment | null;
  if (created.error || !payment?.payment_id || !payment.payment_reference) {
    paymentFailure(copy.failure);
    return "failed" as const;
  }

  const profile = await supabase
    .from("profiles")
    .select("first_name, last_name, email")
    .eq("id", user.id)
    .maybeSingle();
  const name = [profile.data?.first_name, profile.data?.last_name].filter(Boolean).join(" ").trim() || user.email || copy.customer;
  const email = profile.data?.email || user.email || "";
  const amount = Number(payment.amount);
  const total = Number.isFinite(amount) ? formatCartTotal(amount, copy.currencySymbol) : String(payment.amount);
  const currency = payment.payment_currency?.trim() || copy.currencyCode;
  const message = [
    copy.requestTitle,
    `${copy.name}: ${name}`,
    `${copy.email}: ${email}`,
    `${copy.courses}:`,
    ...lines.map((line) => `- ${line.name} x${line.quantity}`),
    `${copy.total}: ${total} ${currency}`,
    `${copy.method}: ${method === "wave" ? copy.wave : copy.card}`,
    `${copy.reference}: ${payment.payment_reference}`,
  ].join("\n");

  rememberPendingPayment(payment.payment_id);
  window.localStorage.removeItem(INTENT_KEY);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  const popup = window.open(url, "_blank");
  if (popup) {
    popup.opener = null;
    return "done" as const;
  }
  window.location.assign(url);
  return "away" as const;
}

let resuming = false;

export async function resumeCheckout(copy: PaymentCopy) {
  const intent = loadIntent();
  if (!intent || resuming) return "skipped" as const;
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return "skipped" as const;
  resuming = true;
  try {
    const slugs = intent.items.map((item) => item.slug);
    const courses = await supabase.from("courses").select("slug, name_en, name_fr").in("slug", slugs);
    const french = window.localStorage.getItem("icb-lang") === "fr";
    const names = new Map(
      (courses.data ?? []).map((course) => [
        course.slug,
        (french ? course.name_fr : course.name_en)?.trim() || course.name_en || course.slug,
      ]),
    );
    const lines = intent.items.map((item) => ({
      slug: item.slug,
      name: names.get(item.slug) || item.slug,
      quantity: item.quantity,
    }));
    return await createPayment(intent.method, lines, copy);
  } finally {
    resuming = false;
  }
}

export async function beginCheckout(method: "wave" | "card", courses: PaymentCourse[], copy: PaymentCopy) {
  const lines = courseLines(courses);
  if (lines.length === 0) return;

  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    saveIntent(method, lines);
    const next = safeNext(window.location.pathname) || "/courses/global-fluency/payment";
    window.location.assign(`/signup?next=${encodeURIComponent(next)}`);
    return;
  }

  await createPayment(method, lines, copy);
}

export async function syncPaidCart() {
  const ids = pendingIds();
  if (ids.length === 0) return false;
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return false;
  const { data, error } = await supabase.from("payments").select("id, status").in("id", ids);
  if (error || !data?.some((payment) => payment.status === "paid")) return false;
  clearCart();
  window.localStorage.removeItem(PENDING_KEY);
  return true;
}
