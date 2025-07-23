const express = require("express");
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

const PORT = 4000;
app.listen(PORT, () => console.log("server running:", PORT));
