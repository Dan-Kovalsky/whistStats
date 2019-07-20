import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Text, View, TextField, Colors,TextArea, Image, Assets} from 'react-native-ui-lib';

import NameInput from './../components/NameInput'
import NameLabel from '../components/bidding/NameLabel'
import BiddingButtons from '../components/bidding/BiddingButtons'
import BiddingComponent from '../components/bidding/BiddingComponent'

import PropTypes from 'prop-types';
import {Navigation} from 'react-native-navigation';
import BidBtn from "../components/bidding/BidBtn";
import RoundTrump from "../components/results/RoundTrump";
import AsyncStorage from '@react-native-community/async-storage';
import {NEW_GAME_SCREEN_BG} from "../constants/styles/Colors";

import {whistStore} from "../stores/allGamesStore";


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

    componentDidMount(){
        whistStore.loadGamesHistory()
        AsyncStorage.getItem('@WhistStats:NewGameScreen:southName')
            .then(name => {
                this.setState({names:{...this.state.names, southName: name}})
            })
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
            },
            fab: {
                id: 'add',
                // icon: Assets.icons.general.search,
                backgroundColor: 'blue',
                testID: "SOME TEST ID",
                iconColor: 'white',
            }
        };
    }

    navigationButtonPressed({buttonId}) {
        this.saveNorthName();
        this.pushRoundScreen();
    }

    saveNorthName = () => {
        AsyncStorage.setItem(
            '@WhistStats:NewGameScreen:southName',
            this.state.names.southName,
        )
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
            <View flex style={{backgroundColor: NEW_GAME_SCREEN_BG}}>
                <NameInput text={this.state.names.northName} position='north' onChangeText={this.onNChanged}/>
                <View spread row>
                    <NameInput text={this.state.names.westName} position='west' onChangeText={this.onWChanged}/>
                    <NameInput text={this.state.names.eastName} position='east' onChangeText={this.onEChanged}/>
                </View>
                <NameInput text={this.state.names.southName} position='south' onChangeText={this.onSChanged}/>
            </View>
        );
    }
}

export default NewGameScreen;

