// Create new wheel object specifying the parameters at creation time.
let theWheel = new Winwheel({
    'outerRadius'     : 170,        // Set outer radius so wheel fits inside the background.
    'innerRadius'     : 40,         // Make wheel hollow so segments don't go all way to center.
    'textFontSize'    : 28,         // Set default font size for the segments.
    'textOrientation' : 'vertical', // Make text vertical so goes down from the outside of wheel.
    'textAlignment'   : 'outer',    // Align text to outside of wheel.
    'strokeStyle'     : null,
    'lineWidth'       : 0,
    'textFontFamily'  : 'Unica One',
    'textFontWeight'  : 'bold',
    'strokeStyle'       : '#757575',      // Segment line colour. Again segment lines only drawn if this is specified.
    'lineWidth'         : 1,
    'fillStyle'         : '#ececec',
    'textFillStyle'     : 'black',
    'numSegments'     : 23,         // Specify number of segments.
    'segments'        :             // Define segments including colour and text.
    [                               // font size and test colour overridden on backrupt segments.
       {'text' : '2500'},
       {'text' : '100'},
       {'text' : '600'},
       {'text' : '700'},
       {'text' : '600'},
       {'text' : '500'},
       {'text' : '700'},
       {'fillStyle' : 'lightgray', 'text' : 'BANKRUPT', 'textFontFamily': 'Monospace', 'textFontSize' : 14, 'textFillStyle' : 'black'},
       {'fillStyle' : '#089fd1', 'text' : 'JACKPOT', 'textFontFamily': 'Monospace', 'textFontSize' : 16, 'textFillStyle' : '#ff7b60'},
       {'fillStyle' : 'lightgray', 'text' : 'BANKRUPT', 'textFontFamily': 'Monospace', 'textFontSize' : 14, 'textFillStyle' : 'black'},
       {'text' : '600'},
       {'text' : '550'},
       {'text' : '500'},
       {'text' : '600'},
       {'text' : '650'},
       {'text' : '700'},
       {'text' : '800'},
       {'text' : '1000'},
       {'text' : '300'},
       {'text' : '500'},
       {'text' : '650'},
       {'text' : '500'},
       {'text' : '900'},
    ],
    'animation' :           // Specify the animation to use.
    {
        'type'     : 'spinToStop',
        'duration' : 10,    // Duration in seconds.
        'spins'    : 3,     // Default number of complete spins.
        'callbackFinished' : alertPrize,
        'callbackSound'    : playSound,   // Function to call when the tick sound is to be triggered.
        'soundTrigger'     : 'pin'        // Specify pins are to trigger the sound, the other option is 'segment'.
    },
    'pins' :				// Turn pins on.
    {
        'number'     : 24,
        'fillStyle'  : '#f7bc90',
        'strokeStyle'       : 'black',
        'outerRadius': 3.5,
    }
});
// Loads the tick audio sound in to an audio object.
let audio = new Audio('tick.mp3');
// This function is called when the sound is to be played.
function playSound()
{
    // Stop and rewind the sound if it already happens to be playing.
    audio.pause();
    audio.currentTime = 0;
    // Play the sound.
    audio.play();
}
// Vars used by the code in this page to do power controls.
let wheelPower    = 0;
let wheelSpinning = false;
// -------------------------------------------------------
// Function to handle the onClick on the power buttons.
// -------------------------------------------------------
function powerSelected(powerLevel)
{
    // Ensure that power can't be changed while wheel is spinning.
    if (wheelSpinning == false) {
        // Reset all to grey incase this is not the first time the user has selected the power.
        document.getElementById('pw1').className = "";
        document.getElementById('pw2').className = "";
        document.getElementById('pw3').className = "";
        // Now light up all cells below-and-including the one selected by changing the class.
        if (powerLevel >= 1) {
            document.getElementById('pw1').className = "pw1";
        }
        if (powerLevel >= 2) {
            document.getElementById('pw2').className = "pw2";
        }
        if (powerLevel >= 3) {
            document.getElementById('pw3').className = "pw3";
        }
        // Set wheelPower var used when spin button is clicked.
        wheelPower = powerLevel;
        // Light up the spin button by changing it's source image and adding a clickable class to it.
        document.getElementById('spin_button').src = "spin_on.png";
        document.getElementById('spin_button').className = "clickable";
    }
}
// -------------------------------------------------------
// Click handler for spin button.
// -------------------------------------------------------

function startSpin()
{
    // Ensure that spinning can't be clicked again while already running.
    if (wheelSpinning == false) {
        // Based on the power level selected adjust the number of spins for the wheel, the more times is has
        // to rotate with the duration of the animation the quicker the wheel spins.
        if (wheelPower == 1) {
            theWheel.animation.spins = 1;
        } else if (wheelPower == 2) {
            theWheel.animation.spins = 6;
        } else if (wheelPower == 3) {
            theWheel.animation.spins = 10;
        }
        // Disable the spin button so can't click again while wheel is spinning.
        document.getElementById('spin_button').className = "";
        // Begin the spin animation by calling startAnimation on the wheel object.
        theWheel.startAnimation();
        // Set to true so that power can't be changed and spin button re-enabled during
        // the current animation. The user will have to reset before spinning again.
        wheelSpinning = true;
    }
    // Change spin button
    document.getElementById('spin_button').style.backgroundColor = "lightgray";
    document.getElementById('spin_button').style.color = "white";
}

function disableWheel() {
  //document.getElementById('spin_button').className = "";
  document.getElementById('spin_button').style.backgroundColor = "lightgray";
  document.getElementById('spin_button').style.color = "white";
}

window.onload = function() {
  document.getElementById('controls').addEventListener('lightgray', console.log("user has clicked"),false);
}


// -------------------------------------------------------
// Function for reset button.
// -------------------------------------------------------
function resetWheel()
{
    theWheel.stopAnimation(false);  // Stop the animation, false as param so does not call callback function.
    theWheel.rotationAngle = theWheel.rotationAngle % 360;     // Setting to modulus (%) 360 keeps the current position.
    theWheel.draw();                // Call draw to render changes to the wheel.
    wheelSpinning = false;          // Reset to false to power buttons and spin can be clicked again.
    // Reset button style
    document.getElementById('spin_button').style.backgroundColor = "#ff7b60";
    document.getElementById('spin_button').style.color = "white";
}
// -------------------------------------------------------
// Called when the spin animation has finished by the callback feature of the wheel because I specified callback in the parameters.
// -------------------------------------------------------
function alertPrize(indicatedSegment)
{
    // Just alert to the user what happened.
    // In a real project probably want to do something more interesting than this with the result.
    if (indicatedSegment.text == 'JACKPOT') {
      prize = 1000000;
      showGame();
      document.getElementById('result').innerHTML = "All right contestant! This could be our biggest payday yet. For <strong>one million dollars</strong>, give me a letter in our puzzle please. We're looking for a movie quote.";
      // Scroll up the page
      window.scroll({
       top: 0,
       left: 0,
       behavior: 'smooth'
      });
      document.getElementById('change').innerHTML = "";
    } else if (indicatedSegment.text == 'BANKRUPT') {
        bankrupt();
        // Scroll up the page
        window.scroll({
         top: 0,
         left: 0,
         behavior: 'smooth'
        });
    } else if (indicatedSegment.text == 'LOSE TURN') {
        lostTurn();
        // Scroll up the page
        window.scroll({
         top: 0,
         left: 0,
         behavior: 'smooth'
        });
    } else {
        //alert("You have won " + indicatedSegment.text);
        prize = parseInt(indicatedSegment.text);
        showGame();
        document.getElementById('result').innerHTML = "All right contestant. For $" + numberWithCommas(prize) + ", give me a letter. Our category is 'famous quotes from movies'.";
        document.getElementById('change').innerHTML = "";
        // Scroll up the page
        window.scroll({
         top: 0,
         left: 0,
         behavior: 'smooth'
        });
    }
}
