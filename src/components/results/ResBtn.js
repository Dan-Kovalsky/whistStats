import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Text, View, TextField,Colors, Button} from 'react-native-ui-lib';
import {WRONG_RES_BTN_PRS_BG, WRONG_RES_BTN_UN_PRS_BG, FIRST_RES_BTN_PRS_BG, FIRST_RES_BTN_UN_PRS_BG} from '../../constants/Styles'

import PropTypes from 'prop-types';


export default class ResBtn extends Component {

    static propTypes = {
        num: PropTypes.number,
        location: PropTypes.string,
        whenResBtnPressed: PropTypes.function,
        bid: PropTypes.number,
        res: PropTypes.number,

    };

    bgColor = () => {
        if (this.props.bid===this.props.num){       // True only for the first button
            if (this.props.res === this.props.bid) {  //True when the first Button clicked (by default)
                return FIRST_RES_BTN_PRS_BG;
            }
            return FIRST_RES_BTN_UN_PRS_BG;
        }              // All the other buttons
        if (this.props.res === this.props.num)            // This Button is clicked
            return WRONG_RES_BTN_PRS_BG;
        return WRONG_RES_BTN_UN_PRS_BG


    };

    render(){

        return (
            <Button
                backgroundColor={this.bgColor()}
                round
                label={this.props.num.toString()}
                size='xSmall'
                // borderRadius={40}
                text80
                labelStyle={{fontWeight: 'bold'}}
                style={{width:20, height:40}}
                // ref={element => (this.button_0 = element)}
                onPress={() => this.props.whenResBtnPressed(this.props.location, this.props.num)}
            />
        )

    }
}
