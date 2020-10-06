import React, {Component} from 'react';
import {FlatList, Dimensions} from 'react-native';
import {Text, View, Assets, TouchableOpacity, StateScreen} from 'react-native-ui-lib';
import {whistStore} from "../stores/allGamesStore";
import {connect} from 'remx';
import {Navigation} from "react-native-navigation";
import AsyncStorage from '@react-native-community/async-storage';
import {MY_GAMES_SCREEN_COLORS as clr} from "../constants/styles/Colors";
import {reverse} from "lodash";

const ALL_GAMES_KEY = '@WhistStats:allGamesHistory';

const SCREEN_WIDTH = Dimensions.get('screen').width;
const CUBE_WIDTH = SCREEN_WIDTH / 19;
const ITEM_HEIGHT = 150;

class MyGamesScreen extends Component {

    static propTypes = {};

    constructor(props) {
        super(props);
        Navigation.events().bindComponent(this);
        this.backBtnPressed.bind(this.backBtnPressed);

        this.state = {
            allGamesObj: [],
            allGames: [],
            roundsHistory: this.props.roundsHistory,
            isGamesDataEmpty: false
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
                    text: `Games History`
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
        this.getAllGamesFromStorage()

        // const allGames = whistStore.getAllGames()
        // this.setState({allGamesObj: allGames})

        // allGamesActions.fetchWhistGame();
    }

    componentWillMount() {
        // this.props.allGamesObj = whistStore.getAllGames()
        // allGamesActions.fetchWhistGame();

        // this.setState({
        //     allGamesObj: whistStore.getAllGames()
        // })
    }


    getAllGamesFromStorage = async () => {
        const allGamesString = await AsyncStorage.getItem(ALL_GAMES_KEY);
        if (allGamesString === null) {
            this.setState({isGamesDataEmpty: true})
        } else {
            const allGames = JSON.parse(allGamesString);
            const reversedAllGames = reverse(allGames);
            this.setState({allGames: reversedAllGames});
            Navigation.mergeOptions(this.props.componentId, {
                topBar: {
                    title: {
                        text: `Games History (${reversedAllGames.length})`
                    }
                }
            });
        }
    };

    openOldGameTable = (gameObject) => {
        Navigation.showModal({
            stack: {
                children: [{
                    component: {
                        name: 'whistStats.OldGameTableScreen',
                        passProps: {
                            roundsHistory: gameObject.roundsHistory,
                            allNames: gameObject.playerNamesObj,
                            gameStartDateStr: gameObject.gameStartDateStr,
                            playingTimeStr: gameObject.playingTimeStr,
                        }
                    }
                }]
            }
        });

    }

    getUpsDownsStr = roundsHistory => {
        const downs = roundsHistory.reduce(
            (accumulator, round) => accumulator + (round.upDown < 0 ? 1 : 0)
            , 0);
        const ups = roundsHistory.length - downs;
        return `${ups}${Assets.emojis.heavy_plus_sign}  ${downs}${Assets.emojis.heavy_minus_sign}`
    };

    getRoundsFailStr = roundsHistory => {
        const roundsFailCount = roundsHistory.reduce(
            (accumulator, round) => accumulator + (round.isRoundFail ? 1 : 0)
            , 0);
        return `${roundsFailCount} ${Assets.emojis.boom}`
    };

    renderShapesCount = roundsHistory => {
        const shapesCount = {spades: 0, hearts: 0, diamonds: 0, clubs: 0};
        roundsHistory.forEach(round => {
            let curShape = round.chosenTrump;
            shapesCount[curShape]++
        });
        // return `${shapesCount.spades}${Assets.emojis.spades}  ${shapesCount.hearts}${Assets.emojis.hearts}
        //         \n${shapesCount.diamonds}${Assets.emojis.diamonds}  ${shapesCount.clubs}${Assets.emojis.clubs}`
        return (
            <View>
                <Text style={{fontSize: 9}}>{`${shapesCount.spades}${Assets.emojis.spades}  ${shapesCount.hearts}${Assets.emojis.hearts}`}</Text>
                <Text style={{fontSize: 9}}>{`${shapesCount.diamonds}${Assets.emojis.diamonds}  ${shapesCount.clubs}${Assets.emojis.clubs}`}</Text>
            </View>
        )
    };

    renderInfoCube = (item, index) => {
        return (
            <View center style={{height: ITEM_HEIGHT, width: CUBE_WIDTH*3, borderColor:clr.INFO_CUBES_BORDER, backgroundColor: 'white', borderWidth:1, borderRightWidth:0.4, borderBottomWidth:5}}>
                <Text style={{fontSize: 9}}>{`#${this.state.allGames.length - index}`}</Text>
                <Text style={{fontSize: 9}}>{item.gameStartDateStr}</Text>
                <Text style={{fontSize: 4}}>{item.gameStartTimeStr}</Text>
                <Text style={{fontSize: 9}}>{item.playingTimeStr}</Text>
                <Text style={{fontSize: 9}}>{`${item.roundsHistory.length} Rounds`}</Text>
                <Text style={{fontSize: 9}}>{this.getUpsDownsStr(item.roundsHistory)}</Text>
                <Text style={{fontSize: 9}}>{this.getRoundsFailStr(item.roundsHistory)}</Text>
                {this.renderShapesCount(item.roundsHistory)}
            </View>

        )
    };

    countRoundsStands = (roundsHistory, location) => {
        return roundsHistory.reduce((accumulator, round) => {
            return accumulator + (round.isStand[location] ? 1 : 0);
        }, 0);
    };

    countBets = (roundsHistory, location) => {
        return roundsHistory.reduce((accumulator, round) => {
            return accumulator + (round.didBet[location] ? 1 : 0);
        }, 0);
    };

    getMaxSequence = (roundsHistory, location) => {
        return Math.max(...roundsHistory.map(round => round.curSequence[location]), 0);
    };

    bgForResCube = (item, location) => {
        const numberOfRounds = item.roundsHistory.length;
        const pointsArray = Object.values(item.roundsHistory[numberOfRounds - 1].points);
        const min = Math.min(...pointsArray);
        const max = Math.max(...pointsArray);
        const curPlayerPoints = item.roundsHistory[numberOfRounds - 1].points[location];
        if (curPlayerPoints === min) {
            return clr.LOOSER_CUBE_BG
        } else if (curPlayerPoints === max) {
            return clr.WINNER_CUBE_BG
        } else {
            return clr.MIDDLE_CUBE_BG
        }
    };

    renderResCube = (item, location) => {
        const numberOfRounds = item.roundsHistory.length;
        return (
            <View center style={{height: ITEM_HEIGHT, width: CUBE_WIDTH*4, backgroundColor: this.bgForResCube(item, location), borderColor:clr.RESULTS_CUBES_BORDER, borderWidth:1, borderRightWidth:0.4, borderBottomWidth:5}}>
                <Text>{item.playerNamesObj[`${location}Name`].toUpperCase()}</Text>
                <Text style={{fontWeight: 'bold'}}>{item.roundsHistory[numberOfRounds - 1].points[location]}</Text>
                <Text>{`${this.countRoundsStands(item.roundsHistory, location)}/${numberOfRounds}`}</Text>
                <Text>{`${this.countBets(item.roundsHistory, location)} ${Assets.emojis.crown}`}</Text>
                <Text>{`${this.getMaxSequence(item.roundsHistory, location)} in a row`}</Text>
            </View>
        )
    };

    renderLine = ({item, index}) => {
        return (
            <TouchableOpacity row style={{height: ITEM_HEIGHT}} onPress={() => this.openOldGameTable(item)}>
                {this.renderInfoCube(item, index)}
                {this.renderResCube(item, 'north')}
                {this.renderResCube(item, 'west')}
                {this.renderResCube(item, 'south')}
                {this.renderResCube(item, 'east')}
            </TouchableOpacity>
        )
    };

    extractKey = item => item.gameStartTimeObj;

    getItemLayout = (data, index) => {
       return {length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index}
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
            <View flex style={{backgroundColor: clr.BG}}>
                {/*{this.renderTitle()}*/}
                <FlatList
                    keyExtractor={this.extractKey}
                    data={this.state.allGames}
                    renderItem={this.renderLine}
                    // ListFooterComponent={this.renderFooter}
                  getItemLayout={this.getItemLayout}
                />
            </View>
        );

        // return (
        //     <View flex bg-yellow30 center>
        //         <Text>MY GAMES SCREEN</Text>
        //         <Text>    </Text>
        //         <Text>{`allGamesObj:\n${JSON.stringify(this.state.allGames) || 'LOADING'}`}</Text>
        //     </View>
        // );
    }
}


function mapStateToProps() {
    return {
        allGamesObj: whistStore.getAllGames()
    };
}

export default connect(mapStateToProps)(MyGamesScreen);
