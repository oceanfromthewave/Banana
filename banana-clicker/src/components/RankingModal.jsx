import React from "react";
import styles from "../styles/RankingModal.module.scss";

const getTrophy = (idx) => {
  if (idx === 0) return <span className={styles.trophy}>🥇</span>;
  if (idx === 1) return <span className={styles.trophy}>🥈</span>;
  if (idx === 2) return <span className={styles.trophy}>🥉</span>;
  return <span className={styles.rank}>{idx + 1}</span>;
};

function RankingModal({ open, onClose, ranking = [], myNickname }) {
  if (!open) return null;

  return (
    <div className={styles.modalBg}>
      <div className={styles.rankingModal}>
        <div className={styles.header}>🏆 실시간 랭킹</div>
        <div className={styles.rankingList}>
          {ranking.length === 0 && <div className={styles.noData}>아직 점수가 없습니다.</div>}
          {ranking.map((row, i) => (
            <div
              key={row.nickname + row.score}
              className={`${styles.rankingRow} ${row.nickname === myNickname ? styles.me : ""}`}
            >
              {getTrophy(i)}
              <span className={styles.nick}>{row.nickname}</span>
              <span className={styles.score}>{row.score}점</span>
              <span className={styles.date}>{new Date(row.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
        <button className={styles.closeBtn} onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}

export default RankingModal;
