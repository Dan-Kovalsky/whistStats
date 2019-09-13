import {Navigation} from 'react-native-navigation';

export function registerScreens() {
    Navigation.registerComponent('whistStats.NewGameScreen', () => require('./screens/NewGameScreen').default);
    Navigation.registerComponent('whistStats.RoundScreen', () => require('./screens/RoundScreen').default);
    Navigation.registerComponent('whistStats.TableScreen', () => require('./screens/TableScreen').default);
    Navigation.registerComponent('whistStats.MyGamesScreen', () => require('./screens/MyGamesScreen').default);
    Navigation.registerComponent('whistStats.StatisticsScreen', () => require('./screens/StatisticsScreen').default);
}
