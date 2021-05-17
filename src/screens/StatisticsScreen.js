import React, {Component} from 'react';
import {FlatList, ScrollView, Dimensions, Alert} from 'react-native';
import {Text, View, Colors, Assets, Card, LoaderScreen, StateScreen, TextField} from 'react-native-ui-lib';
import {whistStore} from "../stores/allGamesStore";
import {connect} from 'remx';
import {Navigation} from "react-native-navigation";
import AsyncStorage from '@react-native-community/async-storage';
import {cloneDeep} from "lodash"
import {BONUS_POINTS_FOR_5_ROW} from "../constants/Points";
import _ from "lodash"
import {BID_BTN_COLORS as clr} from "../constants/styles/Colors";

const ALL_GAMES_KEY = '@WhistStats:allGamesHistory';
const SCREEN_WIDTH = Dimensions.get('screen').width;
const CARD_WIDTH = SCREEN_WIDTH - 40;
const CUBE_WIDTH = CARD_WIDTH / 10;

const INFO_ALERTS = {
  playersRanking: {title: "Players Ranking", message: "This is the main table of the league.\nOn each game winner get 4 points, 2nd get 1 point, 3rd loses 1 point and loser loses 4 points\nin case of draw, the player who played fewer games will win. next tie break is the number of wins. next tie break is points per round."},
  weeksOnPodium: {title: "Weeks on podium", message: "summary of playerRanking table - podiums of all weeks history.\nsorted by points (gold*3 + silver*2 + bronze*1).\nFor each player the graph represents fraction of each position according to the player with the max weeks on podium"},
  rankingHistory: {title: "Players Ranking History", message: "TODO"},
  roundStands: {title: "% Round Stands", message: "For each player you can see the percentage of stands in all of the rounds he played.\nAlso the number of rounds he stands out of the number of rounds he played."},
  pointsPerRound: {title: "Points Per Round", message: "For each player you can see the average points per round that he played.\nAlso the sum of all af his points out of the number of the number of rounds that he played."},
  playerBets: {title: "Player Bets", message: "For each player:\nWhite:#bets out of #rounds he played\nBlue:% of bets out the round he played\nRed:#fails\nGreen:#stands and % of stands out of games that he bet.\nList is sorted by the % of stands out of the player bets"},
  sequences: {title: "Sequences", message: "Bonuses count: how many times player achieve bonus(sequence of 5 stands).\nMax sequence: longest sequence of stands in a game.\nMax accumulate sequence: longest sequence of stands in more then one game"},
  redGames: {title: "Red Games", message: "Games that finished with score below zero for each player"},
  upDownRatio: {title: "title", message: "TODO"},
  biddingsDistribution: {title: "title", message: "TODO"},
  trumpsDistribution: {title: "title", message: "TODO"},
};

class StatisticsScreen extends Component {

    static propTypes = {};

    constructor(props) {
        super(props);
        Navigation.events().bindComponent(this);
        this.backBtnPressed.bind(this.backBtnPressed);

        this.state = {
            loading: true,
            isGamesDataEmpty: false,
            allGamesObj: [],
            allGames: [],
            roundsHistory: this.props.roundsHistory,
            allPlayersPercentage: {},
/*
  Amir: {
    betAndStandsCount: 120
    betCount: 224
    bonusesCount: 28
    curSequenceAccumulate: 0
    failCount: 495
    gamesCount: 97
    gamesRanking: [15, 19, 28, 35]
    maxSequence: 10
    maxSequenceAccumulate: 16
    rankingHistoryList: undefined
    standsCount: 695
    sumOfPoints: 9885
    redGamesCount: 2
  },
  Dan: {}
*/
            biddingsDistribution: [],
            standsPerBidding: [],
            upsCount: 0,
            downsCount: 0,
            trumpsDistribution: {
                // spades: 0,
                // hearts: 0,
                // diamonds: 0,
                // clubs: 0
            },
            showCards: {
              playersRanking: true,
              weeksOnPodium: false,
              rankingHistory: false,
              roundStands: false,
              pointsPerRound: false,
              playerBets: false,
              sequences: false,
              redGames: false,
              upDownRatio: false,
              roundFails: false,
              biddingsDistribution: false,
              trumpsDistribution: false,
            },
            rankingHistoryChosenWeek: 1

        }
    }

    static get options() {
        return {
            topBar: {
                rightButtons: [
                    {
                        id: 'back',
                        text: 'Back'
                    },
                ],
                title: {
                    text: `Statistics`
                }

            },
            layout: {
                orientation: ['portrait'],
                direction: 'ltr'
            }
        }
    }

    navigationButtonPressed({buttonId}) {
        if (buttonId === 'back') {
            this.backBtnPressed();
        }
    }


    backBtnPressed() {
        Navigation.dismissModal(this.props.componentId);
    }

    componentDidMount() {
      this.getAllGamesFromStorage().then(() => {
        this.setState({
            allPlayersPercentage: this.calcPlayerDictionary(),
            standsPerBidding: this.calcStandsPerBidding(),
            trumpsDistribution: this.calcTrumpsDistribution()
          },
          () => {
            this.setState({loading: false});
            const roundsCount = Object.keys(this.state.trumpsDistribution).reduce((sum,key) => sum + this.state.trumpsDistribution[key], 0);
            Navigation.mergeOptions(this.props.componentId, {
              topBar: {
                subtitle: {
                  text: `${this.state.allGames.length} Games, ${roundsCount} Rounds`
                }
              }
            });
          });
      })
    }

    getAllGamesFromStorage = async () => {
        const allGamesString = await AsyncStorage.getItem(ALL_GAMES_KEY);
        if (allGamesString === null) {
            this.setState({isGamesDataEmpty: true})
        } else {
          const allGames = JSON.parse(allGamesString);
          await this.setState({allGames});
        }
    };

    roundsMapHistory = [];
    calcPlayerDictionary = () => {
        let playerRoundsMap = {};
        this.state.allGames.forEach(
            game => {
                Object.keys(game.playerNamesObj).forEach( position => {
                    const name = game.playerNamesObj[position];
                    if (playerRoundsMap[name] === undefined) {
                        playerRoundsMap[name] =
                            {
                                standsCount: 0,
                                failCount: 0,
                                betCount: 0,
                                betAndStandsCount: 0,
                                gamesCount: 0,
                                redGamesCount: 0,
                                gamesRanking: [0,0,0,0],
                                weeksOnPodium: [0,0,0], //this is count of weeks that the player was [first,second,third] on the overall board
                                sumOfPoints: 0,
                                bonusesCount: 0,
                                maxSequence: 0,
                                maxSequenceAccumulate: 0,
                                curSequenceAccumulate: 0,
                                rankingHistoryList: undefined
                            }
                    }
                });

                const gameScore = game.roundsHistory[game.roundsHistory.length - 1].points;
                Object.keys(gameScore).sort((location1, location2) => gameScore[location2] - gameScore[location1]).forEach(
                    (location, index) => {
                        playerRoundsMap[game.playerNamesObj[`${location}Name`]].gamesCount++;
                        playerRoundsMap[game.playerNamesObj[`${location}Name`]].gamesRanking[index]++;
                        playerRoundsMap[game.playerNamesObj[`${location}Name`]].sumOfPoints += gameScore[location];
                        if (gameScore[location] < 0) {
                          playerRoundsMap[game.playerNamesObj[`${location}Name`]].redGamesCount++;
                        }
                    }
                );


                game.roundsHistory.forEach(
                    round => {
                      const northPlayer = playerRoundsMap[game.playerNamesObj.northName];
                      round.isStand.north ? northPlayer.standsCount++ : northPlayer.failCount++;
                      if (round.didBet.north) {
                        northPlayer.betCount++;
                        if (round.isStand.north) {
                          northPlayer.betAndStandsCount++;
                        }
                      }
                      if (round.curSequence.north > 0 && round.curSequence.north % 5 === 0) {
                        northPlayer.bonusesCount ++;
                      }
                      northPlayer.maxSequence = Math.max(northPlayer.maxSequence, round.curSequence.north);
                      if (round.curSequence.north === 0) {
                        northPlayer.curSequenceAccumulate = 0;
                      } else {
                        northPlayer.curSequenceAccumulate ++;
                        northPlayer.maxSequenceAccumulate = Math.max(northPlayer.maxSequenceAccumulate, northPlayer.curSequenceAccumulate)
                      }

                      const westPlayer = playerRoundsMap[game.playerNamesObj.westName];
                      round.isStand.west ? westPlayer.standsCount++ : westPlayer.failCount++;
                      if (round.didBet.west) {
                        westPlayer.betCount++;
                        if (round.isStand.west) {
                          westPlayer.betAndStandsCount++;
                        }
                      }
                      if (round.curSequence.west > 0 && round.curSequence.west % 5 === 0) {
                        westPlayer.bonusesCount ++;
                      }
                      westPlayer.maxSequence = Math.max(westPlayer.maxSequence, round.curSequence.west);
                      if (round.curSequence.west === 0) {
                        westPlayer.curSequenceAccumulate = 0;
                      } else {
                        westPlayer.curSequenceAccumulate ++;
                        westPlayer.maxSequenceAccumulate = Math.max(westPlayer.maxSequenceAccumulate, westPlayer.curSequenceAccumulate)
                      }

                      const eastPlayer = playerRoundsMap[game.playerNamesObj.eastName];
                      round.isStand.east ? eastPlayer.standsCount++ : eastPlayer.failCount++;
                        if (round.didBet.east) {
                          eastPlayer.betCount++;
                          if (round.isStand.east) {
                            eastPlayer.betAndStandsCount++;
                          }
                        }
                      if (round.curSequence.east > 0 && round.curSequence.east % 5 === 0) {
                        eastPlayer.bonusesCount ++;
                      }
                      eastPlayer.maxSequence = Math.max(eastPlayer.maxSequence, round.curSequence.east);
                      if (round.curSequence.east === 0) {
                        eastPlayer.curSequenceAccumulate = 0;
                      } else {
                        eastPlayer.curSequenceAccumulate ++;
                        eastPlayer.maxSequenceAccumulate = Math.max(eastPlayer.maxSequenceAccumulate, eastPlayer.curSequenceAccumulate)
                      }

                      const southPlayer = playerRoundsMap[game.playerNamesObj.southName];
                      round.isStand.south ? southPlayer.standsCount++ : southPlayer.failCount++;
                      if (round.didBet.south) {
                        southPlayer.betCount++;
                        if (round.isStand.south) {
                          southPlayer.betAndStandsCount++;
                        }
                      }
                      if (round.curSequence.south > 0 && round.curSequence.south % 5 === 0) {
                        southPlayer.bonusesCount ++;
                      }
                      southPlayer.maxSequence = Math.max(southPlayer.maxSequence, round.curSequence.south);
                      if (round.curSequence.west === 0) {
                        westPlayer.curSequenceAccumulate = 0;
                      } else {
                        westPlayer.curSequenceAccumulate ++;
                        westPlayer.maxSequenceAccumulate = Math.max(westPlayer.maxSequenceAccumulate, westPlayer.curSequenceAccumulate)
                      }
                    }
                )

                // weeksOnPodium - increment data for the first three after this week
                const sortedRanking = this.sortRankingPointsOfSpecificWeek(playerRoundsMap);
                const leaderName = sortedRanking[0], secondName = sortedRanking[1], thirdName = sortedRanking[2];
                playerRoundsMap[leaderName].weeksOnPodium[0] ++
                playerRoundsMap[secondName].weeksOnPodium[1] ++
                playerRoundsMap[thirdName].weeksOnPodium[2] ++

              this.roundsMapHistory.push(_.cloneDeep(playerRoundsMap))
            }
        );
        return playerRoundsMap
    };

    calcTrumpsDistribution = () => {
        let trumpsDistribution = {
            spades: 0,
            hearts: 0,
            diamonds: 0,
            clubs: 0
        };
        this.state.allGames.forEach(
            game => {
                game.roundsHistory.forEach(
                    round => {
                        trumpsDistribution[round.chosenTrump]++
                    }
                )
            }
        );
        return trumpsDistribution
    };

    calcBiddingsDistribution = () => {
        let bidsArray = new Array(14).fill(0);
        this.state.allGames.forEach(
            game => {
                game.roundsHistory.forEach(
                    round => {
                        Object.values(round.biddings).forEach(
                            bid => {
                                bidsArray[bid]++
                            }
                        )
                    }
                )
            }
        );
        return bidsArray
    };

    calcRoundFails = () => {
        let roundFailsCount = 0
        this.state.allGames.forEach(
            game => {
                game.roundsHistory.forEach(
                    round => {
                        if(round.isRoundFail) {
                          roundFailsCount++;
                        }
                    }
                )
            }
        );
        return roundFailsCount
    };

    calcUpDownRatio = () => {
        let upsCount = 0, downsCount = 0
        this.state.allGames.forEach(
            game => {
                game.roundsHistory.forEach(
                    round => {
                        if(round.upDown > 0) {
                          upsCount++;
                        } else if(round.upDown < 0) {
                          downsCount++;
                        } else {
                          console.warn("calcUpDownRatio: found round with upDown=0")
                        }
                    }
                )
            }
        );
        return {upsCount, downsCount}
    };

    calcStandsPerBidding = () => {
        let standsPerBidArray = new Array(14).fill(0);
        this.state.allGames.forEach(
            game => {
                game.roundsHistory.forEach(
                    round => {
                        Object.keys(round.biddings).forEach(
                            location => {
                                if (round.isStand[location]) {
                                    standsPerBidArray[round.biddings[location]]++
                                }
                            }
                        )
                    }
                )
            }
        );
        return standsPerBidArray
    };

    renderStandsGraphs = () => {
      const roundsCount = name => this.state.allPlayersPercentage[name].standsCount + this.state.allPlayersPercentage[name].failCount;
      const fraction = name => this.state.allPlayersPercentage[name].standsCount / roundsCount(name);
        return (Object.keys(this.state.allPlayersPercentage)
            .sort((name1, name2) => fraction(name2) - fraction(name1))
            .map((name) => {
                const percentage = Number((fraction(name) * 100).toFixed(2));
                return (
                    <View key={name} row spread flex style={{
                        backgroundColor: Colors.green60,
                        height: 20,
                        marginBottom: 8,
                        width: (CARD_WIDTH * percentage / 100)
                    }}>
                        <Text>{`${name.toUpperCase()}`}</Text>
                        <Text>{` ${percentage}% `}</Text>
                        <Text>{`${this.state.allPlayersPercentage[name].standsCount}/${roundsCount(name)}`}</Text>
                    </View>
                )
            })
        )
    };

    calcPoints = (playerGamesRanking) => {
        return (
            playerGamesRanking[0] * 4
            + playerGamesRanking[1] * 1
            + playerGamesRanking[2] * -1
            + playerGamesRanking[3] * -4
        )
    };

    sortRankingPointsOfSpecificWeek = (playersPercentageObject) => {
      return Object.keys(playersPercentageObject)
        .sort((name1, name2) => {
          const score = name => this.calcPoints(playersPercentageObject[name].gamesRanking);
          const gamesCount = name => playersPercentageObject[name].gamesCount;
          const winCount = name => playersPercentageObject[name].gamesRanking[0];
          const ppr = name => playersPercentageObject[name].sumOfPoints / gamesCount(name);

          return (
            score(name2) - score(name1)
            || gamesCount(name1) - gamesCount(name2)
            || winCount(name2) - winCount(name1)
            || ppr(name2) - ppr(name1)
          )
        });

    }

    renderTableTitle = () => {
        return (
            <View row style={{height: 30}}>
                <Text style={{width: CUBE_WIDTH *3}}> </Text>
                <Text style={{width: CUBE_WIDTH  *1.5}}>PTS</Text>
                <Text style={{width: CUBE_WIDTH *1.5}}> G</Text>
                <Text style={{width: CUBE_WIDTH}}>W</Text>
                <Text style={{width: CUBE_WIDTH}}>2nd</Text>
                <Text style={{width: CUBE_WIDTH}}> 3rd</Text>
                <Text style={{width: CUBE_WIDTH}}>  L</Text>
            </View>
        )
    };

    renderPlayerRankingLine = ({item, index}) => {
        const rankingPoints = this.calcPoints(this.state.allPlayersPercentage[item].gamesRanking);
        return (
            <View row style={{height: 20}}>
                <Text style={{width: CUBE_WIDTH *3}}>{` ${index + 1}.  ${item.toUpperCase()}`}</Text>
                <Text style={{width: CUBE_WIDTH *1.5, fontWeight: 'bold'}}>{`  ${rankingPoints >= 0 ?" ":""}${rankingPoints}`}</Text>
                <Text style={{width: CUBE_WIDTH *1.5}}>{` ${this.state.allPlayersPercentage[item].gamesCount}`}</Text>
                <Text style={{width: CUBE_WIDTH}}>{` ${this.state.allPlayersPercentage[item].gamesRanking[0]}`}</Text>
                <Text style={{width: CUBE_WIDTH}}>{`  ${this.state.allPlayersPercentage[item].gamesRanking[1]}`}</Text>
                <Text style={{width: CUBE_WIDTH}}>{`  ${this.state.allPlayersPercentage[item].gamesRanking[2]}`}</Text>
                <Text style={{width: CUBE_WIDTH}}>{` ${this.state.allPlayersPercentage[item].gamesRanking[3]}`}</Text>
            </View>
        )
    };

    renderPlayerRankingLineByWeek = (name, index, weekNumber) => {
        const rankingPoints = this.calcPoints(this.roundsMapHistory[this.state.rankingHistoryChosenWeek][name].gamesRanking);
        return (
            <View row style={{height: 20}}>
                <Text style={{width: CUBE_WIDTH *3}}>{` ${index + 1}.  ${name.toUpperCase()}`}</Text>
                <Text style={{width: CUBE_WIDTH *1.5, fontWeight: 'bold'}}>{`  ${rankingPoints >= 0 ?" ":""}${rankingPoints}`}</Text>
                <Text style={{width: CUBE_WIDTH *1.5}}>{` ${this.roundsMapHistory[this.state.rankingHistoryChosenWeek][name].gamesCount}`}</Text>
                <Text style={{width: CUBE_WIDTH}}>{` ${this.roundsMapHistory[this.state.rankingHistoryChosenWeek][name].gamesRanking[0]}`}</Text>
                <Text style={{width: CUBE_WIDTH}}>{`  ${this.roundsMapHistory[this.state.rankingHistoryChosenWeek][name].gamesRanking[1]}`}</Text>
                <Text style={{width: CUBE_WIDTH}}>{`  ${this.roundsMapHistory[this.state.rankingHistoryChosenWeek][name].gamesRanking[2]}`}</Text>
                <Text style={{width: CUBE_WIDTH}}>{` ${this.roundsMapHistory[this.state.rankingHistoryChosenWeek][name].gamesRanking[3]}`}</Text>
            </View>
        )
    };

    renderPlayersRankingGraphs = () => {
        const sortedRanking = this.sortRankingPointsOfSpecificWeek(this.state.allPlayersPercentage)
        return (
            <View flex>
                {this.renderTableTitle()}
                <FlatList
                    keyExtractor={(item) => item}
                    data={sortedRanking}
                    renderItem={this.renderPlayerRankingLine}
                />
            </View>
        );
    };

  renderWeeksOnPodiumGraphs = () => {
    const weeksOnPodiumArray = name => this.state.allPlayersPercentage[name].weeksOnPodium;
    const weeksOnPodiumCount = name => _.sum(this.state.allPlayersPercentage[name].weeksOnPodium);
    const totalPoints = name =>
      weeksOnPodiumArray(name)[0] * 3 +
      weeksOnPodiumArray(name)[1] * 2 +
      weeksOnPodiumArray(name)[2] * 1
    const maxWeeksOnPodiumCount = Math.max(...(Object.keys(this.state.allPlayersPercentage).map((name) => weeksOnPodiumCount(name))));
    return (Object.keys(this.state.allPlayersPercentage)
        .sort((name1, name2) => totalPoints(name2) - totalPoints(name1))
        .map((name) => {
          const goldFractionFromMax = weeksOnPodiumArray(name)[0] / maxWeeksOnPodiumCount;
          const silverFractionFromMax = weeksOnPodiumArray(name)[1] / maxWeeksOnPodiumCount;
          const bronzeFractionFromMax = weeksOnPodiumArray(name)[2] / maxWeeksOnPodiumCount;
            return (
              <View key={name}>
                <Text>
                  <Text>{`${name}: `}</Text>
                  <Text style={{fontWeight: 'bold'}}>{`${weeksOnPodiumCount(name)}`}</Text>
                  <Text>{` weeks(`}</Text>
                  <Text style={{color: "gold"}}>{`${weeksOnPodiumArray(name)[0]}`}</Text>
                  <Text>{`,`}</Text>
                  <Text style={{color: "silver"}}>{`${weeksOnPodiumArray(name)[1]}`}</Text>
                  <Text>{`,`}</Text>
                  <Text style={{color: "#CD7F32"}}>{`${weeksOnPodiumArray(name)[2]}`}</Text>
                  <Text>{`).   ${totalPoints(name)} points`}</Text>
                </Text>
                <View row style={{height: 20, marginBottom: 1, borderBottomWidth:0.5, borderBottomColor:"black"}}>
                  <View style={{
                    backgroundColor: "gold",
                    width: (CARD_WIDTH * goldFractionFromMax)
                  }}/>
                  <View style={{
                    backgroundColor: "silver",
                    width: (CARD_WIDTH * silverFractionFromMax)
                  }}/>
                  <View style={{
                    backgroundColor: "#CD7F32",
                    width: (CARD_WIDTH * bronzeFractionFromMax)
                  }}/>
                </View>
              </View>
            )
        })
    )
  };

  renderRankingHistoryGraphs = () => {
    const sortedRanking = this.sortRankingPointsOfSpecificWeek(this.roundsMapHistory[this.state.rankingHistoryChosenWeek]);
        return (
            <View flex>
              <View row style={{height: 50}}>

                <Text text60>choose week: </Text>
                <TextField
                  centered
                  text60
                  style={{fontWeight: 'bold', color: "red"}}
                  // titleColor={clr.TEXT}
                  containerStyle={{height:40, width:25}}
                  // placeholder={`${this.state.rankingHistoryChosenWeek}`}
                  value={this.state.rankingHistoryChosenWeek}
                  onChangeText={(text) => this.setState({rankingHistoryChosenWeek: text || 0})}
                  keyboardType={"number-pad"}
                  maxLength={3}
                />
              </View>

              {this.renderTableTitle()}
                <FlatList
                    keyExtractor={(item) => item}
                    data={sortedRanking}
                    renderItem={({item, index}) => this.renderPlayerRankingLineByWeek(item, index, 3)}
                />
            </View>
        );
  };

  renderPointsPerRoundGraphs = () => {
      const maxValue = Math.max(...(Object.keys(this.state.allPlayersPercentage).map((name) => Math.abs(this.state.allPlayersPercentage[name].sumOfPoints/ (this.state.allPlayersPercentage[name].standsCount + this.state.allPlayersPercentage[name].failCount)))));
      const roundsCount = name => this.state.allPlayersPercentage[name].standsCount + this.state.allPlayersPercentage[name].failCount;
      const sumOfPoints = name => this.state.allPlayersPercentage[name].sumOfPoints;
      const ppr = name => sumOfPoints(name) / roundsCount(name);
      return (Object.keys(this.state.allPlayersPercentage)
            .sort((name1, name2) => ppr(name2) - ppr(name1))
            .map((name) => {
                const fractionFromMax = Math.abs(ppr(name)) / maxValue;
                if (ppr(name) < 0) {
                    return (
                        <View key={name} row>
                            <View flex right style={{
                                height: 20,
                                marginBottom: 8,
                                width: (CARD_WIDTH / 2)
                            }}>

                                <View center style={{
                                    backgroundColor: Colors.red10,
                                    height: 20,
                                    width: ((CARD_WIDTH / 2) * fractionFromMax)
                                }}>
                                    <Text>{ppr(name).toFixed(2)}</Text>
                                </View>
                            </View>
                            <View flex row spread style={{
                                height: 20,
                                marginBottom: 8,
                                width: (CARD_WIDTH / 2)
                            }}>
                                    <Text>{`${name.toUpperCase()}`}</Text>
                                    <Text>{`${sumOfPoints(name)}Pts/${roundsCount(name)}Rd`}</Text>
                            </View>
                        </View>
                    )
                }
                else {
                    return (
                        <View key={name} row>
                            <View flex row spread style={{
                                height: 20,
                                marginBottom: 8,
                                width: (CARD_WIDTH / 2)
                            }}>
                                <Text>{`${name.toUpperCase()}`}</Text>
                                <Text>{`${sumOfPoints(name)}Pts/${roundsCount(name)}Rd`}</Text>
                            </View>
                            <View flex style={{
                                height: 20,
                                marginBottom: 8,
                                width: (CARD_WIDTH / 2)
                            }}>
                                <View center style={{
                                    backgroundColor: Colors.green40,
                                    height: 20,
                                    width: (CARD_WIDTH/2 * fractionFromMax)
                                }}>
                                    <Text>{ppr(name).toFixed(2)}</Text>
                                </View>
                            </View>
                        </View>
                    )

                }
            })
        )
    };

  renderSequencesGraphs = () => {
      const bonusesCount = name => this.state.allPlayersPercentage[name].bonusesCount;
      let bonusesCountMax = 0;
      const maxSequence = name => this.state.allPlayersPercentage[name].maxSequence;
      const maxSequenceAccumulate = name => this.state.allPlayersPercentage[name].maxSequenceAccumulate;

      const bonusCountGraph = Object.keys(this.state.allPlayersPercentage)
        .sort((name1, name2) => bonusesCount(name2) - bonusesCount(name1))
        .map((name) => {
          if (bonusesCountMax === 0) {
            bonusesCountMax = bonusesCount(name);
          }
          const fraction = bonusesCount(name) / bonusesCountMax;
          return (
            <View key={name}>
              <View row spread style={{
                backgroundColor: Colors.red80,
                height: 20,
                marginBottom: 1,
                // width: (CARD_WIDTH * fraction)
              }}>
                <Text>{`${name.toUpperCase()}`}</Text>
                <Text>{`${bonusesCount(name)}(${bonusesCount(name) * BONUS_POINTS_FOR_5_ROW}pts)`}</Text>
                <Text>{` `}</Text>
              </View>
            </View>
          )
        });

      const maxSequenceGraph = Object.keys(this.state.allPlayersPercentage)
        .sort((name1, name2) => maxSequence(name2) - maxSequence(name1))
        .map((name) => {
          return (
            <View key={name}>
              <View row spread style={{
                backgroundColor: Colors.yellow80,
                height: 20,
                marginBottom: 1,
                // width: (CARD_WIDTH * fraction)
              }}>
                <Text>{`${name.toUpperCase()}`}</Text>
                <Text>{`${maxSequence(name)}`}</Text>
                <Text>{` `}</Text>
              </View>
            </View>
          )
        });

      const maxAccumulateSequenceGraph = Object.keys(this.state.allPlayersPercentage)
        .sort((name1, name2) => maxSequenceAccumulate(name2) - maxSequenceAccumulate(name1))
        .map((name) => {
          return (
            <View key={name}>
              <View row spread style={{
                backgroundColor: Colors.green80,
                height: 20,
                marginBottom: 1,
                // width: (CARD_WIDTH * fraction)
              }}>
                <Text>{`${name.toUpperCase()}`}</Text>
                <Text>{`${maxSequenceAccumulate(name)}`}</Text>
                <Text>{` `}</Text>
              </View>
            </View>
          )
        });
        return (
          <View>
            <Text style={{fontWeight: 'bold'}}>Bonuses count</Text>
            {bonusCountGraph}
            <Text style={{fontWeight: 'bold'}}>Max sequence</Text>
            {maxSequenceGraph}
            <Text style={{fontWeight: 'bold'}}>Max accumulate sequence</Text>
            {maxAccumulateSequenceGraph}
          </View>
        )
    };

  renderBetGraphs = () => {
      const betCount = name => this.state.allPlayersPercentage[name].betCount;
      const roundsCount = name => this.state.allPlayersPercentage[name].standsCount + this.state.allPlayersPercentage[name].failCount;
      const stands = name => this.state.allPlayersPercentage[name].betAndStandsCount;
      const standsFraction = name => (stands(name) / betCount(name)) || 0;
      const betFraction = name => betCount(name) / roundsCount(name);


      const betsPercentageGraphs = Object.keys(this.state.allPlayersPercentage)
        .sort((name1, name2) => betFraction(name2) - betFraction(name1))
        .map((name) => {
          const fraction = betCount(name) / roundsCount(name);
          const percentage = Number((fraction * 100).toFixed(1));
          const fails = betCount(name) - stands(name);
          const standsPercentage = Number((standsFraction(name) * 100).toFixed(2));
          return (
            <View key={name}>
              <View row>
                <View row spread style={{
                  backgroundColor: '#f9f9f9',
                  height: 20,
                  marginBottom: 1,
                  width: (CARD_WIDTH * (1 - fraction))
                }}>
                  <Text>{`${name.toUpperCase()}`}</Text>
                  <Text>{`${betCount(name)}/${roundsCount(name)}`}</Text>
                </View>
                <View row center style={{
                  backgroundColor: Colors.blue60,
                  height: 20,
                  marginBottom: 1,
                  width: (CARD_WIDTH * fraction)
                }}>
                  <Text>{`${percentage}%`}</Text>
                </View>
              </View>
            </View>
          )
        });

      const betsStandsPercentageGraphs = Object.keys(this.state.allPlayersPercentage)
        .sort((name1, name2) => standsFraction(name2) - standsFraction(name1))
        .map((name) => {
          const fraction = betCount(name) / roundsCount(name);
          const percentage = Number((fraction * 100).toFixed(1));
          const fails = betCount(name) - stands(name);
          const standsPercentage = Number((standsFraction(name) * 100).toFixed(2));
          return (
            <View key={name}>
              <View row>
                <View row spread style={{
                  backgroundColor: Colors.red40,
                  height: 20,
                  marginBottom: 8,
                  width: (CARD_WIDTH * (1 - standsFraction(name)))
                }}>
                  <Text>{name}</Text>
                  <Text>{`${fails} fails `}</Text>
                </View>
                <View row spread style={{
                  backgroundColor: Colors.green40,
                  height: 20,
                  marginBottom: 8,
                  width: (CARD_WIDTH * standsFraction(name))
                }}>
                  <Text>{` ${stands(name)} stands`}</Text>
                  <Text>{`${standsPercentage}%`}</Text>
                </View>
              </View>
            </View>
          )
        })

      return (
        <>
          <Text style={{fontWeight: 'bold'}}>% bets</Text>
          {betsPercentageGraphs}
          <Text style={{fontWeight: 'bold'}}>% stands when bet</Text>
          {betsStandsPercentageGraphs}
          </>
      )
    };

  renderRoundFails = () => {
    const roundFailsCount = this.calcRoundFails();
    const roundsCount = Object.keys(this.state.trumpsDistribution).reduce((sum,key) => sum + this.state.trumpsDistribution[key], 0);
    const percentage = (roundFailsCount/ roundsCount) * 100;

    return (
      <View style={{marginBottom:8}}>
        <Text>
          <Text style={{fontWeight: 'bold'}}>{roundFailsCount}</Text>
          <Text>{` failed out of ${roundsCount} rounds that played - `}</Text>
          <Text style={{fontWeight: 'bold'}}>{`${Number(percentage).toFixed(1)}%`}</Text>
        </Text>
      </View>
    )
  };

  renderUpDownRatio = () => {
    const {downsCount, upsCount} = this.calcUpDownRatio();
    const downFraction = downsCount / (downsCount + upsCount);
    const downPercentage = Number((downFraction * 100).toFixed(1))
    return (
      <View row>
        <View row spread style={{
          backgroundColor: "cyan",
          height: 20,
          marginBottom: 8,
          width: (CARD_WIDTH*downFraction)
        }}>
          <Text>down</Text>
          <Text>{`${downPercentage}%`}</Text>
        </View>
        <View row spread style={{
          backgroundColor: "magenta",
          height: 20,
          marginBottom: 8,
          width: (CARD_WIDTH*(1 - downFraction))
        }}>
          <Text>up</Text>
          <Text>{`${100 - downPercentage}%`}</Text>
        </View>
      </View>
    )
  };

  renderRedGamesGraphs = () => {
    const maxValue = Math.max(...(Object.keys(this.state.allPlayersPercentage).map((name) => this.state.allPlayersPercentage[name].redGamesCount)));
    const gamesCount = name => this.state.allPlayersPercentage[name].gamesCount;
    const redGamesCount = name => this.state.allPlayersPercentage[name].redGamesCount;
    const percentage = name => redGamesCount(name) / gamesCount(name) * 100;

    return (
      <View>
        <Text style={{fontWeight: 'bold'}}>Games with negative score</Text>
        {
          Object.keys(this.state.allPlayersPercentage)
            .sort((name1, name2) => percentage(name2) - percentage(name1))
            .map((name) => {
              const fractionFromMax = Math.abs(redGamesCount(name)) / maxValue;
              return (
                <View key={name} row>
                  <View flex row spread style={{
                    height: 20,
                    marginBottom: 1,
                    width: (CARD_WIDTH / 2)
                  }}>
                    <Text>{`${name.toUpperCase()}`}</Text>
                    <Text  style={{fontWeight: 'bold'}}>{redGamesCount(name)}</Text>
                    <Text>{`${percentage(name).toFixed(1)}%`}</Text>
                  </View>
                  <View flex style={{
                    height: 20,
                    marginBottom: 1,
                    width: (CARD_WIDTH / 2)
                  }}>
                    <View center style={{
                      backgroundColor: Colors.red40,
                      height: 20,
                      width: (CARD_WIDTH/2 * fractionFromMax) || 0.1
                    }}>
                    </View>
                  </View>
                </View>
              )
            })
        }
      </View>
    )
  };

  renderBiddingsDistributionGraphs = () => {
        const biddingsDistribution = this.calcBiddingsDistribution();
        const allRoundsCount = biddingsDistribution.reduce((a,b) => a + b, 0);
        const maxValue = Math.max(...biddingsDistribution);
        return biddingsDistribution.map((bidCount, index) => {
            const fraction = bidCount / allRoundsCount;
            const fractionToRender = bidCount / maxValue;
            const percentage = Number((fraction * 100).toFixed(0));
            const stands = this.state.standsPerBidding[index];
            const fails = bidCount - stands;
            const standsFraction = (stands / bidCount) || 0;
            const standsPercentage = Number((standsFraction * 100).toFixed(0));

            if (bidCount === 0) {
                if (index > 8) {return}
                return <Text key={index}>{index}</Text>;
            }
            return (
                <View key={index}>
                    <View row spread style={{
                        backgroundColor: Colors.blue40,
                        height: 20,
                        marginBottom: 1,
                        width: (CARD_WIDTH*fractionToRender)
                    }}>
                        <Text>{index}</Text>
                        {(fractionToRender > 0.1) && <Text>{` ${percentage}%`}</Text>}
                        <Text>{` ${bidCount}`}</Text>
                    </View>
                    <View row>
                        <View row spread style={{
                            backgroundColor: Colors.red40,
                            height: 10,
                            marginBottom: 8,
                            width: (CARD_WIDTH * (1 - standsFraction))
                        }}>
                            <Text style={{fontSize:8}}>{`${100-standsPercentage}%`}</Text>
                            <Text style={{fontSize:8}}>{`${fails} fails `}</Text>
                        </View>
                        <View row spread style={{
                            backgroundColor: Colors.green40,
                            height: 10,
                            marginBottom: 8,
                            width: (CARD_WIDTH * standsFraction)
                        }}>
                            <Text style={{fontSize:8}}>{` ${stands} stands`}</Text>
                            <Text style={{fontSize:8}}>{`${standsPercentage}%`}</Text>
                        </View>
                    </View>

                </View>
                )
            }
        )
    };

  renderTrumpsDistributionGraphs = () => {
        // if (! this.state.trumpsDistribution) return
        const roundsCount = Object.keys(this.state.trumpsDistribution).reduce((sum,key) => sum + this.state.trumpsDistribution[key], 0);
        const maxValue = Math.max(...Object.keys(this.state.trumpsDistribution).map(
            t => this.state.trumpsDistribution[t]));
        // Math.max(...a.map(o=>o.y),a[0].y);
        return Object.keys(this.state.trumpsDistribution).map(trump => {
            const fraction = this.state.trumpsDistribution[trump] / roundsCount;
            const fractionToRender = this.state.trumpsDistribution[trump] / maxValue;
            const percentage = Number((fraction * 100).toFixed(0));

            return (
                <View key={trump} row spread style={{
                    backgroundColor: Colors.red70,
                    height: 20,
                    marginBottom: 1,
                    width: (CARD_WIDTH*fractionToRender)
                }}>
                    <Text>{Assets.emojis[trump]}</Text>
                    {(fractionToRender > 0.1) && <Text>{` ${percentage}%`}</Text>}
                    <Text>{` ${this.state.trumpsDistribution[trump]}`}</Text>
                </View>
                )
            }
        )
    };

  onArrowPress = (cardStateString) => {
      const showCards = cloneDeep(this.state.showCards);
      showCards[cardStateString] = !showCards[cardStateString];
      this.setState({showCards})
    };

  onInfoPress = (cardStateString) => {
      Alert.alert(
        `${INFO_ALERTS[cardStateString].title} ${Assets.emojis.information_source}`,
        `${INFO_ALERTS[cardStateString].message}`,
        [{text: 'Got it', onPress: () => {}}]
      );
    };

  render() {
        if (this.state.isGamesDataEmpty) {
            return (
                <StateScreen
                    imageSource={require('../assets/WhistStatsLogo_web_hi_res_512.png')}
                    title='Sorry'
                    subtitle='No games were found'
                    ctaLabel='BACK'
                    onCtaPress={() => Navigation.dismissModal(this.props.componentId)}/>
            )
        }
        return (
            <View flex style={{backgroundColor:'cyan'}}>
                <ScrollView style>
                    <Text/>
                    <View center>

                      <Card width={CARD_WIDTH} flex style={{marginBottom: 15}}>
                        <View spread row>
                          <View row>
                            <Text text40 color={Colors.dark10}>Players Ranking</Text>
                            <Text text60 onPress={() => this.onInfoPress("playersRanking")}>{Assets.emojis.information_source}</Text>
                          </View>
                          <Text text40 marginR-5 onPress={() => this.onArrowPress("playersRanking")}>
                            {this.state.showCards.playersRanking ? Assets.emojis.arrow_up_small : Assets.emojis.arrow_down_small}
                          </Text>
                        </View>
                        {this.state.showCards.playersRanking && this.renderPlayersRankingGraphs()}
                      </Card>

                      <Card width={CARD_WIDTH} flex style={{marginBottom: 15}}>
                        <View spread row>
                          <View row>
                            <Text text40 color={Colors.dark10}>Weeks on Podium</Text>
                            <Text text60 onPress={() => this.onInfoPress("weeksOnPodium")}>{Assets.emojis.information_source}</Text>
                          </View>
                          <Text text40 marginR-5 onPress={() => this.onArrowPress("weeksOnPodium")}>
                            {this.state.showCards.weeksOnPodium ? Assets.emojis.arrow_up_small : Assets.emojis.arrow_down_small}
                          </Text>
                        </View>
                        {this.state.showCards.weeksOnPodium && this.renderWeeksOnPodiumGraphs()}
                      </Card>

                      <Card width={CARD_WIDTH} flex style={{marginBottom: 15}}>
                        <View spread row>
                          <View row>
                            <Text text40 color={Colors.dark10}>Ranking History</Text>
                            <Text text60 onPress={() => this.onInfoPress("rankingHistory")}>{Assets.emojis.information_source}</Text>
                          </View>
                          <Text text40 marginR-5 onPress={() => this.onArrowPress("rankingHistory")}>
                            {this.state.showCards.rankingHistory ? Assets.emojis.arrow_up_small : Assets.emojis.arrow_down_small}
                          </Text>
                        </View>
                        {this.state.showCards.rankingHistory && this.renderRankingHistoryGraphs()}
                      </Card>

                      <Card width={CARD_WIDTH} flex style={{marginBottom: 15}}>
                        <View spread row>
                          <View row>
                            <Text text40 color={Colors.dark10}>% Round Stands</Text>
                            <Text text60 onPress={() => this.onInfoPress("roundStands")}>{Assets.emojis.information_source}</Text>
                          </View>
                          <Text text40 marginR-5 onPress={() => this.onArrowPress("roundStands")}>
                            {this.state.showCards.roundStands ? Assets.emojis.arrow_up_small : Assets.emojis.arrow_down_small}
                          </Text>
                        </View>
                        {this.state.showCards.roundStands && this.renderStandsGraphs()}
                      </Card>

                      <Card  width={CARD_WIDTH} flex style={{marginBottom: 15}}>
                        <View spread row>
                          <View row>
                            <Text text40 color={Colors.dark10}>Points Per Round</Text>
                            <Text text60 onPress={() => this.onInfoPress("pointsPerRound")}>{Assets.emojis.information_source}</Text>
                          </View>
                          <Text text40 marginR-5 onPress={() => this.onArrowPress("pointsPerRound")}>
                            {this.state.showCards.pointsPerRound ? Assets.emojis.arrow_up_small : Assets.emojis.arrow_down_small}
                          </Text>
                        </View>
                        {this.state.showCards.pointsPerRound && this.renderPointsPerRoundGraphs()}
                      </Card>

                      <Card  width={CARD_WIDTH} flex style={{marginBottom: 15}}>
                        <View spread row>
                          <View row>
                            <Text text40 color={Colors.dark10}>{`Player Bets(${Assets.emojis.crown})`}</Text>
                            <Text text60 onPress={() => this.onInfoPress("playerBets")}>{Assets.emojis.information_source}</Text>
                          </View>
                          <Text text40 marginR-5 onPress={() => this.onArrowPress("playerBets")}>
                            {this.state.showCards.playerBets ? Assets.emojis.arrow_up_small : Assets.emojis.arrow_down_small}
                          </Text>
                        </View>
                        {this.state.showCards.playerBets && this.renderBetGraphs()}
                      </Card>

                      <Card  width={CARD_WIDTH} flex style={{marginBottom: 15}}>
                        <View spread row>
                          <View row>
                            <Text text40 color={Colors.dark10}>{`Sequences(${Assets.emojis.tada})`}</Text>
                            <Text text60 onPress={() => this.onInfoPress("sequences")}>{Assets.emojis.information_source}</Text>
                          </View>
                          <Text text40 marginR-5 onPress={() => this.onArrowPress("sequences")}>
                            {this.state.showCards.sequences ? Assets.emojis.arrow_up_small : Assets.emojis.arrow_down_small}
                          </Text>
                        </View>
                        {this.state.showCards.sequences && this.renderSequencesGraphs()}
                      </Card>

                      <Card  width={CARD_WIDTH} flex style={{marginBottom: 15}}>
                        <View spread row>
                          <Text text40 color={Colors.dark10} _onPress={() => this.onInfoPress("upDownRatio")}>
                            {`Up/Down(${Assets.emojis.heavy_plus_sign}${Assets.emojis.heavy_minus_sign})`}
                          </Text>
                          <Text text40 marginR-5 onPress={() => this.onArrowPress("upDownRatio")}>
                            {this.state.showCards.upDownRatio ? Assets.emojis.arrow_up_small : Assets.emojis.arrow_down_small}
                          </Text>
                        </View>
                        {this.state.showCards.upDownRatio && this.renderUpDownRatio()}
                      </Card>

                      <Card  width={CARD_WIDTH} flex style={{marginBottom: 15}}>
                        <View spread row>
                          <View row>
                            <Text text40 color={Colors.dark10}>{`Red Games(${Assets.emojis.see_no_evil})`}</Text>
                            <Text text60 onPress={() => this.onInfoPress("redGames")}>{Assets.emojis.information_source}</Text>
                          </View>
                          <Text text40 marginR-5 onPress={() => this.onArrowPress("redGames")}>
                            {this.state.showCards.redGames ? Assets.emojis.arrow_up_small : Assets.emojis.arrow_down_small}
                          </Text>
                        </View>
                        {this.state.showCards.redGames && this.renderRedGamesGraphs()}
                      </Card>

                      <Card  width={CARD_WIDTH} flex style={{marginBottom: 15}}>
                        <View spread row>
                          <Text text40 color={Colors.dark10} _onPress={() => this.onInfoPress("roundFails")}>
                            {`Failed rounds(${Assets.emojis.boom})`}
                          </Text>
                          <Text text40 marginR-5 onPress={() => this.onArrowPress("roundFails")}>
                            {this.state.showCards.roundFails ? Assets.emojis.arrow_up_small : Assets.emojis.arrow_down_small}
                          </Text>
                        </View>
                        {this.state.showCards.roundFails && this.renderRoundFails()}
                      </Card>

                      <Card  width={CARD_WIDTH} flex style={{marginBottom: 15}}>
                        <View spread row>
                          <Text text40 color={Colors.dark10}>Biddings Distribution</Text>
                          <Text text40 marginR-5 onPress={() => this.onArrowPress("biddingsDistribution")}>{this.state.showCards.biddingsDistribution ? Assets.emojis.arrow_up_small : Assets.emojis.arrow_down_small}</Text>
                        </View>
                        {this.state.showCards.biddingsDistribution && this.renderBiddingsDistributionGraphs()}
                      </Card>

                      <Card  width={CARD_WIDTH} flex style={{marginBottom: 15}}>
                        <View spread row>
                          <Text text40 color={Colors.dark10}>Trumps Distribution</Text>
                          <Text text40 marginR-5 onPress={() => this.onArrowPress("trumpsDistribution")}>{this.state.showCards.trumpsDistribution ? Assets.emojis.arrow_up_small : Assets.emojis.arrow_down_small}</Text>
                        </View>
                        {this.state.showCards.trumpsDistribution && this.renderTrumpsDistributionGraphs()}
                      </Card>
                   </View>
                </ScrollView>
                {this.state.loading &&
                <LoaderScreen
                    loaderColor='black'
                    backgroundColor='cyan'
                    overlay
                />
                }

            </View>
        );
    }
}

function mapStateToProps() {
    return {
        allGamesObj: whistStore.getAllGames()
    };
}

export default connect(mapStateToProps)(StatisticsScreen);
