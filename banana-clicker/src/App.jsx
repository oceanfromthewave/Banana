import React, { useState } from "react";
import Character from "./components/Character";
import ScoreBoard from "./components/ScoreBoard";
import GachaModal from "./components/GachaModal";
import Collection from "./components/Collection";
import RankingModal from "./components/RankingModal";
import SaveScoreForm from "./components/SaveScoreForm";
import ThemeSwitcher from "./components/ThemeSwitcher";
import { useGacha } from "./hooks/useGacha";
import { THEMES } from "./constants/themes";

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

function App() {
  const gacha = useGacha();
  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState(() => gacha.owned[0] || "banana");
  const [showRanking, setShowRanking] = useState(false);
  const [showSave, setShowSave] = useState(false);

  // 테마 인덱스(0: 기본, 1: Night, 2: City, ...)
  const [themeIdx, setThemeIdx] = useState(0);
  const theme = THEMES[themeIdx];

  // 캐릭터 변경시 보유목록 반영
  React.useEffect(() => {
    if (!gacha.owned.includes(current)) setCurrent(gacha.owned[0] || "banana");
  }, [gacha.owned, current]);

  const handleClick = () => setScore((s) => s + 1);

  return (
    <div
      className="game-root"
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Trick 1: 배경 이미지 + 블러 + 그라디언트 오버레이 */}
      {theme.image && (
        <>
          {/* 배경이미지 + 블러 */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 0,
              background: `center/cover no-repeat url(${theme.image})`,
              filter: "blur(32px) brightness(0.93)",
              transform: "scale(1.03)", // 가장자리 채우기
            }}
            aria-hidden="true"
          />
          {/* 중앙선명한 실제 배경 */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1,
              pointerEvents: "none",
              background: `center/contain no-repeat url(${theme.image})`,
              // contain이라 잘림 없이 가운데 선명하게!
            }}
            aria-hidden="true"
          />
          {/* 그라디언트 오버레이(배경색 자연스러운 연결) */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 2,
              pointerEvents: "none",
              background: theme.bg,
              opacity: 0.85,
              mixBlendMode: "lighter", // 밝은 배경에 자연스럽게 섞이게!
            }}
            aria-hidden="true"
          />
        </>
      )}

      {/* 만약 이미지 없으면 bg만 */}
      {!theme.image && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            background: theme.bg,
          }}
          aria-hidden="true"
        />
      )}

      {/* 나머지 UI */}
      <div style={{ position: "relative", zIndex: 10 }}>
        <ScoreBoard score={score} />
        <Character type={current} onClick={handleClick} IMG_MAP={IMG_MAP} />
        <Collection owned={gacha.owned} IMG_MAP={IMG_MAP} />
        <GachaModal {...gacha} />

        {/* 캐릭터 선택 */}
        <div style={{
          position: "absolute", left: 32, bottom: 32, zIndex: 100,
          display: "flex", gap: 10, background: "#fff8",
          borderRadius: 18, padding: "14px 18px", boxShadow: "0 2px 14px #2222"
        }}>
          {gacha.owned.map((c) => (
            <button key={c}
              style={{
                background: c === current ? "#ffd700" : "#fff",
                border: c === current ? "2.5px solid #ffe066" : "2px solid #eee",
                borderRadius: 11,
                padding: 3, width: 52, height: 52, cursor: "pointer",
                boxShadow: c === current ? "0 2px 12px #ffd70066" : "none",
                outline: "none",
                transition: "all 0.14s"
              }}
              onClick={() => setCurrent(c)}
              aria-label={c}
            >
              <img
                src={IMG_MAP[c]}
                alt={c}
                style={{ width: 38, height: 38, objectFit: "contain" }}
                draggable="false"
              />
            </button>
          ))}
        </div>

        {/* 테마 전환 버튼 */}
        <ThemeSwitcher themeIdx={themeIdx} setThemeIdx={setThemeIdx} />

        {/* 랭킹 보기 버튼 */}
        <button
          onClick={() => setShowRanking(true)}
          style={{
            position: "absolute", top: 38, left: 42, zIndex: 200,
            padding: "8px 25px", background: "#ffe066", borderRadius: 11,
            fontWeight: 700, border: "none", cursor: "pointer"
          }}>
          🏆 랭킹 보기
        </button>

        {/* 점수 저장 버튼 */}
        <button
          onClick={() => setShowSave(true)}
          style={{
            position: "absolute", top: 38, right: 42, zIndex: 200,
            padding: "8px 25px", background: "#7de47c", borderRadius: 11,
            fontWeight: 700, border: "none", cursor: "pointer", color: "#fff"
          }}>
          💾 점수 저장
        </button>

        {/* 랭킹 모달 */}
        <RankingModal open={showRanking} onClose={() => setShowRanking(false)} />

        {/* 점수 저장 모달 */}
        {showSave &&
          <div
            style={{
              position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh",
              background: "rgba(0,0,0,0.32)", zIndex: 9998,
              display: "flex", alignItems: "center", justifyContent: "center"
            }}
            onClick={() => setShowSave(false)}
          >
            <div
              style={{
                background: "#fff", borderRadius: 18, minWidth: 320, padding: 26,
                boxShadow: "0 4px 44px #2224"
              }}
              onClick={e => e.stopPropagation()}
            >
              <h2 style={{marginTop:0}}>💾 점수 저장</h2>
              <SaveScoreForm score={score} onSaved={() => setShowSave(false)} />
              <div style={{textAlign: "right", marginTop: 15}}>
                <button onClick={() => setShowSave(false)}
                  style={{
                    padding: "7px 20px", fontWeight: 600, borderRadius: 9,
                    border: "none", background: "#eee"
                  }}>
                  닫기
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  );
}

export default App;
