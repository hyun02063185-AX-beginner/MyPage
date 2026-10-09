# Ship / gangway root cause

R1 assigned opaque pixels through `exclusive(raw, owned)`. This prevented arithmetic overlap but allowed whichever coarse polygon ran first to steal visually unrelated pixels. In particular the gangway covered part of the hull, and broad sail/hull polygons retained water triangles.

R2 does not use ownership-order subtraction for ship-versus-gangway semantics. It authors component masks for hull body, deck, sails, mast/rigging strokes, and gangway separately. The only intentional group/gangway overlap is the documented local hidden-hull continuity patch at the connection.
