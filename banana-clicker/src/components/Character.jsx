import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import styles from "../styles/Character.module.scss";

const PARTICLE_EMOJIS = ["+1", "🍌", "⭐️", "✨", "💥", "🥳", "💛", "🎉"];

function randomEmoji() {
  const n = Math.random();
  if (n < 0.45) return "+1";
  return PARTICLE_EMOJIS[Math.floor(Math.random() * PARTICLE_EMOJIS.length)];
}

function Character({ type, onClick, IMG_MAP, score }) {
  // 위치/파티클 state
  const [pos, setPos] = useState({
    x: window.innerWidth / 2 - 70,
    y: window.innerHeight / 2 - 70
  });
  const [popList, setPopList] = useState([]);
  const idRef = useRef(0);
  const controls = useAnimation();

  // 방향키 이동
  useEffect(() => {
    function handleKeyDown(e) {
      setPos(pos => {
        const step = 36;
        let { x, y } = pos;
        if (e.key === "ArrowLeft") x -= step;
        if (e.key === "ArrowRight") x += step;
        if (e.key === "ArrowUp") y -= step;
        if (e.key === "ArrowDown") y += step;
        x = Math.max(0, Math.min(window.innerWidth - 140, x));
        y = Math.max(0, Math.min(window.innerHeight - 140, y));
        return { x, y };
      });

      // 스페이스바 점수 증가
      if (e.key === " " || e.code === "Space") {
        if (onClick) onClick();
        // 클릭과 동일한 파티클 효과
        createParticles();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line
  }, [onClick]);

  // 캐릭터 점프 애니메이션
  useEffect(() => {
    controls.start({
      y: [0, -36, 0],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    });
    return () => controls.stop();
  }, [controls]);

  // 클릭 시 파티클
  function handleClick(e) {
    if (onClick) onClick();
    createParticles();
  }

  // 파티클 생성 함수 (클릭 or 스페이스)
  function createParticles() {
    const cx = 70; // 중앙 좌표 (img 140x140이니까)
    const cy = 70;
    const count = Math.floor(Math.random() * 3) + 3;
    const newParticles = Array.from({ length: count }).map(() => {
      const angle = Math.random() * Math.PI * 2;
      const dist = 36 + Math.random() * 32;
      return {
        id: idRef.current++,
        x: cx,
        y: cy,
        emoji: randomEmoji(),
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist,
        rotate: (Math.random() - 0.5) * 80,
        scale: 1 + Math.random() * 0.4,
      };
    });
    setPopList(list => [...list, ...newParticles]);
  }

  function handleParticleEnd(id) {
    setPopList(list => list.filter(p => p.id !== id));
  }

  // 점수에 따른 scale (최대 2배로 제한)
  const scale = Math.min(2, 1 + (score || 0) * 0.015);

  return (
    <div className={styles.charRoot}>
      <motion.img
        src={IMG_MAP[type]}
        alt={type}
        className={styles.img}
        draggable="false"
        animate={controls}
        style={{
          position: "absolute",
          left: pos.x,
          top: pos.y,
          zIndex: 11,
          cursor: "pointer",
          width: 140,
          height: 140,
          scale
        }}
        whileTap={{
          scale: scale * 1.11,
          rotate: [0, -10, 10, -6, 6, 0],
          transition: { duration: 0.33 }
        }}
        onClick={handleClick}
      />
      {/* 파티클 애니메이션 */}
      <AnimatePresence>
        {popList.map(p => (
          <motion.div
            key={p.id}
            className={styles.particle}
            initial={{
              opacity: 1,
              x: p.x,
              y: p.y,
              scale: 1,
              rotate: 0,
            }}
            animate={{
              opacity: 0,
              x: p.x + p.dx,
              y: p.y + p.dy,
              scale: p.scale,
              rotate: p.rotate,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.72 + Math.random() * 0.13,
              type: "spring",
              stiffness: 270,
              damping: 19,
            }}
            style={{
              pointerEvents: "none",
              position: "absolute",
              left: pos.x,
              top: pos.y,
              userSelect: "none",
              fontSize: 26 + Math.random() * 13,
              color: "#ffdf48",
              textShadow: "0 2px 10px #e5c30090, 0 1px 0 #fff7",
              fontWeight: 800,
              willChange: "transform, opacity",
              zIndex: 12,
            }}
            onAnimationComplete={() => handleParticleEnd(p.id)}
          >
            {p.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default Character;
