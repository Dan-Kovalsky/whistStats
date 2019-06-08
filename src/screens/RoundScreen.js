import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Text, View, Button, Colors, Assets, RadioGroup, RadioButton,TextField} from 'react-native-ui-lib';

import PropTypes from 'prop-types';
import {Navigation} from 'react-native-navigation';
import ShapeInput from '../components/bidding/ShapeInput'
import RoundTrump from '../components/bidding/RoundTrump'


import NameInput from "../components/NameInput";
import NameLabel from '../components/bidding/NameLabel'
import BiddingComponent from "../components/bidding/BiddingComponent";
import ResultsComponent from "../components/results/ResultsComponent";
import BidInfo from "../components/bidding/BidInfo";
import ResInfo from "../components/results/ResInfo";
import {ZERO_UNDER_POINTS_STAND, ZERO_OVER_POINTS_STAND, ZERO_UNDER_POINTS_FAIL, POINTS_FOR_ZERO_EXTRAHAND_UNDER, ZERO_OVER_POINTS_FAIL, POINTS_FOR_ZERO_EXTRAHAND_OVER, EXTRA_POINTS_FOR_STAND, PENALTY_PER_DIFFERENCE, BONUS_POINTS_FOR_5_ROW} from './../constants/Points'



class RoundScreen extends Component {

    static propTypes = {
        componentId: PropTypes.string,
        somePropToPass: PropTypes.string,
        allNames: PropTypes.object
    };

    constructor(props) {
        super(props);

        // this.state = this.initiateNewBidState();

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
            upDown:-13
        };

        Navigation.events().bindComponent(this);

        this.pushTableScreen = this.pushTableScreen.bind(this);
    }

    pushTableScreen() {
        Navigation.showModal({
            stack: {
                children: [{
                    component: {
                        name: 'whistStats.TableScreen',
                        passProps: {
                            somePropToPass: 'Some props - Table from DB'
                        }
                    }
                }]
            }
        });
    }


    static get options() {
        return {
            topBar: {
                rightButtons: [
                    {
                        id: 'seeTable',
                        text: `Table ${Assets.emojis.clipboard}`
                    }
                ],
                leftButtons: [
                    {
                        id: 'test',
                        text: 'tst'
                    }
                ],
                title: {
                    text: `Round 1 Bidding`
                }
            }
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        if (this.state.bid_notRes !== prevState.bid_notRes) {           //Change Title Only when we change state of bid_notRes
            this.changeScreenTitle();
            if (this.state.bid_notRes) {        // We Finished Round
                this.uploadResults()
            }
            else {                              // We finished Bidding
                this.uploadBiddings()
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
        this.pushTableScreen();
    }

        // Call this function only after finish whole Round
    initiateNewBidState = () => {
        const roundNum = this.state ? this.state.roundNumber + 1 : 1;

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
            points: this.updatePointsObject(this.state.biddings, this.state.results, this.state.points),
            upDown: -13
        });

    }


    updatePointsObject = (biddings, results, points) => {
        console.log(JSON.stringify(biddings))
        console.log(JSON.stringify(results))
        console.log(JSON.stringify(points))
        return {                                                                    //todo add state of sequence
            north: points.north+this.calcRoundPoints(biddings.north, results.north) + this.Row5Bonus(),
            west: points.west + this.calcRoundPoints(biddings.west, results.west) + this.Row5Bonus(),
            east: points.east + this.calcRoundPoints(biddings.east, results.east) + this.Row5Bonus(),
            south: points.south+this.calcRoundPoints(biddings.south, results.south) + this.Row5Bonus()
        }
    }

    Row5Bonus = () => {
        //TODO TODO add state of sequence
        if (true === false) {
            return BONUS_POINTS_FOR_5_ROW
        }
        else {
            return 0
        }
    }


    calcRoundPoints = (bid, res) => {
        const difference = Math.abs(bid - res)
        if (difference === 0) {                          //Stand
            if (bid === 0) {
                if (this.state.sumOfBiddings < 13) {   //Under   //Todo add state of under over and sumOfBiddings
                    return ZERO_UNDER_POINTS_STAND;
                }
                return ZERO_OVER_POINTS_STAND;
            }
            else {                                  //Over
                return bid * bid + EXTRA_POINTS_FOR_STAND
            }
        }
        else {                                      // Fail
            console.log("differsence: "+ difference)
            if (bid === 0) {
                if (this.state.sumOfBiddings < 13) {   //Under   //Todo add state of under over and sumOfBiddings
                    return ZERO_UNDER_POINTS_FAIL + (difference - 1) * POINTS_FOR_ZERO_EXTRAHAND_UNDER
                }
                return ZERO_OVER_POINTS_FAIL + (difference - 1) * POINTS_FOR_ZERO_EXTRAHAND_OVER
            }
            else
                return PENALTY_PER_DIFFERENCE * difference
        }
    }

    changeRoundState = () => {      // this func checks if the Button click is legal and change state if so
        if(this.state.bid_notRes){      //we are on the screen of the bidding
            if (this.state.chosenTrump !== "" && true === true) {             //todo all bids are set.
                if (this.state.sumOfBiddings === 13) {          //todo zero it when round end
                // if (this.calcSumOfBiddings() === 13) {          //todo zero it when round end
                    alert('Sum of Biddings cannot be 13'); return;
                } else {
                    let newResultsObject = JSON.parse(JSON.stringify(this.state.biddings));
                    this.setState({bid_notRes: false, results: newResultsObject, upDown: this.calcUpDown(), sumOfResults: this.state.sumOfBiddings});
                }
            } else {
                alert('please set all biding and choose trump'); return;
            };
        } else {                        // bid_notRes is false, so we want to end a round
            // if (true === true) {         //todo all results are chosen
                if(this.state.sumOfResults !== 13) {
                    alert('Sum of results must be 13'); return;
                    // } else
                    // alert('please insert results for all players');
                    // } else {
                } else {
                    this.setState(this.initiateNewBidState())
                    // this.setState({bid_notRes: true, roundNumber: this.state.roundNumber + 1});
                }
            }
    }


    whenShapePressed = (shapeName) => {
        // alert("the Shape That pressed is " + shapeName)
        this.setState({chosenTrump: shapeName})

    }

    whenBidBtnPressed = (playerLocation, numPressed) => {
        let newBiddingState = {...this.state.biddings};
        newBiddingState[playerLocation] = numPressed;
        let newSum = this.calcSumOfBiddings(playerLocation, numPressed)
        this.setState({biddings: newBiddingState, sumOfBiddings: newSum})
        // alert('The player on the '+playerLocation+' side pressed on '+numPressed+'\nsum of biddings = '+(this.calcSumOfBiddings()+numPressed-this.state.biddings[playerLocation]))

    }

    whenResBtnPressed = (playerLocation, numPressed) => {
        let newResultsState = {...this.state.results};
        newResultsState[playerLocation] = numPressed;
        this.setState({results: newResultsState, sumOfResults: this.calcSumOfResults(playerLocation, numPressed)})
        // alert('The player on the '+playerLocation+' side pressed on '+numPressed+'\nsum of biddings = '+(this.calcSumOfBiddings()+numPressed-this.state.biddings[playerLocation]))

    }

    // calcSumOfBiddings = () => this.state.biddings.north+this.state.biddings.west+this.state.biddings.east+this.state.biddings.south;
    calcSumOfBiddings = (playerLocation, numPressed) => {
        if (playerLocation === 'north') return numPressed+this.state.biddings.west+this.state.biddings.east+this.state.biddings.south;
        else if (playerLocation === 'west') return this.state.biddings.north+numPressed+this.state.biddings.east+this.state.biddings.south;
        else if (playerLocation === 'east') return this.state.biddings.north+this.state.biddings.west+numPressed+this.state.biddings.south;
        else if (playerLocation === 'south') return this.state.biddings.north+this.state.biddings.west+this.state.biddings.east+numPressed;
    };
    calcSumOfResults = (playerLocation, numPressed) => {
        if (playerLocation === 'north') return numPressed + this.state.results.west + this.state.results.east + this.state.results.south;
        else if (playerLocation === 'west') return this.state.results.north + numPressed + this.state.results.east + this.state.results.south;
        else if (playerLocation === 'east') return this.state.results.north + this.state.results.west + numPressed + this.state.results.south;
        else if (playerLocation === 'south') return this.state.results.north + this.state.results.west + this.state.results.east + numPressed;
    }
    calcUpDown = () => this.state.sumOfBiddings - 13;




    render() {
        console.log(this.state.sumOfBiddings)
        return (
            <View flex style={{backgroundColor: '#D3ED44'}}>

                {this.state.bid_notRes ?
                    <View>
                        <BiddingComponent points={this.state.points.north} bid={this.state.biddings.north} whenBidBtnPressed={this.whenBidBtnPressed} location={'north'} name={this.props.allNames.northName}/>
                        <View spread row>
                            <BiddingComponent points={this.state.points.west} bid={this.state.biddings.west} whenBidBtnPressed={this.whenBidBtnPressed} location={'west'}  name={this.props.allNames.westName}/>
                            <BiddingComponent points={this.state.points.east} bid={this.state.biddings.east} whenBidBtnPressed={this.whenBidBtnPressed} location={'east'}  name={this.props.allNames.eastName}/>
                        </View>
                        <BiddingComponent points={this.state.points.south} bid={this.state.biddings.south} whenBidBtnPressed={this.whenBidBtnPressed} location={'south'}  name={this.props.allNames.southName}/>
                    </View>
                    :
                    <View>
                        <ResultsComponent points={this.state.points.north} bid={this.state.biddings.north} res={this.state.results.north} whenResBtnPressed={this.whenResBtnPressed} location={'north'} name={this.props.allNames.northName}/>
                        <View spread row>
                            <ResultsComponent points={this.state.points.west} bid={this.state.biddings.west} res={this.state.results.west} whenResBtnPressed={this.whenResBtnPressed} location={'west'}  name={this.props.allNames.westName}/>
                            <ResultsComponent points={this.state.points.east} bid={this.state.biddings.east} res={this.state.results.east} whenResBtnPressed={this.whenResBtnPressed} location={'east'}  name={this.props.allNames.eastName}/>
                        </View>
                        <ResultsComponent points={this.state.points.south} bid={this.state.biddings.south} res={this.state.results.south} whenResBtnPressed={this.whenResBtnPressed} location={'south'}  name={this.props.allNames.southName}/>
                    </View>
                }

                <View row center>
                    <BidInfo bid_notRes={this.state.bid_notRes} sumOfBiddings={this.state.sumOfBiddings} sumOfResults={this.state.sumOfResults}/>
                    {/*{this.state.bid_notRes ? <ShapeInput/> : <RoundTrump trump={this.state.chosenTrump}/>}        */}
                    {this.state.bid_notRes ?
                        <ShapeInput chosenTrump={this.state.chosenTrump} whenShapePressed={this.whenShapePressed}></ShapeInput>
                        :
                        <RoundTrump trump={this.state.chosenTrump}/>
                    }
                    <ResInfo upDown={this.state.upDown} bid_notRes={this.state.bid_notRes} sumOfBiddings={this.state.sumOfBiddings} sumOfResults={this.state.sumOfResults}/>
                </View>

                <View centerH>
                    <Button
                        backgroundColor={Colors.yellow20}
                        label={this.state.bid_notRes ? `start round ${this.state.roundNumber}` : `end round ${this.state.roundNumber}`}
                        size="large"
                        borderRadius={5}
                        text60
                        labelStyle={{fontWeight: 'bold'}}
                        style={{width:290, height:100}}
                        // ref={element => (this.button_0 = element)}
                        onPress={() => this.changeRoundState()}
                    />
                </View>

                {/*<Text style={styles.text}>roundScreen</Text>*/}
                {/*<Text text40 red10 marginT-30>{this.props.somePropToPass}</Text>*/}
            </View>
        );
    }

    uploadAndUpdateScore() {

    }

    uploadBiddings() {

    }

}

export default RoundScreen;

