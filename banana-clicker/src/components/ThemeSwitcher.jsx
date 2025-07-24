import React from "react";
import { THEMES } from "../constants/themes";
import styles from "../styles/ThemeSwitcher.module.scss";

function ThemeSwitcher({ themeIdx, setThemeIdx }) {
  return (
    <div className={styles.themeSwitcher}>
      <select
        value={themeIdx}
        onChange={e => setThemeIdx(Number(e.target.value))}
        className={styles.themeSelect}
      >
        {THEMES.map((t, idx) => (
          <option key={t.name} value={idx}>{t.name}</option>
        ))}
      </select>
    </div>
  );
}

export default ThemeSwitcher;
