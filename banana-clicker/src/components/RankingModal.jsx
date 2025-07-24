import React, { useEffect, useState } from "react";
import { fetchRanking } from "../hooks/useRanking";
import styles from "../styles/RankingModal.module.scss";

function RankingModal({ open, onClose }) {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    if (open) fetchRanking().then(setRanking);
  }, [open]);

  if (!open) return null;

  return (
    <div className={styles.modalBG} onClick={onClose}>
      <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
        <h2 className={styles.title}>
          <span role="img" aria-label="trophy">🏆</span>{" "}
          하이스코어 랭킹
        </h2>
        <div className={styles.rankingList}>
          {ranking.length === 0 && <div className={styles.noRanking}>아직 랭킹 없음</div>}
          {ranking.map((row, i) => (
            <div key={row.id || i} className={styles.rankRow}>
              <span className={styles.rankIdx}>{i + 1}위</span>
              <span className={styles.rankName}>{row.nickname}</span>
              <span className={styles.rankScore}>{row.score}점</span>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "right", marginTop: 10 }}>
          <button onClick={onClose} className={styles.closeBtn}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

export default RankingModal;
