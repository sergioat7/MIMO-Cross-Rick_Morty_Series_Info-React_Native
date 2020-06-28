import React, { Component } from 'react';
import {
    View,
    Animated,
    StyleSheet,
    ActivityIndicator,
    Text,
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
        };
        this.apiClient = new RickAndMortyApiClient();
        this.isLoading = true;
    
        props.navigation.setOptions({
          title: "",
        });
    }
  
    componentDidMount() {

        this.apiClient.getLocation(this.locationId)
            .then( location => {
                this.isLoading = false;
                this.setState({ location: location });
                this.props.navigation.setOptions({
                    title: location.name,
                });
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
                {this.renderCharacters(location)}
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
  
    renderCharacters(location) {

        if (location.residents == null) {
            return [];
        }

        return (
            <View style={[styles.item, styles.charactersContainer]}>
                <Text style={styles.characterTitle}>Residents:</Text>
                {location.residents.map( resident => {
                    return (
                        <Text
                            style={styles.character}
                            key={resident}
                            onPress={this.onCharacterPressed.bind(this, resident)}
                        >
                            - {resident}
                        </Text>
                    )}
                )}
            </View>
        );
    }

    onCharacterPressed(characterUrl) {

        var characterId = characterUrl.split("/").pop()
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
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20,
    },
    characterTitle: {
        fontWeight: 'bold',
        fontSize: 17,
    },
    character: {
        paddingHorizontal: 2,
        marginHorizontal: 2,
        marginVertical: 5,
        color: 'blue'
    },
});