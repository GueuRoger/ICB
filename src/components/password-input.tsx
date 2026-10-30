"use client";

import { useId, useState, type ComponentProps } from "react";
import { useCopy, useT } from "@/i18n/provider";

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M2.25 12C3.9 7.9 7.6 5.25 12 5.25S20.1 7.9 21.75 12C20.1 16.1 16.4 18.75 12 18.75S3.9 16.1 2.25 12Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3.25" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M3.5 3.5L20.5 20.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M9.9 5.6C10.58 5.4 11.28 5.25 12 5.25C16.4 5.25 20.1 7.9 21.75 12C21.2 13.35 20.4 14.5 19.4 15.4M16.1 16.9C14.9 17.55 13.5 18 12 18.75C7.6 18.75 3.9 16.1 2.25 12C3.05 10.05 4.4 8.45 6.1 7.4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.1 10.2C9.7 10.7 9.5 11.3 9.5 12C9.5 13.4 10.6 14.5 12 14.5C12.7 14.5 13.3 14.3 13.8 13.9"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

type PasswordInputProps = Omit<ComponentProps<"input">, "type">;

/**
 * Drop-in password field that keeps absolute Figma positioning/classes on a wrapper,
 * and places a show/hide control at the extreme right inside the field.
 */
export function PasswordInput({ className = "", style, disabled, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const t = useT();
  const text = useCopy("shared");
  const reactId = useId();
  const toggleId = props.id ? `${props.id}-visibility` : `${reactId}-visibility`;
  const label = visible ? text("hide_password") || t("Hide password") : text("show_password") || t("Show password");

  return (
    <div className={`${className} !pr-0`} style={style}>
      <input
        {...props}
        disabled={disabled}
        type={visible ? "text" : "password"}
        className="box-border h-full w-full border-0 bg-transparent py-0 pr-[44px] pl-0 text-inherit outline-none disabled:opacity-70"
        style={style}
      />
      <button
        id={toggleId}
        type="button"
        tabIndex={0}
        disabled={disabled}
        aria-label={label}
        aria-pressed={visible}
        aria-controls={props.id}
        title={label}
        className="absolute inset-y-0 right-0 z-[1] flex w-[44px] items-center justify-center border-0 bg-transparent p-0 text-current opacity-70 hover:opacity-100 disabled:opacity-40"
        onClick={() => setVisible((value) => !value)}
      >
        {visible ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
}
