# ⚡ Execify

> Code goes in. Results come out. Everything in between is OS.

## What is Execify?

A full-stack platform that executes user-submitted code in sandboxed
child processes with job queuing, concurrency control, and real-time
status streaming. Built as a practical demonstration of operating system
concepts — processes, signals, semaphores, scheduling, and IPC —
implemented in a modern web stack.

---

## Features

- **Browser-based code editor** powered by Monaco Editor
- **Sandboxed code execution** via Node.js child processes
- **Semaphore-based worker pool** with configurable concurrency (1–10)
- **Dual scheduling modes**: FIFO and Priority queue
- **Real-time status streaming** via Server-Sent Events (SSE)
- **Timeout enforcement** with SIGTERM → SIGKILL escalation
- **Memory and execution time tracking** per job
- **Scheduling performance comparison** between FIFO and Priority modes
- **Submission history** with filtering, pagination, and detail view
- **Live monitoring dashboard** with pool metrics and analytics

---

## OS Concepts Applied

| Concept | Implementation |
|---------|----------------|
| Process Creation | child_process.spawn() for each code submission |
| IPC (Pipes) | stdout/stderr piped from child to parent process |
| Signals | SIGTERM → SIGKILL for timeout enforcement |
| Semaphore | Worker pool with maxConcurrent counter |
| Producer-Consumer | submit() produces, processQueue() consumes |
| FIFO Scheduling | Queue with shift() dequeue |
| Priority Scheduling | Sort by priority, dequeue highest first |
| Starvation | Demonstrable with priority mode and low-priority jobs |
| Process States | queued → running → completed / failed |
| Resource Management | Time and memory limits enforced per process |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React, TypeScript, Tailwind CSS |
| Backend | Next.js API Routes, Node.js |
| Database | MongoDB with Mongoose |
| Real-time | Server-Sent Events (SSE) |
| Code Editor | Monaco Editor |
| Process Management | Node.js child_process module |

---

## Architecture
```
Browser (React)
│
├── POST /api/submit ──→ WorkerPool.submit()
│ │
│ ┌─────┴─────┐
│ │ │
│ Queue Execute now
│ │ │
│ └─────┬─────┘
│ │
│ executor.ts
│ │
│ spawn() child process
│ │
│ ┌─────────┴──────────┐
│ │ │
│ stdout stderr
│ │ │
│ └─────────┬──────────┘
│ │
│ Update MongoDB
│
└── GET /api/status/[id] ──→ SSE Stream
   ↑               │
   │               Poll MongoDB
   └─────────────── every 500ms
```

---

## Project Structure
```
execify/
├── app/
│   ├── api/
│   │   ├── submit/route.ts
│   │   ├── jobs/route.ts
│   │   ├── status/[id]/route.ts
│   │   ├── pool/
│   │   │   ├── status/route.ts
│   │   │   ├── concurrency/route.ts
│   │   │   └── mode/route.ts
│   │   └── analytics/
│   │       ├── route.ts
│   │       └── comparison/route.ts
│   ├── submit/page.tsx
│   ├── history/page.tsx
│   ├── dashboard/page.tsx
│   └── page.tsx
├── components/
│   ├── ErrorBoundary.tsx
│   ├── Skeleton.tsx
│   ├── Toast.tsx
│   ├── ToastContainer.tsx
│   ├── FormatUtils.ts
│   ├── SchedulingComparison.tsx
│   └── dashboard/
│       ├── PoolStatusCard.tsx
│       ├── ControlPanel.tsx
│       ├── AnalyticsCards.tsx
│       └── ActivityFeed.tsx
├── hooks/
│   ├── useToast.ts
│   └── useJobStatus.ts
├── lib/
│   ├── db.ts
│   ├── workerPool.ts
│   └── executor.ts
├── models/
│   └── Job.ts
├── .env.example
└── README.md
```

---

## Setup

```bash
git clone <your-repo-url>
cd execify
npm install
cp .env.example .env.local
# Edit .env.local — fill in MONGODB_URI
npm run dev
Visit http://localhost:3000
```

---

## Usage

### Submitting Code
1. Go to `/submit`
2. Select language and priority (1–5)
3. Write code in the Monaco editor
4. Click Run Code or press Ctrl+Enter / Cmd+Enter
5. Watch real-time status via SSE

### Monitoring
- `/dashboard` — Live pool metrics, analytics, scheduling comparison
- `/history` — All submissions, filter by status, click for details

### Scheduling Modes
- **FIFO** — Jobs execute in submission order
- **Priority** — Higher priority jobs execute first (can cause starvation)

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/submit` | Submit code for execution |
| GET | `/api/jobs` | List jobs with filter and pagination |
| GET | `/api/status/[id]` | SSE stream for job status |
| GET | `/api/pool/status` | Worker pool current state |
| PUT | `/api/pool/concurrency` | Update max concurrent workers |
| GET/PUT | `/api/pool/mode` | Get or set scheduling mode |
| GET | `/api/analytics` | Aggregated execution statistics |
| GET | `/api/analytics/comparison` | FIFO vs Priority comparison |

---

## Known Behaviors
- Concurrency reduction does not kill running jobs
- Priority starvation is intentional — it demonstrates the concept
- SSE connections close automatically on job completion or failure
- Memory tracking uses process.memoryUsage() from the child process

---

## License
MIT
