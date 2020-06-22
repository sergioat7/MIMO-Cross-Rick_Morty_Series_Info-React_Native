import React, { Component } from 'react';
import {
    Image,
    Text,
    TouchableHighlight,
    View
} from 'react-native';

export default class CharacterRow extends Component {

    render() {
        return (
            <TouchableHighlight>
                <Text>{this.props.character.name}</Text>
            </TouchableHighlight>
        );
    }
}