import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Text, View, TextField, Colors} from 'react-native-ui-lib';
import PropTypes from 'prop-types'

export default class NameField extends Component {

    static propTypes = {
        name: PropTypes.string,
        points: PropTypes.number
    };

    getScoreColor = () => this.props.points < 0 ? Colors.red20 : this.props.points > 0 ? Colors.green20 : Colors.black;

    render(){
        return (
            <View spread centerV row bg-red70 padding-5 style={{height:40, width:165}}>
                <Text text60 uppercase>
                    {this.props.name}
                </Text>
                <Text text70 style={{fontWeight: 'bold', color: this.getScoreColor()}}>
                    {this.props.points}
                </Text>
            </View>
        )

    }
}
