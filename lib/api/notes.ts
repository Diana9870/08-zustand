import type { AxiosResponse } from "axios";
import type { FetchNotesParams, FetchNotesResponse, NewNote, Note } from "@/types/note";
import { noteApi } from "./api";

export async function fetchNotes({
  page,
  perPage,
  search,
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> {
  const response: AxiosResponse<FetchNotesResponse> = await noteApi.get("/notes", {
    params: {
      page,
      perPage,
      ...(search ? { search } : {}),
      ...(tag && tag !== "all" ? { tag } : {}),
    },
  });
  return response.data;
}

export async function fetchNoteById(id: Note["id"]): Promise<Note> {
  const response: AxiosResponse<Note> = await noteApi.get(`/notes/${id}`);
  return response.data;
}

export async function createNote(note: NewNote): Promise<Note> {
  const response: AxiosResponse<Note> = await noteApi.post("/notes", note);
  return response.data;
}

export async function deleteNote(id: Note["id"]): Promise<Note> {
  const response: AxiosResponse<Note> = await noteApi.delete(`/notes/${id}`);
  return response.data;
}
