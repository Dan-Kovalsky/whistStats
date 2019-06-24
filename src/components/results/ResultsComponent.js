import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Text, View, TextField,Colors} from 'react-native-ui-lib';
import PropTypes from 'prop-types'
import NameLabel from '../bidding/NameLabel'
import ResultsButtons from './ResultsButtons'

export default class ResultsComponent extends Component {

    static propTypes = {
        name: PropTypes.string,
        location: PropTypes.string,
        whenResBtnPressed: PropTypes.func,
        res:PropTypes.number,
        bid:PropTypes.number,
        points: PropTypes.number,
        king: PropTypes.bool
    };

    render(){
        return (
            <View margin-5 marginV-15 center>
                <NameLabel king={this.props.king} name={this.props.name} points={this.props.points}/>
                <ResultsButtons bid={this.props.bid} res={this.props.res} location={this.props.location} whenResBtnPressed={this.props.whenResBtnPressed}/>
            </View>
        )

    }
}
