# Occlusion root cause

The Pilot already had five independently extracted RGBA foreground assets, but their fixed depths (20–28) were always below the player (30+). Consequently the player always drew in front, regardless of feet position. The Candidate B scenic plate and collision data were not at fault and were not changed.

E2.3 retains every extracted asset continuously and assigns its display depth from an authored `occlusionFootY`. Player depth remains `30 + player.y / 1000`; a player above an occluder foot row draws behind that RGBA asset, and a player below it draws in front. This changes draw order only—no walk zone, collision polygon, target, or image pixel is modified.
