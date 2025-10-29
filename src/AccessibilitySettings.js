import React, { useState } from "react";
function AccessibilitySettings() {
  const [contrast, setContrast] = useState(false);
  const toggleContrast = () => setContrast(!contrast);
  return (
    <div className={`container${contrast ? ' bg-dark text-light' : ''}`}>
      <h2>Accessibility</h2>
      <button className="btn btn-secondary" onClick={toggleContrast}>
        {contrast ? "Disable" : "Enable"} High Contrast
      </button>
      {/* Add more settings as needed */}
    </div>
  );
}
export default AccessibilitySettings;
