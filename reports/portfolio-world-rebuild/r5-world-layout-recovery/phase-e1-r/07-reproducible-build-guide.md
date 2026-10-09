# Reproducible build guide

Prerequisite: Python with Pillow (`Pillow 12.3.0` was used). From repository root:

```powershell
python portfolio-world/tools/build_r5_e1r_common_world.py
cd portfolio-world
npm test
```

The script fails rather than substituting assets if Candidate B, both committed E.1 generation inputs, tracked R4 player, C.2, or reserve data is absent. It makes no external API request. Run the build twice and compare the SHA-256 values in `data/portfolio-world/r5-common-world-production-draft.json`; fixed inputs create fixed outputs.
