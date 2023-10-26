const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
let cards;
let interval;
let firstCard = false;
let secondCard = false;

// Define levels with corresponding card counts and rows
const levels = {
  easy: { cardCount: 6, rows: 3 },
  medium: { cardCount: 10, rows: 5 },
  hard: { cardCount: 14, rows: 7 },
};

//Items array
const items = [
    { name: "koala", image: "koala.png" },
    { name: "lion", image: "lion.png" },
    { name: "fox", image: "fox.png" },
    { name: "cat", image: "cat.png" },
    { name: "rab", image: "rab.png" },
    { name: "hen", image: "hen.png" },
    { name: "dol", image: "dol.png" },
    { name: "crab", image: "crab.png" },
    { name: "ele", image: "ele.png" },
    { name: "dog", image: "dog.png" },
    { name: "panda", image: "panda.png" },
    { name: "horse", image: "horse.png" },
    { name: "tiger", image: "tiger.png" }
  ];

// Initial Time
let seconds = 0,
  minutes = 0;
// Initial moves and win count
let movesCount = 0,
  winCount = 0;

// For timer
const timeGenerator = () => {
  seconds += 1;
  // Minutes logic
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  // Format time before displaying
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};

// For calculating moves
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Moves:</span>${movesCount}`;
};

// Pick random objects from the items array
const generateRandom = (cardCount) => {
  // Temporary array
  let tempArray = [...items];
  // Initializes cardValues array
  let cardValues = [];
  // Random object selection
  for (let i = 0; i < cardCount; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    // Once selected, remove the object from temp array
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};

const matrixGenerator = (cardValues, rows) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  // Simple shuffle
  cardValues.sort(() => Math.random() - 0.5);
  for (let i = 0; i < rows * 4; i++) {
    // Create Cards
    gameContainer.innerHTML += `
     <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-before">?</div>
        <div class="card-after">
        <img src="${cardValues[i].image}" class="image"/></div>
     </div>
     `;
  }
  // Grid
  gameContainer.style.gridTemplateColumns = `repeat(${rows}, auto)`;

  // Cards
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      //If selected card is not matched yet then only run (i.e already matched card when clicked would be ignored)
      if (!card.classList.contains("matched")) {
        //flip the cliked card
        card.classList.add("flipped");
        //if it is the firstcard (!firstCard since firstCard is initially false)
        if (!firstCard) {
          //so current card will become firstCard
          firstCard = card;
          //current cards value becomes firstCardValue
          firstCardValue = card.getAttribute("data-card-value");
        } else {
          //increment moves since user selected second card
          movesCounter();
          //secondCard and value
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {
            //if both cards match add matched class so these cards would beignored next time
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            //set firstCard to false since next card would be first now
            firstCard = false;
            //winCount increment as user found a correct match
            winCount += 1;
            //check if winCount ==half of cardValues
            if (winCount == Math.floor(cardValues.length / 2)) {
              result.innerHTML = `<h2>You Won</h2>
            <h4>Moves: ${movesCount}</h4>`;
              stopGame();
            }
          } else {
            //if the cards dont match
            //flip the cards back to normal
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }
      }
    });
  });
};

// Initialize game with the selected level
function initializeGame(level) {
  // Reset the game state
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  winCount = 0;
  firstCard = false;
  secondCard = false;

  // Hide the result message
  result.innerText = "";

  // Generate card values based on the selected level
  const { cardCount } = levels[level];
  const cardValues = generateRandom(cardCount);

  // Generate the game matrix with the selected level's rows
  matrixGenerator(cardValues, levels[level].rows);
}

// Event listeners for level buttons
document.getElementById("easy").addEventListener("click", () => {
  initializeGame("easy");
});

document.getElementById("medium").addEventListener("click", () => {
  initializeGame("medium");
});

document.getElementById("hard").addEventListener("click", () => {
  initializeGame("hard");
});

// Start the game initially with the default level (easy)
initializeGame("easy");

// Start game
startButton.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  //controls amd buttons visibility
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  //Start timer
  interval = setInterval(timeGenerator, 1000);
  //initial moves
  moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
  initializer();
});

// Stop game
stopButton.addEventListener(
    "click",
    (stopGame = () => {
      controls.classList.remove("hide");
      stopButton.classList.add("hide");
      startButton.classList.remove("hide");
      clearInterval(interval);
    })
  );

// Initialize values and function calls
const initializer = () => {
    result.innerText = "";
    winCount = 0;
    let cardValues = generateRandom();
    console.log(cardValues);
    matrixGenerator(cardValues);
  };