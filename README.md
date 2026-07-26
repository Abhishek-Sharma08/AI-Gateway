# AI Gateway

A production-style AI Gateway built with **Fastify**, providing a unified interface to multiple LLM providers (OpenAI, Ollama) with caching, rate limiting, retries, and streaming.

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
Client → AI Gateway → { OpenAI | Ollama }
```

---

## Scope

This project is intentionally scoped to what teaches **Fastify** deeply, rather than maximum feature count. Two providers is enough to prove the abstraction works — a third is trivial to add later and doesn't teach anything new.

**In scope (v1):**
- Chat completion + streaming (SSE) across 2 providers (OpenAI, Ollama)
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
| Framework | Fastify + TypeScript |
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
              AI              Ollama
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
│   │   ├── redis.ts
│   │   ├── prisma.ts
│   │   ├── jwt.ts
│   │   ├── logger.ts
│   │   └── swagger.ts
│   ├── hooks/
│   ├── decorators/
│   ├── routes/
│   ├── config/
│   ├── app.ts
│   └── server.ts
├── tests/
├── docker/
└── docker-compose.yml
```

---

## Module Responsibilities

**Auth** — API key issuance/validation, JWT, basic RBAC
**AI** — Chat completion, streaming, model selection
**Providers** — One adapter per provider behind a shared interface:

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
OpenAI + Ollama adapters behind a shared interface

**Phase 4 — Gateway Intelligence**
Routing, retry, failover, caching, streaming

**Phase 5 — Polish**
Metrics, structured logging, Docker, core tests

*(No separate "Production" phase — CI/CD, observability dashboards, and multi-region concerns are deferred; they're infra learning, not Fastify learning.)*

---

## Learning Outcomes

By the end of this project:
- Fastify plugin architecture and encapsulation boundaries
- Decorators and hooks as an alternative to Express middleware chains
- JSON Schema-driven validation and auto docs
- Streaming responses over Fastify
- Provider abstraction / adapter pattern for external APIs
- Applying existing Redis/BullMQ knowledge in a new framework context

---

## Future Enhancements

Parked intentionally — revisit only if the core project is finished and there's a specific reason to extend it:

- Additional providers (Claude, Groq, OpenRouter)
- Billing/subscriptions, usage-based quotas
- Multi-tenant organizations, team workspaces
- Semantic caching, prompt templates
- Kubernetes, multi-region deployment
- Prometheus/Grafana, OpenTelemetry tracing
- SDK generation, webhook system

---

## License

MIT
