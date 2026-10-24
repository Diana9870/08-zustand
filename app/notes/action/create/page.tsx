import type { Metadata } from "next";
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./page.module.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://notehub.vercel.app";
const description = "Create a new note in NoteHub and save your progress as a draft.";
const ogImage = "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

export const metadata: Metadata = {
  title: "Create note | NoteHub",
  description,
  alternates: { canonical: `${siteUrl}/notes/action/create` },
  openGraph: {
    title: "Create note | NoteHub",
    description,
    url: `${siteUrl}/notes/action/create`,
    images: [{ url: ogImage }],
  },
};

export default function CreateNote() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
