import AsyncStorage from '@react-native-async-storage/async-storage';
// import AsyncStorage from 'react-native';
import * as remx from 'remx';

const ALL_GAMES_KEY = "all-games"


const initialState = {
    games: []
};

const state = remx.state(initialState);


const getters = remx.getters({
    getAllGames(){
        return state.games;
    },

    getGameByIndex(index){
        return state.games[index];
    }
});


const setters = remx.setters({

    async loadGamesHistory() {
        try {
            const allGamesString =  await AsyncStorage.getItem("ALL_GAMES_KEY");
            if (allGamesString) {
                alert("DANKOV INSIDE IF" + allGamesString);
                state.games = JSON.parse(allGamesString);
            }
        } catch (error) {
            // console.warn(error.message);
        }
    },

    async addNewGame(gameAsJson) {
        state.games.push(gameAsJson);
        // console.warn('DANKOV inAddNewGame gameAsJson = '  + gameAsJson);
        try {
            // await AsyncStorage.setItem("ALL_GAMES_KEY", "DAN kovalsky str")
            await AsyncStorage.setItem("ALL_GAMES_KEY", JSON.stringify(state.games))
        } catch (error) {
            // console.warn(error.message);
        }
    },

    async deleteGameByIndex(index) {
        state.games.splice(index, 1);
        try {
            await AsyncStorage.setItem("ALL_GAMES_KEY", JSON.stringify(state.games))
        } catch (error) {
            // console.warn(error.message);
        }
    }
    // setFakeWhistGame(gamesObj){
    //     state.games = gamesObj;
    // },
    // setBid(GameIdx, roundIdx, bidLst){
    //     state.games[gameNum].rounds[roundIdx].biddings = bidLst;
    // },
    // setResult(GameIdx, roundIdx, resultLst){
    //     state.games[gameNum].rounds[roundIdx].results = resultLst;
    // }
});

export const whistStore = {
    ...getters,
    ...setters
};
