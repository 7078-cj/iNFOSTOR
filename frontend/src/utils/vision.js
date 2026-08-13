// Vision cone utilities for limited line-of-sight gameplay.

export const VISION = {
    investigator: {
        range: 480,
        halfAngleDeg: 70,
    },
    imposter: {
        range: 580,
        halfAngleDeg: 80,
    },
};

export function getVisionConfig(isImposter) {
    return isImposter ? VISION.imposter : VISION.investigator;
}

export function getHalfAngleRad(config) {
    return (config.halfAngleDeg * Math.PI) / 180;
}

/**
 * Derive facing angle from movement delta.
 * Defaults to facing down (π/2) when stationary.
 */
export function getFacingFromDelta(dx, dy, currentFacing = Math.PI / 2) {
    if (dx === 0 && dy === 0) {
        return currentFacing;
    }
    return Math.atan2(dy, dx);
}

function normalizeAngle(angle) {
    let a = angle;
    while (a > Math.PI) a -= 2 * Math.PI;
    while (a < -Math.PI) a += 2 * Math.PI;
    return a;
}

/**
 * Returns true when a world-space point lies inside the viewer's forward cone.
 */
export function isInVisionCone(
    viewerX,
    viewerY,
    facing,
    targetX,
    targetY,
    config
) {
    const dx = targetX - viewerX;
    const dy = targetY - viewerY;
    const dist = Math.hypot(dx, dy);

    if (dist <= 1) {
        return true;
    }

    if (dist > config.range) {
        return false;
    }

    const angleToTarget = Math.atan2(dy, dx);
    const diff = Math.abs(normalizeAngle(angleToTarget - facing));
    const halfAngle = getHalfAngleRad(config);

    return diff <= halfAngle;
}

/**
 * Build an SVG polygon (screen-space) describing the lit vision cone.
 * The local player is always centered on screen, so the cone originates
 * from the viewport center.
 */
export function buildConePolygon(
    screenCenterX,
    screenCenterY,
    facing,
    config,
    segments = 24
) {
    const halfAngle = getHalfAngleRad(config);
    const range = config.range;
    const points = [`${screenCenterX},${screenCenterY}`];

    for (let i = 0; i <= segments; i += 1) {
        const t = i / segments;
        const angle = facing - halfAngle + t * halfAngle * 2;
        const x = screenCenterX + Math.cos(angle) * range;
        const y = screenCenterY + Math.sin(angle) * range;
        points.push(`${x},${y}`);
    }

    return points.join(" ");
}
