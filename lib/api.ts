// Single entry point for all API functions: import { fetchNotes } from "@/lib/api".
// The implementation lives in separate modules inside lib/api/.
export { noteApi } from "./api/api";
export { fetchNotes, fetchNoteById, createNote, deleteNote } from "./api/notes";
