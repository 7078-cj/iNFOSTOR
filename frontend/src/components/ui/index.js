/*
|--------------------------------------------------------------------------
| UI primitives
|--------------------------------------------------------------------------
| Shared shells that encode the design system's rules — elevation, radius,
| component states, focus treatment — so screens compose them instead of
| restating utility strings. If a screen needs a one-off style, that is a
| signal the primitive is missing a variant, not a licence to inline it.
*/

export { default as Button } from "./Button";
export { default as Input } from "./Input";
export { default as Card, CardLabel } from "./Card";
export { default as Modal } from "./Modal";
export { default as VerdictBadge } from "./VerdictBadge";
export { default as RoleBadge } from "./RoleBadge";
export { default as PhaseRail } from "./PhaseRail";
