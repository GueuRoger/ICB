import { supabase } from "@/lib/supabase";

export type StudentCredentials = {
  email: string;
  password: string;
};

export type StudentSignInResult =
  | { ok: true }
  | { ok: false; message: string };

export type StudentRegistration = {
  firstName: string;
  lastName: string;
  email: string;
  whatsapp: string;
  password: string;
  confirmPassword: string;
};

export async function registerStudent(input: StudentRegistration): Promise<StudentSignInResult> {
  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();
  const email = input.email.trim();
  const whatsapp = input.whatsapp.trim();
  const password = input.password;
  const confirmPassword = input.confirmPassword;

  if (!firstName || !lastName || !email || !whatsapp || !password || !confirmPassword) {
    return { ok: false, message: "Fill in every field." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: "Enter a valid email address." };
  }

  const digits = whatsapp.replace(/\D/g, "");
  if (digits.length < 8) {
    return { ok: false, message: "Enter a valid WhatsApp number." };
  }

  if (password.length < 6) {
    return { ok: false, message: "Password should be at least 6 characters." };
  }

  if (password !== confirmPassword) {
    return { ok: false, message: "Passwords do not match." };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  });

  if (error || !data.user) {
    const already = /already registered|already exists/i.test(error?.message ?? "");
    return { ok: false, message: already ? "An account with this email already exists." : "The account could not be created. Try again." };
  }

  if (data.user.identities && data.user.identities.length === 0) {
    return { ok: false, message: "An account with this email already exists." };
  }

  let session = data.session;
  if (!session) {
    const signedIn = await supabase.auth.signInWithPassword({ email, password });
    session = signedIn.data.session;
    if (signedIn.error || !session) {
      return { ok: false, message: "The account could not be created. Try again." };
    }
  }

  const profile = await supabase.from("profiles").upsert(
    {
      id: data.user.id,
      first_name: firstName,
      last_name: lastName,
      email,
    },
    { onConflict: "id" },
  );

  if (profile.error && session) {
    return { ok: false, message: "The account could not be created. Try again." };
  }

  return { ok: true };
}

export async function requestPasswordReset(email: string): Promise<StudentSignInResult> {
  const trimmed = email.trim();

  if (!trimmed) {
    return { ok: false, message: "Enter your email address." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { ok: false, message: "Enter a valid email address." };
  }

  await new Promise((resolve) => setTimeout(resolve, 600));
  return { ok: true };
}

export function safeReturnPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\") || value.includes("://")) return "";
  return value;
}

export async function signInStudent(credentials: StudentCredentials): Promise<StudentSignInResult> {
  const email = credentials.email.trim();
  const password = credentials.password;

  if (!email || !password) {
    return { ok: false, message: "Enter your email and password." };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.session) {
    const unconfirmed = /not confirmed/i.test(error?.message ?? "");
    return {
      ok: false,
      message: unconfirmed ? "Confirm your email before signing in." : "The email or password is not correct.",
    };
  }

  return { ok: true };
}
