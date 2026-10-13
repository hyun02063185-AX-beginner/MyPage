# Capture Integrity and Test Record

| screenshot | dimensions | SHA-256 |
|---|---:|---|
| `10-dev-r5-runtime.png` | 1236×1113 | `E895916258886BFDCFD24AE636573079C36A1DB7C1A866FE9B69D7942221C27E` |
| `11-production-preview-r5-runtime.png` | 1236×1113 | `00BCB5129BBE9B19A1754740AF0D7369F4828EC58CFE57D78060147F9E2A981B` |
| `12-canonical-r4-regression.png` | 1236×1113 | `D8421B985C7F03823D35A2DD5854A5D208A3370560C1FF0882C1C2D26054D6E0` |
| `13-hybrid-pilot-regression.png` | 1236×1113 | `88B810158935A03323E0919413BA90B98B3EE409F68CC733752F6DD34F3EBEB7` |

Verification method: each URL was navigated in an isolated browser tab, allowed to settle, DOM-tested for canvas/expected UI, inspected through browser console logs for error/warn entries, then exported with Chrome DevTools Protocol `Page.captureScreenshot`. No page content was changed during capture.

Code scope remains unchanged from the baseline commit. This correction adds only this report/evidence folder.

