import React, {Component} from 'react';
import {BackHandler, Alert} from 'react-native';
import {View, Button, Colors, Assets} from 'react-native-ui-lib';

import PropTypes from 'prop-types';
import {Navigation} from 'react-native-navigation';
import ShapeInput from '../components/bidding/ShapeInput'
import RoundTrump from '../components/results/RoundTrump'
import KeepAwake from 'react-native-keep-awake';

import BiddingComponent from "../components/bidding/BiddingComponent";
import ResultsComponent from "../components/results/ResultsComponent";
import BidInfo from "../components/bidding/BidInfo";
import ResInfo from "../components/results/ResInfo";
import * as pts from './../constants/Points'
import {ROUND_SCREEN_COLORS as clr} from "../constants/styles/Colors";

let roundsHistory = [];

class RoundScreen extends Component {

    static propTypes = {
        componentId: PropTypes.string,
        somePropToPass: PropTypes.string,
        allNames: PropTypes.object
    };


    constructor(props) {
        super(props);

        this.state = {
            roundNumber: 1,
            bid_notRes: true,
            sumOfBiddings: 0,
            sumOfResults: 0,
            chosenTrump: "",
            biddings: {
                north: 0,
                south: 0,
                west: 0,
                east: 0
            },
            results: {
                north: 0,
                south: 0,
                west: 0,
                east: 0
            },
            points:{
                north: 0,
                south: 0,
                west: 0,
                east: 0
            },
            upDown:-13,
            isStand: {
                north: true,
                south: true,
                west: true,
                east: true
            },
            curSequence: {
                north: 0,
                south: 0,
                west: 0,
                east: 0
            },
            didBet: {
                north: false,
                south: false,
                west: false,
                east: false
            },
            isRoundFail: false,
            gameStartTime: new Date(),
            endStartTime: "",     //TODO dont need, only save it when finish game
            startBidTime: new Date(),
            startRoundTime: undefined,
            endRoundTime: undefined

        };

        Navigation.events().bindComponent(this);
        // this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    deleteLastRound = () => {
        roundsHistory.pop()
        const roundNumber = this.state.roundNumber - 1;
        let points = {
            north: 0,
            south: 0,
            west: 0,
            east: 0
        }
        let curSequence = {
            north: 0,
            south: 0,
            west: 0,
            east: 0
        }
        if (roundsHistory.length > 0) {
            points = {...roundsHistory[roundsHistory.length - 1].points}
            curSequence = {...roundsHistory[roundsHistory.length - 1].curSequence}
        }
        this.setState({
            roundNumber,
            points,
            curSequence
        })
    }

    // onNavigatorEvent(event) {
    //     switch (event.id) {
    //         case 'willAppear':
    //             this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    //             break;
    //         case 'willDisappear':
    //             this.backPressed = 0;
    //             this.backHandler.remove();
    //             break;
    //         default:
    //             break;
    //     }
    // }
    // handleBackPress = () => {
    //     if (this.backPressed && this.backPressed > 0) {
    //         this.props.navigator.popToRoot({ animated: false });
    //         return false;
    //     }
    //
    //     this.backPressed = 1;
    //     this.props.navigator.showSnackbar({
    //         text: 'Press one more time to exit',
    //         duration: 'long',
    //     });
    //     return true;
    // }

    pushTableScreen = () => {
        Navigation.showModal({
            stack: {
                children: [{
                    component: {
                        name: 'whistStats.TableScreen',
                        passProps: {
                            somePropToPass: 'Some props - Table from DB',
                            roundsHistory: roundsHistory,
                            allNames: this.props.allNames,
                            deleteLastRound: this.deleteLastRound,
                            gameStartTime: this.state.gameStartTime
                        }
                    }
                }]
            }
        });
    }

    static get options() {
        return {
            popGesture: false,
            topBar: {
                rightButtons: [
                    {
                        id: 'tableBtn',
                        text: `Table ${Assets.emojis.clipboard}`
                    }
                ],
                leftButtons: [
                    {
                        id: 'backBtn',
                        text: 'back'
                    }
                ],
                title: {
                    text: `Round 1 Biddings`
                }
            }
        };
    }

    // componentDidAppear() {
    //     console.log("componentDidAppear")
    // }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.bid_notRes !== prevState.bid_notRes) {           //Change Title Only when we change state of bid_notRes
            // this.updateRow5()
            // this.changeScreenTitle();
            if (this.state.bid_notRes) {        // We Finished Round
            }
            else {                              // We finished Bidding
                this.uploadBiddings()
                this.changeScreenTitle();
            }

        }
    }

    uploadResults() {
        this.pushTableScreen()      //TODO maybe I dont want it to jump always
    }

    uploadBiddings() {

    }

    changeScreenTitle = () => {
        Navigation.mergeOptions(this.props.componentId, {
            topBar: {
                title: {
                    text: `Round ${this.state.roundNumber} ${this.state.bid_notRes ? 'Biddings': 'Results'}`
                }
            }
        });
    }


    navigationButtonPressed({buttonId}) {
        if (buttonId === 'tableBtn') {
            this.pushTableScreen();
        }
        else if (buttonId === 'backBtn') {
            this.iosNavigationBackBtnPressed()
        }
    }

    iosNavigationBackBtnPressed = () => {
        Alert.alert(
            'Warning',
            'This will delete the game',
            [
                {text: 'Cancel', onPress: () => {}, style: 'cancel'},
                {text: 'OK', onPress: () => {this.popScreenAndDeleteGame()}}
            ],
            {cancelable: false},
        );
    }

    popScreenAndDeleteGame = () => {
        roundsHistory = [];
        Navigation.pop(this.props.componentId);
    }

        // Call this function only after finish whole Round
    initiateNewBidState = () => {
        const roundNum = this.state.roundNumber + 1;
        // const roundNum = this.state ? this.state.roundNumber + 1 : 1;

        // console.log(JSON.stringify(this.state))
        return ({
            roundNumber: roundNum,
            bid_notRes: true,
            sumOfBiddings: 0,
            sumOfResults: 0,
            chosenTrump: "",
            biddings: {
                north: 0,
                south: 0,
                west: 0,
                east: 0
            },
            results: {
                north: 0,
                south: 0,
                west: 0,
                east: 0
            },
            upDown: -13,
            didBet: {
                north: false,
                south: false,
                west: false,
                east: false
            },
            isRoundFail: false,
            startBidTime: new Date(),
            startRoundTime: undefined,
            endRoundTime: undefined
        });

    }

    updateIsStand = (biddings, results) => {
        return (
            {
                north: biddings.north === results.north,
                west: biddings.west === results.west,
                east: biddings.east === results.east,
                south: biddings.south === results.south
            }
        )
    }

    updateRoundFail = (biddings, results) => {
        return (
                biddings.north !== results.north &&
                biddings.west !== results.west &&
                biddings.east !== results.east &&
                biddings.south !== results.south
        )
    }

    updateSequence = (biddings, results, lastSequence) => {
        return (
            {
                north: biddings.north === results.north ? lastSequence.north + 1 : 0,
                west: biddings.west === results.west ? lastSequence.west + 1 : 0,
                east: biddings.east === results.east ? lastSequence.east + 1 : 0,
                south: biddings.south === results.south ? lastSequence.south + 1 : 0
            }
        )
    }


    updatePointsObject = (biddings, results, points) => {
        if (this.state.isRoundFail) {
            return points;
        }
        return {
            north: points.north+this.calcRoundPoints(biddings.north, results.north) + this.Row5Bonus('north'),
            west: points.west + this.calcRoundPoints(biddings.west, results.west) + this.Row5Bonus('west'),
            east: points.east + this.calcRoundPoints(biddings.east, results.east) + this.Row5Bonus('east'),
            south: points.south+this.calcRoundPoints(biddings.south, results.south) + this.Row5Bonus('south')
        }
    }

    Row5Bonus = (location) => {
        const sequence = this.state.curSequence[location]
        if (this.state.roundNumber < 4) return 0;
        if (sequence > 0 && sequence % 5 === 0) {
            return pts.BONUS_POINTS_FOR_5_ROW
        }
        else {
            return 0
        }
    }


    calcRoundPoints = (bid, res) => {
        const difference = Math.abs(bid - res)
        if (difference === 0) {                          //Stand
            if (bid === 0) {
                if (this.state.sumOfBiddings < 13) {   //Under
                    return pts.ZERO_UNDER_POINTS_STAND;
                }
                return pts.ZERO_OVER_POINTS_STAND;
            }
            else {                                  //Over
                return bid * bid + pts.EXTRA_POINTS_FOR_STAND
            }
        }
        else {                                      // Fail
            if (bid === 0) {
                if (this.state.sumOfBiddings < 13) {   //Under
                    return pts.ZERO_UNDER_POINTS_FAIL + (difference - 1) * pts.POINTS_FOR_ZERO_EXTRAHAND_UNDER
                }
                return pts.ZERO_OVER_POINTS_FAIL + (difference - 1) * pts.POINTS_FOR_ZERO_EXTRAHAND_OVER
            }
            else
                return pts.PENALTY_PER_DIFFERENCE * difference
        }
    }

    changeRoundState = () => {      // this func checks if the Button click is legal and change state if so
        if(this.state.bid_notRes){      //we are on the screen of the bidding
            if (this.state.chosenTrump !== "" && true === true) {             //todo all bids are set.
                if (this.state.didBet.north || this.state.didBet.west || this.state.didBet.east || this.state.didBet.south) {
                    if (this.state.sumOfBiddings !== 13) {
                        let newResultsObject = JSON.parse(JSON.stringify(this.state.biddings));
                        this.setState({bid_notRes: false, results: newResultsObject, upDown: this.calcUpDown(), sumOfResults: this.state.sumOfBiddings, startRoundTime: new Date()});
                    } else {
                        Alert.alert('!! SUM 13 !!'); return;
                    }
                } else {
                    Alert.alert('!! BET 5+ !!')
                }
            } else {
                Alert.alert('!! CHOOSE TRUMP !!'); return;
            };
        } else {                        // bid_notRes is false, so we want to end a round
            if(this.state.sumOfResults !== 13) {
                Alert.alert('!! SUM NOT 13 !!'); return;
            } else {
                this.setState({
                    isStand: this.updateIsStand(this.state.biddings, this.state.results),
                    isRoundFail: this.updateRoundFail(this.state.biddings, this.state.results),
                    curSequence: this.updateSequence(this.state.biddings, this.state.results, this.state.curSequence),
                    bid_notRes: true,
                    endRoundTime: new Date()
                }, () => {
                    this.setState({
                        points: this.updatePointsObject(this.state.biddings, this.state.results, this.state.points)
                    }, () => {
                        roundsHistory.push({
                            roundNumber: this.state.roundNumber,
                            chosenTrump: this.state.chosenTrump,
                            biddings: {...this.state.biddings},
                            results: {...this.state.results},
                            points: {...this.state.points},
                            curSequence: {...this.state.curSequence},
                            isStand: {...this.state.isStand},
                            upDown: this.state.upDown,
                            didBet: {...this.state.didBet},
                            isRoundFail: this.state.isRoundFail,
                            startBidTime: this.state.startBidTime,
                            startRoundTime: this.state.startRoundTime,
                            endRoundTime: this.state.endRoundTime
                        });
                        this.setState(this.initiateNewBidState(),
                            () => this.changeScreenTitle());
                        this.uploadResults();

                    })
                })
            }
        }
    };

    whenShapePressed = (shapeName) => {
        this.setState({chosenTrump: shapeName})

    }

    whenBidBtnPressed = (location, numPressed) => {
        let newBiddingState = {...this.state.biddings};
        newBiddingState[location] = numPressed;
        const newSum = this.calcSumOfBiddings(location, numPressed);
        this.setState({biddings: newBiddingState, sumOfBiddings: newSum, didBet: this.checkIfBet(location, numPressed)})

    }

    whenResBtnPressed = (location, numPressed) => {
        let newResultsState = {...this.state.results};
        newResultsState[location] = numPressed;
        this.setState({results: newResultsState, sumOfResults: this.calcSumOfResults(location, numPressed)})

    }

    checkIfBet = (location, numPressed) => {
        let newDidBet = {...this.state.didBet}
        if (numPressed >= 5) {
            if (!newDidBet.north && !newDidBet.west && !newDidBet.east && !newDidBet.south) {       //Its the first one to have bid more than 5
                newDidBet[location] = true;
            }
            else {

            }
        }
        else {      // number lower than 5 pressed
            if (newDidBet[location]) {          // previously he was the king
                newDidBet[location] = false;
                ['north', 'west', 'east', 'south'].forEach((value) => {
                    if (value !== location && this.state.biddings[value] >= 5 &&        // this if takes care on the situation that someone else gets the crown if he bid more than 5
                        !newDidBet.north && !newDidBet.west && !newDidBet.east && !newDidBet.south) {
                        newDidBet[value] = true;
                    }
                })
            }
        }
        return newDidBet
    }

    calcSumOfBiddings = (location, numPressed) => {
        if (location === 'north') return numPressed+this.state.biddings.west+this.state.biddings.east+this.state.biddings.south;
        else if (location === 'west') return this.state.biddings.north+numPressed+this.state.biddings.east+this.state.biddings.south;
        else if (location === 'east') return this.state.biddings.north+this.state.biddings.west+numPressed+this.state.biddings.south;
        else if (location === 'south') return this.state.biddings.north+this.state.biddings.west+this.state.biddings.east+numPressed;
    };

    calcSumOfResults = (location, numPressed) => {
        if (location === 'north') return numPressed + this.state.results.west + this.state.results.east + this.state.results.south;
        else if (location === 'west') return this.state.results.north + numPressed + this.state.results.east + this.state.results.south;
        else if (location === 'east') return this.state.results.north + this.state.results.west + numPressed + this.state.results.south;
        else if (location === 'south') return this.state.results.north + this.state.results.west + this.state.results.east + numPressed;
    }

    calcUpDown = () => this.state.sumOfBiddings - 13;

    render() {
        return (
            <View flex style={{backgroundColor: clr.BG}}>
                {this.state.bid_notRes ?
                    <View>
                        <BiddingComponent king={this.state.didBet.north} points={this.state.points.north} bid={this.state.biddings.north} whenBidBtnPressed={this.whenBidBtnPressed} location={'north'} name={this.props.allNames.northName}/>
                        <View spread row>
                            <BiddingComponent king={this.state.didBet.west} points={this.state.points.west} bid={this.state.biddings.west} whenBidBtnPressed={this.whenBidBtnPressed} location={'west'}  name={this.props.allNames.westName}/>
                            <BiddingComponent king={this.state.didBet.east} points={this.state.points.east} bid={this.state.biddings.east} whenBidBtnPressed={this.whenBidBtnPressed} location={'east'}  name={this.props.allNames.eastName}/>
                        </View>
                        <BiddingComponent king={this.state.didBet.south} points={this.state.points.south} bid={this.state.biddings.south} whenBidBtnPressed={this.whenBidBtnPressed} location={'south'}  name={this.props.allNames.southName}/>
                    </View>
                    :
                    <View>
                        <ResultsComponent king={this.state.didBet.north} points={this.state.points.north} bid={this.state.biddings.north} res={this.state.results.north} whenResBtnPressed={this.whenResBtnPressed} location={'north'} name={this.props.allNames.northName}/>
                        <View spread row>
                            <ResultsComponent king={this.state.didBet.west} points={this.state.points.west} bid={this.state.biddings.west} res={this.state.results.west} whenResBtnPressed={this.whenResBtnPressed} location={'west'}  name={this.props.allNames.westName}/>
                            <ResultsComponent king={this.state.didBet.east} points={this.state.points.east} bid={this.state.biddings.east} res={this.state.results.east} whenResBtnPressed={this.whenResBtnPressed} location={'east'}  name={this.props.allNames.eastName}/>
                        </View>
                        <ResultsComponent king={this.state.didBet.south} points={this.state.points.south} bid={this.state.biddings.south} res={this.state.results.south} whenResBtnPressed={this.whenResBtnPressed} location={'south'}  name={this.props.allNames.southName}/>
                    </View>
                }

                <View row center>
                    <BidInfo bid_notRes={this.state.bid_notRes} sumOfBiddings={this.state.sumOfBiddings} sumOfResults={this.state.sumOfResults}/>
                    {this.state.bid_notRes ?
                        <ShapeInput chosenTrump={this.state.chosenTrump} whenShapePressed={this.whenShapePressed}></ShapeInput>
                        :
                        <RoundTrump trump={this.state.chosenTrump}/>
                    }
                    <ResInfo upDown={this.state.upDown} bid_notRes={this.state.bid_notRes} sumOfBiddings={this.state.sumOfBiddings} sumOfResults={this.state.sumOfResults}/>
                </View>

                <View centerH>
                    <Button
                        backgroundColor={this.state.bid_notRes ? clr.START_ROUND_BTN_BG : clr.END_ROUND_BTN_BG}
                        color={this.state.bid_notRes ? clr.START_ROUND_BTN_TEXT : clr.END_ROUND_BTN_TEXT}
                        label={this.state.bid_notRes ? `start round ${this.state.roundNumber}` : `end round ${this.state.roundNumber}`}
                        size="large"
                        borderRadius={50}
                        text60
                        labelStyle={{fontWeight: 'bold'}}
                        style={{width:250, height:40}}
                        // ref={element => (this.button_0 = element)}
                        onPress={() => this.changeRoundState()}
                    />
                </View>
                <KeepAwake />
            </View>
        );
    }

    uploadAndUpdateScore() {

    }

    uploadBiddings() {

    }

}

export default RoundScreen;

