import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Text, View, TextField, Colors,TextArea, Image} from 'react-native-ui-lib';

import NameInput from './../components/NameInput'
import NameLabel from '../components/Bidding/NameLabel'
import BiddingButtons from '../components/Bidding/BiddingButtons'
import BiddingComponent from '../components/Bidding/BiddingComponent'

import PropTypes from 'prop-types';
import {Navigation} from 'react-native-navigation';
import BidBtn from "../components/Bidding/BidBtn";
import RoundTrump from "../components/Bidding/RoundTrump";

class NewGameScreen extends Component {


    static propTypes = {
        componentId: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.state = {
            names: {
                northName: '',
                southName: '',
                eastName: '',
                westName: ''
            }
        };

        Navigation.events().bindComponent(this);

        this.pushRoundScreen = this.pushRoundScreen.bind(this);
        this.enableStartBtn = this.enableStartBtn.bind(this);
    }

    pushRoundScreen() {
        Navigation.push(this.props.componentId, {
            component: {
                name: 'whistStats.RoundScreen',
                passProps: {
                    somePropToPass: 'Some props that we are passing - all the names',
                    allNames: this.state.names
                }
            }
        });
    }

    static get options() {
        return {
            topBar: {
                rightButtons: [
                    {
                        id: 'roundScreen',
                        text: 'Start',
                        enabled: !false     //TODO DELETE '!'
                    }
                ]
            }
        };
    }

    navigationButtonPressed({buttonId}) {
        this.pushRoundScreen();
    }

    onNChanged = name => {
        this.setState({names:{...this.state.names, northName: name}})
        // this.setState({...this.state.names, names:{...this.state.names, northName: name}})
        this.enableStartBtn(name)

    }
    onSChanged = name => {
        this.setState({names: {...this.state.names, southName: name}})
        this.enableStartBtn(name)

    }
    onWChanged = name => {
        this.setState({names: {...this.state.names, westName: name}})
        this.enableStartBtn(name)

    }
    onEChanged = name => {
        this.setState({names: {...this.state.names, eastName: name}})
        this.enableStartBtn(name)
    }
    enableStartBtn(name) {
        Navigation.mergeOptions(this.props.componentId, {
            topBar: {
                rightButtons: [{
                    id: 'roundScreen',
                    text: 'Start',
                    // enabled: this.isAllNamesFill
                    // enabled: true
                    enabled: !!name && !!this.state.names.northName &&  !!this.state.names.southName &&  !!this.state.names.eastName &&  !!this.state.names.westName
                }]
            }
        });
    }



    render() {
        return (
            <View flex>
                <View flex center bg-cyan10>
                    <NameInput position='north' onChangeText={this.onNChanged}/>
                    <View row>
                        <NameInput position='west' onChangeText={this.onWChanged}/>
                        <NameInput position='east' onChangeText={this.onEChanged}/>
                    </View>
                    <NameInput position='south' onChangeText={this.onSChanged}/>
                </View>
                {/*<View flex center bg-blue30>*/}
                {/*    /!*<BiddingComponent name={this.state.names.northName}/>*!/*/}
                {/*    /!*<OneBtn num={6}/>*!/*/}
                {/*    /!*<BiddingButtons/>*!/*/}
                {/*    /!*<NameLabel name={this.state.names.northName}/>*!/*/}
                {/*    <RoundTrump trump='diamonds'/>*/}

                {/*</View>*/}


            </View>
        );
    }
}

export default NewGameScreen;

