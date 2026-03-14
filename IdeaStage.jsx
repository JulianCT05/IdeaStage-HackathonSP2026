import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #f5f3ef; color: #1a1a18; min-height: 100vh; }

  .nav {
    position: sticky; top: 0; z-index: 100;
    background: rgba(245,243,239,0.92);
    backdrop-filter: blur(12px);
    border-bottom: 0.5px solid rgba(0,0,0,0.1);
    padding: 0 2rem;
    display: flex; align-items: center; justify-content: space-between;
    height: 60px;
  }
  .nav-brand {
    font-family: 'Playfair Display', serif;
    font-size: 20px; font-weight: 600;
    color: #1a1a18; letter-spacing: -0.3px;
  }
  .nav-links { display: flex; align-items: center; gap: 4px; }
  .nav-btn {
    background: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 400;
    color: #555; padding: 6px 14px;
    border-radius: 8px; transition: all 0.15s;
  }
  .nav-btn:hover { background: rgba(0,0,0,0.06); color: #1a1a18; }
  .nav-btn.active { color: #1a1a18; font-weight: 500; background: rgba(0,0,0,0.08); }
  .sign-btn {
    background: #1a1a18; color: #f5f3ef;
    border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 500;
    padding: 7px 18px; border-radius: 8px;
    transition: all 0.15s; margin-left: 8px;
  }
  .sign-btn:hover { background: #333; }
  .sign-btn.out { background: none; color: #555; border: 0.5px solid rgba(0,0,0,0.2); }
  .sign-btn.out:hover { background: rgba(0,0,0,0.06); color: #1a1a18; }
  .user-chip { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #555; }
  .avatar {
    width: 28px; height: 28px; border-radius: 50%;
    background: #c8e6c9; display: flex; align-items: center;
    justify-content: center; font-size: 12px; font-weight: 500; color: #2e7d32;
  }

  .modal-overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(0,0,0,0.4);
    display: flex; align-items: center; justify-content: center;
    animation: fadeIn 0.15s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal {
    background: #f5f3ef; border-radius: 16px;
    padding: 2rem; width: 360px; max-width: 90vw;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    animation: slideUp 0.2s ease;
  }
  @keyframes slideUp { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .modal h2 { font-family: 'Playfair Display', serif; font-size: 22px; margin-bottom: 4px; }
  .modal p { font-size: 14px; color: #777; margin-bottom: 1.5rem; }
  .field { margin-bottom: 1rem; }
  .field label { font-size: 12px; font-weight: 500; color: #888; display: block; margin-bottom: 6px; letter-spacing: 0.5px; text-transform: uppercase; }
  .field input {
    width: 100%; padding: 10px 14px;
    border: 0.5px solid rgba(0,0,0,0.2); border-radius: 8px;
    font-family: 'DM Sans', sans-serif; font-size: 14px;
    background: #fff; outline: none; transition: border 0.15s;
  }
  .field input:focus { border-color: rgba(0,0,0,0.5); }
  .modal-actions { display: flex; gap: 8px; margin-top: 1.5rem; }
  .btn-primary {
    flex: 1; background: #1a1a18; color: #f5f3ef;
    border: none; cursor: pointer; padding: 10px;
    border-radius: 8px; font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 500; transition: background 0.15s;
  }
  .btn-primary:hover { background: #333; }
  .btn-secondary {
    flex: 1; background: none; border: 0.5px solid rgba(0,0,0,0.2);
    cursor: pointer; padding: 10px; border-radius: 8px;
    font-family: 'DM Sans', sans-serif; font-size: 14px;
    transition: background 0.15s; color: #555;
  }
  .btn-secondary:hover { background: rgba(0,0,0,0.06); }
  .error-msg { font-size: 12px; color: #c0392b; margin-top: 8px; }

  .hero { padding: 4rem 2rem 2rem; max-width: 800px; margin: 0 auto; }
  .hero h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(32px, 5vw, 52px);
    line-height: 1.15; color: #1a1a18; margin-bottom: 1rem;
  }
  .hero p { font-size: 16px; color: #666; max-width: 480px; line-height: 1.7; }
  .tag {
    display: inline-block; background: #e8f5e9;
    color: #2e7d32; font-size: 12px; font-weight: 500;
    padding: 4px 10px; border-radius: 20px; margin-bottom: 1rem;
  }

  .slides-section { max-width: 800px; margin: 0 auto; padding: 1rem 2rem 4rem; }
  .slides-section h2 { font-family: 'Playfair Display', serif; font-size: 22px; margin-bottom: 1.5rem; }
  .slide-viewer { background: #fff; border-radius: 16px; border: 0.5px solid rgba(0,0,0,0.1); overflow: hidden; }
  .slide-canvas { aspect-ratio: 16/9; background: #fff; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; }
  .slide-inner { width: 100%; height: 100%; position: relative; }
  .slide-controls {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 16px; border-top: 0.5px solid rgba(0,0,0,0.08); background: #fafaf8;
  }
  .slide-nav-btn {
    background: none; border: 0.5px solid rgba(0,0,0,0.15);
    cursor: pointer; padding: 6px 14px; border-radius: 7px;
    font-size: 13px; font-family: 'DM Sans', sans-serif;
    color: #555; transition: all 0.15s;
  }
  .slide-nav-btn:hover:not(:disabled) { background: rgba(0,0,0,0.06); color: #1a1a18; }
  .slide-nav-btn:disabled { opacity: 0.3; cursor: default; }
  .slide-dots { display: flex; gap: 6px; align-items: center; }
  .dot { width: 6px; height: 6px; border-radius: 3px; background: #ccc; cursor: pointer; transition: all 0.2s; border: none; padding: 0; }
  .dot.active { background: #1a1a18; width: 18px; }
  .slide-thumbs { display: flex; gap: 8px; padding: 12px 16px; border-top: 0.5px solid rgba(0,0,0,0.08); overflow-x: auto; }
  .thumb { flex-shrink: 0; width: 80px; aspect-ratio: 16/9; border-radius: 6px; overflow: hidden; cursor: pointer; border: 2px solid transparent; transition: border 0.15s; position: relative; }
  .thumb.active { border-color: #1a1a18; }

  .ideas-page { max-width: 700px; margin: 0 auto; padding: 3rem 2rem 4rem; }
  .ideas-page h1 { font-family: 'Playfair Display', serif; font-size: 36px; margin-bottom: 0.5rem; }
  .ideas-page > p { font-size: 15px; color: #777; margin-bottom: 2rem; }
  .idea-form { background: #fff; border-radius: 16px; border: 0.5px solid rgba(0,0,0,0.1); padding: 1.75rem; }
  .form-field { margin-bottom: 1.25rem; }
  .form-field label { display: block; font-size: 12px; font-weight: 500; color: #888; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 6px; }
  .form-field input, .form-field textarea, .form-field select {
    width: 100%; padding: 10px 14px;
    border: 0.5px solid rgba(0,0,0,0.2); border-radius: 8px;
    font-family: 'DM Sans', sans-serif; font-size: 14px;
    background: #fafaf8; outline: none; transition: border 0.15s; color: #1a1a18;
  }
  .form-field input:focus, .form-field textarea:focus, .form-field select:focus { border-color: rgba(0,0,0,0.5); background: #fff; }
  .form-field textarea { resize: vertical; min-height: 120px; line-height: 1.6; }
  .submit-btn {
    background: #1a1a18; color: #f5f3ef;
    border: none; cursor: pointer; padding: 12px 28px;
    border-radius: 8px; font-family: 'DM Sans', sans-serif;
    font-size: 15px; font-weight: 500; transition: background 0.15s; width: 100%;
  }
  .submit-btn:hover { background: #333; }
  .success-card { background: #e8f5e9; border-radius: 12px; padding: 1.5rem; text-align: center; margin-top: 1rem; animation: slideUp 0.3s ease; }
  .success-card h3 { font-family: 'Playfair Display', serif; font-size: 20px; color: #2e7d32; margin-bottom: 6px; }
  .success-card p { font-size: 14px; color: #388e3c; }
  .locked-gate { background: #fff; border-radius: 16px; border: 0.5px solid rgba(0,0,0,0.1); padding: 3rem 2rem; text-align: center; }
  .lock-icon { font-size: 40px; margin-bottom: 1rem; }
  .locked-gate h3 { font-family: 'Playfair Display', serif; font-size: 22px; margin-bottom: 8px; }
  .locked-gate p { font-size: 15px; color: #777; margin-bottom: 1.5rem; }

  .ideas-list { margin-top: 2rem; }
  .ideas-list h3 { font-family: 'Playfair Display', serif; font-size: 20px; margin-bottom: 1rem; }
  .idea-card { background: #fff; border-radius: 12px; border: 0.5px solid rgba(0,0,0,0.1); padding: 1rem 1.25rem; margin-bottom: 10px; }
  .idea-card-title { font-weight: 500; font-size: 15px; margin-bottom: 4px; }
  .idea-card-meta { font-size: 12px; color: #999; margin-bottom: 8px; }
  .idea-card-body { font-size: 14px; color: #555; line-height: 1.6; }
  .category-badge { display: inline-block; font-size: 11px; font-weight: 500; padding: 2px 8px; border-radius: 10px; margin-right: 6px; }
`;

// ── Slide Data ──────────────────────────────────────────────────────────────

const slides = [
  {
    bg: "#1a237e", accent: "#7986cb",
    title: "Quarterly Review", subtitle: "Q3 2024 Performance & Highlights",
    layout: "title",
  },
  {
    bg: "#fff", accent: "#3949ab",
    title: "Key Metrics", layout: "metrics",
    metrics: [
      { label: "Revenue", value: "$4.2M", delta: "+18%", up: true },
      { label: "Users",   value: "128K",  delta: "+32%", up: true },
      { label: "Churn",   value: "2.1%",  delta: "-0.4%", up: true },
      { label: "NPS",     value: "72",    delta: "+5",   up: true },
    ],
  },
  {
    bg: "#fff", accent: "#1a237e",
    title: "Product Roadmap", layout: "roadmap",
    items: [
      { q: "Q1", label: "Launch v2.0",  done: true },
      { q: "Q2", label: "Mobile app",   done: true },
      { q: "Q3", label: "API platform", done: true },
      { q: "Q4", label: "AI features",  done: false },
    ],
  },
  {
    bg: "#e8eaf6", accent: "#3949ab",
    title: "Team Highlights", layout: "bullets",
    bullets: [
      "24 new team members joined this quarter",
      "Engineering velocity up 40% YoY",
      "3 major enterprise deals closed",
      "ISO 27001 certification achieved",
      "New offices in Austin & Berlin",
    ],
  },
  {
    bg: "#1a237e", accent: "#7986cb",
    title: "Thank You", subtitle: "Questions & Discussion",
    layout: "title",
  },
];

// ── Slide Renderer ───────────────────────────────────────────────────────────

function SlideRenderer({ slide }) {
  const s = { width: "100%", height: "100%" };

  if (slide.layout === "title") return (
    <div style={{ ...s, background: slide.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10%" }}>
      <div style={{ width: 60, height: 4, background: slide.accent, borderRadius: 2, marginBottom: 24 }} />
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, color: "#fff", textAlign: "center", lineHeight: 1.2, marginBottom: 16 }}>{slide.title}</h1>
      {slide.subtitle && <p style={{ fontSize: 18, color: "rgba(255,255,255,0.7)", textAlign: "center" }}>{slide.subtitle}</p>}
    </div>
  );

  if (slide.layout === "metrics") return (
    <div style={{ ...s, background: slide.bg, padding: "8% 8% 6%" }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: slide.accent, marginBottom: 24 }}>{slide.title}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {slide.metrics.map((m, i) => (
          <div key={i} style={{ background: "#f5f3ef", borderRadius: 12, padding: "16px 20px" }}>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>{m.label}</div>
            <div style={{ fontSize: 32, fontWeight: 500, color: slide.accent }}>{m.value}</div>
            <div style={{ fontSize: 13, color: "#4caf50", marginTop: 4 }}>{m.delta}</div>
          </div>
        ))}
      </div>
    </div>
  );

  if (slide.layout === "roadmap") return (
    <div style={{ ...s, background: slide.bg, padding: "8%" }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: slide.accent, marginBottom: 28 }}>{slide.title}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {slide.items.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: item.done ? slide.accent : "#eee", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: item.done ? "#fff" : "#999", flexShrink: 0 }}>{item.q}</div>
            <div style={{ flex: 1, height: 36, background: item.done ? "#e8eaf6" : "#f5f5f5", borderRadius: 8, display: "flex", alignItems: "center", paddingLeft: 14, fontSize: 14, color: item.done ? slide.accent : "#aaa", fontWeight: item.done ? 500 : 400 }}>
              {item.label} {item.done && <span style={{ marginLeft: 8, fontSize: 12, color: "#4caf50" }}>✓ Complete</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (slide.layout === "bullets") return (
    <div style={{ ...s, background: slide.bg, padding: "8%" }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: slide.accent, marginBottom: 24 }}>{slide.title}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {slide.bullets.map((b, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{ width: 6, height: 6, borderRadius: 3, background: slide.accent, flexShrink: 0, marginTop: 7 }} />
            <span style={{ fontSize: 15, color: "#333", lineHeight: 1.5 }}>{b}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return null;
}

// ── Auth Modal ───────────────────────────────────────────────────────────────

function AuthModal({ onClose, onSignIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handle = () => {
    if (!email.trim()) return setError("Please enter your email.");
    if (!password.trim()) return setError("Please enter your password.");
    const name = email
      .split("@")[0]
      .replace(".", " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    onSignIn({ email, name });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Welcome back</h2>
        <p>Sign in to access all features</p>
        <div className="field">
          <label>Email</label>
          <input type="email" placeholder="you@example.com" value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handle()} />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" placeholder="••••••••" value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handle()} />
        </div>
        {error && <div className="error-msg">{error}</div>}
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handle}>Sign in</button>
        </div>
      </div>
    </div>
  );
}

// ── Nav ──────────────────────────────────────────────────────────────────────

function Nav({ page, setPage, user, onSignInClick, onSignOut }) {
  return (
    <nav className="nav">
      <div className="nav-brand">IdeaStage</div>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <div className="nav-links">
          <button className={`nav-btn${page === "home" ? " active" : ""}`} onClick={() => setPage("home")}>Home</button>
          <button className={`nav-btn${page === "ideas" ? " active" : ""}`} onClick={() => setPage("ideas")}>Submit Idea</button>
        </div>
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: 12 }}>
            <div className="user-chip">
              <div className="avatar">{user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</div>
              <span style={{ fontSize: 13 }}>{user.name.split(" ")[0]}</span>
            </div>
            <button className="sign-btn out" onClick={onSignOut}>Sign out</button>
          </div>
        ) : (
          <button className="sign-btn" onClick={onSignInClick} style={{ marginLeft: 12 }}>Sign in</button>
        )}
      </div>
    </nav>
  );
}

// ── Home Page ────────────────────────────────────────────────────────────────

function HomePage() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => Math.max(0, c - 1));
  const next = () => setCurrent((c) => Math.min(slides.length - 1, c + 1));

  return (
    <>
      <div className="hero">
        <span className="tag">Featured Presentation</span>
        <h1>Quarterly<br />Review 2024</h1>
        <p>Browse through the latest company update, metrics, and roadmap highlights presented by the leadership team.</p>
      </div>
      <div className="slides-section">
        <h2>Presentation</h2>
        <div className="slide-viewer">
          <div className="slide-canvas">
            <div className="slide-inner">
              <SlideRenderer slide={slides[current]} />
            </div>
          </div>
          <div className="slide-controls">
            <button className="slide-nav-btn" onClick={prev} disabled={current === 0}>← Prev</button>
            <div className="slide-dots">
              {slides.map((_, i) => (
                <button key={i} className={`dot${i === current ? " active" : ""}`} onClick={() => setCurrent(i)} />
              ))}
            </div>
            <button className="slide-nav-btn" onClick={next} disabled={current === slides.length - 1}>Next →</button>
          </div>
          <div className="slide-thumbs">
            {slides.map((slide, i) => (
              <div key={i} className={`thumb${i === current ? " active" : ""}`} onClick={() => setCurrent(i)}
                style={{ background: slide.bg }}>
                <div style={{ transform: "scale(0.22)", transformOrigin: "top left", width: "455px", height: "256px", pointerEvents: "none" }}>
                  <SlideRenderer slide={slide} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Ideas Page ───────────────────────────────────────────────────────────────

const categoryColors = {
  Product:     { bg: "#e8eaf6", color: "#3949ab" },
  Design:      { bg: "#fce4ec", color: "#c2185b" },
  Marketing:   { bg: "#e8f5e9", color: "#2e7d32" },
  Engineering: { bg: "#e3f2fd", color: "#1565c0" },
  Operations:  { bg: "#fff3e0", color: "#e65100" },
};

const defaultIdeas = [
  { title: "Dark mode for dashboard", category: "Design",    body: "Many users work late and would benefit from a dark mode option.", author: "Alex T." },
  { title: "Weekly digest email",     category: "Marketing", body: "Automated weekly summary of activity sent to all users.",         author: "Sam R." },
];

function IdeasPage({ user, onSignInClick }) {
  const [title, setTitle]       = useState("");
  const [category, setCategory] = useState("Product");
  const [body, setBody]         = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [ideas, setIdeas]       = useState(defaultIdeas);

  const handleSubmit = async () => {
    if (!title.trim() || !body.trim()) return;

    // Get AI feedback
    const response = await fetch('http://localhost:3001/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, category, body }),
    });

    const data = await response.json();

    setIdeas((prev) => [{ title, category, body, author: user.name, feedback: data.feedback }, ...prev]);
    setTitle(""); setBody(""); setCategory("Product");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  if (!user) return (
    <div className="ideas-page">
      <h1>Submit an Idea</h1>
      <p>Have a thought that could improve things? Share it with the team.</p>
      <div className="locked-gate">
        <div className="lock-icon">🔒</div>
        <h3>Sign in required</h3>
        <p>You need to be signed in to submit ideas and view submissions from the team.</p>
        <button className="btn-primary" style={{ width: "auto", padding: "10px 28px" }} onClick={onSignInClick}>
          Sign in to continue
        </button>
      </div>
    </div>
  );

  return (
    <div className="ideas-page">
      <h1>Submit an Idea</h1>
      <p>Have a thought that could improve things? Share it with the team.</p>
      <div className="idea-form">
        <div className="form-field">
          <label>Idea title</label>
          <input type="text" placeholder="Give your idea a clear title..." value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="form-field">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {Object.keys(categoryColors).map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-field">
          <label>Description</label>
          <textarea placeholder="Describe your idea in detail — the problem it solves, how it might work..." value={body} onChange={(e) => setBody(e.target.value)} />
        </div>
        <button className="submit-btn" onClick={handleSubmit}>Submit idea</button>
        {submitted && (
          <div className="success-card">
            <h3>Idea submitted!</h3>
            <p>Thanks {user.name.split(" ")[0]} — your idea has been added to the board.</p>
          </div>
        )}
      </div>

      <div className="ideas-list">
        <h3>Recent ideas</h3>
        {ideas.map((idea, i) => {
          const c = categoryColors[idea.category] || { bg: "#eee", color: "#555" };
          return (
            <div key={i} className="idea-card">
              <div className="idea-card-meta">
                <span className="category-badge" style={{ background: c.bg, color: c.color }}>{idea.category}</span>
                by {idea.author}
              </div>
              <div className="idea-card-title">{idea.title}</div>
              <div className="idea-card-body">{idea.body}</div>
              {idea.feedback && (
                <div style={{ marginTop: 10, padding: "10px 14px", background: "#f0f4ff", borderRadius: 8, fontSize: 13, color: "#3949ab", lineHeight: 1.6 }}>
                  <strong>AI Feedback:</strong> {idea.feedback}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage]       = useState("home");
  const [user, setUser]       = useState(null);
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      {/* Inject styles */}
      <style>{styles}</style>

      <Nav
        page={page}
        setPage={setPage}
        user={user}
        onSignInClick={() => setShowAuth(true)}
        onSignOut={() => setUser(null)}
      />

      {page === "home"
        ? <HomePage />
        : <IdeasPage user={user} onSignInClick={() => setShowAuth(true)} />
      }

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSignIn={(u) => setUser(u)}
        />
      )}
    </>
  );
}