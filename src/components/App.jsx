import React, { useEffect, useState } from "react";
import Splash from "./Splash";

function App() {
  const [count, setCount] = useState(0);
  const [bgColor, setBgColor] = useState("#0d6efd");
  const [showSplash, setShowSplash] = useState(true);
  const [hijriDate, setHijriDate] = useState("");

  useEffect(() => {
    // Format Hijri date
    const today = new Date();
    const hijriFormatter = new Intl.DateTimeFormat("en-TN-u-ca-islamic", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const formattedDate = hijriFormatter.format(today);
    setHijriDate(formattedDate);

    // Splash timeout
    const splashTimeout = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    // Clean up timeout if component unmounts
    return () => clearTimeout(splashTimeout);
  }, []);

  // Show splash if still active
  if (showSplash) {
    return <Splash onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div className="app">
      <div className="hijri-banner">Hijri Date: {hijriDate}</div>
      <div className="screen" style={{ backgroundColor: bgColor }}>
        <div className="counter-body" style={{ borderColor: bgColor }}>
          <div className="display">{String(count).padStart(4, "0")}</div>

          <div className="buttons">
            <button
              className="icon-btn"
              onClick={() => setCount(0)}
              title="Reset"
            >
              🔄
            </button>
          </div>

          <button
            className="main-btn"
            onClick={() => setCount(count + 1)}
    style={{
    "--btn-bg": "#fff",
    "--btn-hover-bg": bgColor // or any dynamic value
  }}
          ></button>
        </div>

        <footer>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
          />
          <h2>
            <b>Theme</b>
          </h2>
        </footer>
      </div>
    </div>
  );
}

export default App;
