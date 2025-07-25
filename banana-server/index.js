const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

const COOLDOWN_MS = 3 * 60 * 60 * 1000;

// 1. 유저 등록/조회 (닉네임, 최초 등록시 바나나 캐릭터 지급)
app.post("/api/user", async (req, res) => {
  const { nickname } = req.body;
  if (!nickname || typeof nickname !== "string")
    return res.status(400).json({ ok: false, error: "닉네임 필수" });
  let user = await prisma.user.findUnique({ where: { nickname } });
  if (!user) {
    user = await prisma.user.create({ data: { nickname, lastLuckybox: null } });
    // 최초 바나나 캐릭터 지급
    const banana = await prisma.character.findUnique({
      where: { key: "banana" },
    });
    if (banana) {
      await prisma.userCharacter.create({
        data: { userId: user.id, characterId: banana.id },
      });
    }
  }
  return res.json({ ok: true, user });
});

// 2. 전체 캐릭터 목록
app.get("/api/characters", async (req, res) => {
  const chars = await prisma.character.findMany({ orderBy: { id: "asc" } });
  return res.json(chars);
});

// 3. 내 캐릭터 컬렉션 조회 (닉네임 기준)
app.get("/api/collection/:nickname", async (req, res) => {
  const { nickname } = req.params;
  const user = await prisma.user.findUnique({
    where: { nickname },
    include: {
      ownedChars: {
        include: { character: true },
        orderBy: { acquiredAt: "asc" },
      },
    },
  });
  if (!user) {
    return res.json({ ok: true, owned: [] });
  }
  const owned = user.ownedChars.map((uc) => uc.character.key);
  return res.json({ ok: true, owned });
});

// 4. 마지막 럭키박스 뽑기 시각 반환 (★수정)
app.get("/api/luckybox/last/:nickname", async (req, res) => {
  const { nickname } = req.params;
  const user = await prisma.user.findUnique({ where: { nickname } });
  if (!user) return res.status(404).json({ lastTime: null });
  return res.json({
    lastTime: user.lastLuckybox ? new Date(user.lastLuckybox).getTime() : null,
  });
});

// 5. LuckyBox (3시간 쿨타임) 캐릭터 뽑기 (★수정)
app.post("/api/collection/luckybox", async (req, res) => {
  const { nickname } = req.body;
  if (!nickname)
    return res.status(400).json({ ok: false, error: "닉네임 필요" });
  const user = await prisma.user.findUnique({ where: { nickname } });
  if (!user)
    return res.status(404).json({ ok: false, error: "존재하지 않는 닉네임" });

  // ★ lastLuckybox 기반 쿨타임!
  const lastTime = user.lastLuckybox
    ? new Date(user.lastLuckybox).getTime()
    : 0;
  const now = Date.now();
  if (lastTime && now - lastTime < COOLDOWN_MS) {
    return res.status(403).json({
      ok: false,
      error: "쿨타임",
      remain: COOLDOWN_MS - (now - lastTime),
    });
  }

  // 미보유 캐릭터만 추첨
  const allChars = await prisma.character.findMany();
  const ownedChars = await prisma.userCharacter.findMany({
    where: { userId: user.id },
    select: { characterId: true },
  });
  const ownedIds = ownedChars.map((c) => c.characterId);
  const notOwned = allChars.filter((c) => !ownedIds.includes(c.id));
  let prize = null;
  if (notOwned.length > 0 && Math.random() < 0.003) {
    // 0.3%
    const idx = Math.floor(Math.random() * notOwned.length);
    prize = notOwned[idx];
    await prisma.userCharacter.create({
      data: { userId: user.id, characterId: prize.id },
    });
  }

  // ★ 쿨타임 최신화!
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLuckybox: new Date() },
  });

  return res.json({ ok: true, prize: prize ? prize.key : null });
});

// 6. 점수 저장
app.post("/api/score", async (req, res) => {
  const { nickname, score } = req.body;
  if (!nickname || typeof score !== "number")
    return res.status(400).json({ ok: false, error: "닉네임/점수 필요" });
  const user = await prisma.user.findUnique({ where: { nickname } });
  if (!user)
    return res.status(404).json({ ok: false, error: "존재하지 않는 닉네임" });
  const saved = await prisma.score.create({
    data: { userId: user.id, value: score },
  });
  return res.json({ ok: true, score: saved.value });
});

// 7. 랭킹 (Top 10)
app.get("/api/ranking", async (req, res) => {
  const ranking = await prisma.score.findMany({
    orderBy: { value: "desc" },
    include: { user: true },
    take: 10,
  });
  return res.json(
    ranking.map((r) => ({
      nickname: r.user.nickname,
      score: r.value,
      createdAt: r.createdAt,
    }))
  );
});

const PORT = 4000;
app.listen(PORT, () => console.log("server running:", PORT));
