import m4 from "./m4.js";

import noiseImage from "./noise.png";
import vertexSource from "./main.vert";

export const getConfig = function (obj) {
  return {
    width: 1440,
    height: 900,
    dpr: window.devicePixelRatio,

    ...obj,
  };
};

export const getProperties = function (obj) {
  return {
    cameraPitch: 0.16,
    cameraYaw: 1.26,
    cameraDist: 1.79,

    scaleZ: 2.0,
    translateZ: -0.09,

    meshRows: 128,
    meshColumns: 256,

    framesToFade: 15.0,

    lineSpacing: 200.0,
    lineWidth: 55.0,

    waveSpeed: 0.2,
    waveSpeedD: 0.008,
    waveSpeedMinI: 0.013,
    waveSpeedMaxI: 0.021,

    waveHeight: 0.16,
    waveHeightD: 0.094,
    waveHeightMinI: 0.126,
    waveHeightMaxI: 0.178,

    ...obj,
  };
};

function WavingFlag(canvas, config, properties) {
  config = getConfig(config);
  properties = getProperties(properties);

  const { width, height, dpr } = config;
  const { meshRows, meshColumns, lineSpacing, lineWidth } = properties;

  // Canvas
  if (typeof(canvas) === 'string') {
    canvas = document.querySelector(canvas);
  }

  if (!(canvas instanceof HTMLCanvasElement)) {
    console.error("Could not find a suitable canvas element.");
  }

  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);

  let gl = canvas.getContext("webgl", { antialias: true });

  if (!gl) {
    console.error("Unable to initialize WebGL.");
  }

  // Pointer
  let pointerOn = false;
  let pointerPosition = { x: 0.5, y: 0.5 };

  // Camera
  let cameraPosition = { x: 1, y: 0, z: 1 };

  let projectionMatrix;
  let viewMatrix;

  function normalize(v) {
    let length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

    return { x: v.x / length, y: v.y / length, z: v.z / length };
  }

  function getCameraPosition() {
    const { cameraDist: dist } = properties;

    return [
      dist * cameraPosition.x,
      dist * cameraPosition.y,
      dist * cameraPosition.z,
    ];
  }

  function updateCameraPosition() {
    const { cameraYaw: yaw, cameraPitch } = properties;

    const pitch = (properties.cameraPitch = Math.max(
      -Math.PI / 2.0,
      Math.min(Math.PI / 2.0, cameraPitch)
    ));

    cameraPosition.x = Math.sin(yaw);
    cameraPosition.z = Math.cos(yaw);
    cameraPosition.y = -Math.sin(pitch);

    cameraPosition = normalize(cameraPosition);
  }

  function setupCamera() {
    const fieldOfView = (45 * Math.PI) / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;

    projectionMatrix = m4.perspective(fieldOfView, aspect, zNear, zFar);

    const cameraTarget = [0, 0, 0];
    const up = [0, 1, 0];

    const cameraMatrix = m4.lookAt(getCameraPosition(), cameraTarget, up);

    viewMatrix = m4.inverse(cameraMatrix);
  }

  updateCameraPosition();
  setupCamera();

  // Geometry
  const vertices = [];
  const uv = [];

  const elementCount = 2 * 3 * (meshColumns - 1) * (meshRows - 1);

  for (let j = 0; j < meshRows; j++) {
    for (let i = 0; i < meshColumns; i++) {
      vertices.push(i / meshColumns - 0.5, 0.0, j / meshRows - 0.5);
      uv.push(i / meshColumns, j / meshRows);
    }
  }

  let indices = [];
  for (let y = 0; y < meshRows - 1; y++) {
    for (let x = 0; x < meshColumns - 1; x++) {
      indices.push(
        x + y * meshColumns,
        x + y * meshColumns + 1,
        x + (1 + y) * meshColumns
      );
      indices.push(
        x + y * meshColumns + 1,
        x + (y + 1) * meshColumns + 1,
        x + (1 + y) * meshColumns
      );
    }
  }

  // Model
  function getModelMatrix() {
    const { scaleZ, translateZ } = properties;

    let modelMatrix = m4.create();

    modelMatrix = m4.zRotate(modelMatrix, Math.PI / 2.0);
    modelMatrix = m4.scale(modelMatrix, 1.0, 1.0, scaleZ);
    modelMatrix = m4.translate(modelMatrix, 0.0, 0.0, translateZ);

    return modelMatrix;
  }

  // Texture
  function toFloatStr(value) {
    let str = String(value);
    if (!str.includes(".")) {
      str += ".0";
    }

    return str;
  }

  function loadTexture(gl, texture, url) {
    gl.bindTexture(gl.TEXTURE_2D, texture);

    const internalFormat = gl.RGBA;
    const width_ = 1;
    const height_ = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([255, 0, 0, 255]); // opaque blue
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      internalFormat,
      width_,
      height_,
      border,
      srcFormat,
      srcType,
      pixel
    );

    const image = new Image();
    image.onload = function () {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        internalFormat,
        srcFormat,
        srcType,
        image
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    };
    image.crossOrigin = "";
    image.src = url;

    return texture;
  }

  // Shaders
  let fragmentSource = `
    precision highp float;
    const float lineSpacing = ${toFloatStr(lineSpacing)};
    const float lineWidth = ${toFloatStr(lineWidth)};
    varying vec2 uv;
    
    void main() {
      float col = 0.5 + 0.5 * sin(uv.x * lineSpacing);
      gl_FragColor = vec4(vec3(0.5 * pow(col, lineWidth)), 1.0);
    }
    `;

  function compileShader(shaderSource, shaderType) {
    let shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw `Shader compile failed with: ${gl.getShaderInfoLog(shader)}`;
    }

    return shader;
  }

  function getAttribLocation(program, name) {
    let attributeLocation = gl.getAttribLocation(program, name);
    if (attributeLocation === -1) {
      throw `Cannot find attribute ${name}`;
    }

    return attributeLocation;
  }

  function getUniformLocation(program, name) {
    let uniformLocation = gl.getUniformLocation(program, name);
    if (uniformLocation === -1) {
      throw `Cannot find uniform ${name}`;
    }

    return uniformLocation;
  }

  // Interaction
  function mix(x, y, a) {
    return x * (1.0 - a) + y * a;
  }

  function fadeIn(f) {
    const {
      waveSpeedD,
      waveSpeedMinI,
      waveSpeedMaxI,
      waveHeightD,
      waveHeightMinI,
      waveHeightMaxI,
    } = properties;

    properties.waveSpeed = mix(
      waveSpeedD,
      mix(waveSpeedMinI, waveSpeedMaxI, pointerPosition.x),
      f
    );
    properties.waveHeight = mix(
      waveHeightD,
      mix(waveHeightMinI, waveHeightMaxI, pointerPosition.y),
      f
    );
  }

  function pointerMove(evt) {
    let x = evt.clientX;
    let y = evt.clientY;

    if (evt instanceof TouchEvent) {
      x = evt.changedTouches[0].pageX;
      y = evt.changedTouches[0].pageY;
    }

    pointerOn = true;

    const rect = canvas.getBoundingClientRect();

    pointerPosition.x = (x - rect.left) / rect.width;
    pointerPosition.y = (y - rect.top) / rect.height;
  }

  function pointerLeave() {
    pointerOn = false;
  }

  function pointerEnter() {
    pointerOn = true;
  }

  function toggleListeners(remove = false) {
    const fn = canvas[remove ? "removeEventListener" : "addEventListener"].bind(
      canvas
    );

    fn("mouseenter", pointerEnter);
    fn("mousemove", pointerMove);
    fn("mouseleave", pointerLeave);

    fn("touchstart", pointerEnter, { passive: true });
    fn("touchmove", pointerMove, { passive: true });
    fn("touchend", pointerLeave, { passive: true });
  }

  const bindListeners = () => toggleListeners(false);
  const unbindListeners = () => toggleListeners(true);

  unbindListeners();
  bindListeners();

  // Shader
  const vertexShader = compileShader(vertexSource, gl.VERTEX_SHADER);
  const fragmentShader = compileShader(fragmentSource, gl.FRAGMENT_SHADER);

  let program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const vertexDataBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexDataBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  const positionHandle = getAttribLocation(program, "position");
  gl.vertexAttribPointer(positionHandle, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionHandle);

  const uvBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);

  const uvHandle = getAttribLocation(program, "vertexCoordinate");
  gl.vertexAttribPointer(uvHandle, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(uvHandle);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  );

  const handles = {};
  [
    "time",
    "projectionMatrix",
    "viewMatrix",
    "modelMatrix",
    "noiseTexture",
    "waveHeight",
    "waveSpeed",
  ].forEach((name) => {
    handles[name] = getUniformLocation(program, name);
  });

  gl.useProgram(program);
  gl.uniform1i(handles.noiseTexture, 0);
  gl.uniformMatrix4fv(handles.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(handles.viewMatrix, false, viewMatrix);
  gl.uniformMatrix4fv(handles.modelMatrix, false, getModelMatrix());

  gl.activeTexture(gl.TEXTURE0);
  loadTexture(gl, gl.createTexture(), noiseImage);

  // Draw
  let time = 0.0;
  let frame = 0;
  let lastFrame = Date.now();
  let thisFrame;

  function draw() {
    const { framesToFade, waveSpeed, waveHeight } = properties;

    if (pointerOn) {
      frame = Math.min(framesToFade, frame + 1.0);
    } else {
      frame = Math.max(0, frame - 1.0);
    }

    fadeIn(frame / framesToFade);

    thisFrame = Date.now();
    time += (25.0 * waveSpeed * (thisFrame - lastFrame)) / 1000;
    lastFrame = thisFrame;

    gl.useProgram(program);

    gl.uniform1f(handles.time, time);
    gl.uniform1f(handles.waveSpeed, waveSpeed);
    gl.uniform1f(handles.waveHeight, waveHeight);

    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, elementCount, gl.UNSIGNED_SHORT, 0);
  }

  // public api

  this.draw = draw;
  
  this.toggleInteraction = (on) => (on ? bindListeners() : unbindListeners());
}

export default WavingFlag;
