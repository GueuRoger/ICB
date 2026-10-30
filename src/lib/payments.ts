import { loadCart, saveCart, clearCart } from "@/lib/cart-store";
import { formatCartTotal } from "@/lib/money";
import { supabase } from "@/lib/supabase";

const PENDING_KEY = "icb-pending-payments";
const INTENT_KEY = "icb-checkout-intent";
const RESUME_LOCK_KEY = "icb-checkout-resume-lock";
const HANDOFF_KEY = "icb-checkout-whatsapp-handoff";
export const WHATSAPP_NUMBER = "2250705298727";
export const GLOBAL_FLUENCY_PAYMENT_PATH = "/courses/global-fluency/payment";

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

type WhatsAppHandoff = {
  paymentId: string;
  url: string;
  fingerprint: string;
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

export type CheckoutResumeResult = "done" | "away" | "failed" | "login" | "skipped";

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
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\") || value.includes("://")) {
    return "";
  }
  return value;
}

function pendingIds() {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(PENDING_KEY) ?? "[]") as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string" && item !== "")
      : [];
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

function intentFingerprint(intent: Pick<CheckoutIntent, "method" | "items">) {
  return JSON.stringify({
    method: intent.method,
    items: intent.items
      .map((item) => ({ slug: item.slug, quantity: item.quantity }))
      .sort((a, b) => a.slug.localeCompare(b.slug)),
  });
}

function loadIntent(): CheckoutIntent | null {
  if (typeof window === "undefined") return null;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(INTENT_KEY) ?? "null") as CheckoutIntent | null;
    if (!parsed || (parsed.method !== "wave" && parsed.method !== "card") || !Array.isArray(parsed.items)) {
      return null;
    }
    const items = parsed.items.filter(
      (item) => item && typeof item.slug === "string" && item.slug !== "" && item.quantity > 0,
    );
    if (items.length === 0) return null;
    return {
      method: parsed.method,
      items,
      returnTo: safeNext(parsed.returnTo) || GLOBAL_FLUENCY_PAYMENT_PATH,
    };
  } catch {
    return null;
  }
}

function loadHandoff(): WhatsAppHandoff | null {
  if (typeof window === "undefined") return null;
  try {
    const parsed = JSON.parse(window.sessionStorage.getItem(HANDOFF_KEY) ?? "null") as WhatsAppHandoff | null;
    if (!parsed?.paymentId || !parsed.url || !parsed.fingerprint) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveHandoff(handoff: WhatsAppHandoff) {
  window.sessionStorage.setItem(HANDOFF_KEY, JSON.stringify(handoff));
}

function clearHandoff() {
  window.sessionStorage.removeItem(HANDOFF_KEY);
}

function clearResumeLock() {
  window.sessionStorage.removeItem(RESUME_LOCK_KEY);
}

/** Acquire a one-shot lock so React Strict Mode / reloads do not create duplicate payments. */
function acquireResumeLock(fingerprint: string) {
  const existing = window.sessionStorage.getItem(RESUME_LOCK_KEY);
  if (existing === fingerprint) return false;
  window.sessionStorage.setItem(RESUME_LOCK_KEY, fingerprint);
  return true;
}

export function hasCheckoutIntent() {
  return loadIntent() !== null;
}

export function checkoutReturnPath() {
  return loadIntent()?.returnTo || "";
}

/** Rebuild cart lines from a saved checkout intent so return-from-auth never loses the order. */
export function restoreCartFromCheckoutIntent() {
  const intent = loadIntent();
  if (!intent) return false;
  const existing = loadCart();
  const bySlug = new Map(existing.map((item) => [item.slug, item]));
  for (const line of intent.items) {
    const current = bySlug.get(line.slug);
    if (current) {
      current.quantity = Math.max(current.quantity, line.quantity);
    } else {
      bySlug.set(line.slug, {
        lineId:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${line.slug}-${Date.now()}`,
        slug: line.slug,
        quantity: line.quantity,
      });
    }
  }
  saveCart([...bySlug.values()]);
  return true;
}

function saveIntent(method: "wave" | "card", lines: CheckoutLine[]) {
  const intent: CheckoutIntent = {
    method,
    items: lines.map((line) => ({ slug: line.slug, quantity: line.quantity })),
    returnTo: safeNext(window.location.pathname) || GLOBAL_FLUENCY_PAYMENT_PATH,
  };
  window.localStorage.setItem(INTENT_KEY, JSON.stringify(intent));
  clearResumeLock();
  clearHandoff();
  const bySlug = new Map(loadCart().map((item) => [item.slug, item]));
  for (const line of lines) {
    const current = bySlug.get(line.slug);
    if (current) current.quantity = Math.max(current.quantity, line.quantity);
    else {
      bySlug.set(line.slug, {
        lineId:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${line.slug}-${Date.now()}`,
        slug: line.slug,
        quantity: line.quantity,
      });
    }
  }
  saveCart([...bySlug.values()]);
}

function redirectToSignup() {
  const next = safeNext(window.location.pathname) || GLOBAL_FLUENCY_PAYMENT_PATH;
  window.location.assign(`/signup?next=${encodeURIComponent(next)}`);
}

function openWhatsApp(url: string, mode: "popup" | "assign"): "done" | "away" {
  if (mode === "assign") {
    window.location.assign(url);
    return "away";
  }
  const popup = window.open(url, "_blank");
  if (popup && !popup.closed) {
    popup.opener = null;
    return "done";
  }
  // Popup blocked (common after async signup/login) — fall back to top-level navigation.
  window.location.assign(url);
  return "away";
}

async function createPayment(
  method: "wave" | "card",
  lines: CheckoutLine[],
  copy: PaymentCopy,
  handoff: "popup" | "assign",
): Promise<CheckoutResumeResult> {
  const { data: auth, error: authError } = await supabase.auth.getUser();
  const user = auth.user;
  if (authError || !user?.id || !user.email) {
    saveIntent(method, lines);
    return "login";
  }

  const fingerprint = intentFingerprint({ method, items: lines });
  const existingHandoff = loadHandoff();
  if (existingHandoff && existingHandoff.fingerprint === fingerprint) {
    // Payment already created for this intent — reopen WhatsApp, do not create again.
    window.localStorage.removeItem(INTENT_KEY);
    return openWhatsApp(existingHandoff.url, handoff);
  }

  const created = await supabase.rpc("create_pending_payment", {
    method,
    items: lines.map((line) => ({ slug: line.slug, quantity: line.quantity })),
  });
  const payment = (Array.isArray(created.data) ? created.data[0] : created.data) as CreatedPayment | null;
  if (created.error || !payment?.payment_id || !payment.payment_reference) {
    clearResumeLock();
    paymentFailure(copy.failure);
    return "failed";
  }

  const profile = await supabase
    .from("profiles")
    .select("first_name, last_name, email")
    .eq("id", user.id)
    .maybeSingle();
  const name =
    [profile.data?.first_name, profile.data?.last_name].filter(Boolean).join(" ").trim() ||
    user.email ||
    copy.customer;
  const email = user.email.trim();
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

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  rememberPendingPayment(payment.payment_id);
  saveHandoff({ paymentId: payment.payment_id, url, fingerprint });
  // Clear intent only after pending payment exists and WhatsApp handoff is ready.
  window.localStorage.removeItem(INTENT_KEY);
  return openWhatsApp(url, handoff);
}

let resuming = false;

/**
 * Continue a saved checkout intent after auth.
 * Uses top-level WhatsApp navigation because this often runs outside a direct click gesture.
 */
export async function resumeCheckout(copy: PaymentCopy): Promise<CheckoutResumeResult> {
  const intent = loadIntent();
  if (!intent) {
    const handoff = loadHandoff();
    if (handoff) return openWhatsApp(handoff.url, "assign");
    return "skipped";
  }
  if (resuming) return "skipped";

  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return "login";

  const fingerprint = intentFingerprint(intent);
  if (!acquireResumeLock(fingerprint)) {
    const handoff = loadHandoff();
    if (handoff && handoff.fingerprint === fingerprint) {
      window.localStorage.removeItem(INTENT_KEY);
      return openWhatsApp(handoff.url, "assign");
    }
    return "skipped";
  }

  resuming = true;
  try {
    restoreCartFromCheckoutIntent();
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
    const result = await createPayment(intent.method, lines, copy, "assign");
    if (result === "failed" || result === "login") clearResumeLock();
    return result;
  } catch (error) {
    clearResumeLock();
    throw error;
  } finally {
    resuming = false;
  }
}

export async function beginCheckout(method: "wave" | "card", courses: PaymentCourse[], copy: PaymentCopy) {
  const lines = courseLines(courses);
  if (lines.length === 0) return;

  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) {
    saveIntent(method, lines);
    redirectToSignup();
    return;
  }

  const result = await createPayment(method, lines, copy, "popup");
  if (result === "login") {
    saveIntent(method, lines);
    redirectToSignup();
  }
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
  clearHandoff();
  clearResumeLock();
  return true;
}
