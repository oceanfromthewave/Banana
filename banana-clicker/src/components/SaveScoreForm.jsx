import React, { useState } from "react";
import { saveScore } from "../hooks/useRanking";
import styles from '../styles/SaveScoreForm.module.scss';

function SaveScoreForm({ score, nickname, onSaved }) {
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await saveScore(nickname, score);
      setDone(true);
      setTimeout(() => {
        setSaving(false);
        if (onSaved) onSaved();
      }, 1400);
    } catch (err) {
      setError("저장 실패! 잠시 후 다시 시도해 주세요.");
      setSaving(false);
    }
  };

  if (done) {
    return (
      <div className={styles.done}>
        <span className={styles.icon}>✅</span>
        <span className={styles.msg}>점수 저장 완료!</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className={styles.saveForm}>
      <div className={styles.info}>
        <div>현재 점수 <b>{score}</b>를 저장하면 랭킹에 등록됩니다.</div>
        <div>저장 후 점수는 <b>초기화</b>됩니다.</div>
        <div style={{ color: "#aaa", marginTop: "3px" }}>닉네임: <b>{nickname}</b></div>
      </div>
      <button
        type="submit"
        className={styles.saveBtn}
        disabled={saving}
      >{saving ? "저장 중..." : "점수 저장"}</button>
      {error && <div className={styles.error}>{error}</div>}
    </form>
  );
}

export default SaveScoreForm;
