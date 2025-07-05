import React, { useEffect, useState } from "react";
import Splash from "./Splash";
import moment from 'moment-hijri';


function App() {
  const [count, setCount] = useState(0);
  const [bgColor, setBgColor] = useState("#0d6efd");
  const [showSplash, setShowSplash] = useState(true);
  const [hijriDate, setHijriDate] = useState("");

  useEffect(() => {
    const splashTimeout = setTimeout(() => setShowSplash(false), 3000);
    
    try {
      // First try moment-hijri (most reliable)
      const hijriMoment = moment();
      const formattedDate = `${hijriMoment.format('iD')} ${hijriMoment.format('iMMMM')} ${hijriMoment.format('iYYYY')} AH`;
      setHijriDate(formattedDate);
    } catch (error) {
      console.error("Error with moment-hijri:", error);
      try {
        // Fallback to Intl API if moment fails
        const formatter = new Intl.DateTimeFormat('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          calendar: 'islamic'
        });
        const parts = formatter.formatToParts(new Date());
        const day = parts.find(p => p.type === 'day').value;
        const month = parts.find(p => p.type === 'month').value;
        const year = parts.find(p => p.type === 'year').value;
        setHijriDate(`${day} ${month} ${year} AH`);
      } catch (intlError) {
        console.error("Error with Intl API:", intlError);
        // Final fallback
        setHijriDate(moment().format('iD iMMMM iYYYY') + " AH");
      }
    }

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
