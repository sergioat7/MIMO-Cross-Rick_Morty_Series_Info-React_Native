import React, { Component } from 'react';
import {
    View,
    Animated,
    StyleSheet,
    Text,
    ActivityIndicator,
} from 'react-native';
import RickAndMortyApiClient from '../api/RickAndMortyApiClient'
import Icon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-community/async-storage';

export default class CharacterDetails extends Component {
    
    constructor(props) {
        super(props);
    
        params = props.route.params;
        this.posterAlpha = new Animated.Value(0);
        this.posterScale = new Animated.Value(0.5);
        this.scrollValue = new Animated.Value(0);
        this.characterId = params.characterId;
        this.key = 'character' + params.characterId;
        this.state = {
            character: null,
            initialAnimation: true,
            isFavourite: false,
        };
        this.apiClient = new RickAndMortyApiClient();
        this.isLoading = true
        this.props.navigation.setOptions({
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

        this.apiClient.getCharacter([this.characterId]).then( characters => {
            this.isLoading = false;
            this.setState({
                character: characters[0]
            });
            this.props.navigation.setOptions({
                 title: characters[0].name,
                });
        })
        .catch( error => {
            console.error(error)
        })

        AsyncStorage.getItem(this.key).then( isFavourite => {
            this.setState({
                isFavourite: isFavourite == 'true'
            });
        });
    
        Animated.sequence([
            Animated.parallel([
                Animated.timing(this.posterAlpha, {
                    duration: 1000,
                    toValue: 1,
                    useNativeDriver: true,
                }),
                Animated.spring(this.posterScale, {
                    speed: 1,
                    bounciness: 10,
                    toValue: 1,
                    useNativeDriver: true,
                }),
            ]),
            Animated.timing(this.posterScale, {
                toValue: -1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(this.posterScale, {
                toValue: 1,
                delay: 1000,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]).start(() => {
            this.setState({
                ...this.state,
                initialAnimation: false,
            })
        });
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

        character = this.state.character;

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
                {this.renderHeader(character)}
                {this.renderEpisodes(character)}
            </Animated.ScrollView>
          );
    }

    renderHeader(character) {
        
        var species = character.species
        if (character.type != "") {
            species += " (" + character.type + ")"
        }
        
        return (
            <View style={styles.headerContainer}>
                <Animated.Image 
                    style={[styles.image, {
                        opacity: this.state.initialAnimation ? this.posterAlpha : this.scrollValue.interpolate({
                            inputRange: [0, 150,],
                            outputRange: [1.0, 0.0],
                            extrapolate: 'clamp',
                        }),
                        transform: [{
                            scale: this.posterScale,
                        }],
                    }]}
                    resizeMode="contain"
                    source={{ uri: character.image }} 
                />
                <View style={styles.infoContainer}>
                    <View style={styles.infoTitle}>
                        <Text>Species: </Text>
                        <Text style={styles.infoTitle}>{species} / {character.gender}</Text>
                    </View>
                    <View style={styles.infoTitle}>
                        <Text>Origin: </Text>
                        {this.getLocation(character.origin)}
                    </View>
                    <View style={styles.infoTitle}>
                        <Text>Currently on:</Text>
                        {this.getLocation(character.location)}
                    </View>
                </View>
            </View>
        );
    }
  
    renderEpisodes(character) {

        if (character.episode == null) {
            return [];
        }
      
        return (
            <View style={[styles.item, styles.episodesContainer]}>
                <Text style={styles.episodeTitle}>Episodes:</Text>
                {character.episode.map( episode => {
                    return (
                        <Text
                            style={styles.episode}
                            key={episode}
                            onPress={this.onEpisodePressed.bind(this, episode)}
                        >
                            - {episode}
                        </Text>
                    )}
                )}
            </View>
        );
    }

    getLocation(location) {

        if (location.url != "") {
            return (
                <Text
                    style={styles.infoLink}
                    onPress={this.onLocationPressed.bind(this, location.url)}
                >
                    {location.name}
                </Text>
            );
        } else {
            return (
                <Text>
                    {location.name}
                </Text>
            );
        }
    }

    onLocationPressed(locationUrl) {

        var locationId = locationUrl.split("/").pop()
        this.props.navigation.navigate('LocationDetails', { locationId: locationId});
    }

    onEpisodePressed(episodeUrl) {

        var episodeId = episodeUrl.split("/").pop()
        this.props.navigation.navigate('EpisodeDetails', { episodeId: episodeId });
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
    headerContainer: {
        flex: 0,
        justifyContent: 'center',
        flexDirection: 'row',
        marginBottom: 5,
    },
    image: {
        width: 150,
        height: 150,
    },
    infoContainer: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'center',
    },
    infoTitle: {
        marginVertical: 3,
    },
    infoLink: {
        color: 'blue',
    },
    item: {
        marginVertical: 5,
    },
    episodesContainer: {
        flexDirection: 'column',
        marginTop: 20,
    },
    episodeTitle: {
        fontWeight: 'bold',
        fontSize: 17,
    },
    episode: {
        paddingHorizontal: 2,
        marginHorizontal: 2,
        marginVertical: 5,
        color: 'blue'
    },
    favouriteHeaderButton: {
        marginStart: 10,
        marginEnd: 10,
    }
});