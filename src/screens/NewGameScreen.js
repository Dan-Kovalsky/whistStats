import React, {Component} from 'react';
import {TouchableWithoutFeedback, Keyboard, ScrollView, FlatList, Alert} from 'react-native';
import {View, Text, TouchableOpacity, Assets, TextField, Button} from 'react-native-ui-lib';

import NameInput from './../components/NameInput'

import PropTypes from 'prop-types';
import {Navigation} from 'react-native-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import {NEW_GAME_SCREEN_BG} from "../constants/styles/Colors";

import {whistStore} from "../stores/allGamesStore";
const OPTIONAL_NAMES_KEY = '@WhistStats:NewGameScreen:optionalNamesList';
const SOUTH_NAME_KEY = '@WhistStats:NewGameScreen:southName';


class NewGameScreen extends Component {


    static propTypes = {
        componentId: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.state = {
            addingName: false,
            newName: '',
            optionalNamesList: [],
            newNameErrorMsg:'Empty',
            names: {
                northName: '',
                southName: '',
                eastName: '',
                westName: ''
            },
            nameErrorMsg: {
                north: '',
                west: '',
                east: '',
                south: ''
            }
        };
        Navigation.events().bindComponent(this);
        this.pushRoundScreen = this.pushRoundScreen.bind(this);
        this.enableStartBtn = this.enableStartBtn.bind(this);
    }

    componentDidMount(){
        whistStore.loadGamesHistory();
        AsyncStorage.getItem(SOUTH_NAME_KEY)
            .then(name => {
                this.setState({names:{...this.state.names, southName: name}})
            });
        this.loadOptionalNamesFromStorage()
    }

    loadOptionalNamesFromStorage = async () => {
        let optionalNames = [];
        let optionalNamesListStr = await AsyncStorage.getItem(OPTIONAL_NAMES_KEY);
        if (optionalNamesListStr == null) {
            const optionalNamesExample = [{name: 'Dan'},{name: 'Eyal'},{name: 'Segev'}];
            await this.saveNamesToStorage(optionalNamesExample);
            optionalNames = optionalNamesExample;
        }
        else {
            optionalNames = JSON.parse(optionalNamesListStr)
        }
        this.setState({optionalNamesList: optionalNames})

    };

    saveNamesToStorage = (optionalNames) => {
        AsyncStorage.setItem(
            OPTIONAL_NAMES_KEY,
            JSON.stringify(optionalNames),
        )
    };

    addNameToOptionalList = () => {
        const newValue = {name: this.state.newName};
        this.setState(state => {
            const newList = [...state.optionalNamesList, newValue];
            return {
                optionalNamesList: newList,
                addingName: false,
                newName: ''
            }
        }, () => this.saveNamesToStorage(this.state.optionalNamesList))
    };

    deleteNameFromOptionals = (name) => {
        this.setState(state => {
            const newList = state.optionalNamesList.filter(item => item.name !== name);
            return {
                optionalNamesList: newList,
            }
        }, () => {this.saveNamesToStorage(this.state.optionalNamesList)})
    };

    startAddingName = () => {
        this.setState({addingName: true})
    };

    pushRoundScreen() {
        Navigation.push(this.props.componentId, {
            component: {
                name: 'whistStats.RoundScreen',
                passProps: {
                    somePropToPass: 'Some props that we are passing - all the names',
                    allNames: this.state.names
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
                        enabled: false     //TODO DELETE '!'
                    }
                ]
            },
            layout: {
                orientation: ['portrait'],
                direction: 'ltr'
            }
        };
    }

    navigationButtonPressed({buttonId}) {
        this.saveSouthName();
        this.pushRoundScreen();
    }

    saveSouthName = () => {
        AsyncStorage.setItem(
            SOUTH_NAME_KEY,
            this.state.names.southName,
        )
    };

    getErrorMessagePerLocation = (name, location) => {
        let errorMsg = "Name not exist";
        if (this.state.optionalNamesList.map(item => item.name).includes(name)) {
            errorMsg = ''
        }
        let nameErrorMsg = {...this.state.nameErrorMsg};
        nameErrorMsg[location] = errorMsg;
        return nameErrorMsg
    };
    getErrorMessageForNewName = (name) => {
        let errorMsg = '';
        if (name === '') {
            errorMsg = 'Empty'
        } else if (this.state.optionalNamesList.map(item => item.name).includes(name)) {
            errorMsg = 'Exist'
        }
        return errorMsg
    };

    isAllErrorsEmpty = () => {
        let isEmpty = true;
        Object.keys(this.state.nameErrorMsg).forEach(location => {
            // console.warn(location)
            isEmpty = isEmpty && this.state.nameErrorMsg[location] === ''
        });
        return isEmpty
    };

    allNamesExist = () => {
        let isAllExist = true;
        Object.keys(this.state.names).forEach(location => {
            // console.warn(location)
            isAllExist = isAllExist && this.state.optionalNamesList.includes(this.state.names[location])
        });
        return isAllExist
    };

    onNChanged = name => {
        const nameErrorMsg = this.getErrorMessagePerLocation(name, 'north');
        this.setState({
            names:{...this.state.names, northName: name},
            nameErrorMsg
        }, () => this.enableStartBtn());
    };
    onSChanged = name => {
        const nameErrorMsg = this.getErrorMessagePerLocation(name, 'south');
        this.setState({
            names: {...this.state.names, southName: name},
            nameErrorMsg
        }, () => this.enableStartBtn());
    };
    onWChanged = name => {
        const nameErrorMsg = this.getErrorMessagePerLocation(name, 'west');
        this.setState({
            names: {...this.state.names, westName: name},
            nameErrorMsg
        }, () => this.enableStartBtn());
    };
    onEChanged = name => {
        const nameErrorMsg = this.getErrorMessagePerLocation(name, 'east');
        this.setState({
            names: {...this.state.names, eastName: name},
            nameErrorMsg
        }, () => this.enableStartBtn());
    };
    enableStartBtn() {
        Navigation.mergeOptions(this.props.componentId, {
            topBar: {
                rightButtons: [{
                    id: 'roundScreen',
                    text: 'Start',
                    enabled: this.allNamesExist && this.isAllErrorsEmpty() && !!this.state.names.northName &&  !!this.state.names.southName &&  !!this.state.names.eastName &&  !!this.state.names.westName
                }]
            }
        });
    }

    renderLine = (item) => {
        return (
            <TouchableOpacity style={{height:30}} flex spread row>
                <Text>{item.item.name}</Text>
                <TouchableOpacity onPress={ () => this.alertDeleteNameDialog(item.item.name)
                    // () =>this.deleteNameFromOptionals(item.item.name)
                    // console.warn("Delete " + item.item.name)
                    // console.warn("Delete index " + item.index)}
                }
                >
                    <Text>{`Delete ${Assets.emojis.no_entry}`}</Text>
                </TouchableOpacity>
            </TouchableOpacity>
        )
    };

    renderFlatList = () => {
        return (
                <FlatList
                    data={this.state.optionalNamesList}
                    maxHeight={200}
                    keyExtractor={(item) => item.name}
                    renderItem={this.renderLine}
                    // ListFooterComponent={this.renderFooter}
                />
        );
    };

    alertSaveNameDialog = () => {
        if (this.state.newNameErrorMsg === '') {
            Alert.alert(
                'Adding Name',
                `Do you want to add "${this.state.newName}"?`,
                [
                    {text: 'Cancel', onPress: () => {}, style: 'cancel'},
                    {text: 'OK', onPress: () => this.addNameToOptionalList()}
                ],
                {cancelable: true},
            );
        }
    };


    alertDeleteNameDialog = (name) => {
        Alert.alert(
            `Deleting ${name} from list`,
            `Are youSure?`,
            [
                {text: 'Cancel', onPress: () => {}, style: 'cancel'},
                {text: 'Ok', onPress: () => this.deleteNameFromOptionals(name)},
            ],
            {cancelable: true},
        )
    };

    onChangeNewNameText = (newName) => {
        const newNameErrorMsg = this.getErrorMessageForNewName(newName);
        this.setState({newNameErrorMsg})
    };

    render() {
        return (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View centerH flex style={{backgroundColor: NEW_GAME_SCREEN_BG}}>
                    {(this.state.optionalNamesList.length >= 4)
                        ?
                        <View>
                            <NameInput text={this.state.names.northName} errorMsg={this.state.nameErrorMsg.north} position='north' onChangeText={this.onNChanged}/>
                            <View spread row>
                                <NameInput text={this.state.names.westName} errorMsg={this.state.nameErrorMsg.west} position='west' onChangeText={this.onWChanged}/>
                                <NameInput text={this.state.names.eastName} errorMsg={this.state.nameErrorMsg.east} position='east' onChangeText={this.onEChanged}/>
                            </View>
                            <NameInput text={this.state.names.southName} errorMsg={this.state.nameErrorMsg.south} position='My Name' onChangeText={this.onSChanged}/>
                        </View>

                        :
                        <Text>Add at least four names to the list</Text>
                    }
                    <View style={{height:200, width: 150, borderWidth:2, borderColor:'black', marginTop: 20}}>
                        {this.state.addingName ?
                            <View>
                                <TextField
                                    text80
                                    style={{lineHeight: 20}}
                                    containerStyle={{marginBottom: 1}}
                                    placeholder="New Name"
                                    maxLength={9}
                                    showCharacterCounter
                                    onChangeText={this.onChangeNewNameText}
                                    error={this.state.newNameErrorMsg}
                                    // useTopErrors={this.state.topError}
                                />
                                <Button
                                    backgroundColor={'green'}
                                    color={'black'}
                                    label={'SAVE'}
                                    size="small"
                                    borderRadius={50}
                                    text80
                                    labelStyle={{fontWeight: 'bold'}}
                                    style={{width:60, height:20, margin:5}}
                                    onPress={this.alertSaveNameDialog}
                                />
                           </View>
                            :
                            <TouchableOpacity onPress={this.startAddingName}>
                                <Text>{`${Assets.emojis.heavy_plus_sign} Add Name`}</Text>
                            </TouchableOpacity>
                        }
                        {this.renderFlatList()}
                    </View>
                </View>
             </TouchableWithoutFeedback>
        );
    }
}

export default NewGameScreen;

