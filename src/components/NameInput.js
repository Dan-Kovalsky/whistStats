import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Text, View, TextField,Colors} from 'react-native-ui-lib';
import {NAME_INPUT_COLORS as clr, NEW_GAME_SCREEN_BG} from "../constants/styles/Colors";

export default class NameInput extends Component {

    render(){
        return (
            <View marginH-5 marginV-15 center >
                <TextField
                    color={clr.TEXT}
                    centered
                    text60
                    containerStyle={{margin:2, height:80, width:160, backgroundColor: clr.BG, borderColor:clr.FRAME, borderWidth:1}}
                    floatingPlaceholder
                    placeholderTextColor={clr.PLACE_HOLDER_TEXT}
                    floatingPlaceholderColor={Colors.yellow10}


                    placeholder={this.props.position}
                    onChangeText={this.props.onChangeText}

                    underlineColor={{focus: clr.UNDER_LINE_FOCUS}}

                />

            </View>
        )

    }
}
