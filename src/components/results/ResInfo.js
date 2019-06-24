import React, {Component} from 'react';
import {Text, View, TextField,Colors, Button} from 'react-native-ui-lib';
import {BID_RES_INFO_COLORS as clr} from "../../constants/styles/Colors";

import PropTypes from 'prop-types';


export default class ResInfo extends Component {

    static propTypes = {
        bid_notRes: PropTypes.bool,
        sumOfBiddings: PropTypes.number,
        sumOfResults:PropTypes.number,
        upDown: PropTypes.number
    };

    render(){
        const abs = Math.abs(this.props.upDown)

        return (
            !this.props.bid_notRes ?
                <View centerV style={{height: 50, width: 90, borderColor:clr.BORDER, borderWidth:1, backgroundColor:clr.BG}}>
                    <Text center style={{fontSize:17, color:clr.TEXT}}>{`${this.props.upDown > 0 ? 'Up': 'Down'} ${abs}`}</Text>
                    <Text center style={{fontSize:17, color:clr.TEXT}}>{this.props.sumOfResults}</Text>
                </View>
                :
                <View centerV style={{height: 50, width: 90}}/>
        )
    }
}
