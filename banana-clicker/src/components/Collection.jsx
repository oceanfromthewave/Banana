import React from "react";

const ALL_CHARACTERS = [
  { key: "banana", name: "바나나" },
  { key: "tomato", name: "토마토" },
  { key: "peach", name: "복숭아" },
  { key: "apple", name: "사과" },
  { key: "strawberry", name: "딸기" }
];

function Collection({ owned, IMG_MAP }) {
  const percent = Math.round((owned.length / ALL_CHARACTERS.length) * 100);
  return (
    <div
      style={{
        position: "absolute",
        right: 36,
        bottom: 36,
        zIndex: 101,
        minWidth: 200,
        background: "rgba(255,255,255,0.97)",
        borderRadius: 18,
        padding: "14px 20px 14px 20px",
        boxShadow: "0 3px 16px #2221",
        textAlign: "center",
      }}
    >
      <div style={{fontWeight: 700, fontSize: 17, marginBottom: 7}}>
        📒 캐릭터 도감
      </div>
      <div style={{marginBottom: 8, fontWeight: 500}}>
        수집률 <span style={{color: "#d18900"}}>{percent}%</span>
        <span style={{fontWeight: 400, color: "#aaa", marginLeft: 8}}>
          ({owned.length}/{ALL_CHARACTERS.length})
        </span>
      </div>
      <div style={{display: "flex", justifyContent: "center", gap: 13}}>
        {ALL_CHARACTERS.map((c) => (
          <div key={c.key} style={{opacity: owned.includes(c.key) ? 1 : 0.22, textAlign: "center"}}>
            <img
              src={IMG_MAP[c.key]}
              alt={c.name}
              style={{
                width: 36, height: 36,
                objectFit: "contain",
                filter: owned.includes(c.key) ? "none" : "grayscale(1) blur(1.3px)",
                marginBottom: 2,
                borderRadius: 9,
                background: owned.includes(c.key) ? "#fff" : "#ccc"
              }}
              draggable="false"
            />
            <div style={{
              fontSize: 12,
              marginTop: 0,
              color: owned.includes(c.key) ? "#444" : "#aaa"
            }}>
              {c.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Collection;
