var Hogan = require('./hogan.js');

var maxMisses = 10,
    misses = 0,
    round = 0,
    score = 0;

function tallyScore(stats) {
  misses += stats.misses;
  
  // more points for faster rounds
  // minimum 1000 points per hit
  score += (stats.hits * Math.max(10000 - stats.duration, 1000));
}

function startRound() {
  // increment the round number
  round++;

  // configure the round
  var t = new Hogan.Round({
    timeout: 1000, // 1 second

    targetCount: 3,

    maxBadGuys: 2,

    onShowTargets: function(targets) {
      for (var i=0; i<targets.length; i++) {
        console.log('Target ' + targets[i].position + ' is *' + targets[i].type + '*');
      }
    },

    onHit: function(target) {
      if (target.type === 'bad') {
        // show target was hit
        console.log('Bad guy down! (Target ' + target.position + ')');
      }
      else {
        // show good guy was hit
        console.log('Good guy down! (Target ' + target.position + ')');
      }
    },

    onEnd: function(stats) {
      // show stats, progress to next round
      console.log('Round ' + round + ' over.', stats);
      tallyScore(stats);

      if (misses < maxMisses) {
        startRound();
      }
      else {
        console.log("********************");
        console.log("Game over! Misses: " + misses + ", Score: " + score);
        console.log("********************");
      }
    }
  });

  console.log('--------------------');
  console.log('Starting round ' + round);
  t.start();

  // simulate user shooting target
  setTimeout(function() {
    t.shoot(Math.floor(Math.random()*3)); // shoot a random target
  }, 500); 
}

// start the game
startRound();