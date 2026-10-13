# Browser playtest results

Development: `http://127.0.0.1:30080/?r5=1`, R5WorldScene, one Canvas. Chrome displayed all five bottom controls. Clicking the offscreen Hero Ship set both Hero Marker and menu control pressed, with Runtime state `MOVING`; the observed player advanced from `(245,440)` to `(339,437)`. Route guide changed OFF then ON with corresponding accessible pressed values. Console errors: none observed. Asset-load errors: none observed.

Production Preview: `http://127.0.0.1:30081/MyPage/world/?r5=1`, R5WorldScene, one Canvas. All five controls rendered; console and asset-load errors: none observed.

Actual full arrival verification remains `NOT_VERIFIED_IN_BROWSER` for this task; no generated path is misreported as arrival evidence. The prior waypoint-overstep correction remains in source unchanged.
