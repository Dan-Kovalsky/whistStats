import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Text, View} from 'react-native-ui-lib';

import PropTypes from 'prop-types';
import {Navigation} from 'react-native-navigation';


class RoundScreen extends Component {

    static propTypes = {
        componentId: PropTypes.string,
        somePropToPass: PropTypes.string
    };

    constructor(props) {
        super(props);

        Navigation.events().bindComponent(this);

        this.pushTableScreen = this.pushTableScreen.bind(this);
    }

    pushTableScreen() {
        Navigation.showModal({
            stack: {
                children: [{
                    component: {
                        name: 'whistStats.TableScreen',
                        passProps: {
                            somePropToPass: 'Some props - Table from DB'                        },
                        options: {
                            topBar: {
                                title: {
                                    text: 'Title not Static'
                                }
                            }
                        }
                    }
                }]
            }
        });
    }

        //     this.props.componentId, {
        //     component: {
        //         name: 'whistStats.TableScreen',
        //         passProps: {
        //             somePropToPass: 'Some props - Table from DB'
        //         },
        //         options: {
        //             topBar: {
        //                 title: {
        //                     text: 'Title not Static'
        //                 }
        //             }
        //         }
        //     }
        // });
    // }

    static get options() {
        return {
            topBar: {
                rightButtons: [
                    {
                        id: 'seeTable',
                        text: 'Table'
                    }
                ]
            }
        };
    }

    navigationButtonPressed({buttonId}) {
        this.pushTableScreen();
    }



    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>roundScreen</Text>
                <Text text40 red10 marginT-30>{this.props.somePropToPass}</Text>
            </View>
        );
    }
}

export default RoundScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D3ED44',
    },
    text: {
        fontSize: 28,
        textAlign: 'center',
        margin: 10,
    }
});
