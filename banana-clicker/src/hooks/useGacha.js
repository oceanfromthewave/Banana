import { useEffect, useState } from "react";

export function useGacha(userId = 1) {
  const [owned, setOwned] = useState([]);
  const [all, setAll] = useState([]);
  const [cooldown, setCooldown] = useState(0); // 쿨타임 적용시 추가

  useEffect(() => {
    // 전체 캐릭터 목록
    fetch("/api/characters")
      .then((r) => r.json())
      .then(setAll);
    // 유저 보유 캐릭터
    fetch(`/api/user-characters?userId=${userId}`)
      .then((r) => r.json())
      .then(setOwned);
  }, [userId]);

  // 뽑기
  async function roll() {
    const res = await fetch("/api/draw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    if (data.ok) {
      setOwned((prev) => [...prev, data.character.key]);
      return data.character.key;
    }
    return null;
  }

  return { owned, all, roll };
}
