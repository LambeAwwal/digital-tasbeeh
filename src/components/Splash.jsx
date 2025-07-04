import React, { useEffect } from "react";
import Image from "./Tasbeeh.png"
function Splash({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="intro-screen">
      <img src={Image} alt="Image" />
      <h1 className="splash-title">Digital Tasbeeh</h1>
      <p className="splash-sub">Brought to you by First Response Tech</p>
    </div>
  );
}

export default Splash;
