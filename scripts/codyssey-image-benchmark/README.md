# Codyssey Image Benchmark

This is a standalone provider/model benchmark for Portfolio World. It does not
modify either `portfolio-world/` or `portfolio-world-v2/` runtime.

Run from the MyPage repository root with Node.js 18 or newer.

## Codyssey key wrapper

One time, store the key with current-user Windows DPAPI (the encrypted file is
outside this repository):

```powershell
.\scripts\codyssey-image-benchmark\setup-codyssey-key.ps1
```

For every future Codyssey API job, use the wrapper rather than putting a key in
the calling shell:

```powershell
.\scripts\codyssey-image-benchmark\run-with-codyssey-key.ps1 `
  -Script ".\scripts\codyssey-image-benchmark\<node-script>.mjs"
```

The wrapper supplies the key only to its child Node process and restores the
calling environment afterward.

```powershell
.\scripts\codyssey-image-benchmark\run-with-codyssey-key.ps1 `
  -Script ".\scripts\codyssey-image-benchmark\run-codyssey-image-benchmark.mjs"
```

The script makes one identical request per model (`gpt-image-2`, `imagen-4`,
and `gemini-2.5-flash-image`) to `POST /api/v1/images` with
`response_format: "b64_json"`.

Generated images, redacted request/response metadata, the shared prompt, and
the comparison worksheet are written to:

```text
output/codyssey-image-benchmark/round-01/
```

The generated output and local `.env*` files are Git-ignored. The script never
creates a `.env` file and never writes the API key or Authorization header to
metadata or logs.

## Generate the three playable-harbor structural variants

This runs exactly six `POST /api/v1/images` calls: Central Plaza Hub, Terrace
Steps Harbor, and Waterfront Promenade, once each with `gpt-image-2` and
`gemini-2.5-flash-image`. It does not call `imagen-4` or reuse the Round 01
prompt. Images, redacted metadata, prompts, and the requested structural
comparison worksheet are written to
`output/codyssey-image-benchmark/harbor-structural-candidates/`.

```powershell
.\scripts\codyssey-image-benchmark\run-with-codyssey-key.ps1 `
  -Script ".\scripts\codyssey-image-benchmark\generate-harbor-structural-candidates.mjs"
```

## Playable Harbor Design Round 2

Round 2 is a separate six-candidate design exploration: A Central Plaza,
B Plaza + Waterfront Promenade, and C Simple Two-Level Harbor, each once with
`gpt-image-2` and `gemini-2.5-flash-image`. Its first A/gpt-image-2 request is
also the smoke check, so it never creates a duplicate seventh design. A 5xx can
receive one identical retry; no other prompt/model parameters are changed.

```powershell
cd C:\Users\hyun0\MyPage
.\scripts\codyssey-image-benchmark\run-with-codyssey-key.ps1 `
  -Script ".\scripts\codyssey-image-benchmark\generate-harbor-playable-round-02.mjs"
```

Original decoded files are preserved in
`output/codyssey-image-benchmark/harbor-playable-round-02/`, alongside redacted
metadata with format, dimensions, size, timestamp, a 6-candidate contact sheet,
and a PASS/CAUTION/FAIL human-review matrix. No Phaser files are touched.

## Recover existing Round 01 images only

This mode sends no image-generation request. It reads only
`result.images[].url` from the two preserved success metadata files and makes
authenticated `GET` requests for those images; it never touches `imagen-4`.

From the MyPage root, recover the preserved temporary Round 01 folder with:

```powershell
.\scripts\codyssey-image-benchmark\run-with-codyssey-key.ps1 `
  -Script ".\scripts\codyssey-image-benchmark\run-codyssey-image-benchmark.mjs" `
  -Arguments @('--recover-round-01', '--round-dir', '..\portfolio-world-local-backup\output\codyssey-image-benchmark\round-01')
```

If `CODYSSEY_API_KEY` is absent, recovery exits before reading metadata or
making an external request.

## Re-run only the preserved successful models

Use this only when the original base64 payload is no longer recoverable. It
makes exactly one image-generation request each for `gpt-image-2` and
`gemini-2.5-flash-image`; it never calls `imagen-4`. Images are written to the
canonical MyPage Round 01 directory. New request/response metadata uses the
`recovery-rerun-01.*` prefix, preserving the original Round 01 metadata.

```powershell
.\scripts\codyssey-image-benchmark\run-with-codyssey-key.ps1 `
  -Script ".\scripts\codyssey-image-benchmark\run-codyssey-image-benchmark.mjs" `
  -Arguments @('--rerun-successful-round-01')
```

## Playable Harbor Round 2A

After the one-time setup, use this command for the Gemini-only structural batch.
It makes the one smoke request first, then sends exactly the remaining two
requests only if that smoke request succeeds:

```powershell
.\scripts\codyssey-image-benchmark\run-with-codyssey-key.ps1 `
  -Script ".\scripts\codyssey-image-benchmark\generate-harbor-playable-round-02a.mjs"
```
