import React, { useState } from "react";
import styles from "../styles/GachaModal.module.scss";

const EMOJI = {
  banana: "🍌",
  tomato: "🍅",
  peach: "🍑",
  apple: "🍎",
  strawberry: "🍓",
  grape: "🍇"
};

function msToHMS(ms) {
  let s = Math.ceil(ms / 1000);
  let h = Math.floor(s / 3600);
  let m = Math.floor((s % 3600) / 60);
  s = s % 60;
  return `${h}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

function GachaModal({ owned, cooldown, roll }) {
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState(null);
  const [animState, setAnimState] = useState(""); // "success" | "fail" | ""

  // 뽑기 시도
  const handleRoll = () => {
    setRolling(true);
    setResult(null);
    setAnimState("");
    setTimeout(() => {
      const res = roll();
      setRolling(false);
      setResult(res || "fail");
      setAnimState(res ? "success" : "fail");
      setTimeout(() => setAnimState(""), 1800);
    }, 1100);
  };

  return (
    <div className={styles.gachaModal}>
      <div className={styles.title}>🍀 캐릭터 뽑기</div>
      <div className={styles.action}>
        {cooldown > 0 ? (
          <span className={styles.cooldown}>
            ⏳ {msToHMS(cooldown)} 후에 다시 가능!
          </span>
        ) : (
          <button
            onClick={handleRoll}
            disabled={rolling}
            className={styles.rollBtn}
          >
            {rolling ? "뽑는 중..." : "뽑기!"}
          </button>
        )}
      </div>
      <div className={styles.ownedWrap}>
        <b>보유 캐릭터</b>:
        <span className={styles.ownedList}>
          {owned.map(c => (
            <span key={c} className={styles.ownedChar}>
              {EMOJI[c]}
            </span>
          ))}
        </span>
      </div>
      {/* Gacha 이펙트 연출 */}
      <div className={styles.resultWrap}>
        {rolling && (
          <div className={styles.rollingText}>🎁 상자를 여는 중...</div>
        )}
        {!rolling && result && (
          <div
            className={
              result !== "fail"
                ? styles.resultSuccess
                : styles.resultFail
            }
          >
            {result !== "fail" ? (
              <span>
                <span className={styles.resultEmoji}>{EMOJI[result]}</span>
                <span className={styles.resultText}>획득!</span>
              </span>
            ) : (
              <span>
                ❌ 실패! <span className={styles.resultMsg}>이미 다 모았거나 중복</span>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
export default GachaModal;
