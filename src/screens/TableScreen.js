import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Text, View} from 'react-native-ui-lib';

import {Navigation} from "react-native-navigation";
import PropTypes from 'prop-types';

import {connect} from 'remx';
import {whistStore} from './../stores/allGamesStore'
import * as allGamesActions from './../actions/allGamesActions'

class TableScreen extends Component {

    static propTypes = {
        componentId: PropTypes.string,
        somePropToPass: PropTypes.string,
        allGamesObj: PropTypes.object
    };

    constructor(props) {
        super(props);
        Navigation.events().bindComponent(this);
        this.backToGameScreen.bind(this.backToGameScreen)

        this.state = {
            // allGamesObj : whistStore.getAllGames()
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
                    {
                        id: 'anotherButton',
                        text: 'another'
                    }
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


    render() {
        let gamesLst = this.state.allGamesObj.games
        return (
            <View style={styles.container}>
                <Text style={styles.text}>TableScreen</Text>
                <Text marginT-80 grey10>{this.props.somePropToPass}</Text>

                <Text>all Games</Text>
                <Text>{JSON.stringify(this.props.allGamesObj)}</Text>
                <Text>firstGame First Round</Text>
                <Text>{JSON.stringify(gamesLst[0].rounds[0])}</Text>



                <Text>Second Round</Text>


            </View>
        );
    }
}

// export default TableScreen;

function mapStateToProps() {
    return {
        allGamesObj: whistStore.getAllGames()
    };
}

export default connect(mapStateToProps)(TableScreen);



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1111FF',
    },
    text: {
        fontSize: 28,
        textAlign: 'center',
        margin: 10,
    }
});
