"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api/notes";
import { NOTE_TAGS } from "@/lib/constants";
import { initialDraft, useNoteStore } from "@/lib/store/noteStore";
import type { NewNote } from "@/types/note";
import css from "./NoteForm.module.css";

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const draft = useNoteStore((state) => state.draft);
  const setDraft = useNoteStore((state) => state.setDraft);
  const clearDraft = useNoteStore((state) => state.clearDraft);
  const [error, setError] = useState("");

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      router.back();
    },
    onError: () => setError("Could not create the note. Please try again."),
  });

  async function handleSubmit(formData: FormData) {
    setError("");
    const note: NewNote = {
      title: String(formData.get("title") ?? "").trim(),
      content: String(formData.get("content") ?? ""),
      tag: String(formData.get("tag") ?? "Todo") as NewNote["tag"],
    };
    if (note.title.length < 3 || note.title.length > 50) {
      setError("Title must be between 3 and 50 characters.");
      return;
    }
    if (note.content.length > 500) {
      setError("Content must not exceed 500 characters.");
      return;
    }
    if (!NOTE_TAGS.includes(note.tag)) {
      setError("Please choose a valid tag.");
      return;
    }
    createMutation.mutate(note);
  }

  return (
    <form className={css.form} action={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          minLength={3}
          maxLength={50}
          required
          value={draft?.title ?? initialDraft.title}
          onChange={(event) => setDraft({ title: event.target.value })}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          maxLength={500}
          className={css.textarea}
          value={draft?.content ?? initialDraft.content}
          onChange={(event) => setDraft({ content: event.target.value })}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={draft?.tag ?? initialDraft.tag}
          onChange={(event) => setDraft({ tag: event.target.value as NewNote["tag"] })}
        >
          {NOTE_TAGS.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className={css.error} role="alert">
          {error}
        </p>
      )}

      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={() => router.back()}>
          Cancel
        </button>
        <button type="submit" className={css.submitButton} disabled={createMutation.isPending}>
          {createMutation.isPending ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
}
