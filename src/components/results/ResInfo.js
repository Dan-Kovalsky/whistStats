import React, {Component} from 'react';
import {Text, View, TextField,Colors, Button} from 'react-native-ui-lib';

import PropTypes from 'prop-types';


export default class ResInfo extends Component {

    static propTypes = {
        bid_notRes: PropTypes.boolean,
        sumOfBiddings: PropTypes.number,
        sumOfResults:PropTypes.number,
        upDown: PropTypes.number
    };

    render(){
        const abs = Math.abs(this.props.upDown)

        return (
            !this.props.bid_notRes ?
                <View centerV style={{height: 50, width: 90, borderColor:'black', borderWidth:1}}>
                    <Text marginL-10>{this.props.upDown > 0 ? 'Up ' + abs : 'Down ' + abs}</Text>
                    <Text marginL-10>{this.props.sumOfResults}</Text>
                </View>
                :
                <View centerV style={{height: 50, width: 90}}/>
        )
    }
}
