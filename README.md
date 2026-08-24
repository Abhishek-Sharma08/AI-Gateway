# AI Gateway

A production-style AI Gateway built with **Fastify**, providing a unified interface to multiple LLM providers (a cloud provider + Ollama, local) with caching, rate limiting, retries, and streaming.

Built as a hands-on Fastify learning project — the goal is to go deep on Fastify's plugin architecture, hooks, decorators, and schema validation, not to clone commercial gateways like Portkey or LiteLLM.

---

## This Project

Calling AI providers directly from client apps creates real problems:

- Vendor lock-in to a single provider
- API keys exposed to or duplicated across clients
- No centralized logging, caching, or rate limiting
- No graceful fallback when a provider goes down

AI Gateway sits between clients and providers, handling auth, routing, caching, retries, and observability in one place.

```
Client → AI Gateway → { Cloud Provider | Ollama (local) }
```

---

## Scope

This project is intentionally scoped to what teaches **Fastify** deeply, rather than maximum feature count. Two providers is enough to prove the abstraction works — a third is trivial to add later and doesn't teach anything new.

**In scope (v1):**
- Chat completion + streaming (SSE) across 2 providers (a cloud provider, Ollama)
- API key auth + basic rate limiting (Redis)
- Request validation via JSON Schema + auto-generated Swagger docs
- Response caching (Redis) for repeated prompts
- Retry + failover between providers
- Structured logging (Pino) + basic usage metrics
- Background jobs (BullMQ) for log persistence / cache cleanup
- Dockerized for local reproducibility

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Fastify + JavaScript (ES Modules) |
| Database | PostgreSQL + Prisma |
| Cache | Redis |
| Queue | BullMQ |
| Auth | JWT + API Keys |
| Validation | Fastify JSON Schema |
| Logging | Pino |
| Docs | Swagger (auto-generated from schemas) |
| Testing | Vitest |
| Deployment | Docker + Docker Compose |

---

## Architecture

```
                    Internet
                        │
                        ▼
                 Fastify Server
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
 Authentication     Rate Limit      Validation
        │               │               │
        └───────────────┼───────────────┘
                        ▼
                 Request Router
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
        Cloud Provider          Ollama
              │                   │
              └─────────┬─────────┘
                        ▼
              Response Formatter
                        ▼
                    Client
```

### Project Structure

```
ai-gateway/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   ├── ai/
│   │   ├── providers/
│   │   ├── cache/
│   │   └── health/
│   ├── plugins/
│   │   ├── redis.js
│   │   ├── prisma.js
│   │   ├── jwt.js
│   │   ├── logger.js
│   │   └── swagger.js
│   ├── hooks/
│   ├── decorators/
│   ├── routes/
│   ├── config/
│   ├── app.js
│   └── server.js
├── tests/
├── docker/
└── docker-compose.yml
```

---

## Module Responsibilities

**Auth** — API key issuance/validation, JWT, basic RBAC
**AI** — Chat completion, streaming, model selection
**Providers** — One adapter per provider behind a shared interface:

```js
// Every provider adapter implements this shape
class AIProvider {
  async chat(request) {
    // returns a ChatResponse
  }

  async *stream(request) {
    // yields ChatChunk objects
  }
}
```

**Cache** — Redis-backed prompt caching with TTL and invalidation
**Health** — `/health`, `/health/live`, `/health/ready`

---

## Fastify Concepts Covered

| Concept | Where it's used |
|---|---|
| Plugins | Redis, Prisma, JWT registration |
| Encapsulation | Module isolation (auth vs. providers vs. cache) |
| Decorators | Attaching AI client + user context to `request` |
| Hooks | `preHandler` for auth, `onSend` for logging |
| JSON Schema | Request/response validation |
| Serialization | Fast, secure API responses |
| Error handling | Centralized error formatting |

---

## Roadmap

**Phase 1 — Core Setup**
Project structure, plugins, env config, logging, Swagger

**Phase 2 — Auth**
API keys, JWT, basic RBAC

**Phase 3 — Providers**
Cloud provider (OpenAI-compatible API — could be OpenAI, Groq, Gemini, etc.) + Ollama adapters behind a shared interface

**Phase 4 — Gateway Intelligence**
Routing, retry, failover, caching, streaming

**Phase 5 — Polish**
Metrics, structured logging, Docker, core tests

---

## License

MIT
