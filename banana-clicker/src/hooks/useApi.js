const API = "http://localhost:4000/api";

// 닉네임 등록(회원가입) 및 userId 반환
export async function register(nickname) {
  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nickname }),
  });
  if (!res.ok) throw new Error((await res.json()).error || "등록 실패");
  return await res.json();
}

// 전체 캐릭터 조회
export async function fetchCharacters() {
  const res = await fetch(`${API}/characters`);
  return await res.json();
}

// 내 수집 캐릭터 조회
export async function fetchUserCharacters(userId) {
  const res = await fetch(`${API}/user/${userId}/characters`);
  return await res.json();
}

// LuckyBox(뽑기)
export async function luckyboxDraw(userId) {
  const res = await fetch(`${API}/user/${userId}/luckybox`, { method: "POST" });
  if (!res.ok) {
    const e = await res.json();
    throw new Error(e.error || "뽑기 실패");
  }
  return await res.json();
}

// 점수 저장
export async function saveUserScore(userId, score) {
  const res = await fetch(`${API}/user/${userId}/score`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ score }),
  });
  if (!res.ok) throw new Error((await res.json()).error || "점수 저장 실패");
  return await res.json();
}

// 랭킹
export async function fetchRanking() {
  const res = await fetch(`${API}/ranking`);
  return await res.json();
}
