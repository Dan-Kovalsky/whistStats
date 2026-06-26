import React, {Component} from 'react';
import {TouchableWithoutFeedback, Keyboard, FlatList, Alert} from 'react-native';
import {View, Text, TouchableOpacity, Assets, TextField, Button, Colors, FeatureHighlight, Typography} from 'react-native-ui-lib';
import _ from 'lodash'
import NameInput from './../components/NameInput'

import PropTypes from 'prop-types';
import {Navigation} from 'react-native-navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NEW_GAME_SCREEN_BG} from "../constants/styles/Colors";

import {whistStore} from "../stores/allGamesStore";
const OPTIONAL_NAMES_KEY = '@WhistStats:NewGameScreen:optionalNamesList';
const SOUTH_NAME_KEY = '@WhistStats:NewGameScreen:southName';


const titles = [
    'All Names List',
    'My Name',
    'Start New Game',
];
const messages = [
    'First add your name and all of your friend`s names to the list.\nYou can delete and add new names always.',
    'Write your name. It must be identical to the list.',
    'Add Names from All Names List according to sitting order on table, and click START at the top right corner.',
];

class NewGameScreen extends Component {

    static propTypes = {
        componentId: PropTypes.string
    };

    constructor(props) {
        super(props);
        this.targets = {};
        this.state = {
            isShowInfoOverlay: false,
            currentTargetIndex: 0,
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
                this.setState({names: {...this.state.names, southName: name}})
            });
        this.loadOptionalNamesFromStorage().then((optionalNames) => {
            // Use the freshly loaded list, not this.state (which is still stale
            // right after setState) — otherwise the onboarding tour shows even
            // when the user already has names saved.
            if (optionalNames.length < 4) {
                setTimeout(() => {
                    this.showHighlight();
                }, 500);
            }
        })
    }

    loadOptionalNamesFromStorage = async () => {
        let optionalNames = [];
        let optionalNamesListStr = await AsyncStorage.getItem(OPTIONAL_NAMES_KEY);
        if (optionalNamesListStr == null) {
            const optionalNamesExample = [{name: 'DanKov'},{name: 'Gal Demo'}];
            await this.saveNamesToStorage(optionalNamesExample);
            optionalNames = optionalNamesExample;
        }
        else {
            optionalNames = JSON.parse(optionalNamesListStr)
        }
        this.setState({optionalNamesList: optionalNames})
        return optionalNames;
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
            isEmpty = isEmpty && this.state.nameErrorMsg[location] === ''
        });
        return isEmpty
    };

    allNamesExist = () => {
        let isAllExist = true;
        Object.keys(this.state.names).forEach(location => {
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
            <TouchableOpacity>
                <View style={{height:20}} flex spread row>
                    <Text>{item.item.name}</Text>
                    <TouchableOpacity onPress={() => this.alertDeleteNameDialog(item.item.name)}>
                        <Text>{`Del ${Assets.emojis.no_entry}`}</Text>
                    </TouchableOpacity>
                </View>
                <View flex style={{borderWidth: 0.5, borderColor: 'grey'}} />
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
            `Deleting "${name}" from list`,
            `Are You Sure?`,
            [
                {text: 'Cancel', onPress: () => {}, style: 'cancel'},
                {text: 'Ok', onPress: () => this.deleteNameFromOptionals(name)},
            ],
            {cancelable: true},
        )
    };

    onChangeNewNameText = (newName) => {
        const newNameErrorMsg = this.getErrorMessageForNewName(newName);
        this.setState({
            newNameErrorMsg,
            newName
        })
    };

    statisticsBtnPressed = () => {
        Navigation.showModal({
            stack: {
                children: [{
                    component: {
                        name: 'whistStats.StatisticsScreen',
                        passProps: {
                            somePropToPass: 'Some props - Table from DB',
                        }
                    }
                }]
            }
        })
    };

    gamesHistoryBtnPressed = () => {
        Navigation.showModal({
            stack: {
                children: [{
                    component: {
                        name: 'whistStats.MyGamesScreen',
                        passProps: {
                            somePropToPass: 'Some props - Table from DB',
                        }
                    }
                }]
            }
        });
    };


    addTarget = (ref, id) => {
        if (ref && !this.targets[id]) {
            this.targets[id] = ref;
        }
    };

    moveNext = () => {
        const {currentTargetIndex} = this.state;
        const newTargetIndex = currentTargetIndex + 1;
        this.moveToPage(newTargetIndex);
    };

    moveToPage = (index) => {
        if (index < _.size(this.targets)) {
            this.setState({currentTargetIndex: index});
        } else {
            this.closeHighlight();
        }
    };

    onPagePress = (index) => {
        this.moveToPage(index);
    };

    closeHighlight = () => {
        this.setState({isShowInfoOverlay: false}, () => {});
    };

    showHighlight = () => {
        this.setState({isShowInfoOverlay: true});
    };


    renderHighlighterOverlay = () => {
        const {isShowInfoOverlay, currentTargetIndex} = this.state;
        return (
            <FeatureHighlight
                visible={isShowInfoOverlay}
                title={titles[currentTargetIndex]}
                message={messages[currentTargetIndex]}
                confirmButtonProps={{label: 'Got It', onPress: this.moveNext}}
                // onBackgroundPress={this.closeHighlight}
                getTarget={() => this.targets[currentTargetIndex]}
                // borderRadius={currentTargetIndex === 4 ? 4 : undefined}
            />
        );
    };

    render() {
        return (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View centerH flex style={{backgroundColor: NEW_GAME_SCREEN_BG}}>
                    <View style={{backgroundColor: NEW_GAME_SCREEN_BG}} centerH ref={r => (this.addTarget(r, '2'))}>
                        <NameInput text={this.state.names.northName} errorMsg={this.state.nameErrorMsg.north} position='north' onChangeText={this.onNChanged}/>
                        <View spread row>
                            <NameInput text={this.state.names.westName} errorMsg={this.state.nameErrorMsg.west} position='west' onChangeText={this.onWChanged}/>
                            <NameInput text={this.state.names.eastName} errorMsg={this.state.nameErrorMsg.east} position='east' onChangeText={this.onEChanged}/>
                        </View>
                        <View style={{backgroundColor: NEW_GAME_SCREEN_BG}} ref={r => (this.addTarget(r, '1'))}>
                            <NameInput text={this.state.names.southName} errorMsg={this.state.nameErrorMsg.south} position='My Name' onChangeText={this.onSChanged}/>
                        </View>
                    </View>
                    <View style={{height:200, width: 120, borderWidth:1, borderColor:'black', marginTop: 20, backgroundColor: Colors.yellow80 }} ref={r => (this.addTarget(r, '0'))}>
                        {this.state.addingName ?
                            <View>
                                <TextField
                                    text80
                                    style={{lineHeight: 30}}
                                    containerStyle={{marginBottom: 1}}
                                    placeholder="New Name"
                                    maxLength={9}
                                    showCharacterCounter
                                    onChangeText={this.onChangeNewNameText}
                                    error={this.state.newNameErrorMsg}
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
                        <View center>
                            <Text> </Text>
                            <Text style={{fontWeight:'bold', textDecorationLine:'underline'}}>All Names</Text>
                        </View>
                        {this.renderFlatList()}
                    </View>
                    <View row>
                        <Button
                            backgroundColor={'green'}
                            color={'white'}
                            label={'Games History'}
                            size="small"
                            borderRadius={50}
                            text80
                            labelStyle={{fontWeight: 'bold'}}
                            style={{width:170, height:30, margin:10}}
                            onPress={this.gamesHistoryBtnPressed}
                        />
                        <Button
                            backgroundColor={'magenta'}
                            color={'white'}
                            label={'statistics'}
                            size="small"
                            borderRadius={50}
                            text80
                            labelStyle={{fontWeight: 'bold'}}
                            style={{width:170, height:30, margin:10}}
                            onPress={this.statisticsBtnPressed}
                        />
                    </View>
                    {this.renderHighlighterOverlay()}
                </View>
             </TouchableWithoutFeedback>
        );
    }
}

export default NewGameScreen;

