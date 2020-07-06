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
import DoubleTap from '../views/DoubleTap';

export default class CharacterDetails extends Component {
    
    constructor(props) {
        super(props);
    
        params = props.route.params;
        this.scrollValue = new Animated.Value(0);
        this.springValue  = new Animated.Value(0);
        this.likedValue = new Animated.Value(0);
        this.characterId = params.characterId;
        this.key = 'character' + params.characterId;
        this.state = {
            character: null,
            initialAnimation: true,
            isFavourite: false,
            isSettingFavourite: false,
        };
        this.apiClient = new RickAndMortyApiClient();
        this.isLoading = true
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

        this.springValue.setValue(0)
        Animated.spring(this.springValue, {
            toValue: 1,
            friction: 1,
            useNativeDriver: true,
        }).start(() => {
            this.setState({
                ...this.state,
                initialAnimation: false,
            })
        })
    }

    renderRightHeader() {

        var iconName = this.state.isFavourite ? 'heart' : 'hearto';
        if (this.state.isSettingFavourite) {
            return (
                <ActivityIndicator style={styles.loading} size="large"/>
            );
        } else {
            return (
                <Icon
                    name={iconName}
                    size={25}
                    style={styles.favouriteHeaderButton}
                    onPress={this.onFavouriteButtonPressed.bind(this)}
                />
            );
        }
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
                <DoubleTap onDoubleTap={this.onFavouriteButtonPressed.bind(this)}>
                    <View>
                        <Animated.Image 
                            style={[styles.image, { transform: [{scale: this.springValue}] }]}
                            resizeMode="contain"
                            source={{ uri: character.image }} 
                        />
                        {this.renderOverlay()}
                    </View>
                </DoubleTap>
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

    renderOverlay() {

        const imageStyles = [{
            opacity: this.likedValue,
            transform: [{
                scale: this.likedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.7, 1.5],
                }),
            }],
        }];

        var iconName = this.state.isFavourite ? 'heart' : 'hearto';

        return (
          <View style={styles.overlay}>
              <Animated.View style={imageStyles}>
                <Icon
                    name={iconName}
                    size={25}
                    style={styles.favouriteHeaderButton}
                />
              </Animated.View>
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
        this.props.navigation.push('LocationDetails', { locationId: locationId});
    }

    onEpisodePressed(episodeUrl) {

        var episodeId = episodeUrl.split("/").pop()
        this.props.navigation.push('EpisodeDetails', { episodeId: episodeId });
    }

    onFavouriteButtonPressed() {

        this.setState({
            isSettingFavourite: true
        });
        var value = (!this.state.isFavourite).toString();
        AsyncStorage.setItem(this.key, value).then( () => {
            this.setState({
                isFavourite: !this.state.isFavourite,
                isSettingFavourite: false
            });
            Animated.sequence([
                Animated.spring(this.likedValue, { toValue: 1, useNativeDriver: true }),
                Animated.spring(this.likedValue, { toValue: 0, useNativeDriver: true }),
            ]).start();
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
    overlay: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
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
        color: 'red',
    },
});