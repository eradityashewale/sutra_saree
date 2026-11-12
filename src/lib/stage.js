// Tiny shared state between the DOM (scroll, pointer) and the WebGL scene.
// Plain mutable object on purpose: the render loop reads it every frame
// without causing React re-renders.
export const stage = {
  index: -1, // -1 = hero, 0..4 = active collection
  pointer: { x: 0, y: 0 }, // -1..1
}
