import React, { useState } from "react";
import JobApplicationForm from "./JobApplicationForm";
import Dashboard from "./Dashboard";
import Login from "./Login";
import "./App.css";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className="app-container">
      <header className="header">
        <img src="/logo.png" alt="Smart City Technologies Logo" className="logo" />
        <h1>Smart City Technologies Pte Ltd</h1>
      </header>

      <main>
        {!loggedIn ? (
          <>
            <JobApplicationForm />
            <Login onLogin={() => setLoggedIn(true)} />
          </>
        ) : (
          <Dashboard onLogout={() => setLoggedIn(false)} />
          )}
      </main>

      <footer className="footer">
        <p>All Rights Reserved @ Smart City Technologies Pte Ltd *2026*</p>
      </footer>
    </div>
  );
}

export default App;
