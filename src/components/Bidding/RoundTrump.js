import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Text, View, TextField,Colors, Button, Assets, Image} from 'react-native-ui-lib';
import BidBtn from "./BidBtn";
import ShapeBtn from "./ShapeBtn";

import PropTypes from 'prop-types';



export default class RoundTrump extends Component {

    static propTypes = {
        trump: PropTypes.string
    };

    getTrumpLogo = () => {
        switch (this.props.trump) {
            case ('spades'): {
                return require('./../../assets/spades.png');
            }
            case ('hearts'): {
                return require('./../../assets/hearts.png');
            }
            case ('clubs'): {
                return require('./../../assets/clubs.png');
            }
            case ('diamonds'): {
                return require('./../../assets/diamonds.png');
            }
        }
    };

    render(){
        return (
            <View margin-20 center>
                <Image
                    style={{height:100, width:100}}
                    source={this.getTrumpLogo()}
                />
                {/*<Text>Trump</Text>*/}

            </View>

            //
            // <View margin-20>
            //
            //
            //
            //
            //
            //
            //     {/*<View center row>*/}
            //     {/*    <TrumpBtn trumpEmoji={Assets.emojis.spades}/>*/}
            //     {/*    <TrumpBtn trumpEmoji={Assets.emojis.hearts}/>*/}
            //     {/*</View>*/}
            //     {/*<View center row>*/}
            //     {/*    <TrumpBtn trumpEmoji={Assets.emojis.diamonds}/>*/}
            //     {/*    <TrumpBtn trumpEmoji={Assets.emojis.clubs}/>*/}
            //     {/*</View>*/}
            //
            //     {/*    <Button style={{height:40, width:40}} onPress={() => alert('spade')}>*/}
            //     {/*        <Text>*/}
            //     {/*            {Assets.emojis.spades}*/}
            //     {/*        </Text>*/}
            //     {/*    </Button>*/}
            //     {/*</View>*/}
            //     {/*<View row center>*/}
            //
            //     {/*    <Button onPress={() => alert('heart')}>*/}
            //     {/*        <Text>*/}
            //     {/*            {Assets.emojis.hearts}*/}
            //     {/*        </Text>*/}
            //     {/*    </Button>*/}
            //
            //     {/*    <Button onPress={() => alert('diamond')}>*/}
            //     {/*        <Text>*/}
            //     {/*            {Assets.emojis.diamonds}*/}
            //     {/*        </Text>*/}
            //     {/*    </Button>*/}
            //
            //     {/*    <Button onPress={() => alert('club')}>*/}
            //     {/*        <Text>*/}
            //     {/*            {Assets.emojis.clubs}*/}
            //     {/*        </Text>*/}
            //     {/*    </Button>*/}
            //
            //     {/*    /!*<Button*!/*/}
            //     {/*    /!*    backgroundColor={Colors.yellow30}*!/*/}
            //     {/*    /!*    round*!/*/}
            //     {/*    /!*    // iconSource={Assets.emojis.spades}*!/*/}
            //     {/*    /!*    // label={'start round 1'}*!/*/}
            //     {/*    /!*    size='medium'*!/*/}
            //     {/*    /!*    borderRadius={5}*!/*/}
            //     {/*    /!*    text60*!/*/}
            //     {/*    /!*    labelStyle={{fontWeight: 'bold'}}*!/*/}
            //     {/*    /!*    style={{width:90, height:100}}*!/*/}
            //     {/*    /!*    ref={element => (this.button_0 = element)}*!/*/}
            //     {/*    /!*    onPress={() => this.showSnippet(this.button_4)}*!/*/}
            //     {/*    /!*>*!/*/}
            //     {/*    /!*    /!*<Text>*!/*!/*/}
            //     {/*    /!*    /!*    {Assets.emojis.spades}*!/*!/*/}
            //     {/*    /!*    /!*</Text>*!/*!/*/}
            //     {/*    /!*</Button>*!/*/}
            //
            //
            //
            //     {/*</View>*/}
            //
            //
            // </View>
        )

    }
}
