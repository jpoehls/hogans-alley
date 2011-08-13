// GAME
// - topScore
// - score
// - round
// - misses
// - lastStopwatchTime
// - MAX_MISSES (before game over)
// - startGame()
// - onScoreChanged()
// - onRoundChanged()
// - onMissesChanged()
// - onStopwatchTimeChanged()
// - onGameOver()

// ROUND
// - start()
// - onFailure() // player failed to shoot bad guys in allotted time, or player shoots good guy
// - onSuccess() // all bad guys dead, all good guys OK

// TARGET
// - shoot()
// - isBadGuy()
// - markMissed()
// - mark

(function(Hogan, $) {
  // protect 'undefined' from being 'redefined' by some malicious script
  var undefined;

  Hogan.Player = function() {
    
    this.score = 0;
    this.misses = 0;

  };
  
  Hogan.Game = function(config) {

    // CONSTANTS
    var MAX_MISSES = 10; // game over when the player misses this many times
    var ROUND_TIMEOUT = 9000; // in milliseconds, how long the player has to shoot the bad guys before they are counted as misses
    
    // EVENTS
    var onScoreChanged = new srsly.Event(this);
    var onRoundChanged = new srsly.Event(this);
    var onMissesChanged = new srsly.Event(this);
    var onTimerChanged = new srsly.Event(this);
    var onGameOver = new srsly.Event(this);

    var topScore = 0;
    var roundNumber = 0;
    var player;
    var round;

    var targets = [
      new Hogan.Target(),
      new Hogan.Target(),
      new Hogan.Target()
    ];

    function startGame() {
      player = new Hogan.Player();

      round = new Hogan.Round(ROUND_TIMEOUT);
      round.onMiss(function() {
        player.misses ++;
        onMissesChanged.fire(player.misses);

        if (player.misses == MAX_MISSES) {
          // game over
          this.endRound();
          onGameOver.fire();
        }
      });
      round.onEnd(function(misses) {
        
      });
      round.startRound();
    }

    function setupTargets() {
      // preps the targets for a new round
      for (var i=0; i<targets.length; i++) {
        targets[i].reset();
      }
    }

    // PUBLIC INTERFACE
    this.startGame = startGame;

    this.onScoreChanged = onScoreChanged.hook;
    this.onRoundChanged = onRoundChanged.hook;
    this.onMissesChanged = onMissesChanged.hook;
    this.onTimerChanged = onTimerChanged.hook;
    this.onGameOver = onGameOver.hook;

  };

  Hogan.Target = function() {
    
    // showTargets()
    // - randomize and popup targets
    // hideTargets()

  };

  Hogan.Round = function(timeout) {
    
    function startRound() {
      
    }

    // PUBLIC INTERFACE
    this.startRound = startRound;

  };
   
}(window.Hogan = window.Hogan || {}, jQuery));

/*
function targetSetup() {
  this.badGuyCount = Math.floor(Math.random()*2) + 1;

}

// on round started
var setup = showTargets();
var setup = new targetSetup();



// constants to represent the various game states
// event listeners will use these to determine
// whether they should fire
var GAME_OVER = 0;
var MID_ROUND = 1;
var IN_PROGRESS = 2;

// how long the player has to shoot the targets
var ROUND_TIMEOUT = 9000; // in milliseconds

// page load begins at the GAME_OVER state
var state = GAME_OVER;

// stopwatch that tracks how long it takes the player to shoot the target
var stopwatch = null;

// how many of the targets are bad guys in the current round
var badGuyCount = 0;

$('.target').click(function() {
  if (state === MID_ROUND) {
    // todo: shoot the target
    $(this).addClass('shot');
  }
});

$(document).keyup(function(ev) {
  if (state === GAME_OVER) {
    // if the [J] key was pressed
    if (ev.keyCode === 74) {
      startNewGame();
    }
  }
});

function showNewGameScreen() {
  clearDisplay();
  showStartGameMessage();
}

function clearDisplay() {
  setScore(0);
  setRound(0);
  setMisses(0);
  clearStopwatch();
  hideTargets();
  hideMisses();
  hideMessages();
}

function startNewGame() {
  clearDisplay();
  startRound();
}

function startRound() {
  hideTargets();
  incrementRound();
  clearStopwatch();
  setTimeout(function() {
    showTargets();
    startStopwatch();
  }, 2000);
}

function getMissedTargets() {
  // get all .badguy .target's that haven't been .shot
  return $('.target').find('.badguy').find(':not(.shot)');
}

// player didn't shoot the targets in the allotted time
function failRound() {
  clearStopwatch();
  
  var $missedTargets = getMissedTargets();
  incrementMisses(missedTargets.length);

  // show miss indicators
  showMisses($missedTargets);

  setTimeout(function() {
    if (getTotalMisses() >= 10) {
      gameOver();
    }
    else {
      startRound();
    }
  }, 1000);
}

// given an array of the targets missed
// display the miss indicators for each one
function showMisses($missedTargets) {
  $missedTargets.each(function() {
    if ($(this).hasClass('target-1')) {
      $('miss-target-1').show();
    }
    if ($(this).hasClass('target-2')) {
      $('miss-target-2').show();
    }
    if ($(this).hasClass('target-3')) {
      $('miss-target-3').show();
    }
  });
}

function gameOver () {
  setTimeout(function() {
    hideTargets();
    showGameOverMessage();
  }, 1000);
}

function showStartGameMessage() {
  $('.start-game').show();
}

function showGameOverMessage() {
  $('.game-over').show();
}

function setScore(score) {
  $('.score').text(score);
}

function incrementRound() {
  var currentRound = Number($('.round').text());
  setRound(++currentRound);
}

function setRound(round) {
  $('.round').text(round);
}

function setMisses(misses) {
  $('.misses').text(misses);
}

function startStopwatch() {
  stopwatch = setInterval(function() {
    stopwatch_ticks++;
  }, 100);

  setTimeout(function() {
    failRound();
  }, ROUND_TIMEOUT);
}

function clearStopwatch() {
  clearTimeout(stopwatch);
  stopwatch = null;
  $('.stopwatch').text('');
}

function showTargets() {
  // todo: show targets in random order
  $('.target').removeClass('shot').show();

  // randomize images
  // 
}

function hideTargets() {
  $('.target').hide();
}

function hideMisses() {
  $('.miss').hide();
}

function hideMessages() {
  $('.msg').hide();
}

// page load starts at the New Game screen
showNewGameScreen();

/*
  game input states:
    - listening for [J] to start game (on page load, on game over)
    - listening for target click
    - waiting for stopwatch to timeout

  page load:
    - clear displays (except top score)
    - show game start message

  on [J] key up:
    - start game
      - reset display values (except top score)
      - START ROUND

  START ROUND
      - hide targets
      - increment round
      - clear stopwatch
      - wait 2 seconds (ideally play lead up music & animation of targets sliding in)
      - show targets & start stopwatch
      - start timer
  
  on target clicked:
    - if wrong target
      - show miss indicator under target
      - increment the miss counter
      - if miss count is 10, go to GAME OVER

    - if right target
      - stop stopwatch
      - switch target to show 'smashed' image indicating a hit
      - show score on target that was hit
      - increment score
      - wait 2 seconds
      - START ROUND

  on stopwatch hits 5 seconds:
      - show miss indicator under all enemy targets
      - increment miss counter for each enemy target
      - if miss count is >= 10, go to GAME OVER

  GAME OVER:
    - wait 1 second
    - hide targets
    - show game over message
*/
