import React, {Component} from 'react';
import {Text, View, TextField, Colors, Button} from 'react-native-ui-lib';
import ResBtn from "./ResBtn";
import PropTypes from 'prop-types';
import {BID_RES_COMPONENT_BG, RESULST_BTN_COLORS as clr} from '../../constants/styles/Colors';

export default class ResultsButtons extends Component {

    getResLst = () => {
        let bid = this.props.bid;
        if (bid <= 3) return [0,1,2,3,4,5,6]
        if (bid >= 10) return [7,8,9,10,11,12,13]
        return [bid-3,bid-2,bid-1,bid,bid+1,bid+2,bid+3]
    };
    //
    // getResLst = () => {
    //     let bid = this.props.bid;
    //     switch (bid) {
    //         case 0:
    //             return [0,1,2,3,4,5,6];
    //         case 1:
    //             return [1,0,2,3,4,5,6];
    //         case 2:
    //             return [2,1,3,0,4,5,6]
    //         case 13:
    //             return [13,12,11,10,9,8,7];
    //         case 12:
    //             return [12,11,13,10,9,8,7];
    //         case 11:
    //             return [11,10,12,9,13,8,7]
    //         default: {
    //             return [bid, bid-1, bid+1, bid-2, bid+2, bid-3, bid+3]
    //         }
    //     }
    // };

    constructor(props) {
        super(props);
        this.state = {
            textVal: "",
            btnValLst: this.getResLst()
        };
    }


    static propTypes = {
        location: PropTypes.string,
        whenResBtnPressed: PropTypes.func,
        res: PropTypes.number,
        bid:PropTypes.number
    };

    bgColor = () => {
        if (this.state.btnValLst.includes(this.props.res)) {
            return clr.FAIL_UNPRESSED_BG;
        }
        return clr.FAIL_PRESSED_BG;
    };

    onChangeText = (text) => {
        this.setState({textVal:text})
        this.props.whenResBtnPressed(this.props.location, Number(text))
    }

    render(){
        return (
            <View row bg-red70 style={{height:40, width:165, backgroundColor: BID_RES_COMPONENT_BG}}>
                <ResBtn bid={this.props.bid} res={this.props.res} location={this.props.location} whenResBtnPressed={this.props.whenResBtnPressed} num={this.state.btnValLst[0]}/>
                <ResBtn bid={this.props.bid} res={this.props.res} location={this.props.location} whenResBtnPressed={this.props.whenResBtnPressed} num={this.state.btnValLst[1]}/>
                <ResBtn bid={this.props.bid} res={this.props.res} location={this.props.location} whenResBtnPressed={this.props.whenResBtnPressed} num={this.state.btnValLst[2]}/>
                <ResBtn bid={this.props.bid} res={this.props.res} location={this.props.location} whenResBtnPressed={this.props.whenResBtnPressed} num={this.state.btnValLst[3]}/>
                <ResBtn bid={this.props.bid} res={this.props.res} location={this.props.location} whenResBtnPressed={this.props.whenResBtnPressed} num={this.state.btnValLst[4]}/>
                <ResBtn bid={this.props.bid} res={this.props.res} location={this.props.location} whenResBtnPressed={this.props.whenResBtnPressed} num={this.state.btnValLst[5]}/>
                <ResBtn bid={this.props.bid} res={this.props.res} location={this.props.location} whenResBtnPressed={this.props.whenResBtnPressed} num={this.state.btnValLst[6]}/>
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
