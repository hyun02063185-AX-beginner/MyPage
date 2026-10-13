# Phaser/DOM lifecycle review

R5 creates its notice, status, arrival, toggle and marker layer only after the R5 Scene starts. `SHUTDOWN` and `DESTROY` remove all five IDs and clear marker references. The app still contains one `new Phaser.Game`; R4 and default scenes do not mount R5 UI.
