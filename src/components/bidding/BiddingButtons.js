import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Text, View, TextField, Colors, Button} from 'react-native-ui-lib';
import BidBtn from "./BidBtn";
import PropTypes from 'prop-types'
import {BID_BTN_PRS_BG, BID_BTN_UN_PRS_BG} from '../../constants/Styles'

export default class BiddingButtons extends Component {

    constructor(props) {
        super(props);

        this.state = {
            textVal:""
        };
    }


    static propTypes = {
        location: PropTypes.string,
        whenBidBtnPressed: PropTypes.function,
        bid: PropTypes.number
    };

    bgColor = () => {
        if (this.props.bid > 6 && this.props.bid < 14) {
            return BID_BTN_PRS_BG;
        }
        return BID_BTN_UN_PRS_BG;
    };

    onChangeText = (text) => {
        this.setState({textVal:text})
        this.props.whenBidBtnPressed(this.props.location, Number(text))
    }

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
                    containerStyle={{height:40, width:25, backgroundColor: this.bgColor()}}
                    placeholder={'*'}
                    value={this.state.textVal}
                    onChangeText={this.onChangeText}
                    keyboardType={"number-pad"}
                />
            </View>
        )

    }
}
