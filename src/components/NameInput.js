import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Text, View, TextField,Colors} from 'react-native-ui-lib';

export default class NameInput extends Component {

    render(){
        return (
            <View bg-red20 margin-20 style={{height:54, width:150}}>
                <TextField
                    centered
                    text80
                    containerStyle={{margin:2, height:50, backgroundColor: 'pink'}}
                    floatingPlaceholder
                    placeholderTextColor={Colors.cyan30}
                    floatingPlaceholderColor={Colors.cyan10}


                    placeholder={this.props.position}
                    onChangeText={this.props.onChangeText}

                    underlineColor={{focus: Colors.purple50}}

                />

            </View>
        )

    }
}
