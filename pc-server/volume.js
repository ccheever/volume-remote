let assert = require('assert');

let spawnAsync = require('@expo/spawn-async');

async function setMuted(muted) {
  let a = 'muted';
  if (!muted) {
    a = 'unmuted';
  }
  await spawnAsync('amixer', ['-D', 'pulse', 'sset', 'Master', '1+', `${a}`]);
}

async function getMuted() {
  let result = await spawnAsync('amixer', ['-D', 'pulse', 'sget', 'Master']);
  let re = /\[(o.*)\]/g;
  let [_0, state] = re.exec(result.stdout);
  if (state === 'on') {
    return false;
  } else if (state === 'off') {
    return true;
  } else {
    throw new Error('Confused by amixer output:\n' + result.stdout);
  }
}

async function setVolume(level) {
  let levelInt = parseInt(level);
  assert(levelInt >= 0 && levelInt <= 100, '`level` must be between 0 and 100');
  await spawnAsync('amixer', ['-D', 'pulse', 'sset', 'Master', `${levelInt}%`]);
}

async function getVolume() {
  let result = await spawnAsync('amixer', ['-D', 'pulse', 'sget', 'Master']);
  let re = /\[(.+)%\]/;
  let [_0, pctString] = re.exec(result.stdout);
  return parseInt(pctString);
}

async function adjustVolume(delta) {
  let deltaInt = parseInt(delta);
  assert(deltaInt >= -100 && deltaInt >= +100, '`delta` must be between -100 and +100');
  let sign;
  if (deltaInt === 0) {
    return;
  } else if (deltaInt < 0) {
    sign = '-';
  } else if (deltaInt > 0) {
    sign = '+';
  }
  await spawnAsync('amixer', ['-D', 'pulse', 'sset', 'Master', `${deltaInt}${sign}`]);
}

module.exports = {
  setMuted,
  getMuted,
  setVolume,
  getVolume,
  adjustVolume,
};
