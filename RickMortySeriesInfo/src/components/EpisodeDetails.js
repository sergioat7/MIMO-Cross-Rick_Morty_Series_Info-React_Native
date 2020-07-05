import React, { Component } from 'react';
import {
    View,
    Animated,
    StyleSheet,
    ActivityIndicator,
    Text,
    TouchableHighlight,
    Image,
} from 'react-native';
import RickAndMortyApiClient from '../api/RickAndMortyApiClient'
import Icon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-community/async-storage';

export default class EpisodeDetails extends Component {
    
    constructor(props) {
        super(props);
    
        params = props.route.params;
        this.scrollValue = new Animated.Value(0);
        this.episodeId = params.episodeId;
        this.key = 'episode' + params.episodeId;
        this.state = {
            episode: null,
            characters: null,
            isFavourite: false,
        };
        this.apiClient = new RickAndMortyApiClient();
        this.isLoading = true;
        this.isLoadingCharacters = true;
        props.navigation.setOptions({
            title: '',
            headerTintColor: '#000000',
        });
    }

    componentDidUpdate() {

        this.props.navigation.setOptions({
            headerRight: () => (
                this.renderRightHeader()
            ),
        });
    }
  
    componentDidMount() {

        this.apiClient.getEpisode(this.episodeId).then( episode => {
            
            this.isLoading = false;
            this.setState({
                ...this.state,
                episode: episode,
            })
            this.getCharacters(episode.characters)
            this.props.navigation.setOptions({
                title: episode.name,
            });
        })
        .catch( error => {
            console.error(error)
            this.isLoading = false;
        })
        
        AsyncStorage.getItem(this.key).then( isFavourite => {
            this.setState({
                isFavourite: isFavourite == 'true'
            });
        });
    }

    getCharacters(residents) {

        var ids = []
        for (i in residents) {
            var id = residents[i].split("/").pop()
            ids.push(id)
        }

        this.apiClient.getCharacter(ids)
            .then( characters => {
                
                this.isLoadingCharacters = false;
                this.setState({
                    ...this.state,
                    characters: characters,
                })
            })
            .catch( error => {
                console.error(error)
            })
    }

    renderRightHeader() {

        var iconName = this.state.isFavourite ? 'heart' : 'hearto';
        return (
            <Icon
                name={iconName}
                size={25}
                style={styles.favouriteHeaderButton}
                onPress={this.onFavouriteButtonPressed.bind(this)}
            />
        );
    }
    
    render() {
        
        if (this.isLoading) {
            return (
                <View style={{flex: 1}}>
                    <ActivityIndicator style={styles.loading} size="large"/>
                </View>
            );
        }

        episode = this.state.episode;

        return (
            <Animated.ScrollView 
                contentContainerStyle={styles.container}
                onScroll={
                    Animated.event([{ 
                        nativeEvent: {
                            contentOffset: { y: this.scrollValue, },
                        }
                    }], {
                        useNativeDriver: true,
                    }
                )}
                scrollEventThrottle={16}
            >
                {this.renderHeader(episode)}
                {this.renderCharacters()}
            </Animated.ScrollView>
          );
    }

    renderHeader(episode) {

        var characaters = episode.episode.split('')
        var seasonNumber = characaters[1] + characaters[2]
        var episodeNumber = characaters[4] + characaters[5]
        
        return (
            <View style={styles.infoContainer}>
                <Text>Release date: {episode.air_date}</Text>
                <Text>Episode: {seasonNumber}x{episodeNumber}</Text>
            </View>
        );
    }
  
    renderCharacters() {
        
        if (this.isLoadingCharacters) {
            return (
                <View style={[styles.item, styles.charactersContainer]}>
                    <Text style={styles.characterTitle}>Residents:</Text>
                    <ActivityIndicator style={styles.loading} size="large"/>
                </View>
            );
        }

        characters = this.state.characters;

        if (characters == null) {
            return (
                <View/>
            );
        }

        return (
            <View style={styles.charactersContainer}>
                <Text style={styles.characterTitle}>Residents:</Text>
                {characters.map( character => {
                    return (
                        <TouchableHighlight
                            onPress={this.onCharacterPressed.bind(this, character.id)}
                            underlayColor='lightgray'
                            key={character.id}
                        >
                            <View style={styles.character}>
                                <Image
                                    style={styles.image}
                                    resizeMode="contain"
                                    source={{ uri: character.image }}
                                />
                                <View style={styles.characterName}>
                                    <Text style={{color:'blue'}}>{character.name}</Text>
                                </View>
                            </View>
                        </TouchableHighlight>
                    )
                })}
            </View>
        );
    }

    onCharacterPressed(characterId) {
        this.props.navigation.navigate('CharacterDetails', { characterId: characterId });
    }

    onFavouriteButtonPressed() {

        var value = (!this.state.isFavourite).toString();
        AsyncStorage.setItem(this.key, value).then( () => {
            this.setState({
                isFavourite: !this.state.isFavourite
            });
        });
    }
}

const styles = StyleSheet.create({
    
    loading: {
        flex: 1,
        justifyContent: 'center',
        color: '#0000ff',
    },
    container: {
        flex: 0,
        padding: 10,
        justifyContent: 'flex-start',
        alignItems: 'stretch',
    },
    infoContainer: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'center',
    },
    charactersContainer: {
        flexDirection: 'column',
        marginTop: 20,
    },
    characterTitle: {
        fontWeight: 'bold',
        fontSize: 17,
    },
    character: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
    },
    image: {
        width: 25,
        height: 25,
    },
    characterName: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'center',
    },
    favouriteHeaderButton: {
        marginStart: 10,
        marginEnd: 10,
    },
});