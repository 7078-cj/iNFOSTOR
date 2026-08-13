// Shared collision utilities (AABB = axis-aligned bounding box)

export function getRect(entity) {
    return {
        left: entity.x,
        right: entity.x + entity.w,
        top: entity.y,
        bottom: entity.y + entity.h,
    };
}

export function overlaps(a, b) {
    const ra = getRect(a);
    const rb = getRect(b);
    return ra.left < rb.right && ra.right > rb.left && ra.top < rb.bottom && ra.bottom > rb.top;
}

// Pushes `mover` out of `blocker` along the axis of smallest overlap.
export function resolveCollision(mover, blocker) {
    const rm = getRect(mover);
    const rb = getRect(blocker);

    const overlapX = Math.min(rm.right, rb.right) - Math.max(rm.left, rb.left);
    const overlapY = Math.min(rm.bottom, rb.bottom) - Math.max(rm.top, rb.top);

    if (overlapX <= 0 || overlapY <= 0) return mover;

    const next = { ...mover };
    if (overlapX < overlapY) {
        next.x += rm.left < rb.left ? -overlapX : overlapX;
    } else {
        next.y += rm.top < rb.top ? -overlapY : overlapY;
    }
    return next;
}

export function distanceBetweenCenters(a, b) {
    const ax = a.x + a.w / 2;
    const ay = a.y + a.h / 2;
    const bx = b.x + b.w / 2;
    const by = b.y + b.h / 2;
    return Math.hypot(ax - bx, ay - by);
}