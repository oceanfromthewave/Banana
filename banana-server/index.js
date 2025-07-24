const express = require("express");
import Character from "./../banana-clicker/src/components/Character";
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

// 점수 저장
app.post("/api/score", async (req, res) => {
  const { nickname, score } = req.body;
  if (!nickname || !score)
    return res.status(400).json({ ok: false, error: "닉네임/점수 필수" });
  const newScore = await prisma.score.create({
    data: { nickname, score: Number(score) },
  });
  res.json({ ok: true, id: newScore.id });
});

// 상위 랭킹 조회(Top 10)
app.get("/api/ranking", async (req, res) => {
  const top = await prisma.score.findMany({
    orderBy: { score: "desc" },
    take: 10,
  });
  res.json(top);
});

// 캐릭터 목록
app.get("/api/characters", async (req, res) => {
  const chars = await prisma.character.findMany();
  res.json(chars);
});

// 보유 캐릭터 조회 (userId query)
app.get("/api/user-characters", async (req, res) => {
  const { userId } = req.query;
  const owned = await prisma.userCharacter.findMany({
    where: { userId: Number(userId) },
    include: { character: true },
  });
  res.json(owned.map((c) => c.character.key));
});

// 뽑기 (랜덤)
app.post("/api/draw", async (req, res) => {
  const { userId } = req.body;
  // 로직: userId의 미보유 캐릭터 중 1개 랜덤 선택 → 추가
  const all = await prisma.character.findMany();
  const ownedKeys = (
    await prisma.userCharacter.findMany({
      where: { userId },
      select: { character: { select: { key: true } } },
    })
  ).map((x) => x.character.key);
  const notOwned = all.filter((c) => !ownedKeys.includes(c.key));
  if (!notOwned.length)
    return res.json({ ok: false, message: "이미 전체 보유" });

  const idx = Math.floor(Math.random() * notOwned.length);
  const char = notOwned[idx];
  await prisma.userCharacter.create({
    data: { userId, characterId: char.id },
  });
  res.json({ ok: true, character: char });
});

const PORT = 4000;
app.listen(PORT, () => console.log("server running:", PORT));
