import {lerp} from './math';

/**
 * The arch window. Every hero opens on a photograph framed as an arched
 * window — the round-topped shape of the logo badge stretched upright — and
 * scrolling pushes the camera through it until the photo fills the screen.
 *
 * The frame is one full-screen layer clipped with `inset() round …`, so the
 * photo behind it never moves or rescales to fit the window: only the clip
 * opens. `t` is 0 (arch) → 1 (full bleed).
 */
export type Arch = {left: number; top: number; width: number; height: number};

export function archClip(vw: number, vh: number, a: Arch, t: number) {
  const top = lerp(a.top, 0, t);
  const left = lerp(a.left, 0, t);
  const right = lerp(vw - a.left - a.width, 0, t);
  const bottom = lerp(vh - a.top - a.height, 0, t);
  const crown = lerp(a.width / 2, 0, t);
  const foot = lerp(18, 0, t);
  return `inset(${top}px ${right}px ${bottom}px ${left}px round ${crown}px ${crown}px ${foot}px ${foot}px)`;
}
