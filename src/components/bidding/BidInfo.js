import React, {Component} from 'react';
import {Text, View} from 'react-native-ui-lib';
import {BID_RES_INFO_COLORS as clr} from "../../constants/styles/Colors";

import PropTypes from 'prop-types';


export default class BidInfo extends Component {

    static propTypes = {
        bid_notRes: PropTypes.bool,
        sumOfBiddings: PropTypes.number,
        sumOfResults:PropTypes.number
    };



    render(){

        return (
            this.props.bid_notRes ?
                <View centerV style={{height: 50, width: 90, borderColor:clr.BORDER, borderWidth:1, backgroundColor:clr.BG}}>
                    <Text center style={{fontSize:20, color:clr.TEXT}}>{this.props.sumOfBiddings}</Text>
                </View>
                :
                <View centerV style={{height: 50, width: 90}}/>
        )
    }
}
