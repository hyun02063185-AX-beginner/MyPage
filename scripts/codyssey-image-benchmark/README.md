# Codyssey Image Benchmark

This is a standalone provider/model benchmark for Portfolio World. It does not
modify either `portfolio-world/` or `portfolio-world-v2/` runtime.

Run from the MyPage repository root with Node.js 18 or newer:

```powershell
$env:CODYSSEY_API_KEY = "your-key"
# Optional; defaults to https://copa.codyssey.kr
$env:CODYSSEY_API_BASE_URL = "https://copa.codyssey.kr"
node .\scripts\codyssey-image-benchmark\run-codyssey-image-benchmark.mjs
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

## Recover existing Round 01 images only

This mode sends no image-generation request. It reads only
`result.images[].url` from the two preserved success metadata files and makes
authenticated `GET` requests for those images; it never touches `imagen-4`.

From the MyPage root, recover the preserved temporary Round 01 folder with:

```powershell
$env:CODYSSEY_API_KEY = "your-key"
node .\scripts\codyssey-image-benchmark\run-codyssey-image-benchmark.mjs --recover-round-01 --round-dir ..\portfolio-world-local-backup\output\codyssey-image-benchmark\round-01
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
$env:CODYSSEY_API_KEY = "your-key"
node .\scripts\codyssey-image-benchmark\run-codyssey-image-benchmark.mjs --rerun-successful-round-01
```
