import React, {Component} from 'react';
import {FlatList, Dimensions, Alert} from 'react-native';
import {Text, View, Button, Assets, TouchableOpacity, FeatureHighlight} from 'react-native-ui-lib';

import {Navigation} from "react-native-navigation";
import PropTypes from 'prop-types';

import {connect} from 'remx';
import {whistStore} from '../stores/allGamesStore'
import * as allGamesActions from './../actions/allGamesActions'
import {TABLE_SCREEN_COLORS as clr} from "../constants/styles/Colors";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ALL_GAMES_KEY = '@WhistStats:allGamesHistory';

const SCREEN_WIDTH = Dimensions.get('screen').width;
const CUBE_WIDTH = SCREEN_WIDTH / 11;

const titles = [
    'Important- SAVE GAME!'
];
const messages = [
    'After the last round of the game, remember to press SAVE GAME to save your games history.\nPress BACK on the top right corner to play next round',
];

class TableScreen extends Component {

    static propTypes = {
        componentId: PropTypes.string,
        isTableScreenVisited: PropTypes.bool,
        allGamesObj: PropTypes.array,
        roundsHistory: PropTypes.array,
        deleteLastRound: PropTypes.func,
        gameStartTime: PropTypes.instanceOf(Date),
        popScreenAndDeleteGame: PropTypes.func,
        allNames: PropTypes.object
    };

    constructor(props) {
        super(props);
        Navigation.events().bindComponent(this);
        this.backToGameScreen.bind(this.backToGameScreen);

        this.targets = {};
        this.state = {
            isShowInfoOverlay: false,
            allGamesObj : {},
            roundsHistory: this.props.roundsHistory
        }
    }

    static get options() {
        return {
            topBar: {
                rightButtons: [
                    {
                        id: 'backToGame',
                        text: 'Back'
                    },
                ],
                title: {
                    text: `Game Table`
                }

            },
            layout: {
                orientation: ['portrait'],
                direction: 'ltr'
            }
        }
    }


    componentDidMount() {
        allGamesActions.fetchWhistGame();
        if (!this.props.isTableScreenVisited) {
            setTimeout(() => {
                this.showHighlight();
            }, 200);
        }
    }

    componentWillMount(){
        this.props.allGamesObj = whistStore.getAllGames();
        allGamesActions.fetchWhistGame();

        this.setState({
            allGamesObj : whistStore.getAllGames()
        })
    }

    getDateStr = date => {
        return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()%100
    };
    // getTmeStr = date => {
    //     return date.getHours() + ':' get
    // }


    addGameToStorage = async () => {
        try {
            let allGames = [];
            const allGamesString = await AsyncStorage.getItem(ALL_GAMES_KEY);
            if (allGamesString !== null) {
                allGames = JSON.parse(allGamesString)
            }
             const objectToAdd = {
                gameStartTimeObj : this.props.gameStartTime,
                gameStartDateStr : this.getDateStr(this.props.gameStartTime),
                gameStartTimeStr : this.getTimeStr(0, this.props.gameStartTime),
                playerNamesObj: this.props.allNames,
                playingTimeStr: this.getTimeStr(this.props.gameStartTime, new Date()),
                roundsHistory : this.state.roundsHistory
            };
            allGames.push(objectToAdd);
            await AsyncStorage.setItem(ALL_GAMES_KEY, JSON.stringify(allGames));
        } catch (error) {
            // Error retrieving data
            // console.log(error.message);
        }
    };

    saveGameAndOpenMyGames = async () => {
        await this.addGameToStorage();
        // await whistStore.addNewGame([this.props.roundsHistory]);
        this.showGamesHistoryScreen();
    };

    alertSaveGameDialog = () => {
        if (this.state.roundsHistory.length > 0) {
            Alert.alert(
                'Finish Game',
                'This will add this game to your history.\nAre you sure?',
                [
                    {text: 'Cancel', onPress: () => {}, style: 'cancel'},
                    // {text: 'save', onPress: () => {alert("WIP, soon this game will save in memory")}},
                    {text: 'save', onPress: () => {this.saveGameAndOpenMyGames()}},
                    // {text: 'Delete', onPress: () => this.alertBeforeRestart()},
                ],
                {cancelable: false},
            );
        }
    };

    deleteLastRound = () => {
        this.props.deleteLastRound();
        const roundsHistory = this.state.roundsHistory.slice(0, -1);
        this.setState({roundsHistory})
    };

    alertDeleteDialog = () => {
        if (this.state.roundsHistory.length > 0) {
            Alert.alert(
                'Delete Last Round',
                'Are you sure?',
                [
                    {text: 'Cancel', onPress: () => {}, style: 'cancel'},
                    {text: 'OK', onPress: () => this.deleteLastRound()},
                ],
                {cancelable: true},
            );
        }
    };

    renderTimeFromStart = () => {
        // const minutes = parseInt(Math.abs(new Date() - this.props.gameStartTime) / (1000 * 60) % 60);
        // const hours = parseInt(Math.abs(new Date() - this.props.gameStartTime) / (1000 * 60 * 60) % 24);
        // const diffStr = `${hours < 10 ? '0'+hours : hours}:${minutes < 10 ? '0'+minutes : minutes}`;
        // return <Text>{`Playing Time: ${diffStr}`}</Text>
        return <Text>{`Playing Time: ${this.getTimeStr(this.props.gameStartTime, new Date())}`}</Text>
    };

    navigationButtonPressed({buttonId}) {
        if (buttonId === 'backToGame') {
            this.backToGameScreen();
        }
    }

    backToGameScreen() {
        Navigation.dismissModal(this.props.componentId);
    }

    showGamesHistoryScreen = () => {
        Navigation.showModal({
            stack: {
                children: [{
                    component: {
                        name: 'whistStats.MyGamesScreen',
                        passProps: {
                            somePropToPass: 'Some props - Table from DB',
                        }
                    }
                }]
            }
        });
    };
    gamesHistoryBtnPressed = () => {
        this.showGamesHistoryScreen();
    };

    alertBeforeRestart = () =>{
        Alert.alert(
            'Warning',
            'This will delete the current game',
            [
                {text: 'Cancel', onPress: () => {}, style: 'cancel'},
                {text: 'OK', onPress: () => {this.popToRootAndDeleteGame()}}
            ],
            {cancelable: true},
        );
    };

    popToRootAndDeleteGame = async () => {
        await this.props.popScreenAndDeleteGame();
        Navigation.dismissModal(this.props.componentId)
    };

    statisticsBtnPressed = () => {
        Navigation.showModal({
            stack: {
                children: [{
                    component: {
                        name: 'whistStats.StatisticsScreen',
                        passProps: {
                            somePropToPass: 'Some props - Table from DB',
                        }
                    }
                }]
            }
        })
    };


    renderTitleCube = (str) => {
        return (
            <View center style={{height: 40, width: CUBE_WIDTH, backgroundColor: clr.TITLE_CUBES_BG, borderColor: clr.TITLE_CUBES_BORDER, borderWidth:1}}>
                <Text style={{fontSize: 10}}>{str}</Text>
            </View>
        )
    };
    renderNameCube = (str) => {
        return (
            <View center style={{height: 40, width: CUBE_WIDTH*2, backgroundColor: clr.TITLE_CUBES_BG,  borderColor: clr.TITLE_CUBES_BORDER, borderWidth:1}}>
                <Text style={{fontSize: 15}}>{str}</Text>
            </View>
        )
    };

    renderTitle = () => {
        return(
            <View row styles={{height: 50}}>
                {this.renderTitleCube('Round')}
                {this.renderTitleCube('Up/Down')}
                {this.renderTitleCube('Trump')}
                {this.renderNameCube(this.props.allNames.northName)}
                {this.renderNameCube(this.props.allNames.westName)}
                {this.renderNameCube(this.props.allNames.southName)}
                {this.renderNameCube(this.props.allNames.eastName)}
            </View>
        )
    };

    renderRoundNumCube = (item) => {
        return (
            <View center style={{height: 50, width: CUBE_WIDTH, borderColor: clr.RESULTS_CUBES_BORDER, backgroundColor: clr.RESULTS_CUBES_BG, borderWidth:1}}>
                <Text>{item.roundNumber}</Text>
                <Text>{item.isRoundFail ? Assets.emojis.boom : ' '}</Text>
                {/*{item.isRoundFail ? <Text>{Assets.emojis.boom}</Text> : undefined}*/}
            </View>
        )
    };
    renderUpDownCube = (item) => {
        const str = item.upDown > 0 ? Assets.emojis.heavy_plus_sign + item.upDown : Assets.emojis.heavy_minus_sign + item.upDown*(-1);
        return (
            <View center style={{height: 50, width: CUBE_WIDTH, borderColor: clr.RESULTS_CUBES_BORDER, backgroundColor: clr.RESULTS_CUBES_BG, borderWidth:1}}>
                <Text>{str}</Text>
                <Text>{item.isRoundFail ? Assets.emojis.boom : ' '}</Text>
            </View>
        )
    };
    renderTrumpCube = (item) => {
        return (
            <View center style={{height: 50, width: CUBE_WIDTH, borderColor: clr.RESULTS_CUBES_BORDER, backgroundColor: clr.RESULTS_CUBES_BG, borderWidth:1}}>
                <Text>{Assets.emojis[item.chosenTrump]}</Text>
                <Text>{item.isRoundFail ? Assets.emojis.boom : ' '}</Text>
            </View>
        )
    };

    bgForBidCube = (item, location) => {
        if (item.isStand[location]) {
            return clr.BID_CUBES_STAND_BG
        }
        return clr.BID_CUBES_FAIL_BG
    };
    bgForResCube = (item, location) => {
        const seq = item.curSequence[location];
        if (seq > 0 && seq % 5 === 0) {
            return clr.RESULTS_CUBES_ROW_5_BG
        }
        return clr.RESULTS_CUBES_BG
    };

    renderResCube = (item, location) => {
        const difference = item.results[location]-item.biddings[location];
        const sequence = item.curSequence[location];
        return (
            <View row>
                <View center style={{height: 50, width: CUBE_WIDTH*2*0.25, borderColor:clr.RESULTS_CUBES_BORDER, borderWidth:1, borderRightWidth:0.4, borderRightColor:clr.BID_CUBES_BOUNDARY_LINE, backgroundColor:this.bgForBidCube(item, location)}}>
                    <Text>{item.biddings[location]}</Text>
                    <Text style={{fontSize: 10}}>{difference === 0 ? ' ' : difference <0 ? difference : '+' + difference}</Text>
                </View>
                <View center style={{height: 50, width: CUBE_WIDTH*2*0.75, borderColor:clr.RESULTS_CUBES_BORDER, borderWidth:1, borderLeftWidth:0.4, borderLeftColor:clr.BID_CUBES_BOUNDARY_LINE, backgroundColor: this.bgForResCube(item, location)}}>
                    <Text style={{fontWeight: 'bold'}}>{item.points[location]}</Text>
                    <Text style={{fontSize:13}}>{
                        (item.didBet[location] ? Assets.emojis.crown : ' ')
                        + ' ' +
                        (sequence > 0 && sequence % 5 === 0 ? Assets.emojis.tada : ' ')
                    }</Text>
                </View>
            </View>
        )
    };

    getTimeStr = (start, end) => {
        const difference = Math.abs(end-start);
        const hours = parseInt(difference / (1000 * 60 * 60) % 24);
        const minutes = parseInt(difference / (1000 * 60) % 60);
        const seconds = parseInt(difference / (1000) % 60);
        const hoursStr = hours < 10 ? '0'+hours :hours;
        const minutesStr = minutes < 10 ? '0'+minutes : minutes;
        const secondsStr = seconds < 10 ? '0' + seconds : seconds;
        return`${hoursStr}:${minutesStr}:${secondsStr}`;
        // return`${minutes < 10 ? '0'+minutes : minutes}:${seconds < 10 ? '0'+seconds : seconds}`;
    };

    showRoundInfo = (item) => () => {
        Alert.alert(`Round ${item.roundNumber}`,
            `Bidding Time: ${this.getTimeStr(item.startBidTime, item.startRoundTime)}\nPlaying time: ${this.getTimeStr(item.startRoundTime, item.endRoundTime)}`)
    };

    renderLine = item => {
        return (
            <TouchableOpacity row style={{height: 50}} onLongPress={this.showRoundInfo(item.item)}>
                {this.renderRoundNumCube(item.item)}
                {this.renderUpDownCube(item.item)}
                {this.renderTrumpCube(item.item)}
                {this.renderResCube(item.item, 'north')}
                {this.renderResCube(item.item, 'west')}
                {this.renderResCube(item.item, 'south')}
                {this.renderResCube(item.item, 'east')}
            </TouchableOpacity>
        )
    };

    renderFooter = () => {
        return (
            <View center>
                <View row>
                    <Button
                        backgroundColor={'red'}
                        color={'white'}
                        label={'Delete Last Round'}
                        size="small"
                        borderRadius={50}
                        text80
                        labelStyle={{fontWeight: 'bold'}}
                        style={{width:170, height:30, margin:10}}
                        // ref={element => (this.button_0 = element)}
                        onPress={this.alertDeleteDialog}
                    />
                    <Button
                        backgroundColor={'pink'}
                        color={'black'}
                        label={'Restart game'}
                        size="small"
                        borderRadius={50}
                        text80
                        labelStyle={{fontWeight: 'bold'}}
                        style={{width:170, height:30, margin:10}}
                        onPress={this.alertBeforeRestart}
                    />
                </View>
                <Button
                    backgroundColor={'blue'}
                    color={'white'}
                    label={'Save Game'}
                    size="small"
                    borderRadius={50}
                    text80
                    labelStyle={{fontWeight: 'bold'}}
                    style={{width:170, height:30, margin:10}}
                    onPress={this.alertSaveGameDialog}
                    ref={r => (this.addTarget(r, '0'))}
                />
                {this.renderTimeFromStart()}
                <Text>{"long press on a round to get more info"}</Text>
                <View row>
                    <Button
                        backgroundColor={'green'}
                        color={'white'}
                        label={'Games History'}
                        size="small"
                        borderRadius={50}
                        text80
                        labelStyle={{fontWeight: 'bold'}}
                        style={{width:170, height:30, margin:10}}
                        onPress={this.gamesHistoryBtnPressed}
                    />
                    <Button
                        backgroundColor={'magenta'}
                        color={'white'}
                        label={'statistics'}
                        size="small"
                        borderRadius={50}
                        text80
                        labelStyle={{fontWeight: 'bold'}}
                        style={{width:170, height:30, margin:10}}
                        onPress={this.statisticsBtnPressed}
                    />
                </View>
            </View>
        )
    };


    addTarget = (ref, id) => {
        if (ref && !this.targets[id]) {
            this.targets[id] = ref;
        }
    };

    closeHighlight = () => {
        this.setState({isShowInfoOverlay: false}, () => {});
    };

    showHighlight = () => {
        this.setState({isShowInfoOverlay: true});
    };

    renderHighlighterOverlay = () => {
        const {isShowInfoOverlay} = this.state;
        return (
            <FeatureHighlight
                visible={isShowInfoOverlay}
                title={titles['0']}
                message={messages['0']}
                confirmButtonProps={{label: 'Got It', onPress: this.closeHighlight}}
                onBackgroundPress={this.closeHighlight}
                getTarget={() => this.targets['0']}
            />
        );
    };

    render() {
        return (
            <View flex style={{backgroundColor: clr.BG}}>
                {this.renderTitle()}
                <FlatList
                    keyExtractor={(item) => item.roundNumber.toString()}
                    data={this.state.roundsHistory}
                    renderItem={this.renderLine}
                    ListFooterComponent={this.renderFooter}
                />
                {this.renderHighlighterOverlay()}
            </View>
        );
    }
}

function mapStateToProps() {
    return {
        allGamesObj: whistStore.getAllGames()
    };
}

export default connect(mapStateToProps)(TableScreen);
