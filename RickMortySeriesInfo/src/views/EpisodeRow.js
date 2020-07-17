import React, { Component } from 'react';
import {
    Text,
    TouchableHighlight,
    View,
    StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-community/async-storage';
import { inject, observer  } from 'mobx-react';

@inject('store')
@observer
export default class EpisodeRow extends Component {
    
    constructor(props) {
        super(props);
        this.key = 'episode' + props.episode.id;
        this.favouriteEpisodes = props.store.favouriteEpisodes;
    }

    componentDidMount() {

        AsyncStorage.getItem(this.key).then( isFavourite => {
            this.props.store.addEpisode(this.props.episode.id, isFavourite == 'true');
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

        const isFavourite = this.favouriteEpisodes.has(this.props.episode.id) && this.favouriteEpisodes.get(this.props.episode.id);
        return (
            isFavourite ? <Icon name='heart' style={styles.favouriteIcon}/> : null
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