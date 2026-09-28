import { useEffect, useRef } from "react";

// Fundo em gradiente animado (WebGL + ruído simplex), adaptado do componente Auralis.
// Pausa fora da tela, fica em um quadro estático com redução de movimento
// e, sem WebGL, mostra o degradê de fundo definido no CSS (.gradient-band).

const vertexShader = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

// Shader do Auralis (ondas de luz sobre ruído simplex), adaptado para 4 cores e fundo claro:
// base colorida em vez de quase preto, cada cor da paleta numa camada e vinheta suave.
const fragmentShader = `
precision highp float;
varying vec2 vUv;

uniform vec2  u_resolution;
uniform float u_time;
uniform float u_grain;
uniform vec3  u_colors[4];
uniform vec3  u_bg;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = vUv;
  float ratio = u_resolution.x / u_resolution.y;
  vec2 p = uv * vec2(ratio, 1.0);
  float t = u_time * 0.2;

  float n1 = snoise(p * 0.5 + t);
  float n2 = snoise(p * 0.9 - t * 0.5 + n1);
  float n3 = snoise(p * 0.7 + vec2(t * 0.3, -t * 0.2) + n2 * 0.5);

  float light = pow(abs(n2), 2.0) * 0.9;

  vec3 col = u_bg;
  col += u_colors[0] * smoothstep(-0.4, 1.0, n1) * 0.75;
  col += u_colors[1] * light;
  col += u_colors[2] * smoothstep(0.2, 1.0, n3) * 0.45;
  col += u_colors[3] * smoothstep(0.35, 1.0, n1 * n2 + 0.3) * 0.35;

  float grain = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453 + u_time);
  col += (grain - 0.5) * u_grain * 0.25;

  float dist = length(uv - 0.5);
  col *= mix(0.72, 1.0, smoothstep(1.0, 0.25, dist));

  gl_FragColor = vec4(col, 1.0);
}
`;

const hexToRgb = (hex) => {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
};

export default function GradientBand({
  // Paleta "Vice City": Ocean Night de base; Neon Purple, Sunset Pink, Vice Cyan e Miami Peach.
  bg = "#2a1d63",
  colors = ["#bc6cff", "#ff5ca8", "#00f0ff", "#ffb86b"],
  speed = 1,
  grain = 0.4,
  className = "",
  children,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const colorKey = colors.join(",");

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const gl = canvas?.getContext("webgl");
    if (!gl) return;

    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexShader));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentShader));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const pos = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const loc = (name) => gl.getUniformLocation(program, name);
    gl.uniform1f(loc("u_grain"), grain);
    gl.uniform3f(loc("u_bg"), ...hexToRgb(bg));
    gl.uniform3fv(
      loc("u_colors"),
      new Float32Array(colorKey.split(",").slice(0, 4).flatMap(hexToRgb)),
    );
    const uRes = loc("u_resolution");
    const uTime = loc("u_time");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let visible = false;
    const start = performance.now();

    const draw = (now) => {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      // Com redução de movimento, um quadro fixo em um ponto bonito da animação.
      gl.uniform1f(uTime, reduce.matches ? 12 : ((now - start) / 1000) * speed + 12);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    const loop = (now) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    const sync = () => {
      cancelAnimationFrame(raf);
      if (visible && !reduce.matches) raf = requestAnimationFrame(loop);
      else draw(performance.now());
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(container.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(container.clientHeight * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      draw(performance.now());
    };
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    io.observe(container);
    reduce.addEventListener("change", sync);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      reduce.removeEventListener("change", sync);
    };
  }, [bg, colorKey, speed, grain]);

  return (
    <div ref={containerRef} className={`gradient-band ${className}`}>
      <canvas ref={canvasRef} className="gradient-band-canvas" aria-hidden="true" />
      <div className="gradient-band-content">{children}</div>
    </div>
  );
}
