# E.1 defect reproduction

The prior tool depended on two full-scene clean sources from paths not committed to Git, composited a Workshop bundle and Hero bundle, duplicated pixels under several semantic names, and cropped 1024×576 world pixels before scaling. Those are four different defects: scene inconsistency, non-independent composition, semantic duplication, and an invalid camera contract.

E.1-R uses only committed E.1 source-generation PNGs, samples them only through local masks, never draws an E.1 bundle in the final composite, assigns every extracted Candidate B pixel to one semantic owner, and uses a 1024×576 logical viewport at one 1.25 world-to-screen transform.
