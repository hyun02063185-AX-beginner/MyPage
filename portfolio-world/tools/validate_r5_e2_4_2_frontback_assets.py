"""Machine-check the E2.4.2 Front/Back common-body gait asset contract."""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
ASSET = ROOT / "public/assets/r5-hybrid/pilot-player"


def examine(name: str, frames: int) -> dict:
    image = Image.open(ASSET / name).convert("RGBA")
    alpha = np.asarray(image)[:, :, 3]
    items = []
    for index in range(frames):
        piece = alpha[:, index * 28:(index + 1) * 28]
        ys, xs = np.where(piece > 12)
        items.append({"bounds": [int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1], "hash": hashlib.sha256(piece.tobytes()).hexdigest()})
    return {"size": list(image.size), "frames": items}


def main() -> None:
    front, back, side = examine("walk-front-v3.png", 8), examine("walk-back-v3.png", 8), examine("walk-side-v2.png", 8)
    idle_front, idle_back = examine("idle-front-v3.png", 1), examine("idle-back-v3.png", 1)
    def valid(row: dict) -> bool:
        values = row["frames"]
        return row["size"] == [224, 56] and all(frame["bounds"][1] == 3 and frame["bounds"][3] == 55 and frame["bounds"][3] - frame["bounds"][1] == 52 for frame in values) and len({frame["hash"] for frame in values}) == 8
    result = {
        "front": front, "back": back, "side": side,
        "idleFrontMatchesPassing": idle_front["frames"][0]["hash"] == front["frames"][3]["hash"],
        "idleBackMatchesPassing": idle_back["frames"][0]["hash"] == back["frames"][3]["hash"],
        "frontBackValid": valid(front) and valid(back),
        "sideReferenceIntact": side["size"] == [224, 56],
        "bodyWidths": {"front": [frame["bounds"][2] - frame["bounds"][0] for frame in front["frames"]], "back": [frame["bounds"][2] - frame["bounds"][0] for frame in back["frames"]], "side": [frame["bounds"][2] - frame["bounds"][0] for frame in side["frames"]]},
    }
    result["allPass"] = result["frontBackValid"] and result["idleFrontMatchesPassing"] and result["idleBackMatchesPassing"] and min(result["bodyWidths"]["front"]) >= 22 and min(result["bodyWidths"]["back"]) >= 22
    print(json.dumps(result))


if __name__ == "__main__":
    main()
