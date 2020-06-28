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

export default class LocationDetails extends Component {
    
    constructor(props) {
        super(props);
    
        params = props.route.params;
        this.scrollValue = new Animated.Value(0);
        this.locationId = params.locationId;
        this.state = {
            location: null,
            characters: null,
        };
        this.apiClient = new RickAndMortyApiClient();
        this.isLoading = true;
        this.isLoadingCharacters = true;
    
        props.navigation.setOptions({
          title: "",
        });
    }
  
    componentDidMount() {

        this.apiClient.getLocation(this.locationId)
            .then( location => {

                this.isLoading = false;
                this.setState({
                    ...this.state,
                    location: location,
                })
                this.getCharacters(location.residents)
                this.props.navigation.setOptions({
                    title: location.name,
                });
            })
            .catch( error => {
                console.error(error)
            })
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
    
    render() {
        
        if (this.isLoading) {
            return (
                <View style={{flex: 1}}>
                    <ActivityIndicator style={styles.loading} size="large"/>
                </View>
            );
        }

        location = this.state.location;

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
                {this.renderHeader(location)}
                {this.renderCharacters()}
            </Animated.ScrollView>
          );
    }

    renderHeader(location) {
        
        return (
            <View style={styles.infoContainer}>
                <Text>Type: {location.type}</Text>
                <Text>Dimension: {location.dimension}</Text>
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
});