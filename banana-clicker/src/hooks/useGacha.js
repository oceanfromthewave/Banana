import { useState, useEffect } from "react";

const CHARACTERS = ["banana", "tomato", "peach", "apple", "strawberry"];

export function useGacha() {
  // 마지막 뽑기 시각 저장
  const [lastTime, setLastTime] = useState(() =>
    Number(localStorage.getItem("gacha-last") || 0)
  );
  // 보유 캐릭터
  const [owned, setOwned] = useState(() =>
    JSON.parse(localStorage.getItem("gacha-owned") || '["banana"]')
  );
  // 남은 쿨타임
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const remain = Math.max(0, lastTime + 3 * 60 * 60 * 1000 - Date.now());
      setCooldown(remain);
    }, 1000);
    return () => clearInterval(interval);
  }, [lastTime]);

  // 뽑기 시도
  function roll() {
    if (cooldown > 0) return null;
    // 랜덤 캐릭터(이미 있으면 꽝)
    const available = CHARACTERS.filter((c) => !owned.includes(c));
    if (available.length === 0) return null;
    const idx = Math.floor(Math.random() * available.length);
    const result = available[idx];

    const next = [...owned, result];
    setOwned(next);
    setLastTime(Date.now());
    localStorage.setItem("gacha-last", Date.now());
    localStorage.setItem("gacha-owned", JSON.stringify(next));
    return result;
  }

  return { owned, cooldown, roll };
}
