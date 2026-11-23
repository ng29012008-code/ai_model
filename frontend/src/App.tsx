import { useState } from "react";
import "./App.css";

// Python FastAPI backend URL
const API_URL = "http://127.0.0.1:8000/predict";

function App() {
  // Classroom input values
  const [students, setStudents] = useState(32);
  const [lights, setLights] = useState(true);
  const [fans, setFans] = useState(true);
  const [power, setPower] = useState(450);

  // AI prediction results
  const [prediction, setPrediction] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Connect React to Python AI
  async function checkWastage() {
    setLoading(true);
    setError("");
    setPrediction(null);
    setMessage("");

    const inputData = {
      students: students,
      lights_on: lights ? 1 : 0,
      fans_on: fans ? 1 : 0,
      power_consumption: power
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(inputData)
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();

      setPrediction(Boolean(result.wastage_detected));
      setMessage(result.message);

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to AI backend"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2>⚡ Energy Monitor</h2>
        <p>Classroom Monitoring</p>
      </aside>

      {/* Main dashboard */}
      <main className="main">

        <header className="topbar">
          <div>
            <h1>Classroom Dashboard</h1>
            <p>AI-powered electricity monitoring</p>
          </div>

          <span className="demo-badge">
            AI MONITORING
          </span>
        </header>

        {/* Classroom statistics */}
        <section className="stats">

          <div className="card">
            <span>👨‍🎓</span>
            <p>Students Present</p>
            <h2>{students}</h2>
          </div>

          <div className="card">
            <span>⚡</span>
            <p>Power Consumption</p>
            <h2>{power} W</h2>
          </div>

          <div className="card">
            <span>💡</span>
            <p>Lights</p>
            <h2>{lights ? "ON" : "OFF"}</h2>
          </div>

          <div className="card">
            <span>🌀</span>
            <p>Fans</p>
            <h2>{fans ? "ON" : "OFF"}</h2>
          </div>

        </section>

        {/* Input controls */}
        <section className="panel">

          <h2>Classroom Input Controls</h2>

          <div className="controls">

            <label>
              Number of Students

              <input
                type="number"
                min="0"
                value={students}
                onChange={(e) =>
                  setStudents(Math.max(0, Number(e.target.value)))
                }
              />
            </label>

            <label>
              Power Consumption (Watts)

              <input
                type="number"
                min="0"
                value={power}
                onChange={(e) =>
                  setPower(Math.max(0, Number(e.target.value)))
                }
              />
            </label>

            <label className="toggle">
              <input
                type="checkbox"
                checked={lights}
                onChange={(e) => setLights(e.target.checked)}
              />
              Lights ON
            </label>

            <label className="toggle">
              <input
                type="checkbox"
                checked={fans}
                onChange={(e) => setFans(e.target.checked)}
              />
              Fans ON
            </label>

          </div>

          <button
            onClick={checkWastage}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Check Electricity Wastage"}
          </button>

        </section>

        {/* AI results */}
        <section className="panel ai-panel">

          <h2>🤖 AI Analysis Results</h2>

          {loading && (
            <p>AI is analyzing classroom data...</p>
          )}

          {error && (
            <div className="result error">
              <h3>Connection Error</h3>
              <p>{error}</p>
            </div>
          )}

          {prediction !== null && (
            <div className={`result ${prediction ? "danger" : "safe"}`}>

              <h3>
                {prediction
                  ? "⚠️ Electricity Wastage Detected"
                  : "✅ No Electricity Wastage Detected"}
              </h3>

              <p>{message}</p>

            </div>
          )}

          {prediction === null && !loading && !error && (
            <p>
              Enter classroom data and click the analysis button.
            </p>
          )}

        </section>

        <footer>
          loda lehsun
        </footer>

      </main>
    </div>
  );
}

export default App;