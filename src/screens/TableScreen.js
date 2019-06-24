import React, {Component} from 'react';
import {FlatList, Dimensions} from 'react-native';
import {Text, View, Colors, Assets} from 'react-native-ui-lib';

import {Navigation} from "react-native-navigation";
import PropTypes from 'prop-types';

import {connect} from 'remx';
import {whistStore} from './../stores/allGamesStore'
import * as allGamesActions from './../actions/allGamesActions'
import {TABLE_SCREEN_COLORS as clr} from "../constants/styles/Colors";

const SCREEN_WIDTH = Dimensions.get('screen').width
const CUBE_WIDTH = SCREEN_WIDTH / 11;

class TableScreen extends Component {

    static propTypes = {
        componentId: PropTypes.string,
        somePropToPass: PropTypes.string,
        allGamesObj: PropTypes.object,
        roundsHistory: PropTypes.array
    };

    constructor(props) {
        super(props);
        Navigation.events().bindComponent(this);
        this.backToGameScreen.bind(this.backToGameScreen)

        this.state = {
            allGamesObj : {}
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
                    // {
                    //     id: 'anotherButton',
                    //     text: 'another'
                    // }
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


    navigationButtonPressed({buttonId}) {
        if (buttonId === 'backToGame') {
            this.backToGameScreen();
        }
    }

    backToGameScreen() {
        Navigation.dismissModal(this.props.componentId);
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

    renderLine = item => {
        return (
            <View row styles={{height: 50}}>
                {this.renderRoundNumCube(item.item)}
                {this.renderUpDownCube(item.item)}
                {this.renderTrumpCube(item.item)}
                {this.renderResCube(item.item, 'north')}
                {this.renderResCube(item.item, 'west')}
                {this.renderResCube(item.item, 'south')}
                {this.renderResCube(item.item, 'east')}
            </View>
        )
    }


    render() {
        let gamesLst = this.state.allGamesObj.games
        return (
            <View flex style={{backgroundColor: clr.BG}}>
                {this.renderTitle()}
                <FlatList
                    keyExtractor={(item) => item.roundNumber.toString()}
                    data={this.props.roundsHistory}
                    renderItem={this.renderLine}
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
