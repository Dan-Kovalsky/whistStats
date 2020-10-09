//example for game object with 3 rounds

const gameObject = {
  gameStartTimeObj: "2020-10-03T06:21:24.711Z",
  gameStartDateStr: "3/10/20",
  gameStartTimeStr: "06:21:24",
  playerNamesObj: {
    southName: "Niv",
    northName: "Dan",
    eastName: "Amir",
    westName: "Eyal"
  },
  playingTimeStr: "01:07:20",
  roundsHistory: [
    {
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
    },
    {
      roundNumber: 2,
      chosenTrump: "spades",
      biddings: {
        north: 7,
        south: 2,
        west: 2,
        east: 3
      },
      results: {
        north: 7,
        south: 1,
        west: 2,
        east: 3
      },
      points: {
        north: 49,
        west: 28,
        east: 33,
        south: 49
      },
      curSequence: {
        north: 1,
        west: 2,
        east: 2,
        south: 0
      },
      isStand: {
        north: true,
        west: true,
        east: true,
        south: false
      },
      upDown: 1,
      didBet: {
        north: true,
        south: false,
        west: false,
        east: false
      },
      isRoundFail: false,
      startBidTime: "2020-10-03T06:25:32.590Z",
      startRoundTime: "2020-10-03T06:28:46.349Z",
      endRoundTime: "2020-10-03T06:33:15.360Z"
    },
    {
      roundNumber: 3,
      chosenTrump: "hearts",
      biddings: {
        north: 3,
        south: 6,
        west: 1,
        east: 2
      },
      results: {
        north: 3,
        south: 6,
        west: 2,
        east: 2
      },
      points: {
        north: 68,
        west: 18,
        east: 47,
        south: 95
      },
      curSequence: {
        north: 2,
        west: 0,
        east: 3,
        south: 1
      },
      isStand: {
        north: true,
        west: false,
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
      startBidTime: "2020-10-03T06:33:16.466Z",
      startRoundTime: "2020-10-03T06:36:31.424Z",
      endRoundTime: "2020-10-03T06:39:14.365Z"
    }
  ]
};

