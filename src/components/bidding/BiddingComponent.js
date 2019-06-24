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
        whenBidBtnPressed: PropTypes.func,
        bid:PropTypes.number,
        points: PropTypes.number,
        king: PropTypes.bool
    };

    render(){
        return (
            <View marginH-5 marginV-15 center>
                <NameLabel king={this.props.king} name={this.props.name} points={this.props.points}/>
                <BiddingButtons bid={this.props.bid} location={this.props.location} whenBidBtnPressed={this.props.whenBidBtnPressed}/>
            </View>
        )

    }
}
