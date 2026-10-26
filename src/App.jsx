
import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import "./index.css";


const initialTopics = [
  { id: 1, name: "Programming Basics", status: "mastered", score: 92, x: 50, y: 12 },
  { id: 2, name: "Variables", status: "mastered", score: 88, x: 22, y: 36 },
  { id: 3, name: "Conditions", status: "learning", score: 65, x: 78, y: 36 },
  { id: 4, name: "Loops", status: "practice", score: 35, x: 22, y: 67 },
  { id: 5, name: "Functions", status: "learning", score: 60, x: 78, y: 67 },
  { id: 6, name: "Mini Project", status: "practice", score: 20, x: 50, y: 91 },
];

const statusText = {
  mastered: "Mastered",
  learning: "Learning",
  practice: "Needs practice",
};

function App() {
  const [topics, setTopics] = useState(initialTopics);
  const [selectedTopic, setSelectedTopic] = useState(4);
  const [topicInput, setTopicInput] = useState("");
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("Overview");
useEffect(() => {
    async function loadTopics() {
      const { data, error } = await supabase
        .from("learning_topics")
        .select("*")
        .order("id");

      if (error) {
        console.error("Could not load topics:", error.message);
        return;
      }

      if (data && data.length > 0) {
        setTopics(
          data.map((topic, index) => ({
            ...topic,
            x: initialTopics[index % initialTopics.length]?.x ?? 200,
            y: initialTopics[index % initialTopics.length]?.y ?? 150,
          }))
        );
      }
    }

    loadTopics();
  }, []);
  const selected = topics.find((topic) => topic.id === selectedTopic);

  function addTopic(event) {
    event.preventDefault();

    const name = topicInput.trim();
    if (!name) {
      setMessage("Please enter a topic first.");
      return;
    }

    if (topics.some((topic) => topic.name.toLowerCase() === name.toLowerCase())) {
      setMessage("That topic is already on your learning map.");
      return;
    }

    const newTopic = {
      id: Date.now(),
      name,
      status: "practice",
      score: 0,
      x: 50,
      y: 50,
    };

    setTopics((previous) => [...previous, newTopic]);
    setSelectedTopic(newTopic.id);
    setTopicInput("");
    setMessage(`"${name}" was added to your learning map!`);
  }

  function updateProgress() {
    if (!selected) return;

    const nextScore = Math.min(selected.score + 20, 100);
    const nextStatus =
      nextScore >= 80 ? "mastered" : nextScore >= 50 ? "learning" : "practice";

    setTopics((previous) =>
      previous.map((topic) =>
        topic.id === selected.id
          ? { ...topic, score: nextScore, status: nextStatus }
          : topic
      )
    );

    setMessage(`Progress updated for ${selected.name}. Your map has changed!`);
  }

  const masteredCount = topics.filter((topic) => topic.status === "mastered").length;
  const averageScore = topics.length
    ? Math.round(topics.reduce((sum, topic) => sum + topic.score, 0) / topics.length)
    : 0;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#home">
          <span className="brand-icon">✳</span>
          <span>mindmap<span className="brand-light">.ai</span></span>
        </a>

        <div className="sidebar-label">WORKSPACE</div>
        {["Overview", "My Knowledge Map", "Study History"].map((tab, index) => (
          <button
            key={tab}
            className={`nav-item ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            <span className="nav-icon">{["◫", "⌘", "◷"][index]}</span>
            {tab}
          </button>
        ))}

        <div className="sidebar-label second-label">YOUR LEARNING</div>
        <div className="mini-topic">
          <span className="topic-dot purple-dot" /> Programming
        </div>
        <div className="mini-topic">
          <span className="topic-dot green-dot" /> Mathematics
        </div>
        <div className="mini-topic">
          <span className="topic-dot orange-dot" /> Physics
        </div>

        <div className="sidebar-bottom">
          <div className="avatar">S</div>
          <div>
            <strong>Student profile</strong>
            <p>Your personal learning space</p>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> {activeTab}</div>
          <div className="topbar-right">
            <span className="demo-pill"><span /> Interactive demo</span>
            <div className="avatar small-avatar">S</div>
          </div>
        </header>

        <section className="welcome">
          <div>
            <p className="eyebrow">YOUR PERSONAL LEARNING SPACE</p>
            <h1>Learn your way<span className="purple-text">.</span></h1>
            <p className="subtitle">
              Every concept connects. Every session helps your knowledge grow.
            </p>
          </div>
          <div className="welcome-art" aria-hidden="true">
            <span className="orbit orbit-one" />
            <span className="orbit orbit-two" />
            <span className="orbit-center">✳</span>
            <span className="orbit-node node-one">A</span>
            <span className="orbit-node node-two">B</span>
            <span className="orbit-node node-three">C</span>
          </div>
        </section>

        <form className="topic-form" onSubmit={addTopic}>
          <span className="search-icon">⌕</span>
          <input
            value={topicInput}
            onChange={(event) => setTopicInput(event.target.value)}
            placeholder="What would you like to understand today?"
            aria-label="New learning topic"
          />
          <button type="submit" className="primary-button">
            <span>＋</span> Add topic
          </button>
        </form>

        {message && (
          <div className="notice" role="status">
            {message}
            <button onClick={() => setMessage("")} aria-label="Dismiss message">×</button>
          </div>
        )}

        <section className="stats-grid">
          <article className="stat-card">
            <div className="stat-top">
              <span className="stat-icon lilac">⌘</span>
              <span className="stat-caption">IN YOUR MAP</span>
            </div>
            <div className="stat-value">{topics.length}<span> topics</span></div>
            <p className="stat-description">Concepts you're exploring</p>
          </article>

          <article className="stat-card">
            <div className="stat-top">
              <span className="stat-icon mint">✓</span>
              <span className="stat-caption">STRONG CONCEPTS</span>
            </div>
            <div className="stat-value">{masteredCount}<span> mastered</span></div>
            <p className="stat-description">Keep building on your strengths</p>
          </article>

          <article className="stat-card">
            <div className="stat-top">
              <span className="stat-icon peach">↗</span>
              <span className="stat-caption">OVERALL MASTERY</span>
            </div>
            <div className="stat-value">{averageScore}<span>%</span></div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${averageScore}%` }} />
            </div>
          </article>
        </section>

        <section className="content-grid">
          <article className="panel map-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">SEE HOW IDEAS CONNECT</p>
                <h2>Your knowledge map</h2>
              </div>
              <span className="count-pill">{topics.length} nodes</span>
            </div>

            <div className="map-legend">
              <span><i className="legend-dot mastered-dot" /> Mastered</span>
              <span><i className="legend-dot learning-dot" /> Learning</span>
              <span><i className="legend-dot practice-dot" /> Needs practice</span>
            </div>

            <div className="knowledge-map">
              <svg className="map-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
                <line x1="50" y1="15" x2="22" y2="36" />
                <line x1="50" y1="15" x2="78" y2="36" />
                <line x1="22" y1="36" x2="22" y2="67" />
                <line x1="78" y1="36" x2="78" y2="67" />
                <line x1="22" y1="67" x2="50" y2="91" />
                <line x1="78" y1="67" x2="50" y2="91" />
              </svg>

              {topics.map((topic, index) => {
                const positions = [
                  { x: 50, y: 12 },
                  { x: 22, y: 34 },
                  { x: 78, y: 34 },
                  { x: 22, y: 64 },
                  { x: 78, y: 64 },
                  { x: 50, y: 88 },
                ];
                const position = positions[index % positions.length];

                return (
                  <button
                    key={topic.id}
                    className={`map-node ${topic.status} ${selectedTopic === topic.id ? "selected" : ""}`}
                    style={{ left: `${position.x}%`, top: `${position.y}%` }}
                    onClick={() => setSelectedTopic(topic.id)}
                    title={`Select ${topic.name}`}
                  >
                    <span className="node-status">
                      {topic.status === "mastered" ? "✓" : topic.status === "learning" ? "◒" : "○"}
                    </span>
                    <span className="node-name">{topic.name}</span>
                    <span className="node-score">{topic.score}% mastery</span>
                  </button>
                );
              })}
            </div>

            <p className="map-hint">Select any node to explore a concept.</p>
          </article>

          <article className="panel detail-panel">
            <p className="eyebrow">YOUR NEXT STEP</p>
            {selected ? (
              <>
                <div className="detail-symbol">✳</div>
                <h2>{selected.name}</h2>
                <span className={`status-badge ${selected.status}`}>
                  {statusText[selected.status]}
                </span>
                <p className="detail-copy">
                  {selected.status === "mastered"
                    ? "Great progress! Try a more challenging question to strengthen your understanding."
                    : selected.status === "learning"
                    ? "You're making progress. A little more practice can help this concept stick."
                    : "Let's start with the basics and build your understanding one step at a time."}
                </p>
                <div className="detail-progress-heading">
                  <span>Current mastery</span>
                  <strong>{selected.score}%</strong>
                </div>
                <div className="progress-track detail-track">
                  <div className="progress-fill" style={{ width: `${selected.score}%` }} />
                </div>
                <button className="primary-button full-button" onClick={updateProgress}>
                  Practise this concept <span>→</span>
                </button>
                <p className="demo-note">
                  Demo action: practising increases mastery by 20 points.
                </p>
              </>
            ) : (
              <p>Select a concept on the map to see its details.</p>
            )}
          </article>
        </section>

        <footer className="footer">
          <span>✳ MindMap Memory AI</span>
          <span>Learn better, one connection at a time.</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
