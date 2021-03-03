import WavingFlag from "./main.js";

const desktopViz = new WavingFlag('#desktopViz', {
  dpr: 2,
}, {
  lineSpacing: 200.0,
  lineWidth: 55.0,

  meshRows: 128,
  meshColumns: 256,
});

const mobileViz = new WavingFlag('#mobileViz', {
  dpr: 1,
}, {
  lineSpacing: 100.0,
  lineWidth: 25.0,

  meshRows: 64,
  meshColumns: 128,
});

function onAnimationFrame() {
  desktopViz.draw();
  // mobileViz.draw();

  requestAnimationFrame(onAnimationFrame);
}

requestAnimationFrame(onAnimationFrame);
