# Pilot-to-Runtime transfer

R5WorldScene reuses Pilot's pure `hybridCollision.ts` and `hybridNavigation.ts`; it does not import the Pilot scene or its separate Phaser.Game instance. Runtime owns its Scene input, camera and DOM lifecycle. Content navigation remains deferred to Integration C.

Transferred: 170 world-px/s eight-way movement, 28×16 feet body, 2px segment sweep, 8px A*, smoothing, six approved animation sheets, and the four approved POIs. Preserved: Candidate B plate, five foreground layers, 1280×720 world and zoom 1.25.
