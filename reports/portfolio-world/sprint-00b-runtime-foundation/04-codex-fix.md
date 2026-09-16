# Sprint 0B — Codex Fix Pass Report

- Agent: Codex
- Model: GPT-5.6 Terra High
- Environment: CODYSSEY_SHARED_MAC
- Starting commit: e79ff55

## F1 — Local Work Context config recovery

- Change: CLI arguments are parsed before strict config loading. A valid `--set-profile` now performs lenient recovery: it preserves a safely valid UUID when available or creates a new UUID, replaces invalid JSON/schema config, and prints a concise warning. Normal execution still exits non-zero for corrupt config.
- Validation: valid config preserved its machine context ID; corrupt JSON repaired to schema v1; schema-invalid JSON repaired while preserving its valid UUID; invalid profile exited non-zero without changing the config. The original ignored local config was restored from a temporary backup.

## F2 — Preview base-path validation

- Change: `preview` is now `vite preview --base /MyPage/world/`; the Node smoke test asserts that production base is in the script while retaining the generated HTML asset-base assertion.
- Preview validation: `npm run preview -- --host 127.0.0.1 --port 4173` resolved `/MyPage/world/`.
- Correct JS asset: returned HTTP 200 with `Content-Type: text/javascript`.
- Wrong prefix-free asset request: returned HTTP 404 with `Content-Type: text/plain`; it did not return the application page or masquerade as the production asset.

## F3 — Canonical handoff parsing

- Change: `work-context.mjs` now extracts metadata only between `## Work Context Metadata` and the next level-2 heading.
- Validation: unrelated metadata elsewhere was ignored; absence of the canonical section produced `UNKNOWN` values without failure. The handoff now documents the canonical machine-readable section beside the stable keys.

## Commands

- `npm ci`
- `npm run typecheck`
- `npm run build`
- `npm test`
- Work Context valid-config, corrupt-JSON, schema-invalid, invalid-profile, canonical-metadata, and absent-metadata validations
- `npm run preview -- --host 127.0.0.1 --port 4173`
- `git diff --check`

## Scope

Runtime scope changed: NO.
