import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Text, View, TextField,Colors} from 'react-native-ui-lib';
import {NAME_INPUT_COLORS as clr, NEW_GAME_SCREEN_BG} from "../constants/styles/Colors";
import PropTypes from 'prop-types';

export default class NameInput extends Component {

    static propTypes = {
        text: PropTypes.string,
        position: PropTypes.string,
        onChangeText: PropTypes.func
    };

    render(){
        return (
            <View marginH-5 marginV-15 center >
                <TextField
                    color={clr.TEXT}
                    centered
                    text60
                    containerStyle={{margin:2, height:80, width:160, backgroundColor: clr.BG, borderColor:clr.FRAME, borderWidth:0}}
                    floatingPlaceholder
                    placeholderTextColor={clr.PLACE_HOLDER_TEXT}
                    floatingPlaceholderColor={Colors.yellow10}
                    value={this.props.text}
                    placeholder={this.props.position}
                    onChangeText={this.props.onChangeText}

                    underlineColor={{focus: clr.UNDER_LINE_FOCUS}}

                />

            </View>
        )

    }
}
