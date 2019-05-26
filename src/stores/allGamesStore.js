import * as remx from 'remx';
const initialState = {
    games: {}
};

const state = remx.state(initialState);


const getters = remx.getters({
    getAllGames(){
        return state.games;
    },

    getGameByGameId(gameId){
        return state.games[gameId];
    }
});


const setters = remx.setters({
    setFakeWhistGame(gamesObj){
        state.games = gamesObj;
    },

    setBid(GameIdx, roundIdx, bidLst){
        state.games[gameNum].rounds[roundIdx].biddings = bidLst;
    },
    setResult(GameIdx, roundIdx, resultLst){
        state.games[gameNum].rounds[roundIdx].results = resultLst;
    }
})

export const whistStore = {
    ...getters,
    ...setters
}
