import React, {Component} from 'react';
import {FlatList, ScrollView, Dimensions} from 'react-native';
import {Text, View, Colors, Assets, Card, LoaderScreen, StateScreen} from 'react-native-ui-lib';
import {whistStore} from "../stores/allGamesStore";
import {connect} from 'remx';
import {Navigation} from "react-native-navigation";
import AsyncStorage from '@react-native-community/async-storage';
import {cloneDeep} from "lodash"

const ALL_GAMES_KEY = '@WhistStats:allGamesHistory';
const SCREEN_WIDTH = Dimensions.get('screen').width;
const CARD_WIDTH = SCREEN_WIDTH - 40;
const CUBE_WIDTH = CARD_WIDTH / 10;

const INFO_ALERTS = {
  playersRanking: "This is the main table of the league.\nOn each game winner get 4 points, 2nd get 1 point, 3rd loses 1 point and loser loses 4 points\nin case of draw, the player who played fewer games will win. next tie break is the number of wins. next tie break is points per round.",
  roundStands: "For each player you can see the percentage of stands in all of the rounds he played.\nAlso the number of rounds he stands out of the number of rounds he played.",
  pointsPerRound: "For each player you can see the average points per round that he played.\nAlso the sum of all af his points out of the number of the number of rounds that he played.",
  playerBets: "For each player:\nWhite:#bets out of #rounds he played\nBlue:% of bets out the round he played\nRed:#fails\nGreen:#stands and % of stands out of games that he bet.\nList is sorted by the % of stands out of the player bets",
  biddingsDistribution: "TODO",
  trumpsDistribution: "TODO",
}

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
            biddingsDistribution: [],
            standsPerBidding: [],
            trumpsDistribution: {
                // spades: 0,
                // hearts: 0,
                // diamonds: 0,
                // clubs: 0
            },
            showCards: {
              playersRanking: true,
              roundStands: false,
              pointsPerRound: false,
              playerBets: false,
              biddingsDistribution: false,
              trumpsDistribution: false,
            }

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
            allPlayersPercentage: this.calcStandsPercentage(),
            biddingsDistribution: this.calcBiddingsDistribution(),
            standsPerBidding: this.calcStandsPerBidding(),
            trumpsDistribution: this.calcTrumpsDistribution()
          },
          () => {
            this.setState({loading: false});
            const roundsCount = Object.keys(this.state.trumpsDistribution).reduce((sum,key) => sum + this.state.trumpsDistribution[key], 0);
            Navigation.mergeOptions(this.props.componentId, {
              topBar: {
                // title: {
                //   text: `Statistics (${this.state.allGames.length} G, ${roundsCount} R)`
                // },
                subtitle: {
                  text: `${this.state.allGames.length} Games, ${roundsCount} Rounds`
                }
              }
            });
          });
      })
    }

    componentWillMount() {
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

    calcStandsPercentage = () => {
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
                                gamesRanking: [0,0,0,0],
                                sumOfPoints: 0
                            }
                    }
                });

                const gameScore = game.roundsHistory[game.roundsHistory.length - 1].points;
                Object.keys(gameScore).sort((location1, location2) => gameScore[location2] - gameScore[location1]).forEach(
                    (location, index) => {
                        playerRoundsMap[game.playerNamesObj[`${location}Name`]].gamesCount++;
                        playerRoundsMap[game.playerNamesObj[`${location}Name`]].gamesRanking[index]++;
                        playerRoundsMap[game.playerNamesObj[`${location}Name`]].sumOfPoints += gameScore[location];
                    }
                );

                game.roundsHistory.forEach(
                    round => {
                        round.isStand.north ? playerRoundsMap[game.playerNamesObj.northName].standsCount++ :
                            playerRoundsMap[game.playerNamesObj.northName].failCount++;
                        if (round.didBet.north) {
                            playerRoundsMap[game.playerNamesObj.northName].betCount++;
                            if (round.isStand.north) {
                                playerRoundsMap[game.playerNamesObj.northName].betAndStandsCount++;
                            }
                        }

                        round.isStand.west ? playerRoundsMap[game.playerNamesObj.westName].standsCount++ :
                            playerRoundsMap[game.playerNamesObj.westName].failCount++;
                        if (round.didBet.west) {
                            playerRoundsMap[game.playerNamesObj.westName].betCount++;
                            if (round.isStand.west) {
                                playerRoundsMap[game.playerNamesObj.westName].betAndStandsCount++;
                            }
                        }

                        round.isStand.east ? playerRoundsMap[game.playerNamesObj.eastName].standsCount++ :
                            playerRoundsMap[game.playerNamesObj.eastName].failCount++;
                        if (round.didBet.east) {
                            playerRoundsMap[game.playerNamesObj.eastName].betCount++;
                            if (round.isStand.east) {
                                playerRoundsMap[game.playerNamesObj.eastName].betAndStandsCount++;
                            }
                        }

                        round.isStand.south ? playerRoundsMap[game.playerNamesObj.southName].standsCount++ :
                            playerRoundsMap[game.playerNamesObj.southName].failCount++;
                        if (round.didBet.south) {
                            playerRoundsMap[game.playerNamesObj.southName].betCount++;
                            if (round.isStand.south) {
                                playerRoundsMap[game.playerNamesObj.southName].betAndStandsCount++;
                            }
                        }
                    }
                )
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

    renderTableTitle = () => {
        return (
            <View row style={{height: 30}}>
                <Text style={{width: CUBE_WIDTH *3}}> </Text>
                <Text style={{width: CUBE_WIDTH}}> G</Text>
                <Text style={{width: CUBE_WIDTH *2}}>PTS</Text>
                <Text style={{width: CUBE_WIDTH}}>W</Text>
                <Text style={{width: CUBE_WIDTH}}>2nd</Text>
                <Text style={{width: CUBE_WIDTH}}> 3rd</Text>
                <Text style={{width: CUBE_WIDTH}}>  L</Text>
            </View>
        )
    };

    renderPlayerRankingLine = item => {
        const rankingPoints = this.calcPoints(this.state.allPlayersPercentage[item.item].gamesRanking);
        return (
            <View row style={{height: 20}}>
                <Text style={{width: CUBE_WIDTH *3}}>{` ${item.index + 1}.  ${item.item.toUpperCase()}`}</Text>
                <Text style={{width: CUBE_WIDTH}}>{` ${this.state.allPlayersPercentage[item.item].gamesCount}`}</Text>
                <Text style={{width: CUBE_WIDTH *2, fontWeight: 'bold'}}>{`  ${rankingPoints >= 0 ?" ":""}${rankingPoints}`}</Text>
                <Text style={{width: CUBE_WIDTH}}>{` ${this.state.allPlayersPercentage[item.item].gamesRanking[0]}`}</Text>
                <Text style={{width: CUBE_WIDTH}}>{`  ${this.state.allPlayersPercentage[item.item].gamesRanking[1]}`}</Text>
                <Text style={{width: CUBE_WIDTH}}>{`  ${this.state.allPlayersPercentage[item.item].gamesRanking[2]}`}</Text>
                <Text style={{width: CUBE_WIDTH}}>{` ${this.state.allPlayersPercentage[item.item].gamesRanking[3]}`}</Text>
            </View>
        )
    };

    renderPlayersRankingGraphs = () => {
        const sortedData = Object.keys(this.state.allPlayersPercentage)
            .sort((name1, name2) => {
              const score = name => this.calcPoints(this.state.allPlayersPercentage[name].gamesRanking);
              const gamesCount = name => this.state.allPlayersPercentage[name].gamesCount;
              const winCount = name => this.state.allPlayersPercentage[name].gamesRanking[0];
              const ppr = name => this.state.allPlayersPercentage[name].sumOfPoints / gamesCount(name);

              return (
                score(name2) - score(name1)
                || gamesCount(name1) - gamesCount(name2)
                || winCount(name2) - winCount(name1)
                || ppr(name2) - ppr(name1)
              )
            });
        return (
            <View flex>
                {this.renderTableTitle()}
                <FlatList
                    keyExtractor={(item) => item}
                    data={sortedData}
                    renderItem={this.renderPlayerRankingLine}
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

    renderBetGraphs = () => {
      const betCount = name => this.state.allPlayersPercentage[name].betCount;
      const roundsCount = name => this.state.allPlayersPercentage[name].standsCount + this.state.allPlayersPercentage[name].failCount;
      const stands = name => this.state.allPlayersPercentage[name].betAndStandsCount;
      const standsFraction = name => (stands(name) / betCount(name)) || 0;
      return (Object.keys(this.state.allPlayersPercentage)
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
                        <View row>
                            <View row spread style={{
                                backgroundColor: Colors.red40,
                                height: 10,
                                marginBottom: 8,
                                width: (CARD_WIDTH * (1 - standsFraction(name)))
                            }}>
                                <Text style={{fontSize:8}}>{name}</Text>
                                <Text style={{fontSize:8}}>{`${fails} fails `}</Text>
                            </View>
                            <View row spread style={{
                                backgroundColor: Colors.green40,
                                height: 10,
                                marginBottom: 8,
                                width: (CARD_WIDTH * standsFraction(name))
                            }}>
                                <Text style={{fontSize:8}}>{` ${stands(name)} stands`}</Text>
                                <Text style={{fontSize:8}}>{`${standsPercentage}%`}</Text>
                            </View>
                        </View>
                    </View>
                )
            })
        )
    };

    renderBiddingsDistributionGraphs = () => {
        const allRoundsCount = this.state.biddingsDistribution.reduce((a,b) => a + b, 0);
        const maxValue = Math.max(...this.state.biddingsDistribution);
        return this.state.biddingsDistribution.map((bidCount, index) => {
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
      alert(INFO_ALERTS[cardStateString]);
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
                          <Text text40 color={Colors.dark10} onPress={() => this.onInfoPress("playersRanking")}>
                            {`Players Ranking${Assets.emojis.information_source}`}
                          </Text>
                          <Text text40 marginR-5 onPress={() => this.onArrowPress("playersRanking")}>
                            {this.state.showCards.playersRanking ? Assets.emojis.arrow_up_small : Assets.emojis.arrow_down_small}
                          </Text>
                        </View>
                        {this.state.showCards.playersRanking && this.renderPlayersRankingGraphs()}
                      </Card>

                      <Card width={CARD_WIDTH} flex style={{marginBottom: 15}}>
                        <View spread row>
                          <Text text40 color={Colors.dark10} onPress={() => this.onInfoPress("roundStands")}>
                            {`% Round stands${Assets.emojis.information_source}`}
                          </Text>
                          <Text text40 marginR-5 onPress={() => this.onArrowPress("roundStands")}>
                            {this.state.showCards.roundStands ? Assets.emojis.arrow_up_small : Assets.emojis.arrow_down_small}
                          </Text>
                        </View>
                        {this.state.showCards.roundStands && this.renderStandsGraphs()}
                      </Card>

                      <Card  width={CARD_WIDTH} flex style={{marginBottom: 15}}>
                        <View spread row>
                          <Text text40 color={Colors.dark10} onPress={() => this.onInfoPress("pointsPerRound")}>
                            {`Points Per Round${Assets.emojis.information_source}`}
                          </Text>
                          <Text text40 marginR-5 onPress={() => this.onArrowPress("pointsPerRound")}>
                            {this.state.showCards.pointsPerRound ? Assets.emojis.arrow_up_small : Assets.emojis.arrow_down_small}
                          </Text>
                        </View>
                        {this.state.showCards.pointsPerRound && this.renderPointsPerRoundGraphs()}
                      </Card>

                      <Card  width={CARD_WIDTH} flex style={{marginBottom: 15}}>
                        <View spread row>
                          <Text text40 color={Colors.dark10} onPress={() => this.onInfoPress("playerBets")}>
                            {`Player bets (${Assets.emojis.crown})${Assets.emojis.information_source}`}
                          </Text>
                          <Text text40 marginR-5 onPress={() => this.onArrowPress("playerBets")}>
                            {this.state.showCards.playerBets ? Assets.emojis.arrow_up_small : Assets.emojis.arrow_down_small}
                          </Text>
                        </View>
                        {this.state.showCards.playerBets && this.renderBetGraphs()}
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
