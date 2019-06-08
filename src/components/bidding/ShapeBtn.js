import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Text, View, TextField,Colors, Button} from 'react-native-ui-lib';

import PropTypes from 'prop-types';


export default class ShapeBtn extends Component {

    static propTypes = {
        trump: PropTypes.number,
    };

    render(){

        return (
            this.props.chosenTrump === this.props.shapeName
                ?
                <Button
                    bg-violet40
                    borderRadius={15}
                    round
                    style={{height:50, width:50}}
                    onPress={() => this.props.whenShapePressed(this.props.shapeName)}>
                    {/*onPress={() => alert('spade')}>*/}
                    <Text>
                        {this.props.trumpEmoji}
                    </Text>
                </Button>
                :
                <Button
                    bg-violet60
                    borderRadius={15}
                    round
                    style={{height:50, width:50}}
                    onPress={() => this.props.whenShapePressed(this.props.shapeName)}>
                    {/*onPress={() => alert('spade')}>*/}
                    <Text>
                        {this.props.trumpEmoji}
                    </Text>
                </Button>

        )

    }
}
