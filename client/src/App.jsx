import { useState, useEffect, useRef } from "react";
import startBg from "./bg";
import {
  LINKS, SKILLS, JOBS, SERVICES, OUT, CMDS, ABOUT, EDU,
  YEARS, ROLES, STACK, PIPELINE, COUNTRIES,
} from "./data";

const EMAIL = "didierluboya7@gmail.com";
const PHONE = "+48 515 595 109";
const reduceMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- icons (stroke, 24px grid) ---------- */
const P = {
  home: "M3 11.5 12 4l9 7.5M5.5 9.5V20h13V9.5",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7.5 8a7.5 7.5 0 0 1 15 0",
  layers: "m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5",
  brief: "M4 7.5h16v12H4zM9 7.5V5h6v2.5M4 12.5h16",
  mail: "M3.5 5.5h17v13h-17zM3.5 6l8.5 7 8.5-7",
  cloud: "M7 18.5a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 10a4.25 4.25 0 0 1-.5 8.5H7Z",
  code: "m8 7-5 5 5 5m8-10 5 5-5 5M14 4l-4 16",
  box: "m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Zm0 9 8-4.5M12 12v9m0-9L4 7.5",
  shield: "M12 3 4.5 6v5.5c0 4.6 3.2 8.3 7.5 9.5 4.3-1.2 7.5-4.9 7.5-9.5V6L12 3Zm-3 9 2.2 2.2L15.5 10",
  check: "M20 6 9 17l-5-5",
  rocket: "M5 15c-1.5 1.3-2 4-2 6 2 0 4.7-.5 6-2m-1.5-4.5L15 7c2-2 4.5-3 6-3 0 1.5-1 4-3 6l-7.5 7.5M7.5 14.5 4 13l3-3h4m3.5 3.5V17l-3 3-1.5-3.5",
  pulse: "M3 12h4l2.5-6 4 12 2.5-6H21",
  git: "M6 3v12m0 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm12-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 0c0 5-6 4-12 6",
  copy: "M8 8h12v12H8zM16 8V4H4v12h4",
  pin: "M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21Zm0-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  phone: "M5 3.5h3.5l1.7 4.3-2.2 1.5a11 11 0 0 0 6.7 6.7l1.5-2.2 4.3 1.7V19a1.5 1.5 0 0 1-1.6 1.5C10.4 20 4 13.6 3.5 5.1A1.5 1.5 0 0 1 5 3.5Z",
  arrow: "M5 12h14m-6-6 6 6-6 6",
  term: "M4 5h16v14H4zM7.5 9.5 10 12l-2.5 2.5M12 15h4.5",
  server: "M4 4h16v6H4zM4 14h16v6H4zM7.5 7h.01M7.5 17h.01",
  key: "M14.5 9.5a4.5 4.5 0 1 1-1.6-3.4M14.5 9.5 21 16v3h-3v-2h-2v-2h-2l-2.2-2.2",
  migrate: "M4 7h13l-3-3m6 13H7l3 3",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-9-9h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9Z",
  chev: "m6 9 6 6 6-6",
};
function Icon({ n, s = 20, className }) {
  return (
    <svg className={className} width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={P[n]} />
    </svg>
  );
}
const LinkedIn = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14H.22V8zm7.4 0h4.37v1.92h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.47 3.04 5.47 6.99V22h-4.56v-6.4c0-1.53-.03-3.49-2.13-3.49-2.13 0-2.46 1.66-2.46 3.38V22H7.62V8z" /></svg>
);
const Instagram = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" /></svg>
);

/* ---------- hooks ---------- */
function useInView(opts = { threshold: 0.3 }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, opts);
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen];
}

// Adds .in to every [data-r] element as it scrolls into view.
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    document.querySelectorAll("[data-r]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useActive(ids) {
  const [a, setA] = useState(ids[0]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setA(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);
  return a;
}

// Scroll progress (top bar) + experience timeline fill, via CSS variables.
function useScrollVars() {
  useEffect(() => {
    let raf = 0;
    const upd = () => {
      raf = 0;
      const d = document.documentElement;
      d.style.setProperty("--sp", (d.scrollTop / Math.max(1, d.scrollHeight - innerHeight)).toFixed(4));
      d.classList.toggle("scrolled", d.scrollTop > 24);
      const tl = document.querySelector(".tl");
      if (tl) {
        const r = tl.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (innerHeight * 0.6 - r.top) / r.height));
        tl.style.setProperty("--p", p.toFixed(4));
      }
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(upd); };
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    upd();
    return () => { removeEventListener("scroll", on); removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, []);
}

// Cursor spotlight for cards (pointer devices only).
function spot(e) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", e.clientX - r.left + "px");
  e.currentTarget.style.setProperty("--my", e.clientY - r.top + "px");
}

/* ---------- small components ---------- */
function Typer({ words }) {
  const [i, setI] = useState(0);
  const [txt, setTxt] = useState(reduceMotion() ? words[0] : "");
  const [del, setDel] = useState(false);
  useEffect(() => {
    if (reduceMotion()) return;
    const w = words[i % words.length];
    let t;
    if (!del && txt === w) t = setTimeout(() => setDel(true), 1700);
    else if (del && txt === "") { setDel(false); setI(i + 1); }
    else t = setTimeout(() => setTxt(del ? w.slice(0, txt.length - 1) : w.slice(0, txt.length + 1)), del ? 35 : 70);
    return () => clearTimeout(t);
  }, [txt, del, i]);
  return <span className="typer">{txt}<i className="caret" /></span>;
}

function Count({ to, suffix = "" }) {
  const [ref, seen] = useInView({ threshold: 0.6 });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!seen) return;
    if (reduceMotion()) return setN(to);
    let raf, t0;
    const step = (t) => {
      t0 ??= t;
      const k = Math.min(1, (t - t0) / 1400);
      setN(Math.round(to * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [seen]);
  return <span ref={ref}>{n}{suffix}</span>;
}

function SplitName({ text }) {
  let k = 0;
  return (
    <span className="split" aria-label={text}>
      {text.split(" ").map((w, wi) => (
        <span className="w" key={wi} aria-hidden="true">
          {[...w].map((ch, ci) => <span className="ch" key={ci} style={{ "--i": k++ }}>{ch}</span>)}
        </span>
      ))}
    </span>
  );
}

function Head({ k, title, sub }) {
  return (
    <header className="sh" data-r>
      <span className="mono kicker"><span className="kn">{k}</span> ~/{title.toLowerCase().replace(/\s+/g, "-")}</span>
      <h2>{title}</h2>
      {sub && <p>{sub}</p>}
    </header>
  );
}

/* ---------- terminal ---------- */
function Terminal() {
  const [lines, setLines] = useState([]);
  const [val, setVal] = useState("");
  const box = useRef(null);
  const inp = useRef(null);
  const [ref, seen] = useInView({ threshold: 0.25 });

  useEffect(() => {
    if (!seen) return;
    const intro = [
      ["m", "Booting didier-os 2.0 ..."],
      ["m", "[ OK ] network · identity · container runtime"],
      ["p", "whoami"], ["o", "Didier Luboya — Cloud & DevOps Engineer"],
      ["p", "neofetch"], ...OUT.neofetch().map((t) => ["g", t]),
      ["m", "Type 'help' or tap a command below."],
    ];
    if (reduceMotion()) return setLines(intro);
    let i = 0;
    const t = setInterval(() => {
      if (i >= intro.length) return clearInterval(t);
      const x = intro[i++];
      setLines((p) => [...p, x]);
    }, 220);
    return () => clearInterval(t);
  }, [seen]);

  useEffect(() => { if (box.current) box.current.scrollTop = box.current.scrollHeight; }, [lines]);

  const run = (c) => {
    c = c.trim().toLowerCase();
    if (!c) return;
    if (c === "clear") return setLines([]);
    const l = [["p", c]];
    if (c === "help") l.push(["o", "Commands: " + CMDS.join(", ")]);
    else if (OUT[c]) OUT[c]().forEach((t) => l.push(["o", t]));
    else if (c.startsWith("sudo")) l.push(["m", "nice try 😄 — permission denied"]);
    else l.push(["m", `command not found: ${c} (try 'help')`]);
    setLines((p) => [...p, ...l]);
  };

  return (
    <div className="termwrap" ref={ref} data-r>
      <div className="term mono">
        <div className="bar"><i></i><i></i><i></i><span>didier@cloud: ~</span></div>
        <div className="body" ref={box} onClick={() => inp.current?.focus({ preventScroll: true })}>
          {lines.map((x, k) => (
            <div key={k} className={"ln " + x[0]}>
              {x[0] === "p" ? (<><span className="g">didier@cloud</span>:<span className="b">~</span>$ {x[1]}</>) : x[1]}
            </div>
          ))}
          <div className="row">
            <span><span className="g">didier@cloud</span>:<span className="b">~</span>$</span>
            <input ref={inp} value={val} aria-label="Terminal input" autoCapitalize="off" autoCorrect="off" spellCheck="false" enterKeyHint="send"
              onChange={(e) => setVal(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { run(val); setVal(""); } }} />
          </div>
        </div>
      </div>
      <div className="cmds">
        {CMDS.map((c) => <button className="mono" key={c} onClick={() => run(c)}>{c}</button>)}
      </div>
    </div>
  );
}

/* ---------- sections ---------- */
const NAV = [
  ["top", "Home", "home"], ["about", "About", "user"], ["skills", "Skills", "layers"],
  ["experience", "Work", "brief"], ["contact", "Contact", "mail"],
];

function Header({ active }) {
  return (
    <header className="hdr">
      <a href="#top" className="logo mono" aria-label="Back to top">
        <span className="lg-mark"><Icon n="cloud" s={16} /></span>didier<span className="dim">@cloud</span><i className="caret" />
      </a>
      <nav className="links" aria-label="Main">
        {NAV.slice(1).map(([id, label]) => (
          <a key={id} href={"#" + id} className={active === id ? "on" : ""}>{label}</a>
        ))}
        <a href="#services" className={active === "services" ? "on" : ""}>Services</a>
      </nav>
      <div className="soc">
        <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LinkedIn /></a>
        <a href={LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram /></a>
        <a className="btn sm hire" href="#contact">Hire me</a>
      </div>
    </header>
  );
}

function Dock({ active }) {
  return (
    <nav className="dock" aria-label="Quick navigation">
      {NAV.map(([id, label, ic]) => {
        const on = active === id || (id === "skills" && ["skills", "pipeline"].includes(active)) || (id === "experience" && ["experience", "services"].includes(active)) || (id === "about" && ["about", "shell"].includes(active));
        return (
          <a key={id} href={"#" + id} className={on ? "on" : ""} aria-label={label}>
            <Icon n={ic} s={21} /><span>{label}</span>
          </a>
        );
      })}
    </nav>
  );
}

function Hero() {
  const [img, setImg] = useState(true);
  const now = JOBS[0];
  const techCount = Object.values(SKILLS).flat().length;
  return (
    <section className="hero" id="top">
      <div className="hero-grid">
        <div className="hero-copy">
          <a href="#contact" className="pill mono"><span className="dot" />Available for projects · Kraków, PL</a>
          <h1 className="name"><span className="hi">Hi, I'm</span><SplitName text="Didier Luboya" /></h1>
          <p className="role mono"><span className="dim">$ building</span> <Typer words={ROLES} /></p>
          <p className="lead">
            Cloud &amp; DevOps engineer. I design, automate and run secure Azure platforms with
            Terraform, Kubernetes and CI/CD, and I build the software that runs on them.
          </p>
          <p className="now"><Icon n="server" s={16} /> Currently <b>{now.role}</b> at <b>{now.co}</b></p>
          <div className="cta">
            <a className="btn" href="#contact">Let's talk <Icon n="arrow" s={18} /></a>
            <a className="btn ghost" href="#experience">See my work</a>
          </div>
        </div>
        <div className="hero-art">
          <div className="frame">
            {img ? <img src="/photo.jpg" alt="Didier Luboya presenting an Azure environment" onError={() => setImg(false)} fetchpriority="high" />
              : <div className="ph">DL</div>}
            <div className="scan" />
          </div>
          <span className="chip c1 mono"><Icon n="cloud" s={15} /> Azure</span>
          <span className="chip c2 mono"><Icon n="box" s={15} /> AKS · Docker</span>
          <span className="chip c3 mono"><Icon n="code" s={15} /> Terraform</span>
          <span className="chip c4 mono"><span className="ok"><Icon n="check" s={13} /></span> apply complete</span>
          <div className="orbit" aria-hidden="true"><i /><i /><i /></div>
        </div>
      </div>
      <div className="stats">
        {[
          [YEARS, "+", "years in tech"],
          [JOBS.length, "", "roles held"],
          [COUNTRIES.length, "", "countries worked in"],
          [techCount, "+", "tools & platforms"],
        ].map(([n, s, l], i) => (
          <div className="stat" key={l} data-r style={{ "--d": i }}>
            <b><Count to={n} suffix={s} /></b><span>{l}</span>
          </div>
        ))}
      </div>
      <a href="#stack" className="scrollcue" aria-label="Scroll down"><span /></a>
    </section>
  );
}

function Marquee() {
  const row = (list, rev) => (
    <div className={"mq" + (rev ? " rev" : "")}>
      <div className="mq-track">
        {[...list, ...list].map((t, i) => <span key={i} aria-hidden={i >= list.length}>{t}</span>)}
      </div>
    </div>
  );
  const half = Math.ceil(STACK.length / 2);
  return (
    <section className="stack" id="stack" aria-label="Tech stack">
      {row(STACK.slice(0, half))}
      {row(STACK.slice(half), true)}
    </section>
  );
}

function About() {
  return (
    <section id="about">
      <Head k="01" title="About" sub="From web development to running cloud infrastructure at enterprise scale." />
      <div className="about-grid">
        <div className="glass about-card" data-r onPointerMove={spot}>
          <p>{ABOUT}</p>
          <div className="facts">
            <span><Icon n="pin" s={16} /> Kraków, Poland</span>
            <span><Icon n="globe" s={16} /> French · English</span>
            <span><Icon n="brief" s={16} /> {COUNTRIES.join(" · ")}</span>
          </div>
        </div>
        <div className="edu">
          {EDU.map((e, i) => (
            <div className="glass edu-item" key={e.deg + e.years} data-r style={{ "--d": i }} onPointerMove={spot}>
              <span className="mono yr">{e.years}</span>
              <h3>{e.deg}</h3>
              <p>{e.school}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Shell() {
  return (
    <section id="shell">
      <Head k="02" title="Shell" sub="Prefer the command line? Explore my profile the DevOps way." />
      <Terminal />
    </section>
  );
}

function Pipeline() {
  const ic = { plan: "git", code: "code", build: "box", test: "shield", deploy: "rocket", monitor: "pulse" };
  const [ref, seen] = useInView({ threshold: 0.2 });
  return (
    <section id="pipeline">
      <Head k="03" title="How I ship" sub="Every change goes through the same automated path, from idea to production." />
      <div className={"pipe" + (seen ? " run" : "")} ref={ref}>
        <div className="pipe-line" aria-hidden="true"><i /></div>
        {PIPELINE.map((s, i) => (
          <div className="stage" key={s.k} style={{ "--d": i }}>
            <div className="node"><Icon n={ic[s.k]} s={22} /><span className="tick"><Icon n="check" s={12} /></span></div>
            <div className="st-body">
              <span className="mono st-n">stage {i + 1}/{PIPELINE.length}</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
              <span className="mono st-tools">{s.tools}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Skills() {
  const cats = Object.keys(SKILLS);
  const [cur, setCur] = useState(cats[0]);
  const icons = ["cloud", "code", "key", "server", "box", "globe"];
  return (
    <section id="skills">
      <Head k="04" title="Skills" sub="The tools I use every day to build and run infrastructure." />
      <div className="tabs" role="tablist" data-r>
        {cats.map((c, i) => (
          <button key={c} role="tab" aria-selected={cur === c} className={cur === c ? "on" : ""} onClick={() => setCur(c)}>
            <Icon n={icons[i % icons.length]} s={16} />{c}
          </button>
        ))}
      </div>
      <div className="skill-panel glass" key={cur} role="tabpanel" onPointerMove={spot}>
        <div className="sp-head">
          <span className="mono">{String(cats.indexOf(cur) + 1).padStart(2, "0")} / {String(cats.length).padStart(2, "0")}</span>
          <h3>{cur}</h3>
        </div>
        <div className="pills">
          {SKILLS[cur].map((x, i) => <span key={x} style={{ "--d": i }}><i />{x}</span>)}
        </div>
      </div>
    </section>
  );
}

function Job({ j, i }) {
  const [open, setOpen] = useState(false);
  const [when, where] = j.when.split(" · ");
  const shown = open ? j.pts : j.pts.slice(0, 2);
  return (
    <article className={"job" + (open ? " open" : "") + (i === 0 ? " current" : "")} data-r>
      <span className="pin" aria-hidden="true" />
      <div className="glass job-card" onPointerMove={spot}>
        <div className="job-top">
          <span className="mono when">{when}</span>
          {i === 0 && <span className="live mono"><span className="dot" />now</span>}
        </div>
        <h3>{j.role}</h3>
        <p className="co">{j.co}{where && <span className="dim"> · {where}</span>}</p>
        <ul>{shown.map((p) => <li key={p}>{p}</li>)}</ul>
        {j.pts.length > 2 && (
          <button className="more mono" aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? "show less" : `+${j.pts.length - 2} more`} <Icon n="chev" s={16} />
          </button>
        )}
      </div>
    </article>
  );
}

function Experience() {
  return (
    <section id="experience">
      <Head k="05" title="Experience" sub="Enterprise cloud, blockchain and full-stack work across three countries." />
      <div className="tl">
        <div className="tl-rail" aria-hidden="true"><i /></div>
        {JOBS.map((j, i) => <Job key={j.role + j.co} j={j} i={i} />)}
      </div>
    </section>
  );
}

function Services() {
  const ic = ["globe", "cloud", "box", "key", "migrate", "code"];
  return (
    <section id="services">
      <Head k="06" title="Services" sub="How I can help your team." />
      <div className="svc-grid">
        {SERVICES.map((s, i) => (
          <div className="glass svc" key={s[0]} data-r style={{ "--d": i % 3 }} onPointerMove={spot}>
            <span className="svc-ic"><Icon n={ic[i % ic.length]} s={22} /></span>
            <h3>{s[0]}</h3>
            <p>{s[1]}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  const E = { name: "", email: "", phone: "", message: "", website: "" };
  const [f, setF] = useState(E);
  const [st, setSt] = useState({ s: "idle", m: "" });
  const [copied, setCopied] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const copy = async () => {
    try { await navigator.clipboard.writeText(EMAIL); setCopied(true); setTimeout(() => setCopied(false), 1600); }
    catch { location.href = "mailto:" + EMAIL; }
  };

  const send = async (e) => {
    e.preventDefault();
    setSt({ s: "load", m: "" });
    try {
      const r = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || "Could not send your message.");
      setSt({ s: "ok", m: "Message delivered. I'll get back to you soon." });
      setF(E);
    } catch (err) {
      setSt({ s: "err", m: err.message === "Failed to fetch" ? "Cannot reach the server." : err.message });
    }
  };

  return (
    <section id="contact">
      <Head k="07" title="Contact" sub="Open to cloud, infrastructure and DevOps roles and projects." />
      <div className="contact-grid">
        <div className="c-side">
          <button className="glass c-item" onClick={copy} data-r onPointerMove={spot}>
            <span className="c-ic"><Icon n="mail" /></span>
            <span><small className="mono">email</small><b>{EMAIL}</b></span>
            <span className="c-act mono">{copied ? "copied ✓" : <Icon n="copy" s={18} />}</span>
          </button>
          <a className="glass c-item" href={"tel:" + PHONE.replace(/\s/g, "")} data-r style={{ "--d": 1 }} onPointerMove={spot}>
            <span className="c-ic"><Icon n="phone" /></span>
            <span><small className="mono">phone</small><b>{PHONE}</b></span>
          </a>
          <a className="glass c-item" href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" data-r style={{ "--d": 2 }} onPointerMove={spot}>
            <span className="c-ic"><LinkedIn /></span>
            <span><small className="mono">linkedin</small><b>in/didier-luboya</b></span>
            <span className="c-act"><Icon n="arrow" s={18} /></span>
          </a>
        </div>
        <form className="glass form" onSubmit={send} data-r onPointerMove={spot}>
          <div className="f-head mono"><span className="dot" /> POST /api/contact</div>
          <label className="fl">
            <input placeholder=" " required maxLength="100" value={f.name} onChange={set("name")} autoComplete="name" />
            <span>Name</span>
          </label>
          <label className="fl">
            <input type="email" placeholder=" " required maxLength="150" value={f.email} onChange={set("email")} autoComplete="email" />
            <span>Email</span>
          </label>
          <label className="fl full">
            <input type="tel" placeholder=" " maxLength="30" value={f.phone} onChange={set("phone")} autoComplete="tel" />
            <span>Phone (optional)</span>
          </label>
          <label className="fl full">
            <textarea rows="5" placeholder=" " required maxLength="3000" value={f.message} onChange={set("message")} />
            <span>Your message</span>
          </label>
          <input className="hp" tabIndex="-1" autoComplete="off" aria-hidden="true" name="website" value={f.website} onChange={set("website")} />
          <button className={"btn full send " + st.s} disabled={st.s === "load"}>
            {st.s === "load" ? <><span className="spin" /> Sending…</> : st.s === "ok" ? <><Icon n="check" s={18} /> Sent</> : <>Send message <Icon n="arrow" s={18} /></>}
          </button>
          {st.m && <div className={"full msg " + st.s} role="status">{st.m}</div>}
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="foot">
      <p className="foot-big" data-r>Let's build something <span className="grad">reliable.</span></p>
      <p className="quote">“Designing secure cloud systems. Building reliable software. Delivering at scale.”</p>
      <div className="foot-row mono">
        <span><span className="dot" /> all systems operational</span>
        <span>© {new Date().getFullYear()} Didier Luboya</span>
        <a href="#top">back to top ↑</a>
      </div>
    </footer>
  );
}

export default function App() {
  const bg = useRef(null);
  useEffect(() => startBg(bg.current), []);
  useReveal();
  useScrollVars();
  const active = useActive(["top", "about", "shell", "pipeline", "skills", "experience", "services", "contact"]);
  return (
    <>
      <div className="progress" aria-hidden="true" />
      <div className="aurora" aria-hidden="true"><i /><i /><i /></div>
      <canvas ref={bg} className="bgfx" aria-hidden="true" />
      <Header active={active} />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Shell />
        <Pipeline />
        <Skills />
        <Experience />
        <Services />
        <Contact />
        <Footer />
      </main>
      <Dock active={active} />
    </>
  );
}
