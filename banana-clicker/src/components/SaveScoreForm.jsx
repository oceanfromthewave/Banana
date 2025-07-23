import React, { useState } from "react";
import { saveScore } from "../hooks/useRanking";
import styles from '../styles/SaveScoreForm.module.scss';
;

function SaveScoreForm({ score, onSaved }) {
  const [nickname, setNickname] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nickname.trim()) return setError("닉네임을 입력하세요!");
    await saveScore(nickname, score);
    setDone(true);
    setError("");
    setTimeout(() => {
      if (onSaved) onSaved();
    }, 1200);
  };

  if (done) {
    return (
      <div className={styles.done}>
        <span className={styles.icon}>✅</span>
        <span className={styles.msg}>저장 완료!</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.saveForm}>
      <div>
        <input
          value={nickname}
          onChange={e => setNickname(e.target.value)}
          placeholder="닉네임"
        />
        <button type="submit">점수 저장</button>
      </div>
      {error && <div className={styles.error}>{error}</div>}
    </form>
  );
}

export default SaveScoreForm;
