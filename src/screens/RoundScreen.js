import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Text, View, Button, Colors, Assets, RadioGroup, RadioButton,TextField} from 'react-native-ui-lib';

import PropTypes from 'prop-types';
import {Navigation} from 'react-native-navigation';
import ShapeInput from '../components/Bidding/ShapeInput'
import RoundTrump from '../components/Bidding/RoundTrump'


import NameInput from "../components/NameInput";
import NameLabel from '../components/Bidding/NameLabel'
import BiddingComponent from "../components/Bidding/BiddingComponent";
import BidBtn from "../components/Bidding/BidBtn";



class RoundScreen extends Component {

    static propTypes = {
        componentId: PropTypes.string,
        somePropToPass: PropTypes.string,
        allNames: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.state = {
            roundNumber: '1',
            bid_notScore: true,
            sumOfBiddings: 0,
            sumOfResults: 0,
            chosenTrump: "",
            biddings: {
                north: 0,
                south: 0,
                west: 0,
                east: 0
            }

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
                            somePropToPass: 'Some props - Table from DB'                        },
                        options: {
                            // topBar: {
                            //     title: {
                            //         text: 'Title not Static'
                            //     }
                            // }
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
                    text: `round 1 Bidding`
                }
            }

        };
    }

    navigationButtonPressed({buttonId}) {
        this.pushTableScreen();
    }

    changeRoundState = () => {      // this func checks if the Button click is legal and change state if so
        if(this.state.bid_notScore){      //we are on the screen of the bidding
            if (true === true) {             //todo all bids are set, and trump chosen.
                if (this.state.sumOfBiddings === 13) {          //todo increase sumOfBiddings and zero it when round end
                    alert('Sum of Biddings cannot be 13');
                } else {
                    this.setState({bid_notScore: false});
                }
            } else {
                alert('please set all biding and choose trump');
            };
        } else {                        // bid_notScore is false, so we want to end a round
            if (true === true) {         //todo all results are chosen
                if(this.state.sumOfResults !== 13) {
                    alert('Sum of results must be 13');
                } else
                alert('please insert results for all players');
            } else {
                this.setState({bid_notScore: true});
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
        this.setState({biddings: newBiddingState})
        // alert('The player on the '+playerLocation+' side pressed on '+numPressed+'\nsum of biddings = '+(this.calcSumOfBiddings()+numPressed-this.state.biddings[playerLocation]))

    }

    calcSumOfBiddings = () =>this.state.biddings.north+this.state.biddings.west+this.state.biddings.east+this.state.biddings.south;




    render() {
        return (
            <View flex style={{backgroundColor: '#D3ED44',}}>

                {/*<RadioGroup*/}
                {/*    value={this.state.biddings.north}*/}
                {/*    onValueChange={value => this.setState({*/}
                {/*        biddings: {*/}
                {/*            north:value,*/}
                {/*            south: this.state.biddings.south,*/}
                {/*            west: this.state.biddings.west,*/}
                {/*            east: this.state.biddings.east*/}
                {/*        }*/}
                {/*}*/}
                {/*)}>*/}
                {/*    <NameLabel name={this.props.allNames.northName}/>*/}
                {/*    <View row bg-red70 style={{height:40, width:165}}>*/}
                {/*        <View center>*/}
                {/*            <RadioButton value={0} size={20} color={Colors.green30} borderRadius={0}/>*/}
                {/*            <Text>0</Text>*/}
                {/*        </View>*/}
                {/*        <View center>*/}
                {/*            <RadioButton value={1} size={20} color={Colors.green30} borderRadius={0}/>*/}
                {/*            <Text>1</Text>*/}
                {/*        </View>*/}
                {/*        <View center>*/}
                {/*            <RadioButton value={2} size={20} color={Colors.green30} borderRadius={0}/>*/}
                {/*            <Text>2</Text>*/}
                {/*        </View>*/}
                {/*        <View center>*/}
                {/*            <RadioButton value={3} size={20} color={Colors.green30} borderRadius={0}/>*/}
                {/*            <Text>3</Text>*/}
                {/*        </View>*/}
                {/*        <View center>*/}
                {/*            <RadioButton value={4} size={20} color={Colors.green30} borderRadius={0}/>*/}
                {/*            <Text>4</Text>*/}
                {/*        </View>*/}
                {/*        <View center>*/}
                {/*            <RadioButton value={5} size={20} color={Colors.green30} borderRadius={0}/>*/}
                {/*            <Text>5</Text>*/}
                {/*        </View>*/}
                {/*        <View center>*/}
                {/*            <RadioButton value={6} size={20} color={Colors.green30} borderRadius={0}/>*/}
                {/*            <Text>6</Text>*/}
                {/*        </View>*/}
                {/*        <View center>*/}
                {/*            <RadioButton value={7} size={20} color={Colors.green30} borderRadius={0}/>*/}
                {/*            <TextField*/}
                {/*                centered*/}
                {/*                text90*/}
                {/*                containerStyle={{height:18, width:18}}*/}
                {/*                placeholder={'7'}*/}
                {/*                onChangeText={this.props.onChangeText}*/}
                {/*            />*/}
                {/*        </View>*/}
                {/*    </View>*/}
                {/*</RadioGroup>*/}


                <BiddingComponent bid={this.state.biddings.north} whenBidBtnPressed={this.whenBidBtnPressed} location={'north'} name={this.props.allNames.northName}/>
                <View spread row>
                    <BiddingComponent bid={this.state.biddings.west} whenBidBtnPressed={this.whenBidBtnPressed} location={'west'}  name={this.props.allNames.westName}/>
                    <BiddingComponent bid={this.state.biddings.east} whenBidBtnPressed={this.whenBidBtnPressed} location={'east'}  name={this.props.allNames.eastName}/>
                </View>
                <BiddingComponent bid={this.state.biddings.south} whenBidBtnPressed={this.whenBidBtnPressed} location={'south'}  name={this.props.allNames.southName}/>

                {/*{this.state.bid_notScore ? <ShapeInput/> : <RoundTrump trump={this.state.chosenTrump}/>}        */}
                {/*//TODO define chosenTrump*/}
                {this.state.bid_notScore ? <ShapeInput chosenTrump={this.state.chosenTrump} whenShapePressed={this.whenShapePressed}/> : <RoundTrump trump={this.state.chosenTrump}/>}

                <View centerH>
                    <Button
                        backgroundColor={Colors.yellow20}
                        label={this.state.bid_notScore ? `start round ${this.state.roundNumber}` : `end round ${this.state.roundNumber}`}
                        size="large"
                        borderRadius={5}
                        text60
                        labelStyle={{fontWeight: 'bold'}}
                        style={{width:290, height:100}}
                        ref={element => (this.button_0 = element)}
                        onPress={() => this.changeRoundState(this.button_4)}
                    />
                </View>

                {/*<Text style={styles.text}>roundScreen</Text>*/}
                {/*<Text text40 red10 marginT-30>{this.props.somePropToPass}</Text>*/}
            </View>
        );
    }
}

export default RoundScreen;

