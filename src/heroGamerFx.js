// Tema gamer da hero (teste visual): enquanto o PC gamer está na tela, a hero assume os roxos da
// área gamer e aparecem arcos elétricos curtos. As cores ficam em styles.css ("Tema gamer da hero");
// aqui ficam frequência, tamanho e intensidade dos raios. Para desligar o teste, HERO_GAMER_THEME = false.

export const HERO_GAMER_THEME = true;

export const FX = {
  // Raios no fundo, atrás do gabinete e nas bordas (nunca sobre o título e a descrição)
  background: {
    // every: intervalo entre aparições (ms); pair: chance de dois arcos juntos
    desktop: { every: [1100, 2400], length: [150, 300], branches: [1, 3], width: 1.6, pair: 0.3 },
    mobile: { every: [2200, 3800], length: [80, 150], branches: [0, 1], width: 1.2, pair: 0 },
    life: 520, // duração de cada aparição, em ms
  },
  // Arcos no contorno do acesso "Área gamer" da hero
  link: {
    every: [1300, 2800],
    life: 420,
    pulseArcs: 3, // arcos do pulso de entrada, quando o PC gamer aparece
  },
  colors: {
    core: "#f5ecff", // miolo do raio
    stroke: "#d8b4fe", // lilás luminoso
    glow: "rgba(168, 85, 247, 0.85)", // brilho roxo em volta
  },
};

const rand = (min, max) => min + Math.random() * (max - min);
export const between = ([min, max]) => rand(min, max);

// Linha quebrada entre dois pontos, por deslocamento do ponto médio.
function jag(x1, y1, x2, y2, roughness, depth) {
  let points = [[x1, y1], [x2, y2]];
  let offset = Math.hypot(x2 - x1, y2 - y1) * roughness;
  for (let d = 0; d < depth; d++) {
    const next = [points[0]];
    for (let i = 0; i < points.length - 1; i++) {
      const [ax, ay] = points[i];
      const [bx, by] = points[i + 1];
      const len = Math.hypot(bx - ax, by - ay) || 1;
      const shift = rand(-offset, offset);
      next.push([(ax + bx) / 2 + (-(by - ay) / len) * shift, (ay + by) / 2 + ((bx - ax) / len) * shift], points[i + 1]);
    }
    points = next;
    offset /= 2;
  }
  return points;
}

const toPath = (points) =>
  points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("");

// Raio com ramificações finas. Devolve { main, branches } em caminhos SVG.
export function bolt(x1, y1, x2, y2, branchCount = 2) {
  const main = jag(x1, y1, x2, y2, 0.22, 6);
  const branches = [];
  for (let b = 0; b < branchCount; b++) {
    const from = main[Math.floor(rand(0.25, 0.8) * main.length)];
    const angle = Math.atan2(y2 - y1, x2 - x1) + rand(0.45, 1.1) * (Math.random() < 0.5 ? -1 : 1);
    const len = Math.hypot(x2 - x1, y2 - y1) * rand(0.2, 0.4);
    branches.push(toPath(jag(from[0], from[1], from[0] + Math.cos(angle) * len, from[1] + Math.sin(angle) * len, 0.28, 4)));
  }
  return { main: toPath(main), branches };
}

// Trecho do contorno de um retângulo arredondado, com tremor elétrico, para o acesso "Área gamer".
export function contourArc(w, h, r) {
  const perimeter = 2 * (w + h);
  const start = rand(0, perimeter);
  const span = rand(0.14, 0.26) * perimeter;
  const at = (s) => {
    s = ((s % perimeter) + perimeter) % perimeter;
    if (s < w) return [s, 0];
    if (s < w + h) return [w, s - w];
    if (s < 2 * w + h) return [w - (s - w - h), h];
    return [0, h - (s - 2 * w - h)];
  };
  const steps = 14;
  const points = [];
  for (let i = 0; i <= steps; i++) {
    let [x, y] = at(start + (span * i) / steps);
    // aproxima os cantos do arredondamento do contorno
    x = Math.min(w - r * 0.3, Math.max(r * 0.3, x));
    y = Math.min(h, Math.max(0, y));
    const jitter = i === 0 || i === steps ? 0 : rand(-2.6, 2.6);
    points.push([x + jitter, y + jitter]);
  }
  // uma faísca curta saindo do contorno
  const tip = points[Math.floor(rand(4, steps - 4))];
  const out = [tip[0] < w / 2 ? -1 : 1, tip[1] < h / 2 ? -1 : 1];
  const spark = jag(tip[0], tip[1], tip[0] + out[0] * rand(6, 14), tip[1] + out[1] * rand(5, 11), 0.35, 3);
  return { main: toPath(points), branches: [toPath(spark)] };
}

// Desenha um raio num <svg> e o faz piscar e sumir (Web Animations: não deixa animação CSS presa).
export function flash(svg, { main, branches }, { width = 1.4, life = 480, reduce = 1 } = {}) {
  const ns = "http://www.w3.org/2000/svg";
  const g = document.createElementNS(ns, "g");
  const add = (d, w, color, opacity) => {
    const p = document.createElementNS(ns, "path");
    p.setAttribute("d", d);
    p.setAttribute("fill", "none");
    p.setAttribute("stroke", color);
    p.setAttribute("stroke-width", w);
    p.setAttribute("stroke-linecap", "round");
    p.setAttribute("stroke-linejoin", "round");
    p.setAttribute("opacity", opacity);
    g.appendChild(p);
  };
  for (const d of branches) add(d, width * 0.55, FX.colors.stroke, 0.75 * reduce);
  add(main, width * 2.6, FX.colors.stroke, 0.35 * reduce);
  add(main, width, FX.colors.core, 1 * reduce);
  svg.appendChild(g);
  const anim = g.animate(
    [{ opacity: 0 }, { opacity: 1, offset: 0.08 }, { opacity: 0.35, offset: 0.22 }, { opacity: 0.95, offset: 0.34 }, { opacity: 0.6, offset: 0.6 }, { opacity: 0 }],
    { duration: life, easing: "ease-out" },
  );
  const done = () => g.remove();
  anim.onfinish = done;
  anim.oncancel = done;
  return anim;
}
