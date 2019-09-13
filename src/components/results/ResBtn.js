import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Text, View, TextField,Colors, Button} from 'react-native-ui-lib';
import {RESULST_BTN_COLORS as clr} from '../../constants/styles/Colors'

import PropTypes from 'prop-types';


export default class ResBtn extends Component {

    static propTypes = {
        num: PropTypes.number,
        location: PropTypes.string,
        whenResBtnPressed: PropTypes.func,
        bid: PropTypes.number,
        res: PropTypes.number,

    };

    bgColor = () => {
        if (this.props.bid===this.props.num){       // True only for the first button
            if (this.props.res === this.props.bid) {  //True when the first Button clicked (by default)
                return clr.STAND_PRESSED_BG;
            }
            return clr.STAND_UNPRESSED_BG;
        }              // All the other buttons
        if (this.props.res === this.props.num)            // This Button is clicked
            return clr.FAIL_PRESSED_BG;
        return clr.FAIL_UNPRESSED_BG
    };

    render(){

        if (this.props.num < 10) {
            return (
                <Button
                    backgroundColor={this.bgColor()}
                    color={clr.TEXT}
                    round
                    label={this.props.num.toString()}
                    size='xSmall'
                    text70
                    labelStyle={{fontWeight: 'bold'}}
                    style={{width: 20, height: 40}}
                    // ref={element => (this.button_0 = element)}
                    onPress={() => this.props.whenResBtnPressed(this.props.location, this.props.num)}
                />
            )
        }
        //todo change uilib typography.text90.fontSize -> ios from 13 to 12
        return (
            <Button
                backgroundColor={this.bgColor()}
                color={clr.TEXT}
                round
                label={this.props.num.toString()}
                size='xSmall'
                text90
                labelStyle={{fontWeight: 'bold', fontSize: 11}}
                style={{width:20, height:40}}
                // ref={element => (this.button_0 = element)}
                onPress={() => this.props.whenResBtnPressed(this.props.location, this.props.num)}
            />
        )


    }
}
