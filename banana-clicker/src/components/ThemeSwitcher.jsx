import React from "react";
import { THEMES } from "../constants/themes";

function ThemeSwitcher({ themeIdx, setThemeIdx }) {
  return (
    <div style={{
      position: "absolute", top: 36, right: 180, zIndex: 210
    }}>
      <select
        value={themeIdx}
        onChange={e => setThemeIdx(Number(e.target.value))}
        style={{
          padding: "7px 16px", borderRadius: 8, border: "1px solid #ddd",
          fontWeight: 600, background: "#fff"
        }}
      >
        {THEMES.map((t, idx) => (
          <option key={t.name} value={idx}>{t.name}</option>
        ))}
      </select>
    </div>
  );
}

export default ThemeSwitcher;
