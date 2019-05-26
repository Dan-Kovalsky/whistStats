import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Text, View, TextField,Colors} from 'react-native-ui-lib';
import PropTypes from 'prop-types'
import NameLabel from './NameLabel'
import BiddingButtons from './BiddingButtons'
import NameInput from "../NameInput";

export default class BiddingComponent extends Component {

    static propTypes = {
        name: PropTypes.string,
        location: PropTypes.string,
        whenBidBtnPressed: PropTypes.function,
        bid:PropTypes.number
    };

    render(){
        return (
            <View margin-10 center>
                <NameLabel name={this.props.name}/>
                <BiddingButtons bid={this.props.bid} location={this.props.location} whenBidBtnPressed={this.props.whenBidBtnPressed}/>
            </View>
        )

    }
}
