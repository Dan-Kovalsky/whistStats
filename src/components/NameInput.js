import React, {Component} from 'react';
import {View, TextField} from 'react-native-ui-lib';
import {NAME_INPUT_COLORS as clr} from "../constants/styles/Colors";
import PropTypes from 'prop-types';

export default class NameInput extends Component {

    static propTypes = {
        text: PropTypes.string,
        position: PropTypes.string,
        onChangeText: PropTypes.func,
        errorMsg: PropTypes.string
    };

    render(){
        return (
            <View marginH-5 marginV-5 center >
                <TextField
                    color={clr.TEXT}
                    centered
                    text60
                    containerStyle={{ height:55, width:140, backgroundColor: clr.BG, borderColor:clr.FRAME, borderWidth:0}}
                    value={this.props.text}
                    placeholder={this.props.position}
                    onChangeText={this.props.onChangeText}
                    underlineColor={{focus: clr.UNDER_LINE_FOCUS}}
                    maxLength={9}
                    showCharacterCounter
                    error={this.props.errorMsg}
                />
            </View>
        )
    }
}
