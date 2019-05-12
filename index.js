/**
 * @format
 */

import { Navigation } from "react-native-navigation";
import {registerScreens} from './src/screens.js';

registerScreens();

Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setRoot({
        root: {
            stack: {
                children: [
                    {
                        component: {
                            name: 'whistStats.NewGameScreen',
                            options: {
                                topBar: {
                                    title: {
                                        text: 'New Game Screen'
                                    }
                                }
                            }
                        }
                    }
                ]
            }
        }
    });
});
