# Mahaiza Lesson Platform

This repository hosts the React front-end and the Python backend used to import, index, and expose lesson PDFs as searchable knowledge bases.

## Front-end (Vite + React)

- Located inside `src/`.
- Uses Vite with React + TypeScript. Run `npm install` followed by `npm run dev` to launch the UI.
- Routing lives in `src/routes` and lesson pages live under `src/components/pages`.

## Backend PDF Import Pipeline

The backend (under `backend/`) contains a modular pipeline that follows the recommended architecture for lesson ingestion:

1. **Extract text** from PDFs with PyMuPDF.
2. **Split text** into overlapping chunks via LangChain's recursive text splitter.
3. **Create embeddings** using OpenAI (`text-embedding-3-large`) or the local `sentence-transformers/all-MiniLM-L6-v2` model.
4. **Store vectors** in Chroma, either locally (embedded) or via the optional Dockerized Chroma server.

### Project structure

```
backend/
 ├── .env.example        # Copy to .env and adjust keys/settings
 ├── config.py           # Dataclass-driven settings
 ├── embeddings.py       # Embedding provider selection
 ├── pdf_loader.py       # PyMuPDF extraction helpers
 ├── text_splitter.py    # LangChain chunking utilities
 ├── vector_store.py     # Local/remote Chroma connectors
 ├── import_pipeline.py  # CLI entry point
 └── docker-compose.yml  # Optional chroma server
```

### Setup

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp backend/.env.example backend/.env  # add OPENAI_API_KEY if using OpenAI embeddings
```

> The dependencies are isolated in `requirements.txt` to keep the Vite front-end separate from the Python stack.

### Running the importer

```bash
python backend/import_pipeline.py path/to/lesson.pdf lesson_collection \
  --persist-dir backend/.chroma \
  --course "Terminale" \
  --language "fr"
```

- Switch to OpenAI embeddings with `--embedding-backend openai` (requires `OPENAI_API_KEY`).
- Override chunk settings via `--chunk-size` and `--chunk-overlap`.
- Add `--chroma-host localhost --chroma-port 8000` if using the Dockerized server below.

### FastAPI analysis + ingestion API

The front-end import screen calls a JSON API exposed via FastAPI:

```bash
uvicorn backend.server:app --reload --port 3000
```

- Configure the default collection and allowed CORS origins in `backend/.env` (see `.env.example`).
- The `POST /documents/analyze` endpoint accepts a `file` form field (PDF) and returns metadata matching `DocumentAnalysisResult`.

Example request:

```bash
curl -X POST http://localhost:3000/documents/analyze \
  -F "file=@/path/to/lesson.pdf" | jq
```

### Optional: Dockerized Chroma

```bash
cd backend
docker compose up -d
```

The importer will connect to the HTTP server when `CHROMA_HOST`/`CHROMA_PORT` are defined (or passed as CLI flags). Persisted vectors live inside `backend/chroma_data` when using Docker, or under `backend/.chroma` when storing locally.

## PDF Preview Functionality

The application includes a comprehensive PDF viewer in the analysis interface:

### Features
- **Real-time PDF rendering** using react-pdf and PDF.js
- **Navigation controls** for multi-page documents
- **Zoom functionality** (0.5x to 2x scaling)
- **Error handling** with retry mechanism
- **Loading states** and visual feedback

### PDF Sources
PDFs are loaded in this priority order:
1. Direct URLs or base64 data from `document.image`
2. Static files from `public/pdfs/{fileName}`
3. Fallback sample PDF for demonstration

### Adding PDFs
Place PDF files in the `public/pdfs/` directory:
```bash
mkdir -p public/pdfs
cp your-document.pdf public/pdfs/
```

The PDF preview automatically appears when analyzing documents in the education module.

### Next steps

- Wire the indexed vectors into the querying API or serverless functions.
- Extend metadata (subject, level, author) as needed in `import_pipeline.py`'s `attach_metadata` helper.
