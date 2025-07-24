import React, { useState, useEffect } from "react";
import styles from "../styles/LuckyBoxModal.module.scss";
import boxImg from "../assets/box.png"; // 반드시 존재해야함

function msToHMS(ms) {
  let s = Math.ceil(ms / 1000);
  let h = Math.floor(s / 3600);
  let m = Math.floor((s % 3600) / 60);
  s = s % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const BLUR_BG_STYLE = {
  backdropFilter: "blur(4px)",
  background: "rgba(0,0,0,0.28)"
};

function LuckyBoxModal({ open, onClose, nickname, onSuccess, cooldown }) {
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState(null); // { prize: 'banana' } or null
  const [error, setError] = useState("");
  const [remain, setRemain] = useState(cooldown);

  // 쿨타임 체크
  useEffect(() => {
    if (!open) return;
    setRemain(cooldown);
    if (cooldown > 0) {
      const t = setInterval(() => {
        setRemain(r => Math.max(0, r - 1000));
      }, 1000);
      return () => clearInterval(t);
    }
  }, [cooldown, open]);

  if (!open) return null;

  // 뽑기 버튼
  async function handleDraw() {
    setRolling(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/collection/luckybox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname }),
      });
      if (res.status === 403) {
        const data = await res.json();
        setError(`⏳ 쿨타임: ${msToHMS(data.remain)}`);
      } else if (res.ok) {
        const data = await res.json();
        setResult(data.prize ? data.prize : "fail");
        if (data.prize) onSuccess && onSuccess();
      } else {
        setError("에러가 발생했습니다");
      }
    } catch (e) {
      setError("네트워크 오류");
    } finally {
      setRolling(false);
    }
  }

  return (
    <div className={styles.modalBg} style={BLUR_BG_STYLE}>
      <div className={styles.luckyBoxModal}>
        <div className={styles.header}>🎁 럭키박스 - 3시간마다 도전!</div>
        <div className={styles.desc}>상자를 클릭해서 새로운 캐릭터를 뽑아보세요!</div>
        <button
          className={styles.boxBtn}
          onClick={handleDraw}
          disabled={rolling || remain > 0}
          style={{ outline: "none" }}
        >
          <img
            src={boxImg}
            alt="럭키박스"
            className={`${styles.boxImg} ${rolling ? styles.rolling : ""}`}
          />
        </button>
        {rolling && <div className={styles.msg}>상자를 여는 중...</div>}
        {result === "fail" && (
          <div className={styles.fail}>❌ 꽝! (이미 다 모았거나 확률 실패)</div>
        )}
        {result && result !== "fail" && (
          <div className={styles.success}>
            <b>🎉 축하합니다! 새로운 캐릭터: {result}</b>
          </div>
        )}
        {error && <div className={styles.error}>{error}</div>}
        {remain > 0 && (
          <div className={styles.cooldown}>⏳ {msToHMS(remain)} 후 재도전</div>
        )}
        <button className={styles.closeBtn} onClick={onClose} disabled={rolling}>
          닫기
        </button>
      </div>
    </div>
  );
}

export default LuckyBoxModal;
