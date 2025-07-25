import React, { useState, useEffect, useRef, useCallback } from "react";
import ScoreBoard from "../components/ScoreBoard";
import Character from "../components/Character";
import Collection from "../components/Collection";
import RankingModal from "../components/RankingModal";
import SaveScoreForm from "../components/SaveScoreForm";
import ThemeSwitcher from "../components/ThemeSwitcher";
import LuckyBoxModal from "../components/LuckyBoxModal";
import { THEMES } from "../constants/themes";
import { useCollection } from "../hooks/useCollection";
import styles from "../styles/Game.module.scss";
import { AnimatePresence, motion } from "framer-motion";

import bananaImg from "../assets/banana.png";
import tomatoImg from "../assets/tomato.png";
import peachImg from "../assets/peach.png";
import appleImg from "../assets/apple.png";
import strawberryImg from "../assets/strawberry.png";
import grapeImg from "../assets/grape.png";

const IMG_MAP = {
  banana: bananaImg,
  tomato: tomatoImg,
  peach: peachImg,
  apple: appleImg,
  strawberry: strawberryImg,
  grape: grapeImg,
};

const COOLDOWN_MS = 3 * 60 * 60 * 1000; // 3시간

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

function Game({ nickname }) {
  const [score, setScore] = useState(0);
  const [particleKey, setParticleKey] = useState(0);
  const [themeIdx, setThemeIdx] = useState(0);
  const theme = THEMES[themeIdx];
  const [showRanking, setShowRanking] = useState(false);
  const [ranking, setRanking] = useState([]);
  const [showSave, setShowSave] = useState(false);

  const [showLuckyBox, setShowLuckyBox] = useState(false);
  const [luckyCooldown, setLuckyCooldown] = useState(null);
  const [now, setNow] = useState(new Date());
  const timerRef = useRef();
  const [bgKey, setBgKey] = useState(0);

  useEffect(() => {
    setBgKey(k => k + 1);
  }, [themeIdx]);

  // DB 연동 컬렉션
  const { owned, addCharacter, loading: ownedLoading, refreshOwned } = useCollection(nickname);
  const [current, setCurrent] = useState("banana");

  // 실시간 시간 갱신
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // 랭킹 가져오기 (백엔드 /api/ranking API 사용)
    async function fetchRanking() {
      const res = await fetch("/api/ranking");
      const data = await res.json();
      setRanking(data);
    }
    fetchRanking();
  }, []);

  // owned 캐릭터가 변경될 때 current 변경
  useEffect(() => {
    if (owned && owned.length > 0 && !owned.includes(current)) {
      setCurrent(owned[0]);
    }
  }, [owned, current]);

  // LuckyBox 쿨타임 관리 (최초 진입, 뽑기 성공 후 fetch)
  const fetchLuckyboxCooldown = async (suppressAutoOpen = false) => {
    const res = await fetch(`/api/luckybox/last/${nickname}`);
    const data = await res.json();
    if (!data.lastTime) {
      setLuckyCooldown(null);
      setShowLuckyBox(false);
      return;
    }
    const now = Date.now();
    const remain = data.lastTime + COOLDOWN_MS - now;
    if (remain <= 0) {
      setLuckyCooldown(0);
      if (!suppressAutoOpen) setShowLuckyBox(true);
    } else {
      setLuckyCooldown(remain);
      setShowLuckyBox(false);
      timerRef.current = setTimeout(() => setShowLuckyBox(true), remain);
    }
  };

  useEffect(() => {
    fetchLuckyboxCooldown();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [nickname]);

  // LuckyBox 뽑기 성공/닫기 후 쿨타임 새로고침
  const handleLuckyBoxClose = () => {
    setShowLuckyBox(false);
    fetchLuckyboxCooldown(true);
  };

  // 캐릭터 클릭, 스페이스바, 파티클/스케일 증가 모두 여기서!
  const handleScoreUp = useCallback(() => {
    setScore(s => s + 1);
    setParticleKey(k => k + 1);
  }, []);

  // 스페이스바 점수+파티클
  useEffect(() => {
    function handleSpace(e) {
      if ((e.code === "Space" || e.key === " " || e.keyCode === 32)) {
        e.preventDefault();
        handleScoreUp();
      }
    }
    window.addEventListener("keydown", handleSpace);
    return () => window.removeEventListener("keydown", handleSpace);
  }, [handleScoreUp]);

  // 확대 비율: 점수 0~최대값에 따라 1~2.5 정도까지
  const minScale = 1;
  const maxScale = 2.5;
  const maxScore = 300; // 이 점수까지 가면 최대 크기 도달
  const characterScale = minScale + (maxScale - minScale) * Math.min(score, maxScore) / maxScore;
  const bgScale = characterScale; // 배경도 동일하게 확대 (원하면 따로 조절)

  if (ownedLoading) {
    return (
      <div className={styles.gameRoot}>
        <div className={styles.centerLoading}>캐릭터 정보 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className={styles.gameRoot}>
      {/* LuckyBox 모달 */}
      <LuckyBoxModal
        open={showLuckyBox}
        onClose={handleLuckyBoxClose}
        nickname={nickname}
        onSuccess={() => {
          refreshOwned();
          alert("🎉 새로운 캐릭터를 획득했습니다!");
          handleLuckyBoxClose();
        }}
        cooldown={luckyCooldown === null ? undefined : luckyCooldown}
      />
      {/* 배경 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={bgKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, scale: bgScale }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            originX: 0.5,
            originY: 0.5,
          }}
        >
          {theme.image ? (
            <>
              <div
                className={styles.bgCover}
                style={{ backgroundImage: `url(${theme.image})` }}
                aria-hidden="true"
              />
              <div
                className={styles.bgOverlay}
                style={{ background: theme.bg }}
                aria-hidden="true"
              />
              <div className={styles.centerGradient} aria-hidden="true" />
            </>
          ) : (
            <div
              className={styles.bgSolid}
              style={{ background: theme.bg }}
              aria-hidden="true"
            />
          )}
        </motion.div>
      </AnimatePresence>
      <div className={styles.uiWrap}>
        {/* 우측 상단: 테마, 저장, 시간 */}
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
        <div className={styles.centerMain}>
          <Character
            type={current}
            onClick={handleScoreUp}
            IMG_MAP={IMG_MAP}
            score={score}
            scale={characterScale}
            particleKey={particleKey}
          />
        </div>

        {/* 우측 하단 도감 */}
        <div className={styles.collectionWrap}>
          <Collection owned={owned} IMG_MAP={IMG_MAP} />
        </div>

        {/* 좌하단 캐릭터 선택 */}
        <div className={styles.charSelectBar}>
          {owned.map((c) => (
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

        {/* 랭킹 모달 버튼 */}
        <button
          className={styles.rankingBtn}
          onClick={() => setShowRanking(true)}
        >🏆 랭킹 보기</button>

        {/* 랭킹 모달 */}
        <RankingModal
          open={showRanking}
          onClose={() => setShowRanking(false)}
          ranking={ranking}
          myNickname={nickname}
        />

        {/* 점수 저장 모달 */}
        {showSave && (
          <div className={styles.modalBG} onClick={() => setShowSave(false)}>
            <div
              className={styles.modalBox}
              onClick={e => e.stopPropagation()}
            >
              <h2>💾 점수 저장</h2>
              <SaveScoreForm
                score={score}
                nickname={nickname}
                onSaved={() => {
                  setShowSave(false);
                  setScore(0);
                }}
              />
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

export default Game;
