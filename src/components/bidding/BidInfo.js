import React, {Component} from 'react';
import {Text, View, TextField,Colors, Button} from 'react-native-ui-lib';

import PropTypes from 'prop-types';


export default class BidInfo extends Component {

    static propTypes = {
        bid_notRes: PropTypes.boolean,
        sumOfBiddings: PropTypes.number,
        sumOfResults:PropTypes.number
    };



    render(){

        return (
            this.props.bid_notRes ?
                <View centerV style={{height: 50, width: 90, borderColor:'black', borderWidth:1}}>
                    <Text center>{this.props.sumOfBiddings}</Text>
                </View>
                :
                <View centerV style={{height: 50, width: 90}}/>
        )
    }
}
