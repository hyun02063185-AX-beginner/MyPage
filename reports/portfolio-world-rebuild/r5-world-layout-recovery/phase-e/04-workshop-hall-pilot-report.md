# R5 Phase E — Workshop / Hall Pilot Report

Actual pilot: `pilot-assets/workshop-hall-foreground-occlusion-v1.png` (2142×734 RGBA). It is standalone generated art, not an original-image crop. The pilot has a limestone wall, rail, planters, foliage, stair edge, and a transparent central opening.

Placement for review: world `(30,356)` at `420×144`, foreground order 70, over the player anchored at Workshop `(245,440)`. Its bottom-center player contact stays on C.2 ground while the rail/wall can draw in front.

Result: alpha and ordering prove the occlusion mechanism. Visual quality is **conditional**: the pilot’s detailed construction and broad opening do not exactly match Candidate B’s local geometry, and hidden terrain beneath/behind the original Workshop still needs authored production art.
