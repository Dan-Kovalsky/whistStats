import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Text, View, TextField,Colors, Button} from 'react-native-ui-lib';
import BidBtn from "./BidBtn";
import PropTypes from 'prop-types'

export default class BiddingButtons extends Component {


    static propTypes = {
        location: PropTypes.string,
        whenBidBtnPressed: PropTypes.function,
        bid: PropTypes.number
    };


    render(){
        return (
            <View row bg-red70 style={{height:40, width:165}}>
                <BidBtn bid={this.props.bid} location={this.props.location} whenBidBtnPressed={this.props.whenBidBtnPressed} num={0}/>
                <BidBtn bid={this.props.bid} location={this.props.location} whenBidBtnPressed={this.props.whenBidBtnPressed} num={1}/>
                <BidBtn bid={this.props.bid} location={this.props.location} whenBidBtnPressed={this.props.whenBidBtnPressed} num={2}/>
                <BidBtn bid={this.props.bid} location={this.props.location} whenBidBtnPressed={this.props.whenBidBtnPressed} num={3}/>
                <BidBtn bid={this.props.bid} location={this.props.location} whenBidBtnPressed={this.props.whenBidBtnPressed} num={4}/>
                <BidBtn bid={this.props.bid} location={this.props.location} whenBidBtnPressed={this.props.whenBidBtnPressed} num={5}/>
                <BidBtn bid={this.props.bid} location={this.props.location} whenBidBtnPressed={this.props.whenBidBtnPressed} num={6}/>
                <TextField
                    centered
                    text90
                    containerStyle={{height:40, width:25, backgroundColor: Colors.orange60}}
                    placeholder={'^'}
                    onChangeText={this.props.onChangeText}

                />
            </View>
        )

    }
}
