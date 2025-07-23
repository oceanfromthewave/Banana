import React from "react";

function ScoreBoard({ score }) {
  return (
    <div
      className="score-board"
      style={{
        position: "absolute",
        left: "50%",
        top: 36,
        transform: "translateX(-50%)",
        fontSize: 32,
        color: "#333",
        fontWeight: 700,
        background: "rgba(255,255,255,0.82)",
        padding: "14px 38px",
        borderRadius: 30,
        boxShadow: "0 6px 28px #2221",
        letterSpacing: 2,
        minWidth: 120,
        textAlign: "center",
        userSelect: "none",
      }}
    >
      🍌 Score: {score}
    </div>
  );
}

export default ScoreBoard;
