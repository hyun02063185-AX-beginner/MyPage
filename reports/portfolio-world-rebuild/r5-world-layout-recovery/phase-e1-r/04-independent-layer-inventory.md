# Independent layer inventory

The final composite directly draws individual Hall facade, Hall stairs/retaining, Workshop structure, Workshop foreground, Archive approach foreground, dock surface, dock piles, gangway, Hero hull, Hero foreground, and water-contact foreground PNGs. It does not draw an integrated bundle.

Every semantic mask is ownership-subtracted from earlier masks. Therefore zero opaque source pixels are owned by two layers. The manifest in `r5-common-world-production-draft.json` records source, mask, placement, alpha bounds, depth, feet rule, ground relation, validation, and SHA-256.

Water contact is a distinct contact-only effect. Hero foreground is the owned lower/stern occluder region; it is no longer a copied dock-piles image under another name.
