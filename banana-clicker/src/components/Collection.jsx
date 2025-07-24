import React from "react";
import styles from "../styles/Collection.module.scss";

const ALL_CHARACTERS = [
  { key: "banana", name: "바나나" },
  { key: "tomato", name: "토마토" },
  { key: "peach", name: "복숭아" },
  { key: "apple", name: "사과" },
  { key: "strawberry", name: "딸기" }
];

function Collection({ owned, IMG_MAP }) {
  const percent = Math.round((owned.length / ALL_CHARACTERS.length) * 100);
  return (
    <div className={styles.collectionBox}>
      <div className={styles.header}>📒 캐릭터 도감</div>
      <div className={styles.progress}>
        수집률 <span className={styles.percent}>{percent}%</span>
        <span className={styles.count}>({owned.length}/{ALL_CHARACTERS.length})</span>
      </div>
      <div className={styles.grid}>
        {ALL_CHARACTERS.map((c) => (
          <div
            key={c.key}
            className={`${styles.item} ${owned.includes(c.key) ? styles.owned : styles.locked}`}
          >
            <img
              src={IMG_MAP[c.key]}
              alt={c.name}
              className={styles.img}
              draggable="false"
            />
            <div className={styles.name}>{c.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Collection;
