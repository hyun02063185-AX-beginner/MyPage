# Mobile and accessibility review

The panel is a labelled modal dialog with keyboard-focused content link, close and continue buttons, Esc handling, and a constrained scrollable max height. At 450px the panel uses top alignment, remains within the game root, and the existing bottom controls use their E2.2 two-column grid. DOM buttons provide mouse, touch, and Tab focus; the panel stops pointer propagation before any canvas ground handler.

This is browser emulation, not Android hardware validation. Real-device touch target and browser-tab behavior remain human/device QA items.
