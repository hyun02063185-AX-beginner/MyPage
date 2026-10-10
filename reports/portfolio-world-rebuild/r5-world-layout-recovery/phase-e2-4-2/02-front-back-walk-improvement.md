# Front / Back walk improvement

Front and Back now use eight authored poses: contact, down, passing, up, opposite contact, down, passing, up. Each phase exposes a leading foot plus its counter-swinging arm; the torso/hips make a restrained side-to-side weight transfer. Idle uses the same V3 master’s compact passing pose, retaining the identical cell, scale, baseline, palette, hair, jacket, shirt, trousers, and shoes.

Default Candidate B runs Side at 20fps and the denser Front/Back sheets at 16fps. This creates an approximately 0.5s vertical cycle at the approved 170px/s rather than replaying a four-frame vertical cycle at 10fps. A 24fps QA baseline remains available as `fast`; A and C provide 18fps and 12fps comparison candidates.
