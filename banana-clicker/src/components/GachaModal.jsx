import React, { useState } from "react";

const EMOJI = {
  banana: "🍌",
  tomato: "🍅",
  peach: "🍑",
  apple: "🍎",
  strawberry: "🍓",
};

function msToHMS(ms) {
  let s = Math.ceil(ms / 1000);
  let h = Math.floor(s / 3600);
  let m = Math.floor((s % 3600) / 60);
  s = s % 60;
  return `${h}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

function GachaModal({ owned, cooldown, roll }) {
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState(null);
  const [animState, setAnimState] = useState(""); // "success" | "fail" | ""

  // 뽑기 시도
  const handleRoll = () => {
    setRolling(true);
    setResult(null);
    setAnimState("");
    setTimeout(() => {
      const res = roll();
      setRolling(false);
      setResult(res || "fail");
      setAnimState(res ? "success" : "fail");
      // 애니메이션 상태는 잠시 유지
      setTimeout(() => setAnimState(""), 1800);
    }, 1100); // 1.1초 연출
  };

  // 효과 애니메이션 스타일
  let boxShadow = "";
  let filter = "";
  if (animState === "success") {
    boxShadow = "0 0 44px #ffe066, 0 0 122px #ffd70099";
    filter = "drop-shadow(0 0 26px #fff89a)";
  }
  if (animState === "fail") {
    boxShadow = "0 0 20px #aaa8";
    filter = "grayscale(1) blur(1px)";
  }

  return (
    <div style={{
      position: "absolute", right: 40, top: 40, zIndex: 99,
      background: "rgba(255,255,255,0.98)",
      borderRadius: 18, boxShadow: "0 4px 24px #2221",
      padding: 24, width: 260, minHeight: 110,
      textAlign: "center"
    }}>
      <div style={{fontWeight: 600, fontSize: 22, marginBottom: 10}}>🍀 캐릭터 뽑기</div>
      <div style={{marginBottom: 12, minHeight: 40}}>
        {cooldown > 0 ? (
          <span style={{color:"#d12", fontWeight:500}}>
            ⏳ {msToHMS(cooldown)} 후에 다시 가능!
          </span>
        ) : (
          <button
            onClick={handleRoll}
            disabled={rolling}
            style={{
              fontSize:20, fontWeight:600, padding:"7px 30px",
              borderRadius: 12, background:"#ffe066", border:"none",
              boxShadow:"0 2px 9px #ffd70033", cursor:"pointer",
              opacity: rolling ? 0.5 : 1
            }}>
            {rolling ? "뽑는 중..." : "뽑기!"}
          </button>
        )}
      </div>
      <div>
        <b>보유 캐릭터</b>:<br />
        {owned.map(c => <span key={c} style={{fontSize:22, marginRight:7}}>{EMOJI[c]}</span>)}
      </div>

      {/* Gacha 이펙트 연출 */}
      <div style={{marginTop:16, minHeight:64, transition:"all 0.3s"}}>
        {rolling && (
          <div style={{fontSize: 30, opacity:0.75, letterSpacing:2}}>
            🎁 상자를 여는 중...
          </div>
        )}
        {!rolling && result && (
          <div style={{
            marginTop: 3,
            fontSize: 28,
            fontWeight: 700,
            color: animState === "fail" ? "#aaa" : "#e1a700",
            transition:"all 0.45s cubic-bezier(.6,-0.02,.33,1.22)",
            filter,
            boxShadow
          }}>
            {result !== "fail" ?
              <span>
                <span style={{fontSize:40, filter, boxShadow, verticalAlign:"middle"}}>{EMOJI[result]}</span>
                <span style={{marginLeft:8}}>획득!</span>
              </span>
              :
              <span style={{fontSize:24}}>
                ❌ 실패! <span style={{fontSize:19, color:"#bbb"}}>이미 다 모았거나 중복</span>
              </span>
            }
          </div>
        )}
      </div>
    </div>
  );
}
export default GachaModal;
