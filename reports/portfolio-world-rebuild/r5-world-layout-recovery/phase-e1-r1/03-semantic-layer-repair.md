# Semantic-layer repair

R1 separates dock piles, gangway, dock surface, full Hero hull, a dock-side foreground occluder, and a small translucent contact ripple. The foreground no longer contains ship hull or a large source-water polygon. The contact effect is intentionally authored as a short translucent ripple rather than reusing a dark Candidate B ship reflection that would survive Hull OFF.

`08-hero-ship-off-validation.png` verifies Hull OFF; `09-dock-gangway-toggle-validation.png` verifies Dock, Gangway, and Contact OFF. Semantic source masks have zero overlapping opaque pixels. A Hull OFF image keeps dock/gangway context but contains no Hero hull pixels.
