# BookWorm AI 

A full-stack AI-powered reading companion that helps you discover books, track your reading, and chat with an AI librarian — now with voice search.

---

## Features

- **AI Book Recommendations** — chat with an AI librarian (powered by Groq / Llama 3) to get personalised book suggestions based on your mood, genre, or a book you loved
- **Voice Search** — speak your search query in the header or talk directly to the chatbot using your microphone
- **Reading List Management** — organise books into To Read, Currently Reading, and Read lists
- **Reading Statistics** — track your reading habits over time
- **Book Search** — search millions of books via the Google Books API
- **User Accounts** — JWT-based authentication with protected routes

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB + Mongoose |
| Auth | JWT |
| AI Chat | Groq API (`llama-3.3-70b-versatile`) |
| Book Data | Google Books API |
| Voice (Header) | Deepgram ASR (`nova-2`) |
| Voice (Chatbot) | Web Speech API (browser-native) |

---

## Project Structure

```
BookWorm-AI/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/      # Header, Sidebar, SearchResults, etc.
│   │   ├── pages/           # Chatbot, ToRead, CurrentlyReading, etc.
│   │   └── mainpages/       # Login, Home
│   └── .env                 # Frontend environment variables
│
└── server/                  # Express backend
    ├── controllers/         # Request handlers
    ├── models/              # Mongoose schemas
    ├── routes/              # Express routes
    ├── services/            # Groq AI + Google Books logic
    └── .env                 # Backend environment variables
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- API keys for Groq, Google Books, and Deepgram (all free tiers available)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/BookWorm-AI.git
cd BookWorm-AI
```

### 2. Set up the server

```bash
cd server
npm install
cp .env.example .env
```

Fill in `server/.env`:

```env
GROQ_API_KEY=your_groq_api_key_here
GOOGLE_BOOKS_API_KEY=your_google_books_api_key_here
JWT_SECRET=any_long_random_string
MONGODB_URI=mongodb://localhost:27017/bookusers
DEEPGRAM_API_KEY=your_deepgram_api_key_here
PORT=5050
```

### 3. Set up the client

```bash
cd ../client
npm install
cp .env.example .env
```

Fill in `client/.env`:

```env
VITE_API_URL=http://localhost:5050
VITE_GOOGLE_BOOKS_API_KEY=your_google_books_api_key_here
```

### 4. Run the app

In two separate terminals:

```bash
# Terminal 1 — backend
cd server && npm start

# Terminal 2 — frontend
cd client && npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## API Keys

| Key | Where to get it | Free tier |
|---|---|---|
| `GROQ_API_KEY` | [console.groq.com](https://console.groq.com) | ✅ 14,400 req/day |
| `GOOGLE_BOOKS_API_KEY` | [console.cloud.google.com](https://console.cloud.google.com) | ✅ 1,000 req/day |
| `DEEPGRAM_API_KEY` | [console.deepgram.com](https://console.deepgram.com) | ✅ $200 free credit |

---

## Voice Search

**In the search bar (Header):** click the mic icon, speak your query, and the search fires automatically when you finish. Uses Deepgram `nova-2` via the `/transcribe` backend endpoint.

**In the chatbot:** click the mic icon next to the input box and speak your request. Uses the browser's built-in Web Speech API — no extra API key needed. Supported in Chrome, Edge, and Safari 14.1+.

---

## Environment Variables Reference

### Server (`server/.env`)

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | Groq API key for AI recommendations |
| `GOOGLE_BOOKS_API_KEY` | Google Books API key |
| `JWT_SECRET` | Secret for signing auth tokens |
| `MONGODB_URI` | MongoDB connection string |
| `DEEPGRAM_API_KEY` | Deepgram key for voice transcription |
| `PORT` | Server port (default: 5050) |

### Client (`client/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend base URL (default: `http://localhost:5050`) |
| `VITE_GOOGLE_BOOKS_API_KEY` | Google Books key for frontend search |

---

## License

MIT