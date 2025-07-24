import React from "react";
import styles from "../styles/ScoreBoard.module.scss";

function ScoreBoard({ score }) {
  return (
    <div className={styles.scoreBoard}>
      🍌 Score: {score}
    </div>
  );
}

export default ScoreBoard;
