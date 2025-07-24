import React, { useState } from "react";
import styles from '../styles/Home.module.scss';

function Home({ setNickname }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleStart() {
    if (!input.trim()) {
      setError("닉네임을 입력해 주세요!");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // 닉네임을 서버에 등록 (없으면 생성)
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: input.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "등록 실패");
        setLoading(false);
        return;
      }
      // 성공 시 localStorage와 App 상태 갱신
      localStorage.setItem("nickname", input.trim());
      setNickname(input.trim());
      // App.jsx의 useEffect로 자동 라우팅!
    } catch (e) {
      setError("서버 에러: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.homeRoot}>
      <div className={styles.box}>
        <h1 className={styles.title}>🍌 Banana Clicker</h1>
        <p className={styles.desc}>
          게임을 시작하려면 <b>닉네임</b>을 입력하세요!
        </p>
        <input
          value={input}
          onChange={e => { setInput(e.target.value); setError(""); }}
          placeholder="닉네임"
          className={styles.input}
          disabled={loading}
          onKeyDown={e => { if (e.key === "Enter") handleStart(); }}
        /><br />
        <button
          onClick={handleStart}
          className={styles.startBtn}
          disabled={loading}
        >{loading ? "확인 중..." : "게임 시작"}</button>
        {error && <div className={styles.error}>{error}</div>}
      </div>
    </div>
  );
}

export default Home;
