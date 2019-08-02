import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Text, View, TextField,Colors, Button, Assets, Image} from 'react-native-ui-lib';
import BidBtn from "../bidding/BidBtn";
import ShapeBtn from "../bidding/ShapeBtn";

import PropTypes from 'prop-types';



export default class RoundTrump extends Component {

    static propTypes = {
        trump: PropTypes.string
    };

    getTrumpLogo = () => {
        switch (this.props.trump) {
            case ('spades'):
                return require('../../assets/spades.png');
            case ('hearts'):
                return require('../../assets/hearts.png');
            case ('clubs'):
                return require('../../assets/clubs.png');
            case ('diamonds'):
                return require('../../assets/diamonds.png');
        }
    };

    render(){
        return (
            <View margin-10 center>
                <Image
                    style={{height:100, width:100}}
                    source={this.getTrumpLogo()}
                />
            </View>
        )

    }
}
