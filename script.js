// Declare global variables
var funds = 0, // player funds
prize = 0, // prize money per round
lettersGuessed = 0, // number of letters guessed correctly
lettersGuessable = 0, // number of guessable letters
fullGuess, // store player's typed guess
puzzleIndex, // index of puzzleWord in array
puzzleGuessedIndex = [], // index of puzzle letters correctly guessed in puzzleWord
pureGuess = "", // store typed guess without spaces or punctuation
purePuzzle = "", // store puzzle phrase without spaces or punctuation
activeWheel = true; // stores whether wheel can spin or not

// Assign puzzle index
var puzzleIndex = Math.floor(Math.random() * (puzzles.length));
var puzzlePhrase = puzzles[puzzleIndex];

// Console log hint
console.log("Hint: This quote is" + sources[puzzleIndex] + ".");

// Show game
function showGame() {
  $('#card').slideToggle();
}

// Setup puzzle onscreen
window.onload = function buildPuzzle() {
  var puzzle = document.getElementById('puzzlearea');

  for (var i = 0; i < puzzlePhrase.length; i++) {
    var node = document.createElement("LI");
    if ((puzzlePhrase[i] === "'") || (puzzlePhrase[i] === ".") || (puzzlePhrase[i] === ",") || (puzzlePhrase[i] === "?") || (puzzlePhrase[i] === "!") || (puzzlePhrase[i] === " ")) {
      node.className = "puzzleVisible";
    } else {
      node.className = "puzzleInvisible";
      lettersGuessable += 1;
    }
    node.id = "puzzle" + [i];
    var textnode = document.createTextNode(puzzlePhrase[i]);
    node.appendChild(textnode);
    document.getElementById("puzzlelist").appendChild(node);
  }
}

// Check guesses
var guessConsonant = document.getElementById('consonant');
var guessVowel = document.getElementById('vowel');

// Activates when consonant is selected
guessConsonant.addEventListener('change', (letter) => {
  console.log(`letter.target.value = ${ letter.target.value }`);
  $('#card').slideToggle();
  var correctLetters = 0;
  for(var i = 0; i < puzzlePhrase.length; i++) {
    if (puzzlePhrase[i] === `${ letter.target.value }`) {
      puzzleGuessedIndex.push(i);
      correctLetters += 1;
      lettersGuessed += 1;
    }
  }
  for(var i = 0; i < puzzleGuessedIndex.length; i++) {
    document.getElementById("puzzle" + puzzleGuessedIndex[i]).style.color = "black";
  }
  if (correctLetters > 0) {
    document.getElementById('result').innerHTML = "There's a " + `${ letter.target.value }` + ". There's " + correctLetters + " of them! $" + numberWithCommas(prize) + " per letter has been added to your account. You're doing great, spin again!";
    funds += (prize * correctLetters);
    document.getElementById('funds').innerHTML = numberWithCommas(funds);
    document.getElementById('change').innerHTML = "<br>▲($" + numberWithCommas(prize*correctLetters) + ")";
    document.getElementById('change').style.color = "#6aff57";
    checkWin();
  } else {
    document.getElementById('result').innerHTML = "Sorry, no " + `${ letter.target.value }` + "'s here.<br>Spin again?";
    document.getElementById('change').innerHTML = "";
  }
  resetWheel();
  // Remove letters from dropdown menu
  $("#consonant option[value=" + `${ letter.target.value }` + "]").remove();
  // Reset dropdown selected
  document.getElementById('consonant').value = "";
});

// Activates when vowel is selected
guessVowel.addEventListener('change', (letter) => {
  if (funds >= 250) {
    console.log(`letter.target.value = ${ letter.target.value }`);
    $('#card').slideToggle();
    var correctLetters = 0;
    for(var i = 0; i < puzzlePhrase.length; i++) {
      if (puzzlePhrase[i] === `${ letter.target.value }`) {
        puzzleGuessedIndex.push(i);
        correctLetters += 1;
        lettersGuessed += 1;
      }
    }
    for(var i = 0; i < puzzleGuessedIndex.length; i++) {
      document.getElementById("puzzle" + puzzleGuessedIndex[i]).style.color = "black";
    }
    if (correctLetters > 0) {
      if (((prize*correctLetters)-250) > 0) {
        document.getElementById('result').innerHTML = "There's a " + `${ letter.target.value }` + ". There's " + correctLetters + " of them! $" + numberWithCommas(prize) + " per letter, minus the cost of your vowel, has been added to your account. Keep it up, spin again!";
        funds += (prize*correctLetters) - 250;
        document.getElementById('funds').innerHTML = numberWithCommas(funds);
        document.getElementById('change').innerHTML = "<br>▲($" + numberWithCommas((prize*correctLetters)-250) + ")";
        document.getElementById('change').style.color = "#6aff57";
        // Remove letters from dropdown menu
        $("#vowel option[value=" + `${ letter.target.value }` + "]").remove();
        checkWin();
      } else {
        document.getElementById('result').innerHTML = "There's a " + `${ letter.target.value }` + ". There's " + correctLetters + " of them! You've won $" + numberWithCommas(prize) + " per letter but the cost of your vowel was $250. $" + numberWithCommas(-((prize*correctLetters)-250)) + " has been deducted from your account. Spin again?";
        funds += (prize*correctLetters) - 250;
        document.getElementById('funds').innerHTML = numberWithCommas(funds);
        document.getElementById('change').innerHTML = "<br>▼($" + numberWithCommas(-((prize*correctLetters)-250)) + ")";
        document.getElementById('change').style.color = "red";
        // Remove letters from dropdown menu
        $("#vowel option[value=" + `${ letter.target.value }` + "]").remove();
        checkWin();
      }
    } else {
      document.getElementById('result').innerHTML = "Sorry, no " + `${ letter.target.value }` + "'s here.<br>Spin again?";
      funds -= 250;
      document.getElementById('funds').innerHTML = numberWithCommas(funds);
      document.getElementById('change').innerHTML = "<br>▼($250)";
      document.getElementById('change').style.color = "red";
      // Remove letters from dropdown menu
      $("#vowel option[value=" + `${ letter.target.value }` + "]").remove();
    }
    resetWheel();
  } else {
    alert("You have $" + funds + " in your bank. Vowels cost $250 each. You don't have enough money!");
  }
  // Reset dropdown selected
  document.getElementById('vowel').value = "";
});

function bankrupt() {
  if (funds === 0) {
    document.getElementById('result').innerHTML = "Oh no, you've gone bankrupt! Luckily, you had nothing in your account to begin with. Spin again?";
  } else {
    var loss = funds;
    funds = 0;
    document.getElementById('result').innerHTML = "Easy come, easy go... you've gone bankrupt and lost all your money. Spin again?";
    document.getElementById('funds').innerHTML = numberWithCommas(funds);
    document.getElementById('change').innerHTML = "<br>▼($" + numberWithCommas(loss) + ")";
    document.getElementById('change').style.color = "red";
  }
  resetWheel();
}

function lostTurn() {
  document.getElementById('result').innerHTML = "Lose a turn? That's just silly. Spin again please!";
  document.getElementById('change').innerHTML = "";
  resetWheel();
}

function checkWin() {
  if (lettersGuessed === lettersGuessable) {
    win();
  }
}

// function to check win from typing the entire puzzle phrase
function checkTypedWin() {
  fullGuess = document.getElementById('fullguess').value;
  if (removePunctuation(fullGuess).toUpperCase() == removePunctuation(puzzlePhrase)) {
    var hiddenLetters = document.getElementsByClassName('puzzleInvisible');
    for (var i = 0; i < hiddenLetters.length; i++) {
      hiddenLetters[i].style.color = "black";
    }
    funds += prize * (lettersGuessable - lettersGuessed);
    document.getElementById('funds').innerHTML = numberWithCommas(funds);
    document.getElementById('change').innerHTML = "<br>▲($" + numberWithCommas(prize * (lettersGuessable - lettersGuessed)) + ")";
    document.getElementById('change').style.color = "#6aff57";
    document.getElementById('result').innerHTML = "Here's what I call bringing home the bacon! $" + numberWithCommas(funds) + "! Congratulations! <br><button onclick='location.reload()'>Reset Game</button>";
    showGame();
    deactivateWheel();
    activeWheel = false;
  } else {
    document.getElementById('result').innerHTML = "Sorry, we were looking for '" + puzzlePhrase.trim() + "'," + sources[puzzleIndex] + ".<br><button onclick='location.reload()'>Reset Game</button>";
    funds = 0;
    showGame()
    deactivateWheel();
    activeWheel = false;
  }
}

// Function to win from guessing all the puzzle letters
function win() {
  document.getElementById('result').innerHTML = "Cash, money, moolah, no matter how you say it, you've won $" + numberWithCommas(funds) + "! Congratulations!<br><button onclick='location.reload()'>Reset Game</button>";
  deactivateWheel();
  activeWheel = false;
}

// Helper function to format numbers
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Helper function to remove all punctuation for text comparison
function removePunctuation(x) {
  var temp = x.toString().replace(/[.,\/#!$%\^&\*;:{}'=\-_`~()]/g,"");
  return temp.split(' ').join('');
}
