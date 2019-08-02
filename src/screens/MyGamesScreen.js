import React, {Component} from 'react';
import {FlatList, Alert} from 'react-native';
import {Text, View, Button, Assets, TouchableOpacity} from 'react-native-ui-lib';
import {whistStore} from "../stores/allGamesStore";
import {connect} from 'remx';

import {Navigation} from "react-native-navigation";

class MyGamesScreen extends Component {

    static propTypes = {};

    constructor(props) {
        super(props);
        Navigation.events().bindComponent(this);
        this.backBtnPressed.bind(this.backBtnPressed)

        this.state = {
            allGamesObj: [],
            roundsHistory: this.props.roundsHistory
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
                ]
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
        const allGames = whistStore.getAllGames()
        this.setState({allGamesObj: allGames})
        // allGamesActions.fetchWhistGame();
    }

    componentWillMount() {
        // this.props.allGamesObj = whistStore.getAllGames()
        // allGamesActions.fetchWhistGame();

        // this.setState({
        //     allGamesObj: whistStore.getAllGames()
        // })
    }



    render() {
        return (
            <View flex bg-yellow30 center>
                <Text>MY GAMES SCREEN</Text>
                <Text>{`allGamesObj:\n${this.state.allGamesObj}`}</Text>

            </View>
        );
    }
}


function mapStateToProps() {
    return {
        allGamesObj: whistStore.getAllGames()
    };
}

export default connect(mapStateToProps)(MyGamesScreen);
