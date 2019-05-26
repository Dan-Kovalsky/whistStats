import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Text, View, TextField,Colors} from 'react-native-ui-lib';
import PropTypes from 'prop-types'

export default class NameField extends Component {

    static propTypes = {
        name: PropTypes.string
    };

    render(){
        return (
            <View center bg-red70 style={{height:40, width:165}}>
                <Text text60 uppercase>
                    {this.props.name}
                </Text>
            </View>
        )

    }
}
