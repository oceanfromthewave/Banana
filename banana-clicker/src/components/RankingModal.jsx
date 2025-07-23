import React, { useEffect, useState } from "react";
import { fetchRanking } from "../hooks/useRanking";

function RankingModal({ open, onClose }) {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    if (open) fetchRanking().then(setRanking);
  }, [open]);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh",
        background: "rgba(0,0,0,0.38)", zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center"
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff", borderRadius: 20, minWidth: 340, padding: 30,
          boxShadow: "0 4px 32px #2222"
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2 style={{
          margin: 0, marginBottom: 18, textAlign: "center",
          fontWeight: 800, fontSize: 25, letterSpacing: -1.5
        }}>
          <span role="img" aria-label="trophy">🏆</span>{" "}
          하이스코어 랭킹
        </h2>
        <div style={{marginTop: 10, marginBottom: 12}}>
          {ranking.length === 0 && <div style={{textAlign:"center"}}>아직 랭킹 없음</div>}
          {ranking.map((row, i) => (
            <div key={row.id || i} style={{
              fontSize: 18, marginBottom: 7, display: "flex", alignItems: "center"
            }}>
              <span style={{
                minWidth: 42, fontWeight: 700, fontSize: 20, color: "#ffa800"
              }}>
                {i + 1}위
              </span>
              <span style={{
                color: "#ffce47", fontWeight: 700, marginLeft: 5, minWidth: 95
              }}>
                {row.nickname}
              </span>
              <span style={{fontWeight: 600, color: "#222", marginLeft: 5}}>
                {row.score}점
              </span>
            </div>
          ))}
        </div>
        <div style={{textAlign: "right", marginTop: 10}}>
          <button onClick={onClose} style={{
            padding: "7px 20px", fontWeight: 600, borderRadius: 9,
            border: "none", background: "#eee", fontSize: 16, cursor: "pointer"
          }}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

export default RankingModal;
