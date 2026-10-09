# R5 Phase E.2.2 task instruction record

`TASK_ID: R5-E2.2-CHARACTER-POI-UX`  
Base: `438f55866162319b801613cc7dcdc6b082acc184` · Branch: `design/world-layout-recovery-r5`

This independent Hybrid Pilot task responds to playtest findings: Workshop→Hero, click-to-move, and manual override passed; directional visual proportions failed; destination discoverability needed improvement.

Required preserved contracts: Candidate B Beauty Master; C.1/C.2 sources; exactly four POI and their page mapping (Hall→`teaching.html`, Workshop→`making.html`, Archive→`gallery.html`, Hero→`career.html`); Future Expansion Reserve; logical 28×56 player; camera zoom 1.25; A* click movement; WASD/arrow manual movement; Hero boarding threshold; and the R4 Runtime. Candidate B/C.1/C.2/R4 must not be modified. Formal R5 Runtime implementation is prohibited.

Part A requires inspection of actual opaque pixels, four directional idle/walk behavior, frame jitter, feet, Phaser scale/origin/body, FlipX, and rendered camera result. Side art may be corrected only as a Pilot-only derived asset; raw R4 art must remain. The result requires an original/updated turnaround and same-position actual Phaser directional comparison.

Part B requires lightweight world-anchored UI markers, not physical signs. Each marker needs icon, Korean/English place name, content purpose, and click-to-move guidance. It must distinguish `visualAnchor`, safe `navigationTarget`, and interaction range; camera/zoom-track; retain compact, hover/focus, selected/moving, and arrival states; call the existing A* logic; avoid background-click duplication; support mouse, keyboard focus, touch, existing bottom POI controls, first-visit Korean guide, Route Guide, and F2-debug distinction.

Required Korean copy:

- Exhibition Hall · 전시관 — AX 강의와 교육 프로그램
- Workshop · 작업실 — AI 활용 및 제작 결과물
- Harbor Archive · 아카이브 — AI·AX 개념과 교육 콘텐츠
- Hero Ship · 히어로십 — 경력과 전문성의 여정

Required browser QA covers T01–T12: directional transitions, idle/walk, four destinations, marker clicks and Hero threshold, manual override, camera anchoring, and mobile width. Deliver the eight written records, seven actual-browser image artifacts, the UX draft data, commit, and push. Human visual approval remains a gate and cannot be self-approved.
