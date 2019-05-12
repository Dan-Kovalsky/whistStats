import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Text, View, TextField, Colors,TextArea} from 'react-native-ui-lib';

import NameInput from './../components/NameInput'

import PropTypes from 'prop-types';
import {Navigation} from 'react-native-navigation';

class NewGameScreen extends Component {


    static propTypes = {
        componentId: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.state = {
            names: {
                northName: '',
                southName: '',
                eastName: '',
                westName: ''
            }
        }

        Navigation.events().bindComponent(this);

        this.pushRoundScreen = this.pushRoundScreen.bind(this);
        this.enableStartBtn = this.enableStartBtn.bind(this);
    }

    pushRoundScreen() {
        Navigation.push(this.props.componentId, {
            component: {
                name: 'whistStats.RoundScreen',
                passProps: {
                    somePropToPass: 'Some props that we are passing - all the names'
                },
                options: {
                    topBar: {
                        title: {
                            text: 'To Be Static'
                        }
                    }
                }
            }
        });
    }

    static get options() {
        return {
            topBar: {
                rightButtons: [
                    {
                        id: 'roundScreen',
                        text: 'Start',
                        enabled: false
                    }
                ]
            }
        };
    }

    navigationButtonPressed({buttonId}) {
        this.pushRoundScreen();
    }

    onNChanged = name => {
        this.setState({...this.state.names, names:{...this.state.names, northName: name}})
        this.enableStartBtn(name)

    }
    onSChanged = name => {
        this.setState({names: {...this.state.names, southName: name}})
        this.enableStartBtn(name)

    }
    onWChanged = name => {
        this.setState({names: {...this.state.names, westName: name}})
        this.enableStartBtn(name)

    }
    onEChanged = name => {
        this.setState({names: {...this.state.names, eastName: name}})
        this.enableStartBtn(name)
    }
    enableStartBtn(name) {
        Navigation.mergeOptions(this.props.componentId, {
            topBar: {
                rightButtons: [{
                    id: 'roundScreen',
                    text: 'Start',
                    // enabled: this.isAllNamesFill
                    // enabled: true
                    enabled: !!name && !!this.state.names.northName &&  !!this.state.names.southName &&  !!this.state.names.eastName &&  !!this.state.names.westName
                }]
            }
        });
    }

    isAllNamesFill = () => !!this.state.names.northName && !!this.state.names.southName &&  !!this.state.names.eastName &&  !!this.state.names.westName;



    render() {
        return (
            <View flex>
                <View flex center bg-cyan10>
                    <NameInput position='north' onChangeText={this.onNChanged}/>
                    <View row>
                        <NameInput position='west' onChangeText={this.onWChanged}/>
                        <NameInput position='east' onChangeText={this.onEChanged}/>
                    </View>
                    <NameInput position='south' onChangeText={this.onSChanged}/>
                </View>
                <View row flex bg-blue30>

                </View>
                {/*<View flex-1 bg-red10></View>*/}

                {/*<Text onPress={this.pushRoundScreen}>NewGameScreen</Text>*/}
                {/*<Text onPress={this.pushRoundScreen}>NewGameScreen</Text>*/}
                {/*<Text onPress={this.pushRoundScreen}>NewGameScreen</Text>*/}
                {/*<View>*/}
                {/*    <TextField text50 onChangeText={this.onChangeText} title='north0'/>*/}
                {/*    <TextField onChangeText={this.onChangeText} title='north1'/>*/}
                {/*    <TextField text10 onChangeText={this.onChangeText} title='north2'/>*/}
                {/*</View>*/}

                {/*<Input10 onChangeText={this.onChangeText}/>*/}
                {/*<Input10 onChangeText={this.onChangeText}/>*/}
                {/*<Input10 onChangeText={this.onChangeText}/>*/}
                {/*<Input10 onChangeText={this.onChangeText}/>*/}
            </View>
        );
    }


}

export default NewGameScreen;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#D3EDFF',
//     },
//     text: {
//         fontSize: 28,
//         textAlign: 'center',
//         margin: 10,
//     }
// });
