"use client";

interface NoteDetailsErrorProps {
  error: Error;
  reset: () => void;
}

export default function NoteDetailsError({ error, reset }: NoteDetailsErrorProps) {
  return (
    <div>
      <p>Could not fetch note details. {error.message}</p>
      <button type="button" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
