# Player motion and occlusion review

Motion evidence is generated from C.2 polylines, not direct shortcuts. `workshop-hall-archive` covers Workshop → Hall stair chain and Workshop → Archive; `hero-route` covers Workshop → Promenade → Pier → Side Dock → Gangway → Hero threshold. Each has 12 PNG frames and a GIF in `motion-evidence/`.

The harness uses the tracked R4 Candidate B 28×56 player and bottom-center feet. Foreground rails, archive foreground, Hero foreground, and water contact use explicit feet-boundary rules after player rendering; primary architecture renders before player. This is independent-harness evidence, not Runtime movement or a final collision implementation.
