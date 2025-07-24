import React, { useState, useEffect } from "react";
import Character from "./components/Character";
import ScoreBoard from "./components/ScoreBoard";
import Collection from "./components/Collection";
import RankingModal from "./components/RankingModal";
import SaveScoreForm from "./components/SaveScoreForm";
import ThemeSwitcher from "./components/ThemeSwitcher";
import { useGacha } from "./hooks/useGacha";
import { THEMES } from "./constants/themes";
import styles from "./styles/App.module.scss";

// 캐릭터 PNG import
import bananaImg from "./assets/banana.png";
import tomatoImg from "./assets/tomato.png";
import peachImg from "./assets/peach.png";
import appleImg from "./assets/apple.png";
import strawberryImg from "./assets/strawberry.png";

// 캐릭터 이미지 매핑
const IMG_MAP = {
  banana: bananaImg,
  tomato: tomatoImg,
  peach: peachImg,
  apple: appleImg,
  strawberry: strawberryImg,
};

// 시간 포맷 함수
function formatKoreanTime(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getDate()).padStart(2, "0");
  let hour = dateObj.getHours();
  const min = String(dateObj.getMinutes()).padStart(2, "0");
  const sec = String(dateObj.getSeconds()).padStart(2, "0");
  const isAM = hour < 12;
  const apm = isAM ? "오전" : "오후";
  hour = hour % 12 || 12;
  return `${y}-${m}-${d} ${apm} ${hour}:${min}:${sec}`;
}

function App() {
  const gacha = useGacha();
  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState(() => gacha.owned[0] || "banana");
  const [showRanking, setShowRanking] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [themeIdx, setThemeIdx] = useState(0);
  const theme = THEMES[themeIdx];
  const [now, setNow] = useState(new Date());

  // 실시간 시간 갱신
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 캐릭터 변경시 보유목록 반영
  useEffect(() => {
    if (!gacha.owned.includes(current)) setCurrent(gacha.owned[0] || "banana");
  }, [gacha.owned, current]);

  const handleClick = () => setScore((s) => s + 1);

  return (
    <div className={styles.gameRoot}>
      {/* 배경: 꽉 차게 + 중앙 강조 효과 */}
      {theme.image ? (
        <>
          <div className={styles.bgCover}
            style={{ backgroundImage: `url(${theme.image})` }} aria-hidden="true" />
          <div className={styles.bgOverlay}
            style={{ background: theme.bg }} aria-hidden="true" />
          <div className={styles.centerGradient} aria-hidden="true" />
        </>
      ) : (
        <div className={styles.bgSolid}
          style={{ background: theme.bg }} aria-hidden="true" />
      )}

      {/* UI 레이어 */}
      <div className={styles.uiWrap}>
        {/* 우측 상단: 테마, 점수저장, 시간(한 줄에 정렬) */}
        <div className={styles.topRightUI}>
  <div className={styles.topRightRow}>
    <ThemeSwitcher themeIdx={themeIdx} setThemeIdx={setThemeIdx} />
    <button
      className={styles.saveBtn}
      onClick={() => setShowSave(true)}
    >💾 점수 저장</button>
  </div>
  <div className={styles.timeNow}>
      <span className={styles.timeNowIcon}>⏰</span>
    {formatKoreanTime(now)}
  </div>
</div>

        {/* 중앙 ScoreBoard + Character */}
        <ScoreBoard score={score} />
        <Character type={current} onClick={handleClick} IMG_MAP={IMG_MAP} />

        {/* 우측 하단 보유 캐릭터 */}
        <div className={styles.collectionWrap}>
          <Collection owned={gacha.owned} IMG_MAP={IMG_MAP} />
        </div>

        {/* 캐릭터 선택 바 (좌하단 고정) */}
        <div className={styles.charSelectBar}>
          {gacha.owned.map((c) => (
            <button
              key={c}
              className={`
                ${styles.charBtn}
                ${c === current ? styles.charBtnActive : ""}
              `}
              onClick={() => setCurrent(c)}
              aria-label={c}
            >
              <img
                src={IMG_MAP[c]}
                alt={c}
                className={styles.charBtnImg}
                draggable="false"
              />
            </button>
          ))}
        </div>

        {/* 랭킹 버튼 (좌상단 고정) */}
        <button
          className={styles.rankingBtn}
          onClick={() => setShowRanking(true)}
        >🏆 랭킹 보기</button>

        {/* 랭킹 모달 */}
        <RankingModal open={showRanking} onClose={() => setShowRanking(false)} />

        {/* 점수 저장 모달 */}
        {showSave && (
          <div className={styles.modalBG} onClick={() => setShowSave(false)}>
            <div
              className={styles.modalBox}
              onClick={e => e.stopPropagation()}
            >
              <h2>💾 점수 저장</h2>
              <SaveScoreForm score={score} onSaved={() => setShowSave(false)} />
              <div style={{ textAlign: "right", marginTop: 15 }}>
                <button
                  onClick={() => setShowSave(false)}
                  className={styles.modalCloseBtn}
                >닫기</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
