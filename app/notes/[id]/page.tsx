import { cache } from "react";
import type { Metadata } from "next";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";

export const dynamic = "force-dynamic";

// generateMetadata and the page need the same note: cache() makes it one request per render
const getNote = cache(fetchNoteById);

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://notehub.vercel.app";
const ogImage = "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

export async function generateMetadata({ params }: NoteDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const note = await getNote(id);
    const title = `${note.title} | NoteHub`;
    const description = note.content?.slice(0, 160) || `Details for the note “${note.title}”.`;
    const url = `${siteUrl}/notes/${encodeURIComponent(id)}`;
    return {
      title,
      description,
      openGraph: { title, description, url, images: [{ url: ogImage }] },
    };
  } catch {
    return {
      title: "Note details | NoteHub",
      description: "View a note in NoteHub.",
      openGraph: {
        title: "Note details | NoteHub",
        description: "View a note in NoteHub.",
        url: `${siteUrl}/notes/${encodeURIComponent(id)}`,
        images: [{ url: ogImage }],
      },
    };
  }
}

interface NoteDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function NoteDetailsPage({ params }: NoteDetailsPageProps) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.fetchQuery({
    queryKey: ["note", id],
    queryFn: () => getNote(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
