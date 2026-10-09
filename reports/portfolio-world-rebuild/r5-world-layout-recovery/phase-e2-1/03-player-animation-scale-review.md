# Player animation scale review

Idle front/back/side sources are each `28×56`. Walk front/back/side sheets are each `112×56`, or four `28×56` frames. The recovery reapplies `28×56` display size, bottom-centre origin, and `28×16` feet body after every animation key transition. `FlipX` changes only facing, not scale.

This preserves naturally narrower alpha in a side stance without stretching its canvas or moving the ground anchor.
