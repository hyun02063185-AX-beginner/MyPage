# Player occlusion validation

`15-player-front-back-occlusion.png` uses the actual R4 Candidate B front sprite at native 28×56 and actual C.2 anchors: Workshop `(245,440)`, Hall stair base `(120,315)`, gangway `(1015,355)`, and Hero threshold `(1028,355)`.

The board tests rail-front, rail-back, Workshop approach, stair approach, dock/gangway, and Hero threshold. When the player is behind an occluder, foreground rail/pile/hull draws after the sprite; when in front, it draws before. The contract follows player feet, not sprite center.

This is a static-frame and camera-transform validation. It verifies the rule at six real positions, but it is not a Runtime movement implementation and does not approve every in-between collision/depth transition.
