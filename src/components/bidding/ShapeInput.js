import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Text, View, TextField,Colors, Button, Assets} from 'react-native-ui-lib';
import BidBtn from "./BidBtn";
import ShapeBtn from "./ShapeBtn";

export default class ShapeInput extends Component {

    render(){
        return (
            <View margin-20>
                <View center row>
                    <ShapeBtn chosenTrump={this.props.chosenTrump} whenShapePressed={this.props.whenShapePressed} trumpEmoji={Assets.emojis.spades} shapeName={'spades'}/>
                    <ShapeBtn chosenTrump={this.props.chosenTrump} whenShapePressed={this.props.whenShapePressed} trumpEmoji={Assets.emojis.hearts} shapeName={'hearts'}/>
                </View>
                <View center row>
                    <ShapeBtn chosenTrump={this.props.chosenTrump} whenShapePressed={this.props.whenShapePressed} trumpEmoji={Assets.emojis.diamonds} shapeName={'diamonds'}/>
                    <ShapeBtn chosenTrump={this.props.chosenTrump} whenShapePressed={this.props.whenShapePressed} trumpEmoji={Assets.emojis.clubs} shapeName={'clubs'}/>
                </View>
            </View>
                  )

    }
}
