import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Text, View, TextField,Colors, Button, Assets} from 'react-native-ui-lib';
import BidBtn from "./BidBtn";
import ShapeBtn from "./ShapeBtn";

export default class ShapeInput extends Component {

    render(){
        return (
            <View margin-20>
                <View center row>
                    <ShapeBtn chosenTrump={this.props.chosenTrump} whenShapePressed={this.props.whenShapePressed} trumpEmoji={Assets.emojis.spades} shapeName={'spades'}/>
                    <ShapeBtn chosenTrump={this.props.chosenTrump} whenShapePressed={this.props.whenShapePressed} trumpEmoji={Assets.emojis.hearts} shapeName={'hearts'}/>
                </View>
                <View center row>
                    <ShapeBtn chosenTrump={this.props.chosenTrump} whenShapePressed={this.props.whenShapePressed} trumpEmoji={Assets.emojis.diamonds} shapeName={'diamonds'}/>
                    <ShapeBtn chosenTrump={this.props.chosenTrump} whenShapePressed={this.props.whenShapePressed} trumpEmoji={Assets.emojis.clubs} shapeName={'clubs'}/>
                </View>

                {/*    <Button style={{height:40, width:40}} onPress={() => alert('spade')}>*/}
                {/*        <Text>*/}
                {/*            {Assets.emojis.spades}*/}
                {/*        </Text>*/}
                {/*    </Button>*/}
                {/*</View>*/}
                {/*<View row center>*/}

                {/*    <Button onPress={() => alert('heart')}>*/}
                {/*        <Text>*/}
                {/*            {Assets.emojis.hearts}*/}
                {/*        </Text>*/}
                {/*    </Button>*/}

                {/*    <Button onPress={() => alert('diamond')}>*/}
                {/*        <Text>*/}
                {/*            {Assets.emojis.diamonds}*/}
                {/*        </Text>*/}
                {/*    </Button>*/}

                {/*    <Button onPress={() => alert('club')}>*/}
                {/*        <Text>*/}
                {/*            {Assets.emojis.clubs}*/}
                {/*        </Text>*/}
                {/*    </Button>*/}

                {/*    /!*<Button*!/*/}
                {/*    /!*    backgroundColor={Colors.yellow30}*!/*/}
                {/*    /!*    round*!/*/}
                {/*    /!*    // iconSource={Assets.emojis.spades}*!/*/}
                {/*    /!*    // label={'start round 1'}*!/*/}
                {/*    /!*    size='medium'*!/*/}
                {/*    /!*    borderRadius={5}*!/*/}
                {/*    /!*    text60*!/*/}
                {/*    /!*    labelStyle={{fontWeight: 'bold'}}*!/*/}
                {/*    /!*    style={{width:90, height:100}}*!/*/}
                {/*    /!*    ref={element => (this.button_0 = element)}*!/*/}
                {/*    /!*    onPress={() => this.showSnippet(this.button_4)}*!/*/}
                {/*    /!*>*!/*/}
                {/*    /!*    /!*<Text>*!/*!/*/}
                {/*    /!*    /!*    {Assets.emojis.spades}*!/*!/*/}
                {/*    /!*    /!*</Text>*!/*!/*/}
                {/*    /!*</Button>*!/*/}



                {/*</View>*/}


            </View>
                  )

    }
}
