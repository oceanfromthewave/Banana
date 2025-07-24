import { useState, useEffect, useCallback } from "react";

// 닉네임 기준 컬렉션 로딩/추가
export function useCollection(nickname) {
  const [owned, setOwned] = useState([]);
  const [loading, setLoading] = useState(true);

  // 서버에서 소유 캐릭터 목록 불러오기
  const fetchOwned = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/collection/${nickname}`);
      const data = await res.json();
      if (data.ok) setOwned(data.owned);
    } finally {
      setLoading(false);
    }
  }, [nickname]);

  useEffect(() => {
    if (nickname) fetchOwned();
  }, [nickname, fetchOwned]);

  // 서버에 캐릭터 추가(획득)
  const addCharacter = async (character) => {
    const res = await fetch("/api/collection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname, character }),
    });
    const data = await res.json();
    if (data.ok) fetchOwned();
    return data.ok;
  };

  return { owned, addCharacter, loading, refreshOwned: fetchOwned };
}

export default useCollection;
