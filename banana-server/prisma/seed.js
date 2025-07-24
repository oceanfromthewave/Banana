const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const data = [
    { key: "banana", name: "바나나", emoji: "🍌" },
    { key: "tomato", name: "토마토", emoji: "🍅" },
    { key: "peach", name: "복숭아", emoji: "🍑" },
    { key: "apple", name: "사과", emoji: "🍎" },
    { key: "strawberry", name: "딸기", emoji: "🍓" },
    { key: "grape", name: "포도", emoji: "🍇" },
  ];
  for (const c of data) {
    await prisma.character.upsert({
      where: { key: c.key },
      update: {},
      create: c,
    });
  }
}

main()
  .then(() => {
    console.log("seed done");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
