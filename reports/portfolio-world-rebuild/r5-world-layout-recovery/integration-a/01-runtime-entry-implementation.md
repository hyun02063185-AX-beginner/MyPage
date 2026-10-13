# R5 Runtime Entry Implementation

Start commit: `cd118b19769c2ae1d345707b7bf673de149a1a20`. Integration A adds `R5WorldScene` to the one Phaser Game in `src/main.ts`; it does not import `hybridPilot.ts` and therefore creates no second Game or Pilot event handlers.

`BootScene` now selects R5 only for `?r5=1` when `canonical` is absent. Canonical is authoritative when both are supplied: `?canonical=4&r5=1` starts Canonical R4. Default World routing is unchanged.

The new scene is deliberately static: Candidate B, five approved foreground alpha layers, the approved player assets/animations, viewport/camera bounds, and a QA-only notice. It contains no pointer input, keyboard movement, A*, destination marker, content panel, or content URL code. The DOM QA notice removes itself on Scene shutdown/destroy.

Runtime URLs tested:

- Development: `http://127.0.0.1:4173/?r5=1`
- Production Preview: `http://127.0.0.1:4175/MyPage/world/?r5=1`
- Preserved R4: `http://127.0.0.1:4173/?canonical=4&overview=1`

