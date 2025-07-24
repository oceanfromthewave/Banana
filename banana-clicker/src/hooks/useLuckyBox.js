import { useState, useEffect, useCallback } from "react";
import { LUCKY_PRIZES } from "../constants/luckyPrizes";

const COOLDOWN_MS = 3 * 60 * 60 * 1000; // 3시간 (테스트는 10000 등으로 변경 가능)

export function useLuckyBox() {
  const [lastDraw, setLastDraw] = useState(() =>
    Number(localStorage.getItem("lucky-last") || 0)
  );
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    const tick = setInterval(() => {
      setCooldown(Math.max(0, lastDraw + COOLDOWN_MS - Date.now()));
    }, 1000);
    return () => clearInterval(tick);
  }, [lastDraw]);

  // 실제 뽑기 함수 (결과 리턴)
  const draw = useCallback(() => {
    if (cooldown > 0) return { key: null, name: "", emoji: "", percent: 0 };
    let r = Math.random() * 100;
    let acc = 0;
    for (const prize of LUCKY_PRIZES) {
      acc += prize.percent;
      if (r < acc) {
        setLastDraw(Date.now());
        localStorage.setItem("lucky-last", Date.now());
        return prize;
      }
    }
    // fallback
    return LUCKY_PRIZES[LUCKY_PRIZES.length - 1];
  }, [cooldown]);

  function cooldownText(ms = cooldown) {
    let s = Math.ceil(ms / 1000);
    let h = Math.floor(s / 3600);
    let m = Math.floor((s % 3600) / 60);
    s = s % 60;
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  return { cooldown, cooldownText, draw };
}
