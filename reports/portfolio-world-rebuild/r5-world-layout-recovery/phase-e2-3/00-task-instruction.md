# R5 Phase E.2.3 task instruction record

`TASK_ID: R5-E2.3-OCCLUSION-CONTENT-UX`  
Start head: `a0a67f7c5e6e896302779a16a9dd8469376cb178` · Branch: `design/world-layout-recovery-r5`

This independent Hybrid Pilot task must preserve Human-accepted directional 28×56 character scale and animation, mouse A* movement, WASD/arrow takeover, Hero dock route, four destination markers, and destination description UX. Candidate B, C.1/C.2, R4 Runtime, the four approved mappings, zoom 1.25, A*, existing pages, and the Future Reserve are protected. Formal R5 Runtime, Candidate B redesign, ship hull separation, new art/buildings/vessels/POI, character redesign, and content-page edits are prohibited.

Task A: validate foreground occlusion using feet/walkable position; use only actual foreground regions, retain structures continuously, never damage plate pixels, and report `ART_OCCLUSION_REQUIRED` where a matching mask does not exist. Task B/C: at an arrived POI, E or visible visit button opens an accessible panel with place, description, open-content, and continue-exploring actions. The first test opens the approved existing page in a new tab and keeps the world tab/state. Panels must block movement/background clicks, close with Esc, and work for touch/mobile. Task D/E require local and GitHub Pages link checks and a mobile review. Browser evidence must be actual Pilot captures. Human approval is still required.
