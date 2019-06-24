import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Text, View, TextField, Colors, Button} from 'react-native-ui-lib';
import BidBtn from "./BidBtn";
import PropTypes from 'prop-types'
import {BID_BTN_COLORS as clr, BID_RES_COMPONENT_BG} from '../../constants/styles/Colors'

export default class BiddingButtons extends Component {

    constructor(props) {
        super(props);

        this.state = {
            textVal:""
        };
    }


    static propTypes = {
        location: PropTypes.string,
        whenBidBtnPressed: PropTypes.func,
        bid: PropTypes.number
    };

    bgColor = () => {
        if (this.props.bid > 6 && this.props.bid < 14) {
            return clr.PRESSED_BG;
        }
        return clr.UNPRESSED_BG;
    };

    onChangeText = (text) => {
        this.setState({textVal:text})
        this.props.whenBidBtnPressed(this.props.location, Number(text))
    }

    render(){
        return (
            <View row style={{height:40, width:165, backgroundColor: BID_RES_COMPONENT_BG}}>
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
                    titleColor={clr.TEXT}
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
