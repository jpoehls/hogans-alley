var Hogan = require('./hogan.js');

// configure the round
var t = new Hogan.Round({
  timeout: 1000, // 1 second

  targetCount: 3,

  maxBadGuys: 2,

  onShowTargets: function(targets) {
    for (var i=0; i<targets.length; i++) {
      console.log('Target ' + targets[i].position + ' is *' + targets[i].type + '*');
    }
    console.log('--------------------');
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
    console.log('Round over.', stats);
  }
});

t.start();

// simulate user shooting target
setTimeout(function() {
  t.shoot(1); // shoot the second target
}, 500);