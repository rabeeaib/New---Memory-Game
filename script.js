const board = document.getElementById("game-board");

async function startGame(type) {
  board.innerHTML = "";
  board.classList.remove("hidden");

  let images = [];

  if (type === "dogs") {
    images = await getDogs();
  } else if (type === "cats") {
    images = await getCats();
  } else if (type === "hp") {
    images = await getHarryPotter();
  }

  // Duplicate 7 → 14 cards
  let cards = [...images, ...images];

  cards = shuffle(cards);

  cards.forEach(src => {
    const card = document.createElement("div");
    card.classList.add("card");

    const img = document.createElement("img");
    img.src = src;
    card.appendChild(img);

    board.appendChild(card);

    card.addEventListener("click", () => flipCard(card));
  });
}

/* APIs */

async function getDogs() {
  const res = await fetch("https://dog.ceo/api/breeds/image/random/7");
  const data = await res.json();
  return data.message;
}

async function getCats() {
  const res = await fetch("https://api.thecatapi.com/v1/images/search?limit=7");
  const data = await res.json();
  return data.map(cat => cat.url);
}

async function getHarryPotter() {
  const res = await fetch("https://hp-api.onrender.com/api/characters");
  const data = await res.json();
  return data
    .filter(ch => ch.image)
    .slice(0, 7)
    .map(ch => ch.image);
}

/* Game Logic */

let lock = false;
let firstCard = null;

function flipCard(card) {
  if (lock) return;

  const img = card.querySelector("img");
  if (img.style.visibility === "visible") return;

  img.style.visibility = "visible";

  if (!firstCard) {
    firstCard = card;
  } else {
    checkMatch(firstCard, card);
    firstCard = null;
  }
}

function checkMatch(card1, card2) {
  const img1 = card1.querySelector("img");
  const img2 = card2.querySelector("img");

  if (img1.src === img2.src) return;

  lock = true;
  setTimeout(() => {
    img1.style.visibility = "hidden";
    img2.style.visibility = "hidden";
    lock = false;
  }, 800);
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}