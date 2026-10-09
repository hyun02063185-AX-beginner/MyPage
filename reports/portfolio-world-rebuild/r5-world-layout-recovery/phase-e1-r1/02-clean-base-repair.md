# Clean-base repair

`11-common-clean-base-repaired.png` starts from Candidate B and applies the existing committed Hero clean-water source only through `MASK_HERO_DOCK_REPAIRED`. The expanded mask includes the complete hull, masts, sails, gangway and dock footprint rather than following incomplete semantic extraction edges.

Candidate B pixels outside all local masks remain unchanged: `outsideMaskChangedPixels = 0`. `07-clean-base-before-after.png` shows the former triangular/structural residual and the repaired water. The local source is still estimated art, so boundary finish remains a human art-direction concern, not a Runtime task.
