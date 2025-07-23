import React, { useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import styles from "../styles/Character.module.scss";
// import clickSound from "../assets/click.wav";

function Character({ type = "banana", onClick, IMG_MAP }) {
  const controls = useAnimation();
  const audioRef = useRef();

  // 2초마다 자동 점프
  useEffect(() => {
    let active = true;
    function loop() {
      controls.start({
        y: [0, -36, 0],
        transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
      });
    }
    if (active) loop();
    return () => { active = false; controls.stop(); };
  }, [controls]);

  // 클릭시 scale/rotate 효과, 효과음
  const handleCharacterClick = () => {
    controls.start({
      scale: [1, 1.18, 0.97, 1],
      rotate: [0, 7, -7, 0],
      transition: { duration: 0.38 }
    });
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
    if (onClick) onClick();
  };

  return (
    <motion.div
      className={styles.character}
      tabIndex={0}
      aria-label="Click Character"
      initial={{ scale: 1, y: 0 }}
      animate={controls}
      whileTap={{ scale: 1.14 }}
      onClick={handleCharacterClick}
    >
      <img
        src={IMG_MAP[type]}
        alt={type}
        className={styles.img}
        draggable="false"
      />
      {/* <audio ref={audioRef} src={clickSound} preload="auto" /> */}
    </motion.div>
  );
}

export default Character;
