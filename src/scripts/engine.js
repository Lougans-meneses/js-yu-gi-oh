const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById("score_points"),
  },
  cardSprites: {
    avatar: document.getElementById("card-image"),
    name: document.getElementById("card-name"),
    type: document.getElementById("card-type"),
  },
  fieldCards: {
    player: document.getElementById("player-field-card"),
    computer: document.getElementById("computer-field-card"),
  },
  actions: {
    button: document.getElementById("next-duel"),
  },
};


playerSides = {
  player1: "player-cards",
  computer: "computer-cards",
};

const pathImages = "./src/assets/icons/";
  const cardData = [
    {
      id: 0,
      name: "Blue Eye White Dragon",
      type: "Paper",
      img: `${pathImages}dragon.png`,
      WinOf: [1],
      LoseOf: [2],
    },
    {
      id: 1,
      name: "Dark Magician",
      type: "Rock",
      img: `${pathImages}magician.png`,
      WinOf: [2],
      LoseOf: [0],
    },
    {
      id: 2,
      name: "Exodia",
      type: "Scissors",
      img: `${pathImages}exodia.png`,
      WinOf: [0],
      LoseOf: [1],
    },
  ]

async function getRandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardData.length);
  return cardData[randomIndex].id;
}

    async function createCardImage(cardId, fieldSide) {
      const cardImage = document.createElement("img");
      cardImage.setAttribute("height", "100px");
      cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
      cardImage.setAttribute("data-id", cardId);
      cardImage.classList.add("card");
      cardImage.addEventListener("mouseover", () => {
        drawSelectedCard(cardId);
      });
      
      cardImage.addEventListener("click", function() {
        setCardsField(this.getAttribute("data-id"), fieldSide);
      });
      
      return cardImage;
    }
    
    async function setCardsField(cardId) {
      await removeAllCardsImage();
    
      let computerCardId = await getRandomCardId();
    
      state.fieldCards.player.style.display = "block";
      state.fieldCards.computer.style.display = "block";
      
      const cardImagePlayer = cardData[cardId].img;
      const cardImageComputer = cardData[computerCardId].img;
      state.fieldCards.player.src = cardImagePlayer;
      state.fieldCards.computer.src = cardImageComputer;
      state.cardSprites.name = "";
      state.cardSprites.type = "";
      let duelResult = await checkDuelResult(cardId, computerCardId);
      await updateScore();
      await drawButton(duelResult);
    }

    async function drawButton(duelResult) {
      state.actions.button.style.display = "block";
      state.actions.button.innerText = duelResult;
    }

    async function updateScore() {
      state.score.scoreBox.innerText = `Win ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
    }


    async function checkDuelResult(cardId, computerCardId) {
      let playerCard = cardData[cardId];
      let computerCard = cardData[computerCardId];
    
      if (playerCard.WinOf.includes(computerCardId)) {
        state.score.playerScore++;
        await playAudio("win");
        return "Player venceu";
      } else if (playerCard.LoseOf.includes(computerCardId)) {
        state.score.computerScore++;
        await playAudio("lose");
        return "Computer venceu";
      } else {
        return "Empate";
      }
    }

    async function removeAllCardsImage() {
      state.fieldCards.player.src = "";
      state.fieldCards.computer.src = "";
    }
    
    async function removeAllCards() {
      const playerCardContainer = document.getElementById(playerSides.player1);
      const computerCardContainer = document.getElementById(playerSides.computer);
    
      playerCardContainer.innerHTML = "";
      computerCardContainer.innerHTML = "";
    }


async function drawSelectedCard(index) {
  state.cardSprites.avatar.setAttribute("src", cardData[index].img);
  state.cardSprites.avatar.src = cardData[index].img;
  state.cardSprites.name.innerText = cardData[index].name;
  state.cardSprites.type.innerText = "Attribute : " + cardData[index].type;
}

      async function drawCards(cardNumbers, fieldSide) {
        for (let i = 0; i < cardNumbers; i++) {
          const cardId = await getRandomCardId();
          const cardImage = await createCardImage(cardId, fieldSide);
      
          if (fieldSide === playerSides.player1) {
            cardImage.addEventListener("mouseover", function() {
              this.classList.remove("hidden-card");
            });
      
            cardImage.addEventListener("mouseout", function() {
              this.classList.add("hidden-card");
            });
      
            cardImage.addEventListener("click", function() {
              setCardsField(this.getAttribute("data-id"), fieldSide);
            });
          } else {
            cardImage.classList.add("hidden-card");
          }
      
          document.getElementById(fieldSide).appendChild(cardImage);
        }
      }



async function resetDuel() {
  state.actions.button.style.display = "block";

  removeAllCardsImage();

  state.score.playerScore = 0;
  state.score.computerScore = 0;
  state.score.scoreBox.innerText = "Win 0 | Lose: 0";

  removeAllCards();

  init();
}

async function playAudio(status) {
  const audio = new Audio(`./src/assets/audios/${status}.wav`);
  
  audio.play();
}

function init() {
  state.fieldCards.player.style.display = "none";
  state.fieldCards.computer.style.display = "none";
  drawCards(5, playerSides.player1);
  drawCards(5, playerSides.computer);

  const bgm = document.getElementById("bgm");
  const audioToggle = document.getElementById("audio-toggle");
let isAudioOn = true;

audioToggle.addEventListener("click", () => {
  if (isAudioOn) {
    bgm.pause();
    isAudioOn = false;
    audioToggle.innerText = "Audio On";
  } else {
    bgm.play();
    isAudioOn = true;
    audioToggle.innerText = "Audio Off";
  }
});
}

init()