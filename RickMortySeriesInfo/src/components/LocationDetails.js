import React, { Component } from 'react';
import {
    View,
    Animated,
    StyleSheet,
    ActivityIndicator,
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
            </Animated.ScrollView>
          );
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
});