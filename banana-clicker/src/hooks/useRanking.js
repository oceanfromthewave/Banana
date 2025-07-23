const API = "http://localhost:4000/api";

// 점수 저장 (닉네임, 점수)
export async function saveScore(nickname, score) {
  const res = await fetch(`${API}/score`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nickname, score }),
  });
  return await res.json();
}

// 랭킹 조회 (상위 10명)
export async function fetchRanking() {
  const res = await fetch(`${API}/ranking`);
  return await res.json();
}
