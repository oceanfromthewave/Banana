// src/constants/themes.js

import dayImg from "../assets/dayImg.png";
import nightImg from "../assets/nightImg.png";
import cityImg from "../assets/cityImg.png";
import spaceImg from "../assets/spaceImg.png";

export const THEMES = [
  {
    name: "Day",
    bg: "linear-gradient(135deg, #f9f7d2 0%, #ffd966 100%)",
    image: dayImg,
  },
  {
    name: "Night",
    bg: "linear-gradient(135deg, #243b55 0%, #141e30 100%)",
    image: nightImg,
  },
  {
    name: "City",
    bg: "#e8e9ef",
    image: cityImg,
  },
  {
    name: "Space",
    bg: "#1a1834",
    image: spaceImg,
  },
  // 원하는 만큼 추가
];
