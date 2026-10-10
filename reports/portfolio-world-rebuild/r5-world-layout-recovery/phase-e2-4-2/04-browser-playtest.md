# Browser playtest

Actual Vite/Phaser runtime was opened with `?animationQa=1` and captured through local CDP at 1024×576. The retained videos contain live frames for Front walk, Back walk, Side walk, and Right→Front→Left direction transition. The QA panel applies A/B/C by removing and recreating the real Phaser animation objects; it is not a visual simulation.

Observed technical result: the new Front/Back arm/leg alternation is visible at the normal camera zoom, vertical silhouettes stay substantially populated through movement, Side remains unchanged, and releasing a movement key returns the player to a matching V3 idle.
