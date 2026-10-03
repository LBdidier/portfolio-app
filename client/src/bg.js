// Animated background: network nodes, cloud hubs, data packets and floating code.
export default function startBg(canvas) {
  const ctx = canvas.getContext("2d");
  const cs = getComputedStyle(document.documentElement);
  const G = cs.getPropertyValue("--accent").trim() || "#0a9462";
  const B = cs.getPropertyValue("--blue").trim() || "#1d6fd1";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const WORDS = ["{ }", "</>", "01", "git", "k8s", "az", "sudo", "docker", "terraform", "$_", "=>", "API", "SQL", "VM", "AKS", "VNet", "ssh", "CI/CD", "10.0.0.1", "yaml"];
  const D = 160;
  const rnd = (a, b) => a + Math.random() * (b - a);
  let w, h, nodes = [], tokens = [], packets = [], raf, timer;

  function size() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(70, Math.max(24, (w * h) / 22000)));
    nodes = Array.from({ length: n }, (_, i) => ({ x: rnd(0, w), y: rnd(0, h), vx: rnd(-0.25, 0.25), vy: rnd(-0.25, 0.25), cloud: i < 6 }));
    tokens = Array.from({ length: Math.max(8, Math.round(w / 70)) }, () => ({ t: WORDS[(Math.random() * WORDS.length) | 0], x: rnd(0, w), y: rnd(0, h), v: rnd(0.15, 0.5), s: rnd(11, 16) }));
    packets = [];
    if (reduce) frame();
  }

  const blob = (x, y, r) => { ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); };
  function cloud(x, y, s) {
    ctx.fillStyle = B; ctx.globalAlpha = 0.26;
    blob(x - s * 0.5, y + s * 0.1, s * 0.35); blob(x, y - s * 0.15, s * 0.45); blob(x + s * 0.55, y + s * 0.1, s * 0.32);
    ctx.fillRect(x - s * 0.5, y + s * 0.1, s * 1.05, s * 0.32);
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = B;
    for (const t of tokens) {
      if (!reduce) { t.y -= t.v; if (t.y < -20) { t.y = h + 20; t.x = rnd(0, w); } }
      ctx.globalAlpha = 0.24; ctx.font = `${t.s}px "JetBrains Mono", monospace`; ctx.fillText(t.t, t.x, t.y);
    }
    for (const n of nodes) {
      if (!reduce) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
    }
    const links = [];
    ctx.strokeStyle = G;
    for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < D) {
        links.push([a, b]);
        ctx.globalAlpha = (1 - d / D) * 0.42; ctx.lineWidth = a.cloud || b.cloud ? 1.6 : 0.8;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }
    if (!reduce && links.length && packets.length < 14 && Math.random() < 0.05) {
      const l = links[(Math.random() * links.length) | 0];
      packets.push({ a: l[0], b: l[1], p: 0, s: rnd(0.012, 0.03) });
    }
    packets = packets.filter((k) => (k.p += k.s) < 1 && Math.hypot(k.a.x - k.b.x, k.a.y - k.b.y) < D * 1.3);
    ctx.fillStyle = B;
    for (const k of packets) {
      const x = k.a.x + (k.b.x - k.a.x) * k.p, y = k.a.y + (k.b.y - k.a.y) * k.p;
      ctx.globalAlpha = 0.18; blob(x, y, 6); ctx.globalAlpha = 0.85; blob(x, y, 2.6);
    }
    for (const n of nodes) {
      if (n.cloud) cloud(n.x, n.y, 24);
      else { ctx.fillStyle = G; ctx.globalAlpha = 0.5; blob(n.x, n.y, 2.4); }
    }
    ctx.globalAlpha = 1;
    if (!reduce) raf = requestAnimationFrame(frame);
  }

  const onResize = () => { clearTimeout(timer); timer = setTimeout(size, 200); };
  window.addEventListener("resize", onResize);
  size();
  if (!reduce) frame();
  return () => { cancelAnimationFrame(raf); clearTimeout(timer); window.removeEventListener("resize", onResize); };
}
