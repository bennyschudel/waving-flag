import m4 from "./m4.js";

import vertexSource from "./main.vert";
import noiseVertexSource from "./noise.vert";
import noiseFragmentSource from "./noise.frag";

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
    waveSpeedD: 0.001,
    waveSpeedMinI: 0.002,
    waveSpeedMaxI: 0.003,

    waveHeight: 0.3,
    waveHeightD: 0.094,
    waveHeightMinI: 0.1,
    waveHeightMaxI: 0.2,

    scale: 0.3,

    ...obj,
  };
};

function WavingFlag(parentEl, config, properties) {
  config = getConfig(config);
  properties = getProperties(properties);

  const { width, height, dpr } = config;
  const { meshRows, meshColumns, lineSpacing, lineWidth } = properties;

  // Canvas
  if (typeof parentEl === "string") {
    parentEl = document.querySelector(parentEl);
  }

  const canvas = document.createElement('canvas');

  canvas.style.width = '100%';
  canvas.style.height = '100%';

  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);

  parentEl.appendChild(canvas);

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

  function createAndSetupTexture(gl) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set up texture so we can render any size
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    return texture;
  }

  // Shaders
  let fragmentSource = `
    precision highp float;
    uniform sampler2D perlinNoiseTexture;
    const float lineSpacing = ${toFloatStr(lineSpacing)};
    const float lineWidth = ${toFloatStr(lineWidth)};
    varying vec2 uv;
    
    void main() {
      float col = 0.5 + 0.5 * sin(uv.x * lineSpacing);
      float alpha = pow(col, lineWidth);
      gl_FragColor = vec4(vec3(0.5 * alpha), alpha);
    }`;

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
  const handles = {};

  const noiseVertexShader = compileShader(noiseVertexSource, gl.VERTEX_SHADER);
  const noiseFragmentShader = compileShader(
    noiseFragmentSource,
    gl.FRAGMENT_SHADER
  );

  const vertexShader = compileShader(vertexSource, gl.VERTEX_SHADER);
  const fragmentShader = compileShader(fragmentSource, gl.FRAGMENT_SHADER);

  // Create shader programs
  const noiseProgram = gl.createProgram();
  gl.attachShader(noiseProgram, noiseVertexShader);
  gl.attachShader(noiseProgram, noiseFragmentShader);
  gl.linkProgram(noiseProgram);
  gl.useProgram(noiseProgram);

  // Set up rectangle covering entire canvas
  const quadVertices = new Float32Array([
    -1.0,
    1.0, // top left
    -1.0,
    -1.0, // bottom left
    1.0,
    1.0, // top right
    1.0,
    -1.0, // bottom right
  ]);

  // Create vertex buffer
  const noiseVertexDataBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, noiseVertexDataBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(quadVertices),
    gl.STATIC_DRAW
  );

  handles.noisePosition = getAttribLocation(noiseProgram, "position");

  // Layout of our data in the vertex buffer
  gl.vertexAttribPointer(handles.noisePosition, 2, gl.FLOAT, false, 2 * 4, 0);
  gl.enableVertexAttribArray(handles.noisePosition);

  handles.noiseScale = gl.getUniformLocation(noiseProgram, "scale");
  handles.noiseResolution = gl.getUniformLocation(noiseProgram, "resolution");

  // Create and bind frame buffer
  const noiseTextureSize = 256;
  const framebuffer = gl.createFramebuffer();
  framebuffer.width = noiseTextureSize;
  framebuffer.height = noiseTextureSize;
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

  // Create texture
  const perlinTexture = createAndSetupTexture(gl);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    framebuffer.width,
    framebuffer.height,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    null
  );

  // Attach texture to frame buffer
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    perlinTexture,
    0
  );

  // Draw noise to framebuffer
  gl.useProgram(noiseProgram);

  gl.uniform1f(handles.noiseScale, 8.0);
  gl.uniform2f(handles.noiseResolution, noiseTextureSize, noiseTextureSize);

  gl.viewport(0, 0, noiseTextureSize, noiseTextureSize);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  // fabric rendering
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.useProgram(program);

  const vertexDataBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexDataBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  handles.position = getAttribLocation(program, "position");
  gl.vertexAttribPointer(handles.position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(handles.position);

  const uvBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);

  handles.uv = getAttribLocation(program, "vertexCoordinate");
  gl.vertexAttribPointer(handles.uv, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(handles.uv);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  );

  handles.time = getUniformLocation(program, "time");
  handles.scale = getUniformLocation(program, "scale");
  handles.projectionMatrix = getUniformLocation(program, "projectionMatrix");
  handles.viewMatrix = getUniformLocation(program, "viewMatrix");
  handles.modelMatrix = getUniformLocation(program, "modelMatrix");
  handles.noiseTexture = getUniformLocation(program, "noiseTexture");
  handles.waveHeight = getUniformLocation(program, "waveHeight");
  handles.waveSpeed = getUniformLocation(program, "waveSpeed");

  gl.useProgram(program);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, perlinTexture);
  gl.uniform1i(handles.noiseTexture, 0);
  gl.uniformMatrix4fv(handles.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(handles.viewMatrix, false, viewMatrix);
  gl.uniformMatrix4fv(handles.modelMatrix, false, getModelMatrix());

  // Draw
  let time = 0.0;
  let frame = 0;
  let lastFrame = Date.now();
  let thisFrame;

  function draw() {
    const { framesToFade, waveSpeed, waveHeight, scale } = properties;

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
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(handles.noiseTexture, 0);
    gl.bindTexture(gl.TEXTURE_2D, perlinTexture);

    gl.uniform1f(handles.time, time);
    gl.uniform1f(handles.scale, scale);
    gl.uniform1f(handles.waveSpeed, waveSpeed);
    gl.uniform1f(handles.waveHeight, waveHeight);

    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.DEPTH_TEST);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, elementCount, gl.UNSIGNED_SHORT, 0);
  }

  // public api

  this.draw = draw;

  this.toggleInteraction = (on) => (on ? bindListeners() : unbindListeners());

  this.destroy = () => {
    unbindListeners();
  }
}

export default WavingFlag;
