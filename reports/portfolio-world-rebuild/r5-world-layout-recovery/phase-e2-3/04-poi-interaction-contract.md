# POI interaction contract

Only `activePoi()` inside its existing interaction range and without an active route can open the panel. E and the visible visit button use the same `hybrid:visit` event. Marker clicks remain movement requests. While `contentPoi` is set, the update loop uses a zero vector, pointer-to-ground movement is ignored, and panel pointer events stop propagation. Esc, Close, Continue exploring, and opening the content link close the panel and preserve the player/camera state.

The content URL is `new URL(poi.content, window.location.href)`, producing `/teaching.html` locally and `/MyPage/teaching.html` on GitHub Pages. The four approved mappings remain Hall→teaching, Workshop→making, Archive→gallery, Hero→career.
