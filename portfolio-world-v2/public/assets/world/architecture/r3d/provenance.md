# R3D architecture runtime provenance

Selected source art is preserved outside git in `output/codyssey-image-benchmark/r3d-environment-art-batch-b/`.

| Runtime asset | Selected source | Transform |
| --- | --- | --- |
| `exhibition-hall-left.png`, `exhibition-hall-entry.png`, `exhibition-hall-right.png` | Hall B (`f6af149c8fa1c9b1a29ff5228440f5b8c6d32be94607dc120ed6db01e0f6feda`) | deterministic #ff00ff mask, tight alpha crop, 440×145 fit, manifest slices |
| `workshop-shell.png` | Workshop B (`169d21609c22ea2e02b7f2feda32fcd90e2d48fd668280d4ad4b77eb63390f6a`) | deterministic #ff00ff mask, tight alpha crop, 180×230 fit |

The lossless extraction is reproducible with `scripts/portfolio-world/build-r3d-architecture-assets.py`. Art adds no collision or walkability claim.

## R3D.1 integration derivatives

`exhibition-hall-assembly-r3d1.png` keeps Hall B at a 470×260 visual envelope
and is grounded at the plaza threshold; `workshop-shell-r3d1.png` uses Workshop
A at 205×300 and is grounded on the non-walkable quay plinth. These dimensions
are visual-only and do not change any R3A collision footprint.
