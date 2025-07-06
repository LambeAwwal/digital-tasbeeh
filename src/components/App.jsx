import React, { useEffect, useState } from "react";
import Splash from "./Splash";
import moment from 'moment-hijri';

function App() {
  const [count, setCount] = useState(0);
  const [bgColor, setBgColor] = useState("#0d6efd");
  const [showSplash, setShowSplash] = useState(true);
  const [hijriDate, setHijriDate] = useState("");
  const [installPrompt, setInstallPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);

  // 1. PWA Installation Handling
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      console.log('Install prompt available');
      e.preventDefault();
      setInstallPrompt(e);
      setCanInstall(true);
      
      // For debugging in console
      window._installPrompt = e;
    };

    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('App already installed');
        setCanInstall(false);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', () => {
      console.log('App successfully installed');
      setCanInstall(false);
    });
    checkIfInstalled();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    try {
      const result = await installPrompt.prompt();
      const { outcome } = await result.userChoice;
      console.log(`User ${outcome} the install`);
      if (outcome === 'accepted') {
        setCanInstall(false);
      }
    } catch (err) {
      console.error('Installation failed:', err);
    }
  };

  // 2. Hijri Date Calculation
  useEffect(() => {
    const splashTimeout = setTimeout(() => setShowSplash(false), 3000);
    
    try {
      const hijriMoment = moment();
      setHijriDate(`${hijriMoment.format('iD')} ${hijriMoment.format('iMMMM')} ${hijriMoment.format('iYYYY')} AH`);
    } catch (error) {
      console.error("Hijri date error:", error);
      setHijriDate(new Date().toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        calendar: 'islamic'
      }));
    }

    return () => clearTimeout(splashTimeout);
  }, []);

  if (showSplash) {
    return <Splash onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div className="app">
      {/* Debug UI - can remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          background: '#333',
          color: 'white',
          padding: '5px',
          fontSize: '12px',
          zIndex: 9999
        }}>
          PWA Status: {canInstall ? 'Ready to Install' : 'Not Installable'}
        </div>
      )}

      {/* Install Button */}
      {canInstall && (
        <button
          onClick={handleInstall}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '12px 20px',
            background: 'linear-gradient(135deg, #0d6efd, #0b5ed7)',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(13, 110, 253, 0.3)',
            zIndex: 1000,
            animation: 'pulse 2s infinite'
          }}
        >
          📲 Install App
        </button>
      )}

      {/* Main App Content */}
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
              "--btn-hover-bg": bgColor
            }}
          ></button>
        </div>

        <footer>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
          />
          <h2><b>Theme</b></h2>
        </footer>
      </div>
    </div>
  );
}

export default App;