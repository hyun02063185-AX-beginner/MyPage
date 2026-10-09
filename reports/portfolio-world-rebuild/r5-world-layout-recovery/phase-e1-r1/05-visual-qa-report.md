# Visual QA report

Clean base: visual review confirms no large ship/dock residual or triangular blue repair slab. Independent layers: Hull OFF removes hull; Dock OFF removes dock owners; Gangway OFF removes only the gangway; Contact OFF removes only the ripple. Motion: no blue polygon or environment pop-in/out appears in Hero route output; Workshop→Hall and Workshop→Archive retain the original E.1-R route policy.

Executed: master/C.2/reserve input hashing, outside-mask test, semantic overlap test, toggles, stable Hero environment-hash test, repeatable local build, `npm test`, typecheck, and build. Not executed: an R5 Runtime test, because it remains prohibited.

Remaining major: masked water restoration is derived from the existing generated clean source and needs a final artist paint-over before production-art approval. Blocker: none in the narrow R1 defect set.
