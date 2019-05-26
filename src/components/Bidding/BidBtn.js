import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Text, View, TextField,Colors, Button} from 'react-native-ui-lib';

import PropTypes from 'prop-types';


export default class BidBtn extends Component {

    static propTypes = {
        num: PropTypes.number,
        location: PropTypes.string,
        whenBidBtnPressed: PropTypes.function,
        bid: PropTypes.function
    };

    bgColor = () => {
        if (this.props.bid===this.props.num){
            return Colors.orange50;
        }
        return Colors.orange60;

        // switch (this.props.num) {
        //     case 0:
        //         return Colors.orange60;
        //     case 1:
        //         return Colors.orange60;
        //     case 2:
        //         return Colors.orange50;
        //     case 3:
        //         return Colors.orange60;
        //     case 4:
        //         return Colors.orange60;
        //     case 5:
        //         return Colors.orange60;
        //     case 6:
        //         return Colors.orange60;
        // }
    };

    render(){

        return (
            <Button
                backgroundColor={this.bgColor()}
                round
                label={this.props.num.toString()}
                size='small'
                borderRadius={40}
                text80
                labelStyle={{fontWeight: 'bold'}}
                style={{width:20, height:40}}
                ref={element => (this.button_0 = element)}
                onPress={() => this.props.whenBidBtnPressed(this.props.location, this.props.num)}
            />
        )

    }
}
