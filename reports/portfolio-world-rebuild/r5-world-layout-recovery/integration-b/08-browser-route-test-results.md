# Browser route test results

Development URL: `http://127.0.0.1:30080/?r5=1`; Scene: `R5WorldScene`; Canvas count: 1; asset-load errors: none observed; console errors: none observed.

Chrome visibly rendered the R5 B notice, route-guide toggle, and all four markers. Browser-executed module evaluation verified safe A* output for Workshop→Hall, Workshop→Archive, Workshop→Hero, Hall→Workshop, Hall→Archive, Archive→Hero, and Hero→Workshop. A focused automation tab did not advance Phaser frames at normal foreground cadence, so it did not provide an honest end-to-end arrival recording. The route screenshots and motion MP4 deliverables are therefore incomplete and cannot be substituted by the path calculation.

| Route | A* path / safety | actual browser arrival recording |
|---|---|---|
| Workshop→Hall | 4 points, safe | not established |
| Workshop→Archive | direct, safe | not established |
| Workshop→Hero | 6 points, safe | not established |
| Hall→Workshop | 4 points, safe | not established |
| Hall→Archive | 5 points, safe | not established |
| Archive→Hero | 7 points, safe | not established |
| Hero→Workshop | 6 points, safe | not established |
