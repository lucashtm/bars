// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default. It means "medium precision"
precision mediump float;
 
uniform vec2 u_resolution;
uniform float percentage;
const float padding = 4.0;
void main() {
  float fullWidth = u_resolution.x - padding * 2.0;
  if (gl_FragCoord.x < (fullWidth * percentage) + padding && gl_FragCoord.x > padding && gl_FragCoord.y > padding && gl_FragCoord.y < u_resolution.y - padding) {
    gl_FragColor = vec4(1, 0, 0.5, 1); // return bar color
  } else {
    gl_FragColor = vec4(0, 0, 0, 1); // return background
  }
}
