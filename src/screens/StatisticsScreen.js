import React, {Component} from 'react';
import {FlatList, ScrollView, Dimensions} from 'react-native';
import {Text, View, Colors, Assets, Card, LoaderScreen, StateScreen} from 'react-native-ui-lib';
import {whistStore} from "../stores/allGamesStore";
import {connect} from 'remx';
import {Navigation} from "react-native-navigation";
import AsyncStorage from '@react-native-community/async-storage';

const ALL_GAMES_KEY = '@WhistStats:allGamesHistory';
const SCREEN_WIDTH = Dimensions.get('screen').width;
const CARD_WIDTH = SCREEN_WIDTH - 40;
const CUBE_WIDTH = CARD_WIDTH / 9;


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
            // console.log("ALL GAMES\n" + JSON.stringify(this.state.allGames))
                // const allPlayersPercentage = this.calcStandsPercentage();
                this.setState({
                    allPlayersPercentage: this.calcStandsPercentage(),
                    biddingsDistribution: this.calcBiddingsDistribution(),
                    standsPerBidding: this.calcStandsPerBidding(),
                    trumpsDistribution: this.calcTrumpsDistribution()},
                    () =>{this.setState({loading: false})}
                    );
                // this.setState({playersRate: this.calcTrumpsDistribution()});
            }
        )
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
                                gamesRanking: [0,0,0,0],
                                sumOfPoints: 0
                            }
                    }
                });

                const gameScore = game.roundsHistory[game.roundsHistory.length - 1].points;
                Object.keys(gameScore).sort((location1, location2) => gameScore[location2] - gameScore[location1]).forEach(
                    (location, index) => {
                        playerRoundsMap[game.playerNamesObj[`${location}Name`]].gamesRanking[index]++;
                        playerRoundsMap[game.playerNamesObj[`${location}Name`]].sumOfPoints += gameScore[location];
                    }
                );

                // console.log("gameScore = " + JSON.stringify(gameScore))
                // console.log("playerRoundsMap[name] sumOfPoints = " + JSON.stringify(playerRoundsMap[name]))


                game.roundsHistory.forEach(
                    round => {
                        round.isStand.north ? playerRoundsMap[game.playerNamesObj.northName].standsCount++ :
                            playerRoundsMap[game.playerNamesObj.northName].failCount++;
                        // if (round.isStand.north)  {
                        //     playerRoundsMap[game.playerNamesObj.northName].standsCount++
                        // } else {
                        //     playerRoundsMap[game.playerNamesObj.northName].failCount++;
                        // }
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
        // console.log("playerRoundsMap = " + JSON.stringify(playerRoundsMap));
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
        return (Object.keys(this.state.allPlayersPercentage)
            .sort((name1, name2) => this.state.allPlayersPercentage[name2].standsCount - this.state.allPlayersPercentage[name1].standsCount || this.state.allPlayersPercentage[name1].failCount - this.state.allPlayersPercentage[name2].failCount)
            .map((name) => {
                const roundsCount = this.state.allPlayersPercentage[name].standsCount + this.state.allPlayersPercentage[name].failCount;
                const fraction = this.state.allPlayersPercentage[name].standsCount / roundsCount;
                const percentage = Number((fraction * 100).toFixed(0));
                return (
                    <View key={name} row spread flex style={{
                        backgroundColor: Colors.green60,
                        height: 20,
                        marginBottom: 8,
                        width: (CARD_WIDTH * percentage / 100)
                    }}>
                        <Text>{`${name.toUpperCase()}`}</Text>
                        <Text>{` ${percentage}% `}</Text>
                        <Text>{`${this.state.allPlayersPercentage[name].standsCount}/${roundsCount}`}</Text>
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
                <Text style={{width: CUBE_WIDTH *2}}>PTS</Text>
                <Text style={{width: CUBE_WIDTH}}>W</Text>
                <Text style={{width: CUBE_WIDTH}}>2nd</Text>
                <Text style={{width: CUBE_WIDTH}}>3rd</Text>
                <Text style={{width: CUBE_WIDTH}}>L</Text>
            </View>
        )
    };

    renderLine = item => {
        const rankingPoints = this.calcPoints(this.state.allPlayersPercentage[item.item].gamesRanking);
        return (
            <View row style={{height: 20}}>
                <Text style={{width: CUBE_WIDTH *3}}>{` ${item.index + 1}.  ${item.item.toUpperCase()}`}</Text>
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
            .sort((name1, name2) => this.calcPoints(this.state.allPlayersPercentage[name2].gamesRanking) - this.calcPoints(this.state.allPlayersPercentage[name1].gamesRanking));
        return (
            <View flex>
                {this.renderTableTitle()}
                <FlatList
                    keyExtractor={(item) => item}
                    data={sortedData}
                    renderItem={this.renderLine}
                />
            </View>
        );
    };

    renderPointsPerRoundGraphs = () => {
        const maxValue = Math.max(...(Object.keys(this.state.allPlayersPercentage).map((name) => Math.abs(this.state.allPlayersPercentage[name].sumOfPoints/ (this.state.allPlayersPercentage[name].standsCount + this.state.allPlayersPercentage[name].failCount)))));
        return (Object.keys(this.state.allPlayersPercentage)
            .sort((name1, name2) => this.state.allPlayersPercentage[name2].sumOfPoints - this.state.allPlayersPercentage[name1].sumOfPoints)
            .map((name) => {
                const roundsCount = this.state.allPlayersPercentage[name].standsCount + this.state.allPlayersPercentage[name].failCount;
                const ppr = this.state.allPlayersPercentage[name].sumOfPoints / roundsCount;
                const fractionFromMax = Math.abs(ppr) / maxValue;
                if (ppr < 0) {
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
                                    <Text>{` ${ppr.toFixed(0)} `}</Text>
                                </View>
                            </View>
                            <View flex row spread style={{
                                height: 20,
                                marginBottom: 8,
                                width: (CARD_WIDTH / 2)
                            }}>
                                    <Text>{`${name.toUpperCase()}`}</Text>
                                    <Text>{`${this.state.allPlayersPercentage[name].sumOfPoints}Pts/${roundsCount}Rd`}</Text>
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
                                <Text>{`${this.state.allPlayersPercentage[name].sumOfPoints}Pts/${roundsCount}Rd`}</Text>
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
                                    <Text>{` ${ppr.toFixed(0)} `}</Text>
                                </View>
                            </View>
                        </View>
                    )

                }
            })
        )
    };

    renderBetGraphs = () => {
        return (Object.keys(this.state.allPlayersPercentage)
            .sort((name1, name2) => this.state.allPlayersPercentage[name2].betCount - this.state.allPlayersPercentage[name1].betCount || this.state.allPlayersPercentage[name1].standsCount + this.state.allPlayersPercentage[name1].failCount - this.state.allPlayersPercentage[name2].standsCount + this.state.allPlayersPercentage[name2].failCount)
            .map((name) => {
                const betCount = this.state.allPlayersPercentage[name].betCount;
                const roundsCount = this.state.allPlayersPercentage[name].standsCount + this.state.allPlayersPercentage[name].failCount;
                const fraction = betCount / roundsCount;
                const percentage = Number((fraction * 100).toFixed(0));
                const stands = this.state.allPlayersPercentage[name].betAndStandsCount;
                const fails = betCount - stands;
                const standsFraction = (stands / betCount) || 0;
                const standsPercentage = Number((standsFraction * 100).toFixed(0));
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
                                {/*<Text>{`${this.state.allPlayersPercentage[name].betAndStandsCount} stand`}</Text>*/}
                                {/*<Text style={{fontSize:10}}>{fails}</Text>*/}
                                <Text>{`${betCount}/${roundsCount}`}</Text>
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
                                width: (CARD_WIDTH * (1 - standsFraction))
                            }}>
                                <Text style={{fontSize:8}}>{name}</Text>
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
                        {/*<Text>   </Text>*/}
                        <Card width={CARD_WIDTH} flex style={{marginBottom: 15}}>
                            <View>
                                <Text text40 color={Colors.dark10}>
                                    % round stands
                                </Text>
                                {this.renderStandsGraphs()}
                            </View>
                        </Card>
                        <Card width={CARD_WIDTH} flex style={{marginBottom: 15}}>
                            <View>
                                <Text text40 color={Colors.dark10}>
                                    Players Ranking
                                </Text>
                                {this.renderPlayersRankingGraphs()}
                            </View>
                        </Card>
                        <Card  width={CARD_WIDTH} flex style={{marginBottom: 15}}>
                            <View center>
                                <Text text40 color={Colors.dark10}>
                                    Points Per Round
                                </Text>
                                {this.renderPointsPerRoundGraphs()}
                            </View>
                        </Card>
                        <Card  width={CARD_WIDTH} flex style={{marginBottom: 15}}>
                            <View center>
                                <Text text40 color={Colors.dark10}>
                                    {`% Bets (${Assets.emojis.crown})`}
                                </Text>
                                {this.renderBetGraphs()}
                            </View>
                        </Card>
                        <Card  width={CARD_WIDTH} flex style={{marginBottom: 15}}>
                            <View>
                                <Text text40 color={Colors.dark10}>
                                    {`Biddings Distribution`}
                                </Text>
                                {this.renderBiddingsDistributionGraphs()}
                            </View>
                        </Card>
                        <Card  width={CARD_WIDTH} flex style={{marginBottom: 15}}>
                            <View>
                                <Text text40 color={Colors.dark10}>
                                    {`Trumps Distribution`}
                                </Text>
                                {/*{this.renderBiddingsDistributionGraphs()}*/}
                                {this.renderTrumpsDistributionGraphs()}
                            </View>
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
