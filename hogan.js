(function() {
	var GOOD = 'good',
		BAD = 'bad';

	var Target = function(type, position) {
		this.type = type;
		this.position = position;
		this.shot = false
	};

	exports.Round = function(config) {
		var startTime,
			endTime,
			timeout,
			targets = [],
			totalBadGuys = 0;

		function start() {
			// setup the targets
			for (var i=0; i<config.targetCount; i++) {
				var randomnumber = Math.floor(Math.random()*2);
				if (randomnumber === 0 && totalBadGuys < config.maxBadGuys) {
					targets.push(new Target(BAD, i+1));
					totalBadGuys++;
				}
				else {
					targets.push(new Target(GOOD, i+1));
				}
			}

			// if none of the targets are bad guys turn a random one bad
			if (totalBadGuys === 0) {
				console.log('random bad guy!');
				targets[Math.floor(Math.random()*targets.length)].type = BAD;
			}

			// tell the UI to show the targets
			config.onShowTargets(targets);

			// start the stopwatch
			startTime = new Date();

			// start the timeout
			timeout = setTimeout(function() {
				console.log('Round timed out.');
				stop();
			}, config.timeout);
		}

		function stop() {
			endTime = new Date();
			clearTimeout(timeout);

			config.onEnd(getStats());
		}

		function getStats() {
			// calculate hits & misses
			var hits = 0,
				misses = 0,
				t;
			for (var i=0; i<targets.length; i++) {
				t = targets[i];
				if (t.type === GOOD && t.shot) {
					misses ++;
				}
				else if (t.type === BAD && !t.shot) {
					misses ++;
				}
				else if (t.type === BAD && t.shot) {
					hits ++;
				}
			}

			// calculate stopwatch time
			var milliseconds = endTime - startTime;

			return {
				duration: milliseconds,
				hits: hits,
				misses: misses
			};
		}

		function shoot(targetPosition) {
			var target = targets[targetPosition];
			target.shot = true;
			
			config.onHit(target);

			if (target.type === GOOD) {
				// good guy shot, round over
				stop();
			}
			else {
				// if all bad guys shot, round over
				totalBadGuys = totalBadGuys - 1;
				if (totalBadGuys === 0) {
					stop();
				}
			}
		}

		// public interface
		this.start = start;
		this.shoot = shoot;
	};
}.call(this));