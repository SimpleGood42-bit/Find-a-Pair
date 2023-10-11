(() => {

  function createArray(length) {
    const numberArr = [];
    for (let i = 1; i < length+1; i++) {
      numberArr.push(i);
      numberArr.push(i);
    }

    return numberArr;
  }

  function mixArray(length) {
    const array = createArray(length);

    for (i = 0; i < array.length; i++) {
      let j = Math.round(Math.random() * (array.length - 1));
      temp = array[i]
      array[i] = (array[j]);
      array[j] = (temp);
    }

    return array;
  }

  function createCard(number) {
    const card = document.createElement('div');
    const frontCard = document.createElement('div');
    const backCard = document.createElement('div');
    const numberCard = document.createElement('span');
    const labelCard = document.createElement('span');


    card.classList.add('card');
    frontCard.classList.add('front__card');
    backCard.classList.add('back__card');
    numberCard.classList.add('card__name');
    numberCard.textContent = number;
    labelCard.textContent = 'SG';
    labelCard.classList.add('label__card');
    frontCard.append(numberCard);
    backCard.append(labelCard);
    card.append(frontCard);
    card.append(backCard);

    return {
      card,
      frontCard,
      backCard
    }
  }

  function createCardsObj(lvl) {
    const numberCards = mixArray(lvl);
    let i = 0;
    const cards = [];

    for (const card of numberCards) {
      const cardObject = {};
      cardObject.id = i;
      cardObject.number = card;
      cardObject.done = false;
      cardObject.open = false;
      cards.push(cardObject);
      i++;
    }
    return cards;
  }

  function makeRows(rows, cols) {
    const field = document.getElementById('field');

    field.style.setProperty('--grid-rows', rows);
    field.style.setProperty('--grid-cols', cols);
  };

  function clickBtnStart(x) {
    makeRows(x, x);
    startApp((x*x) / 2, x);
  }

  function settingGame() {
    const setting = document.getElementById('setting-game');
    const levelSelection = document.createElement('div');
    const levelLabel = document.createElement('label');
    const levelInput = document.createElement('input');
    const startGameBtn = document.createElement('button');

    levelInput.classList.add('input');
    levelInput.placeholder = 4;
    levelLabel.innerHTML = 'Колличество карточек по горизонтали/вертикали (2 - 10): ';
    levelLabel.append(levelInput);
    levelLabel.classList.add('label');
    levelSelection.classList.add('level-select');
    levelSelection.innerHTML = 'Введите размеры поля игры (по умолчанию размер 4 х 4)';
    levelSelection.append(levelLabel, startGameBtn);
    startGameBtn.textContent = 'Начать игру';
    startGameBtn.classList.add('btn');
    setting.append(levelSelection);

    startGameBtn.addEventListener('click', () => {
      if (levelInput.value != '' && ( 1 < levelInput.value && levelInput.value < 11) && (levelInput.value % 2) === 0) {
        clickBtnStart(levelInput.value)
        setting.removeChild(levelSelection);
      }
      else {
        levelInput.classList.add('input-tremor');
        setTimeout(() => {
          levelInput.classList.remove('input-tremor');
        }, 1000)
        levelInput.value = 4;
      }
    });
  }

  function startApp(cardsCount, lvl) {
    const page = document.getElementById('page');
    const timerShow = document.createElement('p');
    timerShow.classList.add('timer');
    timerShow.innerHTML = '01:00'
    page.prepend(timerShow);
    const field = document.getElementById('field');
    const cards = createCardsObj(cardsCount);
    let steps = 0;
    let openCount = 0;
    let selectedFirstCard = {};
    let selectedSecondCard = {};
    let firstOpen = true;
    let timerGame;
    let timeMinut = 59;



    function startTimer() {

      let timer = setInterval(function () {
        let seconds = timeMinut%60
        let minutes = timeMinut/60%60
        if (timeMinut < 0) {
            clearInterval(timer);
            checkFinish(true);
        } else {
          if (minutes === 1) {
            timerShow.innerHTML = `0${Math.trunc(minutes)}:${seconds}0`;
          }
          if (seconds < 10) {
            timerShow.innerHTML = `00:0${seconds}`;
          }
          else {
            timerShow.innerHTML = `00:${seconds}`;
          }
        }
        --timeMinut;

      }, 1000);

      return timer;
    }

    function instalOpenCard() {
      for ( const card of cards) {
        card.open = true;
      }
    }

    function checkCard(cardObj, frontCard, backCard) {
      if (firstOpen) {
        timerGame = startTimer();
      }
      firstOpen = false;
      if (openCount < 1) {
        if (!cardObj.open) {
          frontCard.classList.add('front__card--active');
          backCard.classList.add('back__card--disable');
          openCount += 1;
          cardObj.open = true;
          cardObj.frontCard = frontCard;
          cardObj.backCard = backCard;
          selectedFirstCard = cardObj;
          steps += 1;
        }
      }
      else if (openCount === 1) {
        if (!cardObj.open) {
          frontCard.classList.add('front__card--active');
          backCard.classList.add('back__card--disable');
          openCount += 1;
          cardObj.open = true;
          cardObj.frontCard = frontCard;
          cardObj.backCard = backCard;
          selectedSecondCard = cardObj;
          if (parseInt(selectedFirstCard.number) === parseInt(selectedSecondCard.number)) {
            selectedFirstCard.frontCard.classList.add('front__card--complite');
            selectedSecondCard.frontCard.classList.add('front__card--complite');
            selectedFirstCard.done = true;
            selectedSecondCard.done = true;
            openCount = 0;
            selectedFirstCard = {};
            selectedSecondCard = {};
            steps += 1;
          }
          else {
            steps += 1;
          }
        }
      }
      else if (openCount === 2) {
        if (!cardObj.open) {
          frontCard.classList.add('front__card--active');
          backCard.classList.add('back__card--disable');
          selectedFirstCard.frontCard.classList.remove('front__card--active');
          selectedFirstCard.backCard.classList.remove('back__card--disable');
          selectedSecondCard.frontCard.classList.remove('front__card--active');
          selectedSecondCard.backCard.classList.remove('back__card--disable');
          selectedFirstCard.open = false;
          selectedSecondCard.open = false;
          selectedFirstCard = {};
          selectedSecondCard = {};
          cardObj.open = true;
          cardObj.frontCard = frontCard;
          cardObj.backCard = backCard;
          selectedFirstCard = cardObj;
          openCount = 1;
          steps += 1;
        }
      }
    }

    function checkFinish(timeFalse = false) {
      if (timeFalse) {
        const field = document.getElementById('field');
        const wraperWin = document.createElement('div');
        const titleWin = document.createElement('h3');
        const stepsWin = document.createElement('p');
        const btnRestart = document.createElement('button');


        page.removeChild(timerShow);

        btnRestart.textContent = 'Начать заново';
        btnRestart.classList.add('btn');

        stepsWin.textContent = 'Вы сделали ' + steps + ' шагов, но проиграли т.к. вышло время! попробуйте еще раз!';
        stepsWin.classList.add('steps');

        titleWin.textContent = 'Поражение!';
        titleWin.classList.add('loss-title');

        wraperWin.classList.add('win-field');

        wraperWin.append(titleWin, stepsWin, btnRestart);

        btnRestart.addEventListener('click', () => {
          field.innerHTML = '';
          page.removeChild(wraperWin);
          clickBtnStart(lvl);
        });
        page.append(wraperWin);
        instalOpenCard();
      }
      else {
        let falseCard = 0;
        for (const object of cards) {
          if (!object.done) {
            falseCard +=1;
            break;
          }
        }
        if (falseCard === 0 ) {
          clearInterval(timerGame);
          let timeGame = 60 - timeMinut;
          const field = document.getElementById('field');
          const wraperWin = document.createElement('div');
          const titleWin = document.createElement('h3');
          const timeWin = document.createElement('p');
          const stepsWin = document.createElement('p');
          const btnRestart = document.createElement('button');
          const btnNewGame = document.createElement('button');

          page.removeChild(timerShow);

          btnRestart.textContent = 'Начать заново';
          btnRestart.classList.add('btn','btn-reset');

          btnNewGame.textContent = 'Новая игра';
          btnNewGame.classList.add('btn');

          stepsWin.textContent = 'И завершили игру за ' + steps + ' шагов';
          stepsWin.classList.add('steps');

          timeWin.textContent = 'Вы потратили ' + timeGame + ' секунды';

          titleWin.classList.add('win-title');
          titleWin.textContent = 'Победа!';

          wraperWin.classList.add('win-field');

          wraperWin.append(titleWin, timeWin, stepsWin, btnRestart, btnNewGame);

          btnRestart.addEventListener('click', () => {
            field.innerHTML = '';
            page.removeChild(wraperWin);
            clickBtnStart(lvl);
          });

          btnNewGame.addEventListener('click', () => {
            field.innerHTML = '';
            page.removeChild(wraperWin);
            settingGame();
          });


          page.append(wraperWin);
        }
      }
    }

    for (const cardObj of cards) {
      const card = createCard(cardObj.number);
      field.append(card.card);
      card.card.addEventListener('click', () => {
        checkCard(cardObj, card.frontCard, card.backCard);
        checkFinish();
      });
    }

  }

  document.addEventListener("DOMContentLoaded", () => {
    settingGame();
  })

})();


