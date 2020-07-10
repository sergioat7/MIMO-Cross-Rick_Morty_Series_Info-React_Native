import React, { Component } from 'react';
import {
    Text,
    TouchableHighlight,
    View,
    StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-community/async-storage';

export default class EpisodeRow extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            episode: props.episode,
            isFavourite: false,
        };
        this.key = 'episode' + props.episode.id;
    }

    componentDidMount() {

        AsyncStorage.getItem(this.key).then( isFavourite => {
            this.setState({
                isFavourite: isFavourite == 'true'
            });
        });
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
                    {this.getFavouriteImage()}
                </View>
            </TouchableHighlight>
        );
    }

    getFavouriteImage() {
        return (
            this.state.isFavourite ? <Icon name='heart' style={styles.favouriteIcon}/> : null
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
    favouriteIcon: {
        alignSelf: 'center',
        color: 'red',
    },
});