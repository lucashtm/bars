// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default. It means "medium precision"
precision mediump float;
 
uniform vec2 u_resolution;
uniform float percentage;
const float padding = 4.0;
const vec4 barColor = vec4(1, 0, 0.5, 1);
const vec4 frameColor = vec4(0, 0, 0, 1);
void main() {
  float fullWidth = u_resolution.x - padding * 2.0;
  if (gl_FragCoord.x < (fullWidth * percentage) + padding && gl_FragCoord.x > padding && gl_FragCoord.y > padding && gl_FragCoord.y < u_resolution.y - padding) {
    gl_FragColor = barColor;
  } else {
    gl_FragColor = frameColor;
  }

  float radius = u_resolution.y / 2.0;
  vec2 center1 = vec2(radius, radius);
  vec2 center2 = vec2((u_resolution.x - radius), radius);
  if (gl_FragCoord.x < radius || gl_FragCoord.x > u_resolution.x - radius) { // If we are in the outer half of the circles (left or right)
    if (distance(gl_FragCoord.xy, center1) < radius - padding || distance(gl_FragCoord.xy, center2) < radius - padding) {
      // Do nothing
    } else if(distance(gl_FragCoord.xy, center1) < radius || distance(gl_FragCoord.xy, center2) < radius){
      gl_FragColor = frameColor;
    } else {
      gl_FragColor = vec4(0, 0, 0, 0); // return bar color
    }
  }
}
