import React, {Component} from 'react';
import {FlatList, Dimensions, Alert} from 'react-native';
import {Text, View, Button, Assets, TouchableOpacity} from 'react-native-ui-lib';

import {Navigation} from "react-native-navigation";
import PropTypes from 'prop-types';

import {connect} from 'remx';
import {whistStore} from '../stores/allGamesStore'
import * as allGamesActions from './../actions/allGamesActions'
import {TABLE_SCREEN_COLORS as clr} from "../constants/styles/Colors";

const SCREEN_WIDTH = Dimensions.get('screen').width
const CUBE_WIDTH = SCREEN_WIDTH / 11;

class TableScreen extends Component {

    static propTypes = {
        componentId: PropTypes.string,
        somePropToPass: PropTypes.string,
        allGamesObj: PropTypes.object,
        roundsHistory: PropTypes.array,
        deleteLastRound: PropTypes.func,
        gameStartTime: PropTypes.instanceOf(Date)
    };

    constructor(props) {
        super(props);
        Navigation.events().bindComponent(this);
        this.backToGameScreen.bind(this.backToGameScreen)

        this.state = {
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
                ]
            }
        }
    }


    componentDidMount() {
        console.log("componentDIDMount")
        allGamesActions.fetchWhistGame();
    }

    componentWillMount(){
        console.log("ComponentWillMount")
        this.props.allGamesObj = whistStore.getAllGames()
        allGamesActions.fetchWhistGame();

        this.setState({
            allGamesObj : whistStore.getAllGames()
        })

    }

    saveGameAndOpenMyGames = async () => {
        await whistStore.addNewGame([this.props.roundsHistory]);
        this.showGamesHistoryScreen();
    }

    alertEndGameDialogAndSave = () => {
        if (this.state.roundsHistory.length > 0) {
            Alert.alert(
                'Finish Game',
                'Are you sure?',
                [
                    {text: 'Cancel', onPress: () => {}, style: 'cancel'},
                    {text: 'save', onPress: () => {this.saveGameAndOpenMyGames()}},
                    {text: 'Delete', onPress: () => Alert.alert("Kill the app to start new game!")},
                ],
                {cancelable: false},
            );
        }
    }

    deleteLastRound = () => {
        this.props.deleteLastRound()
        const roundsHistory = this.state.roundsHistory.slice(0, -1)
        this.setState({roundsHistory})
    }


    alertDeleteDialog = () => {
        if (this.state.roundsHistory.length > 0) {
            Alert.alert(
                'Delete Last Round'
                ,
                'Are you sure?',
                [
                    {text: 'Cancel', onPress: () => {}, style: 'cancel'},
                    {text: 'OK', onPress: () => this.deleteLastRound()},
                ],
                {cancelable: false},
            );
        }
    };

    renderTimeFromStart = () => {
        // const minutes = parseInt(Math.abs(new Date() - this.props.gameStartTime) / (1000 * 60) % 60);
        // const hours = parseInt(Math.abs(new Date() - this.props.gameStartTime) / (1000 * 60 * 60) % 24);
        // const diffStr = `${hours < 10 ? '0'+hours : hours}:${minutes < 10 ? '0'+minutes : minutes}`;
        // return <Text>{`Playing Time: ${diffStr}`}</Text>
        return <Text>{`Playing Time: ${this.getTimeStr(this.props.gameStartTime, new Date())}`}</Text>
    }

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
    }
    gamesHistoryBtnPressed = () => {
        this.showGamesHistoryScreen();
    }

    renderTitleCube = (str) => {
        return (
            <View center style={{height: 40, width: CUBE_WIDTH, backgroundColor: clr.TITLE_CUBES_BG, borderColor: clr.TITLE_CUBES_BORDER, borderWidth:1}}>
                <Text style={{fontSize: 10}}>{str}</Text>
            </View>
        )
    }
    renderNameCube = (str) => {
        return (
            <View center style={{height: 40, width: CUBE_WIDTH*2, backgroundColor: clr.TITLE_CUBES_BG,  borderColor: clr.TITLE_CUBES_BORDER, borderWidth:1}}>
                <Text style={{fontSize: 15}}>{str}</Text>
            </View>
        )
    }

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
    }

    renderRoundNumCube = (item) => {
        return (
            <View center style={{height: 50, width: CUBE_WIDTH, borderColor: clr.RESULTS_CUBES_BORDER, backgroundColor: clr.RESULTS_CUBES_BG, borderWidth:1}}>
                <Text>{item.roundNumber}</Text>
                <Text>{item.isRoundFail ? Assets.emojis.boom : ' '}</Text>
                {/*{item.isRoundFail ? <Text>{Assets.emojis.boom}</Text> : undefined}*/}
            </View>
        )
    }
    renderUpDownCube = (item) => {
        const str = item.upDown > 0 ? Assets.emojis.heavy_plus_sign + item.upDown : Assets.emojis.heavy_minus_sign + item.upDown*(-1)
        return (
            <View center style={{height: 50, width: CUBE_WIDTH, borderColor: clr.RESULTS_CUBES_BORDER, backgroundColor: clr.RESULTS_CUBES_BG, borderWidth:1}}>
                <Text>{str}</Text>
                <Text>{item.isRoundFail ? Assets.emojis.boom : ' '}</Text>
            </View>
        )
    }
    renderTrumpCube = (item) => {
        return (
            <View center style={{height: 50, width: CUBE_WIDTH, borderColor: clr.RESULTS_CUBES_BORDER, backgroundColor: clr.RESULTS_CUBES_BG, borderWidth:1}}>
                <Text>{Assets.emojis[item.chosenTrump]}</Text>
                <Text>{item.isRoundFail ? Assets.emojis.boom : ' '}</Text>
            </View>
        )
    }

    bgForBidCube = (item, location) => {
        if (item.isStand[location]) {
            return clr.BID_CUBES_STAND_BG
        }
        return clr.BID_CUBES_FAIL_BG
    }
    bgForResCube = (item, location) => {
        const seq = item.curSequence[location]
        if (seq > 0 && seq % 5 === 0) {
            return clr.RESULTS_CUBES_ROW_5_BG
        }
        return clr.RESULTS_CUBES_BG
    }

    renderResCube = (item, location) => {
        const difference = item.results[location]-item.biddings[location];
        const sequence = item.curSequence[location]
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
    }

    getTimeStr = (start, end) => {
        const difference = Math.abs(end-start)
        const hours = parseInt(difference / (1000 * 60 * 60) % 24);
        const minutes = parseInt(difference / (1000 * 60) % 60);
        const seconds = parseInt(difference / (1000) % 60);
        const hoursStr = hours < 10 ? '0'+hours :hours
        const minutesStr = minutes < 10 ? '0'+minutes : minutes
        const secondsStr = seconds < 10 ? '0' + seconds : seconds
        return`${hoursStr}:${minutesStr}:${secondsStr}`;
        // return`${minutes < 10 ? '0'+minutes : minutes}:${seconds < 10 ? '0'+seconds : seconds}`;
    }

    showRoundInfo = (item) => () => {
        Alert.alert(`Round ${item.roundNumber}`,
            `Bidding Time: ${this.getTimeStr(item.startBidTime, item.startRoundTime)}\nPlaying time: ${this.getTimeStr(item.startRoundTime, item.endRoundTime)}`)
    }

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
    }

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
                        backgroundColor={'blue'}
                        color={'white'}
                        label={'End Game'}
                        size="small"
                        borderRadius={50}
                        text80
                        labelStyle={{fontWeight: 'bold'}}
                        style={{width:170, height:30, margin:10}}
                        // ref={element => (this.button_0 = element)}
                        onPress={this.alertEndGameDialogAndSave}
                    />
                </View>
                {this.renderTimeFromStart()}
                <Text>{"\nlong press on a round to get more info\n"}</Text>
                <Button
                    backgroundColor={'green'}
                    color={'white'}
                    label={'Games History'}
                    size="small"
                    borderRadius={50}
                    text80
                    labelStyle={{fontWeight: 'bold'}}
                    style={{width:270, height:30, margin:10}}
                    // ref={element => (this.button_0 = element)}
                    onPress={this.gamesHistoryBtnPressed}
                />
            </View>

        )
    }


    render() {
        // let gamesLst = this.state.allGamesObj.games
        return (
            <View flex style={{backgroundColor: clr.BG}}>
                {this.renderTitle()}
                <FlatList
                    keyExtractor={(item) => item.roundNumber.toString()}
                    data={this.state.roundsHistory}
                    renderItem={this.renderLine}
                    ListFooterComponent={this.renderFooter}
                />
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
