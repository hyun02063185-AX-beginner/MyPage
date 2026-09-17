export type MovementInput = Readonly<{
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
}>;

export type MovementVector = Readonly<{
  x: number;
  y: number;
}>;

/**
 * Resolves opposing keys before normalizing so cardinal and diagonal movement
 * have the same total magnitude.
 */
export function getMovementDirection(input: MovementInput): MovementVector {
  const horizontal = Number(input.right) - Number(input.left);
  const vertical = Number(input.down) - Number(input.up);
  const magnitude = Math.hypot(horizontal, vertical);

  if (magnitude === 0) {
    return { x: 0, y: 0 };
  }

  return { x: horizontal / magnitude, y: vertical / magnitude };
}

/** Returns a frame-rate-independent movement delta in world pixels. */
export function getMovementDelta(
  input: MovementInput,
  speed: number,
  deltaMs: number,
): MovementVector {
  const direction = getMovementDirection(input);
  const distance = speed * (deltaMs / 1000);

  return {
    x: direction.x * distance,
    y: direction.y * distance,
  };
}
