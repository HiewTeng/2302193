import React, { useState } from "react";
import "./App.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedTerm, setSubmittedTerm] = useState(null);
  const [error, setError] = useState("");

  // Improved XSS detection: only blocks clearly malicious input
  const isXSS = (input) => {
    const blacklistPattern = /<script|<\/script|onerror=|onload=|javascript:/i;
    return blacklistPattern.test(input);
  };

  // Basic SQL Injection detection
  const isSQLInjection = (input) => {
    const sqlPattern = /('|--|;|\/\*|\*\/|xp_cmdshell|exec|drop|insert|select|update|delete)/i;
    return sqlPattern.test(input);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();

    // Handle empty input
    if (!trimmed) {
      setError("Input is empty. Please enter a search term.");
      return;
    }

    // XSS check
    if (isXSS(trimmed)) {
      setError("XSS Detected: Input cleared.");
      setSearchTerm("");
      setSubmittedTerm(null);
      return;
    }

    // SQL injection check
    if (isSQLInjection(trimmed)) {
      setError("SQL Injection Detected: Input cleared.");
      setSearchTerm("");
      setSubmittedTerm(null);
      return;
    }

    // Input is valid
    setError("");
    setSubmittedTerm(trimmed);
  };

  const goHome = () => {
    setSearchTerm("");
    setSubmittedTerm(null);
    setError("");
  };

  return (
    <div className="App">
      {!submittedTerm ? (
        <form onSubmit={handleSubmit} className="form-box">
          <h2>Search Page</h2>
          {error && <p className="error">{error}</p>}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter search term"
          />
          <button type="submit">Submit</button>
        </form>
      ) : (
        <div className="result-box">
          <h2>Search Result</h2>
          <p>You searched for: <strong>{submittedTerm}</strong></p>
          <button onClick={goHome}>Return Home</button>
        </div>
      )}
    </div>
  );
}

export default App;
