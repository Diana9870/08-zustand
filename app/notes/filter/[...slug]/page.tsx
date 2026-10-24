import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import { NOTE_TAGS } from "@/lib/constants";
import type { NoteTag } from "@/types/note";
import NotesClient from "./Notes.client";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://notehub.vercel.app";
const ogImage = "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

export async function generateMetadata({ params }: FilterNotesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const filter = decodeURIComponent(slug?.[0] ?? "all");
  const title = filter === "all" ? "All notes | NoteHub" : `${filter} notes | NoteHub`;
  const description =
    filter === "all"
      ? "Browse all notes in NoteHub."
      : `Browse NoteHub notes with the “${filter}” tag.`;
  const url = `${siteUrl}/notes/filter/${encodeURIComponent(filter)}`;
  return {
    title,
    description,
    openGraph: { title, description, url, images: [{ url: ogImage }] },
  };
}

interface FilterNotesPageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function FilterNotesPage({ params }: FilterNotesPageProps) {
  const { slug } = await params;

  if (slug.length !== 1) notFound();

  const [rawTag] = slug;
  const tag = decodeURIComponent(rawTag);

  if (tag !== "all" && !NOTE_TAGS.includes(tag as NoteTag)) notFound();

  // for "All notes" the tag is not passed to the API at all
  const apiTag = tag === "all" ? undefined : tag;

  const queryClient = new QueryClient();
  await queryClient.fetchQuery({
    queryKey: ["notes", 1, "", tag],
    queryFn: () => fetchNotes({ page: 1, perPage: 12, search: "", tag: apiTag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient key={tag} tag={tag} />
    </HydrationBoundary>
  );
}
