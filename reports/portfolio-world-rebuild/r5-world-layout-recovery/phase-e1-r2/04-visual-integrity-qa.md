# Visual integrity QA

Automated range checks pass: Group OFF, Gangway OFF, and Dock OFF alter no pixels outside their explicit semantic masks; Hero boarding frames retain a fixed environment hash. Player remains 28×56, bottom-center anchored, with a 1024×576 logical viewport and 1.25 zoom.

Visual QA fails production readiness: `07-hero-ship-alpha-mask.png` and the final review board show blue source-water triangles inside the source-led sail/hull extraction. This is not concealed by the passing range checks. The same defect can create straight cutoff impressions in All ON.
