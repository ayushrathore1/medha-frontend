// src/api/api.js

import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL + "/api";
// For CRA: process.env.REACT_APP_BACKEND_URL + '/api'

export function getToken() {
  return localStorage.getItem("token");
}

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Subjects
export const fetchSubjects = async () => {
  const res = await api.get("/subjects");
  return res.data.subjects;
};

// Notes
export const fetchNotes = async (subjectId) => {
  const res = await api.get("/notes", { params: { subject: subjectId } });
  return res.data.notes;
};

// Flashcards for a note
export const fetchFlashcards = async (noteId) => {
  const res = await api.get("/flashcards", { params: { noteId } });
  return res.data.flashcards;
};

// Manual flashcard creation
export const createFlashcard = async ({
  noteId,
  question,
  answer,
  subject,
}) => {
  const res = await api.post("/flashcards", {
    noteId,
    question,
    answer,
    subject,
  });
  return res.data.flashcard;
};

// AI flashcard generation
export const generateAIFlashcards = async (noteId) => {
  const res = await api.post("/flashcards/generate-ai", { noteId });
  return res.data.flashcards;
};

// Update flashcard
export const updateFlashcard = async (id, { question, answer, subject }) => {
  const res = await api.put(`/flashcards/${id}`, { question, answer, subject });
  return res.data.flashcard;
};

// Delete flashcard
export const deleteFlashcard = async (id) => {
  await api.delete(`/flashcards/${id}`);
};

// Create new subject
export const createSubject = async ({ name, description }) => {
  const res = await api.post("/subjects", { name, description });
  return res.data.subject;
};

// Create new note (as text note)
export const createNote = async ({ title, content, subject }) => {
  const res = await api.post("/notes/text", { title, content, subject });
  return res.data.note;
};

export default api;
