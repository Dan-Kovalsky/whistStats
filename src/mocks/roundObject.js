//example for round object

const roundObject = {
  roundNumber: 1,
  chosenTrump: "hearts",
  biddings: {
    north: 1,
    south: 7,
    west: 2,
    east: 2
  },
  results: {
    north: 2,
    south: 7,
    west: 2,
    east: 2
  },
  points: {
    north: -10,
    west: 14,
    east: 14,
    south: 59
  },
  curSequence: {
    north: 0,
    west: 1,
    east: 1,
    south: 1
  },
  isStand: {
    north: false,
    west: true,
    east: true,
    south: true
  },
  upDown: -1,
  didBet: {
    north: false,
    south: true,
    west: false,
    east: false
  },
  isRoundFail: false,
  startBidTime: "2020-10-03T06:21:24.711Z",
  startRoundTime: "2020-10-03T06:21:56.167Z",
  endRoundTime: "2020-10-03T06:25:31.450Z"
};
