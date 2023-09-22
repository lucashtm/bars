<script>
  import { onMount } from "svelte";
  import vertexShaderSource from "./../shaders/bar_vertex.glsl?raw";
  import fragmentShaderSource from "./../shaders/bar_fragment.glsl?raw";

  export let id;
  let percentage = 1.0;
  let max = 100;
  let current = 100;

  let canvas;
  let gl;

  function resizeCanvasToDisplaySize(canvas) {
    // Lookup the size the browser is displaying the canvas in CSS pixels.
    const displayWidth  = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    // Check if the canvas is not the same size.
    const needResize = canvas.width  !== displayWidth ||
      canvas.height !== displayHeight;

    if (needResize) {
      // Make the canvas the same size
      canvas.width  = displayWidth;
      canvas.height = displayHeight;
    }

    return needResize;
  }

  function createShader(gl, type, source) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }

    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }

  function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }

    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }

  onMount(render);
  function render() {
    percentage = current/max;
    canvas = document.getElementById("canvas-"+id);
    resizeCanvasToDisplaySize(canvas);
    gl = canvas.getContext("webgl");
    if (!gl) {
      console.error("Unable to initialize WebGL. Your browser or machine may not support it.");
      return;
    }

    let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    let program = createProgram(gl, vertexShader, fragmentShader);

    let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    var percentageUniformLocation = gl.getUniformLocation(program, "percentage");

    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    let positions = [
      -1, -1,
      -1, 1,
      1, -1,
      1, -1,
      -1, 1,
      1, 1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    gl.uniform1f(percentageUniformLocation, percentage);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(
      positionAttributeLocation,
      2,
      gl.FLOAT,
      false,
      0,
      0
    );
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };
</script>

<style>
  canvas {
    width: 400px;
    height: 50px;
  }

  #values {
    display: inline-block;
    position: absolute;
    top: 16px;
    left: 0;
    width: 100%;
    text-align: center;
    color: black;
    font-size: 18px;
    font-weight: bold;
  }

  #container {
    position: relative;
    top: 0;
    left: 0;
  }
</style>
<div id="container">
  <canvas id="canvas-{id}"></canvas>
  <span id="values">{current}/{max}</span>
</div>
<form>
  <input type="number" min="0" bind:value={max} on:change={render}>
  <input type="number" min="0" max="{max}" bind:value={current} on:change={render}>
</form>
