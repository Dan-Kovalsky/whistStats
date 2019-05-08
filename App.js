/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet} from 'react-native';
import {Text, View} from 'react-native-ui-lib';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

async function fetchPlayers() {
  const response = await fetch('http://localhost:3000/Players');
  console.error('HI DAN')
  const players = await response.json();
  console.warn("hello" + players);
  return players
  // postsStore.setPosts(posts);
}


type Props = {};
export default class App extends Component<Props> {

  render() {
    return (
      <View flex center bg-red80 padding-10 margin-20>
        <Text text30 blue10 padding-20 marginB-30 center style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
  },
  welcome: {
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
