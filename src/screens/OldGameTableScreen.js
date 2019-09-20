import React, {Component} from 'react';
import {FlatList, Dimensions} from 'react-native';
import {Text, View, Assets} from 'react-native-ui-lib';

import {Navigation} from "react-native-navigation";
import PropTypes from 'prop-types';

import {connect} from 'remx';
import {whistStore} from '../stores/allGamesStore'
import * as allGamesActions from './../actions/allGamesActions'
import {TABLE_SCREEN_COLORS as clr} from "../constants/styles/Colors";

const SCREEN_WIDTH = Dimensions.get('screen').width;
const CUBE_WIDTH = SCREEN_WIDTH / 11;

class OldGameTableScreen extends Component {

    static propTypes = {
        componentId: PropTypes.string,
        allGamesObj: PropTypes.array,
        roundsHistory: PropTypes.array,
        gameStartDateStr: PropTypes.string,
        allNames: PropTypes.object,
        playingTimeStr: PropTypes.string
    };

    constructor(props) {
        super(props);
        Navigation.events().bindComponent(this);
        this.backToMyGamesScreen.bind(this.backToMyGamesScreen);

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
                        id: 'backToMyGames',
                        text: 'Back'
                    },
                ],
                title: {
                    text: 'Game From '
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
        Navigation.mergeOptions(this.props.componentId, {
            topBar: {
                title: {
                    text: `Game From ${this.props.gameStartDateStr}`
                }
            },
        })
    }

    componentWillMount(){
        this.props.allGamesObj = whistStore.getAllGames();
        allGamesActions.fetchWhistGame();

        this.setState({
            allGamesObj : whistStore.getAllGames()
        })
    }

    navigationButtonPressed({buttonId}) {
        if (buttonId === 'backToMyGames') {
            this.backToMyGamesScreen();
        }
    }

    backToMyGamesScreen() {
        Navigation.dismissModal(this.props.componentId);
    }

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
    };

    renderLine = item => {
        return (
            <View row style={{height: 50}}>
                {this.renderRoundNumCube(item.item)}
                {this.renderUpDownCube(item.item)}
                {this.renderTrumpCube(item.item)}
                {this.renderResCube(item.item, 'north')}
                {this.renderResCube(item.item, 'west')}
                {this.renderResCube(item.item, 'south')}
                {this.renderResCube(item.item, 'east')}
            </View>
        )
    };

    renderFooter = () => {
        return (
            <View center>
                <Text>{`Playing Time: ${this.props.playingTimeStr}`}</Text>
            </View>
        )
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
            </View>
        );
    }
}

function mapStateToProps() {
    return {
        allGamesObj: whistStore.getAllGames()
    };
}

export default connect(mapStateToProps)(OldGameTableScreen);
