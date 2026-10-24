import type { Metadata } from "next";
import css from "./not-found.module.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://notehub.vercel.app";

export const metadata: Metadata = {
  title: "Page not found | NoteHub",
  description: "The NoteHub page you are looking for does not exist.",
  alternates: { canonical: `${siteUrl}/not-found` },
  openGraph: {
    title: "Page not found | NoteHub",
    description: "The NoteHub page you are looking for does not exist.",
    url: `${siteUrl}/not-found`,
    images: [{ url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg" }],
  },
};

export default function NotFound() {
  return (
    <main className={css.container}>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>Sorry, the page you are looking for does not exist.</p>
    </main>
  );
}
