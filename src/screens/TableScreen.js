import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Text, View} from 'react-native-ui-lib';

import {Navigation} from "react-native-navigation";
import PropTypes from 'prop-types';

class TableScreen extends Component {

    static propTypes = {
        componentId: PropTypes.string,
        somePropToPass: PropTypes.string
    };

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

    constructor(props) {
        super(props);
        Navigation.events().bindComponent(this);
        this.backToGameScreen.bind(this.backToGameScreen)
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
        return (
            <View style={styles.container}>
                <Text style={styles.text}>TableScreen</Text>
                <Text marginT-80 grey10>{this.props.somePropToPass}</Text>
            </View>
        );
    }
}

export default TableScreen;

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
