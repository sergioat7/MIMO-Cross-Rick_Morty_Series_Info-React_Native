import React, { Component } from 'react';
import {
    Text,
    TouchableHighlight,
    View,
    StyleSheet,
} from 'react-native';

export default class EpisodeRow extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            episode: props.episode,
        };
    }
    
    render() {

        episode = this.props.episode;

        var characaters = episode.episode.split('')
        var seasonNumber = characaters[1] + characaters[2]
        var episodeNumber = characaters[4] + characaters[5]

        return (
            <TouchableHighlight onPress={this.props.onPress} underlayColor='lightgray'>
                <View style={styles.mainContainer}>
                    <Text style={{alignSelf: 'center'}}>{seasonNumber}x{episodeNumber}</Text>
                    <View style={styles.titleContainer}>
                        <Text style={{fontWeight: 'bold'}}>{episode.name}</Text>
                        <Text>{episode.air_date}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    
    mainContainer: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
    },
    titleContainer: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'center',
    },
});