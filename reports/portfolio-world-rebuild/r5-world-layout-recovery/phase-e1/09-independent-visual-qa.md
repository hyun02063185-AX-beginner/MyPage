# Independent visual QA

The harness is `portfolio-world/tools/build_r5_e1_production_pilot.py`. It uses Pillow only to produce standalone review artifacts; it neither imports nor writes the R4 game runtime.

Checks performed: Candidate B checksum is recorded; clean plates and 14+ RGBA assets exist; all reconstruction assets have an alpha channel; output composites and the player/depth board render; camera preview uses 1024×576 world coverage at a single 1.25 scale; data records placement, anchor, order, method, source, SHA-256, and validation status.

Manual visual QA is represented by the final board. It confirms no obvious doubled Workshop/Hall or Hero Ship in the E.1 composites. It does not convert the conditional generated clean plates into approved production art.
