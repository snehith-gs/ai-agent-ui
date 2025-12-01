# AI Agent UI

A modern **React + Vite + TypeScript + Tailwind CSS** frontend for the `ai-agent-lab` project.  
This UI provides a clean, chat-style interface for interacting with your AI Agent backend, including support for:

- Session-based conversations  
- RAG (Retrieval-Augmented Generation) context  
- Assistant memory  
- Error handling and loading states  

---

## 🚀 Overview

**AI Agent UI** is a lightweight single-page app that talks to your backend’s `/chat` API.

- The user types a message in the chat box
- The UI sends the message (and session id) to the backend
- The backend:
  - Handles system prompts
  - Manages session memory
  - Optionally does RAG over your documents
  - Calls OpenAI (or another LLM)
- The UI displays the assistant’s reply and (optionally) RAG sources

This repo focuses purely on **frontend UX** and **clean integration** with the backend.

---

## ✨ Features

### 🗣 Chat Experience

- Clean two-column chat layout  
  - **User messages** and **assistant messages** visually distinct  
- Auto-created **session ID**, stored client-side  
- Chat history preserved for the current browser tab/session  
- Smooth auto-scroll to latest message  
- Disabled **Send** button & loading indicator while waiting for a response  

### 🧠 AI & RAG Integration

- Connects to backend `/chat` endpoint  
- Supports:
  - **RAG**: shows retrieved document snippets when available
  - **System prompts**: handled on the backend, no leakage to user
  - **Assistant memory**: backend keeps session history
- Optional display of:
  - RAG sources (doc title / id)
  - Scores or confidence (if returned by backend)

### 💻 Frontend Implementation

- **React + Vite + TypeScript**
- **Tailwind CSS** for styling
- **Axios** (or fetch) for API calls
- Organized into:
  - `components/` (Chat UI)
  - `api/` (backend client)
  - `types/` (shared models)
  - `hooks/` (if applicable)
- Responsive layout: works on desktop and mobile

---

## 🧱 Tech Stack

- **Framework:** React 18 + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State / Data:** React hooks + local state
- **API Client:** Axios (or native fetch, depending on your implementation)
- **Build Tool:** Vite

---

## 📦 Getting Started

### 1️⃣ Prerequisites

- Node.js (>= 18.x recommended)
- npm or yarn or pnpm
- Running instance of **ai-agent-lab backend**, e.g.:

```bash
uvicorn app.main:app --reload
# default: http://127.0.0.1:8000
