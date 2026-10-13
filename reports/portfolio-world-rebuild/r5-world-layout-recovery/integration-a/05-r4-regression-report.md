# R4 Regression Report

R4 source is unchanged: `CanonicalRuntimeR4Scene.ts` was neither edited nor imported by the R5 scene. Development-browser validation of `?canonical=4&overview=1` created exactly one canvas, showed the R4 harbor, and contained no R5 QA notice. The existing default World entry also retains its original BootScene fall-through.

Automated coverage asserts canonical precedence and preserves the `canonical=4` branch. Build/test completed with 157 passing tests. Screenshot `12-r4-regression-screenshot.png` is retained as a visual comparison record; current browser validation is recorded in `07`.

