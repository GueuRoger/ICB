"use client";

import { useEffect } from "react";

export function DocumentTitle({ title, description }: { title: string; description?: string }) {
  useEffect(() => {
    document.title = title;
    if (!description) return;
    const existing = document.querySelector('meta[name="description"]');
    const tag = existing instanceof HTMLMetaElement ? existing : document.createElement("meta");
    if (!(existing instanceof HTMLMetaElement)) {
      tag.name = "description";
      document.head.appendChild(tag);
    }
    tag.content = description;
  }, [title, description]);
  return null;
}
