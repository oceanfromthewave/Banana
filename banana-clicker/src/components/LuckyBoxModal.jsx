import React, { useRef, useState } from "react";
import styles from "../styles/LuckyBoxModal.module.scss";
import boxImg from "../assets/box.png";

function LuckyBoxModal({ open, cooldown, cooldownText, result, onDraw, onClose }) {
  const [opened, setOpened] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const boxRef = useRef();

  // 상자 클릭 시
  const handleBoxClick = () => {
    if (opened) return;
    setOpened(true);
    setTimeout(() => {
      setShowResult(true);
      if (onDraw) onDraw();
      // 자동 닫기 1.4초 뒤
      setTimeout(() => {
        setOpened(false);
        setShowResult(false);
        if (onClose) onClose();
      }, 1200);
    }, 900); // 애니메이션 시간
  };

  // 모달 외부 클릭 시 닫기 방지(상자 열릴 때는 절대 닫기 X)
  const handleModalBGClick = (e) => {
    if (!opened && e.target === e.currentTarget && onClose) onClose();
  };

  return open ? (
    <div className={styles.luckyModalBG} onClick={handleModalBGClick}>
      <div className={styles.centerWrap}>
        <div className={styles.guide}>🎁 3시간에 한 번!  
          <br />럭키박스를 열어보세요!
        </div>
        <div className={styles.boxWrap}>
          <img
            src={boxImg}
            alt="럭키박스"
            className={`${styles.boxImg} ${opened ? styles.opened : ""}`}
            onClick={handleBoxClick}
            ref={boxRef}
            tabIndex={0}
            aria-label="럭키박스 열기"
          />
          {!opened &&
            <div className={styles.clickGuide}>
              <span>상자를 눌러서 열기</span>
            </div>
          }
          {/* 결과 */}
          {showResult && result && (
            <div className={styles.resultPanel}>
              {result.key
                ? <span className={styles.prize}>
                    <span className={styles.emoji}>{result.emoji}</span>
                    <span className={styles.prizeName}>{result.name} 획득!</span>
                  </span>
                : <span className={styles.failMsg}>
                    ❌ 꽝! <span>아쉽게도 아이템이 없습니다.</span>
                  </span>
              }
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null;
}

export default LuckyBoxModal;
