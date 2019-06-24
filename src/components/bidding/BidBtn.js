import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Text, View, TextField,Colors, Button} from 'react-native-ui-lib';
import {BID_BTN_COLORS as clr} from '../../constants/styles/Colors'

import PropTypes from 'prop-types';

export default class BidBtn extends Component {

    static propTypes = {
        num: PropTypes.number,
        location: PropTypes.string,
        whenBidBtnPressed: PropTypes.func,
        bid: PropTypes.number,
    };

    bgColor = () => {
        if (this.props.bid===this.props.num){           //this button pressed
            return clr.PRESSED_BG;
        }
        return clr.UNPRESSED_BG;

    };

    render(){

        return (
            <Button
                backgroundColor={this.bgColor()}
                color={clr.TEXT}
                round
                label={this.props.num.toString()}
                size='xSmall'
                // borderRadius={40}
                text80
                labelStyle={{fontWeight: 'bold'}}
                style={{width:20, height:40}}
                onPress={() => this.props.whenBidBtnPressed(this.props.location, this.props.num)}
            />
        )

    }
}
