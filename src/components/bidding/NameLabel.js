import React, {Component} from 'react';
import {Text, View, Assets} from 'react-native-ui-lib';
import PropTypes from 'prop-types';
import {BID_RES_COMPONENT_BG, NAME_LABEL_COLORS as clr} from "../../constants/styles/Colors";


export default class NameField extends Component {

    static propTypes = {
        name: PropTypes.string,
        points: PropTypes.number,
        king: PropTypes.bool
    };

    getScoreColor = () => this.props.points < 0 ? clr.NUM_MINUS : this.props.points > 0 ? clr.NUM_PLUS : clr.NUM_ZERO;

    render(){
        return (
            <View spread centerV row padding-5 style={{height:40, width:165, backgroundColor:BID_RES_COMPONENT_BG}}>
            {/*<View spread centerV row padding-5 style={{height:40, width:165, backgroundColor:clr.BG}}>*/}
                <Text text70 uppercase style={{fontWeight: 'bold', color: clr.NAME}}>
                    {this.props.name}
                </Text>
                {this.props.king ? <Text>{Assets.emojis.crown}</Text> : undefined}
                <Text text70 style={{fontWeight: 'bold', color: this.getScoreColor()}}>
                    {this.props.points}
                </Text>
            </View>
        )

    }
}
