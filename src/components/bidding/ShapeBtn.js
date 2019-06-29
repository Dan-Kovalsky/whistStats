import React, {Component} from 'react';
import {Text, Button} from 'react-native-ui-lib';

import PropTypes from 'prop-types';
import {SHAPE_BTN_COLORS as clr} from "../../constants/styles/Colors";


export default class ShapeBtn extends Component {

    static propTypes = {
        trump: PropTypes.number,
    };

    bgColor = () => {
        if (this.props.chosenTrump === this.props.shapeName){           //this button pressed
            return clr.PRESSED_BG;
        }
        return clr.UNPRESSED_BG;
    };
    fontSize = () => {
        if (this.props.chosenTrump === this.props.shapeName){           //this button pressed
            return 25;
        }
        return 12;
    };

    render(){
        return (
            <Button
                borderRadius={150}
                round
                style={{height:50, width:50, backgroundColor: this.bgColor()}}
                onPress={() => this.props.whenShapePressed(this.props.shapeName)}>
                <Text style={{fontSize:this.fontSize()}}>
                    {this.props.trumpEmoji}
                </Text>
            </Button>
        )
    }
}
