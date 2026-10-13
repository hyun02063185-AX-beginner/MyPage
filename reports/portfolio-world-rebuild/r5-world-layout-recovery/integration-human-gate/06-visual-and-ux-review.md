# Visual and UX Review

The current browser overview shows Candidate B clearly, four discoverable labels, and no added Reserve building/POI. The original supplied review images are copied here as historical visual context only: `11` overview, `12` route, `13` character/navigation, `14` content flow, and `15` review board. They do not substitute for the current live QA recorded in `05`.

V3 Front/Back and improved Side are accepted for Pilot experience. The 28×56 image cell, origin `.5,1`, y=55 foot contact, and 28×16 body at offset y=40 are fixed. Foreground overlays have intentional depth at their `occlusionFootY`; they do not alter collision geometry.

Known visual defect: the previously reported coastal stone-wall occlusion remains deferred (`ART_OCCLUSION_REQUIRED` history). Human accepted the current degree of occlusion, so no art extraction work resumes in this Gate. Before release, classify it Major/Blocker if it materially hides the character on an actual visit route or enables traversal through visible obstruction.

Portfolio UX recommendation: retain the first-visit instruction and always-visible marker names; add a clear non-game content fallback from the homepage/world chrome in a later product pass. Keep new-tab content initially because it preserves exploration state. Same-tab requires robust return state; overlay adds the highest presentation and maintenance cost.

