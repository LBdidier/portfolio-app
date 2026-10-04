import { useState, useEffect, useRef } from "react";
import startBg from "./bg";
import { LINKS, SKILLS, JOBS, SERVICES, OUT, CMDS, ABOUT, EDU } from "./data";

function Terminal() {
  const [lines, setLines] = useState([]);
  const [val, setVal] = useState("");
  const box = useRef(null);
  const inp = useRef(null);

  useEffect(() => {
    setLines([]);
    const intro = [
      ["m", "Booting didier-os 1.0 ..."],
      ["m", "[ OK ] network, identity, microservices mesh"],
      ["p", "whoami"], ["o", "Didier Luboya — Cloud Engineer"],
      ["p", "neofetch"], ...OUT.neofetch().map((t) => ["g", t]),
      ["m", "Type 'help' or tap a command below."],
    ];
    let i = 0;
    const t = setInterval(() => {
      if (i >= intro.length) return clearInterval(t);
      const x = intro[i++];
      setLines((p) => [...p, x]);
    }, 260);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (box.current) box.current.scrollTop = box.current.scrollHeight;
  }, [lines]);

  const run = (c) => {
    c = c.trim().toLowerCase();
    if (!c) return;
    if (c === "clear") return setLines([]);
    const l = [["p", c]];
    if (c === "help") l.push(["o", "Commands: " + CMDS.join(", ")]);
    else if (OUT[c]) OUT[c]().forEach((t) => l.push(["o", t]));
    else l.push(["m", `command not found: ${c} (try 'help')`]);
    setLines((p) => [...p, ...l]);
    if (["skills", "experience", "services", "contact", "education"].includes(c)) {
      const el = document.getElementById(c === "education" ? "about" : c);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 500);
    }
  };

  const cls = { p: "", o: "", g: "g", m: "m" };
  return (
    <div>
      <div className="term mono">
        <div className="bar"><i></i><i></i><i></i><span>didier@cloud: ~</span></div>
        <div className="body" ref={box} onClick={() => inp.current?.focus()}>
          {lines.map((x, k) => (
            <div key={k} className={cls[x[0]]}>
              {x[0] === "p" ? (<><span className="g">didier@cloud</span>:<span className="b">~</span>$ {x[1]}</>) : x[1]}
            </div>
          ))}
          <div className="row">
            <span><span className="g">didier@cloud</span>:<span className="b">~</span>$</span>
            <input ref={inp} value={val} aria-label="terminal input" autoCapitalize="off" autoCorrect="off" spellCheck="false"
              onChange={(e) => setVal(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { run(val); setVal(""); } }} />
          </div>
        </div>
      </div>
      <div className="btns">
        {CMDS.map((c) => <button className="mono" key={c} onClick={() => run(c)}>{c}</button>)}
      </div>
    </div>
  );
}

function Photo() {
  const [ok, setOk] = useState(true);
  return (
    <div className="photo">
      {ok ? <img src="/photo.jpg" alt="Didier Luboya" onError={() => setOk(false)} /> : <div className="ph">DL</div>}
    </div>
  );
}

const BRAND = { Capgemini: "#0070AD" };
const MS = ["#f25022", "#7fba00", "#00a4ef", "#ffb900"];
function CoName({ co }) {
  if (co === "Microsoft")
    return <span className="co">{[...co].map((ch, i) => <span key={i} style={{ color: MS[i % 4] }}>{ch}</span>)}</span>;
  if (BRAND[co]) return <span className="co" style={{ color: BRAND[co] }}>{co}</span>;
  return <span className="co cgrad">{co}</span>;
}

function Acc({ title, sub, cls, children }) {
  const [o, setO] = useState(false);
  return (
    <div className={cls + (o ? " open" : "")}>
      <button className="acc" aria-expanded={o} onClick={() => setO(!o)}>
        <span><b>{title}</b>{sub && <small className="mono">{sub}</small>}</span>
        <span className="pm mono">{o ? "−" : "+"}</span>
      </button>
      {o && <div className="accb">{children}</div>}
    </div>
  );
}

function Contact() {
  const E = { name: "", email: "", phone: "", message: "", website: "" };
  const [f, setF] = useState(E);
  const [st, setSt] = useState({ s: "idle", m: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const send = async (e) => {
    e.preventDefault();
    setSt({ s: "load", m: "" });
    try {
      const r = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || "Could not send your message.");
      setSt({ s: "ok", m: "Thank you! Your message was sent." });
      setF(E);
    } catch (err) {
      setSt({ s: "err", m: err.message === "Failed to fetch" ? "Cannot reach the server." : err.message });
    }
  };

  return (
    <div className="card">
      <p style={{ marginBottom: 14 }}>Open to cloud, infrastructure and full-stack projects. Send me a message.</p>
      <p className="mono cinfo"><a className="c" href="mailto:didierluboya7@gmail.com">didierluboya7@gmail.com</a> · <a className="c" href="tel:+48515595109">+48 515 595 109</a></p>
      <form className="form" onSubmit={send}>
        <input aria-label="Name" placeholder="Name" required maxLength="100" value={f.name} onChange={set("name")} />
        <input aria-label="Email" type="email" placeholder="Email" required maxLength="150" value={f.email} onChange={set("email")} />
        <input className="full" aria-label="Phone" type="tel" placeholder="Phone (optional)" maxLength="30" value={f.phone} onChange={set("phone")} />
        <textarea className="full" aria-label="Message" rows="5" placeholder="Message" required maxLength="3000" value={f.message} onChange={set("message")} />
        <input className="hp" tabIndex="-1" autoComplete="off" aria-hidden="true" name="website" value={f.website} onChange={set("website")} />
        <button className="btn full" disabled={st.s === "load"}>{st.s === "load" ? "Sending..." : "Send message"}</button>
        {st.m && <div className={"full msg " + st.s}>{st.m}</div>}
      </form>
    </div>
  );
}

export default function App() {
  const bg = useRef(null);
  useEffect(() => startBg(bg.current), []);
  return (
    <div id="top">
      <canvas ref={bg} className="bgfx" aria-hidden="true" />
      <nav className="mono">
        <a href="#top" style={{ color: "var(--accent)" }}>didier@cloud</a>
        <div className="navlinks">
          {["about", "skills", "experience", "services", "contact"].map((s) => <a key={s} href={"#" + s}>{s}</a>)}
        </div>
        <div className="soc">
          <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14H.22V8zm7.4 0h4.37v1.92h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.47 3.04 5.47 6.99V22h-4.56v-6.4c0-1.53-.03-3.49-2.13-3.49-2.13 0-2.46 1.66-2.46 3.38V22H7.62V8z" /></svg>
          </a>
          <a href={LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" /></svg>
          </a>
        </div>
      </nav>
      <main>
        <section className="hero">
          <h1 className="name">Hi, I'm <span className="grad">Didier Luboya</span></h1>
          <p className="role">Cloud Architect | Software Engineer | Azure &amp; DevOps Specialist</p>
          <p className="lead">Passionate technology professional with expertise in Azure Cloud, System Design, Software Engineering, DevOps, DevSecOps, and Site Reliability Engineering (SRE). I build scalable, secure, and high-performance cloud solutions that drive innovation and business growth.</p>
          <p className="quote">“Designing secure cloud systems. Building reliable software. Delivering at scale.” 🚀</p>
          <div className="cta">
            <a className="btn" href="#contact">Contact me</a>
            <a className="btn ghost" href="#experience">View experience</a>
          </div>
          <div className="herogrid"><Terminal /><Photo /></div>
        </section>
        <section id="about"><h2>about</h2>
          <div className="card aboutcard"><p>{ABOUT}</p></div>
          <div className="grid" style={{ marginTop: 16 }}>
            {EDU.map((e) => (
              <div className="card" key={e.deg + e.years}><h3>{e.deg}</h3><p>{e.school}</p><p className="mono" style={{ marginTop: 6, fontSize: 13 }}>{e.years}</p></div>
            ))}
          </div>
        </section>
        <section id="skills"><h2>skills</h2>
          <div className="grid">
            {Object.entries(SKILLS).map(([k, v]) => (
              <div className="card" key={k}><h3>{k}</h3><div className="tags">{v.map((x) => <span key={x}>{x}</span>)}</div></div>
            ))}
          </div>
        </section>
        <section id="experience"><h2>experience</h2>
          {JOBS.map((j) => (
            <Acc key={j.role + j.co} cls="job" title={<>{j.role} · <CoName co={j.co} /></>} sub={j.when}>
              <ul>{j.pts.map((p) => <li key={p}>{p}</li>)}</ul>
            </Acc>
          ))}
        </section>
        <section id="services"><h2>services</h2>
          <div className="grid">
            {SERVICES.map((s) => (
              <Acc key={s[0]} cls="card" title={s[0]}><p style={{ color: "var(--muted)", fontSize: "14.5px" }}>{s[1]}</p></Acc>
            ))}
          </div>
        </section>
        <section id="contact"><h2>contact</h2><Contact /></section>
        <footer className="mono">© {new Date().getFullYear()} Didier Luboya</footer>
      </main>
    </div>
  );
}
