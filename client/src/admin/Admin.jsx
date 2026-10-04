import { useState, useEffect, useCallback } from "react";

const call = async (path, { method = "GET", body, token } = {}) => {
  const r = await fetch(path, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: "Bearer " + token } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) { const e = new Error(d.error || "Request failed"); e.status = r.status; throw e; }
  return d;
};
const fmt = (d) => new Date(d).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });

function Login({ onLogin }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setErr("");
    try { const d = await call("/api/admin/login", { method: "POST", body: { password: pw } }); onLogin(d.token); }
    catch (x) { setErr(x.message === "Failed to fetch" ? "Cannot reach the server." : x.message); }
    finally { setBusy(false); }
  };
  return (
    <div className="dsh-login">
      <form className="dsh-card dsh-loginbox" onSubmit={submit}>
        <div className="mono dsh-logo">didier@cloud:~/admin</div>
        <h1 className="dsh-title">Message dashboard</h1>
        <input type="password" placeholder="Admin password" aria-label="Admin password" autoFocus value={pw} onChange={(e) => setPw(e.target.value)} />
        <button className="btn" disabled={busy || !pw}>{busy ? "Checking..." : "Sign in"}</button>
        {err && <div className="msg err">{err}</div>}
      </form>
    </div>
  );
}

function Dashboard({ token, onLogout }) {
  const [data, setData] = useState({ messages: [], stats: { total: 0, unread: 0, today: 0, handled: 0 } });
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData(await call(`/api/admin/messages?status=${status}&q=${encodeURIComponent(q)}`, { token }));
      setErr("");
    } catch (e) { e.status === 401 ? onLogout() : setErr(e.message); }
    finally { setLoading(false); }
  }, [status, q, token, onLogout]);

  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [load]);

  const patch = async (m, body) => {
    try {
      const n = await call(`/api/admin/messages/${m.id}`, { method: "PATCH", body, token });
      setData((d) => ({
        messages: d.messages.map((x) => (x.id === m.id ? n : x)),
        stats: {
          ...d.stats,
          unread: d.stats.unread + (n.is_read === m.is_read ? 0 : n.is_read ? -1 : 1),
          handled: d.stats.handled + (n.handled === m.handled ? 0 : n.handled ? 1 : -1),
        },
      }));
    } catch (e) { setErr(e.message); }
  };
  const remove = async (m) => {
    if (!window.confirm(`Delete the message from ${m.name}? This cannot be undone.`)) return;
    try { await call(`/api/admin/messages/${m.id}`, { method: "DELETE", token }); setOpen(null); load(); }
    catch (e) { setErr(e.message); }
  };
  const toggle = (m) => { setOpen(open === m.id ? null : m.id); if (!m.is_read) patch(m, { is_read: true }); };

  const s = data.stats;
  const stats = [["Total", s.total], ["Unread", s.unread], ["Today", s.today], ["Handled", s.handled]];

  return (
    <div className="dsh-wrap">
      <header className="dsh-top">
        <div><div className="mono dsh-logo">didier@cloud:~/admin</div><h1 className="dsh-title">Messages</h1></div>
        <div className="dsh-topbtns">
          <button className="btn ghost sm" onClick={load}>Refresh</button>
          <button className="btn ghost sm" onClick={onLogout}>Sign out</button>
        </div>
      </header>

      <div className="dsh-stats">
        {stats.map(([k, v]) => <div className="dsh-card dsh-stat" key={k}><div className="dsh-num">{v}</div><div className="dsh-lbl">{k}</div></div>)}
      </div>

      <div className="dsh-bar">
        <input className="dsh-search" placeholder="Search name, email or message..." aria-label="Search" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="dsh-pills">
          {["all", "unread", "handled"].map((k) => (
            <button key={k} className={"dsh-pill" + (status === k ? " on" : "")} onClick={() => setStatus(k)}>{k}</button>
          ))}
        </div>
      </div>

      {err && <div className="msg err">{err}</div>}
      {loading && !data.messages.length && <div className="dsh-empty">Loading...</div>}
      {!loading && !data.messages.length && <div className="dsh-empty">No messages found.</div>}

      <div className="dsh-list">
        {data.messages.map((m) => (
          <div key={m.id} className={"dsh-card dsh-msg" + (m.is_read ? "" : " unread") + (open === m.id ? " open" : "")}>
            <button className="dsh-head" aria-expanded={open === m.id} onClick={() => toggle(m)}>
              <span className="dsh-who">
                {!m.is_read && <i className="dsh-dot" />}
                <b>{m.name}</b><small className="mono">{m.email}</small>
              </span>
              <span className="dsh-meta">
                {m.handled && <span className="dsh-tag ok">handled</span>}
                {m.reply_sent && <span className="dsh-tag">auto-reply sent</span>}
                <small>{fmt(m.created_at)}</small>
              </span>
            </button>
            {open !== m.id && <div className="dsh-preview">{m.message}</div>}
            {open === m.id && (
              <div className="dsh-body">
                <div className="dsh-info mono">
                  <span>{m.email}</span>{m.phone && <span>{m.phone}</span>}
                </div>
                <p className="dsh-text">{m.message}</p>
                <div className="dsh-actions">
                  <a className="btn sm" href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message")}&body=${encodeURIComponent(`Hi ${m.name.split(" ")[0]},\n\n`)}`}>Reply by email</a>
                  <button className="btn ghost sm" onClick={() => patch(m, { handled: !m.handled })}>{m.handled ? "Mark as not handled" : "Mark as handled"}</button>
                  <button className="btn ghost sm" onClick={() => patch(m, { is_read: false })}>Mark unread</button>
                  <button className="btn danger sm" onClick={() => remove(m)}>Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem("adm_token"));
  const login = (t) => { sessionStorage.setItem("adm_token", t); setToken(t); };
  const logout = useCallback(() => { sessionStorage.removeItem("adm_token"); setToken(null); }, []);
  return token ? <Dashboard token={token} onLogout={logout} /> : <Login onLogin={login} />;
}
