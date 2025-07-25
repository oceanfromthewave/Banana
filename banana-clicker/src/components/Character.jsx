import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import styles from "../styles/Character.module.scss";

// 파티클 이모지 모음
const PARTICLE_EMOJIS = ["+1", "🍌", "⭐️", "✨", "💥", "🥳", "💛", "🎉"];

function randomEmoji() {
  const n = Math.random();
  if (n < 0.45) return "+1";
  return PARTICLE_EMOJIS[Math.floor(Math.random() * PARTICLE_EMOJIS.length)];
}

function Character({ type, onClick, IMG_MAP, score = 0, scale = 1, particleKey }) {
  const [popList, setPopList] = useState([]);
  const idRef = useRef(0);
  const controls = useAnimation();

  // 점프 애니메이션 (scale 연동)
  useEffect(() => {
    controls.start({
      y: [0, -36 * scale, 0],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    });
    return () => controls.stop();
  }, [controls, scale]);

  // 클릭시 점수+파티클
  function handleClick(e) {
    if (onClick) onClick();
    burstParticles();
  }

  // particleKey 바뀔 때(스페이스바)도 파티클 터짐
  useEffect(() => {
    if (particleKey > 0) burstParticles();
    // eslint-disable-next-line
  }, [particleKey]);

  function burstParticles() {
    const cx = 70 * scale;
    const cy = 70 * scale;
    const count = Math.floor(Math.random() * 3) + 3;
    const newParticles = Array.from({ length: count }).map(() => {
      const angle = Math.random() * Math.PI * 2;
      const dist = (36 + Math.random() * 32) * scale;
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
          left: "50%",
          top: "50%",
          width: 140 * scale,
          height: 140 * scale,
          transform: "translate(-50%, -50%)",
          zIndex: 11,
          cursor: "pointer",
        }}
        whileTap={{
          scale: 1.11 * scale,
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
              left: "50%",
              top: "50%",
              userSelect: "none",
              fontSize: 26 * scale + Math.random() * 13,
              color: "#ffdf48",
              textShadow: "0 2px 10px #e5c30090, 0 1px 0 #fff7",
              fontWeight: 800,
              willChange: "transform, opacity",
              zIndex: 12,
              transform: "translate(-50%, -50%)"
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
