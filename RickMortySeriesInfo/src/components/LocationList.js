
import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    ActivityIndicator,
    FlatList,
} from 'react-native';
import RickAndMortyApiClient from '../api/RickAndMortyApiClient'
import LocationRow from '../views/LocationRow'

export default class LocationList extends Component {
    
    constructor(props) {
        super(props);
        
        this.state = { locations: [] };
        this.apiClient = new RickAndMortyApiClient();
        this.nextPage = 1;
        this.numberOfPages = 1;
        this.isLoading = false;
    }
    
    componentDidMount() {
        this.loadNextPage()
    }
    
    loadNextPage() {

        if (this.nextPage > this.numberOfPages) {
            return;
        }
        
        if (this.isLoading) {
            return;
        }
        
        this.isLoading = true;
        
        this.loadPage(this.nextPage)
            .then( ({resultLocations, numberOfPages}) => {
            
                let locations = resultLocations.map( location => {
                    return {
                        key: location.id.toString(),
                        location: location
                    }
                })
                this.setState({
                    locations: this.state.locations.concat(locations)
                });
                this.nextPage++;
                this.numberOfPages = numberOfPages;
            })
            .catch( error => {
                console.error(error);
            })
            .finally( () => {
                this.isLoading = false;
            });
    }
    
    loadPage(page) {
        return this.apiClient.getLocations(page);
    }
    
    render() {

        return (
            <View style={styles.container}>
                {/* <ActivityIndicator size="large" color="#0000ff" animating={this.isLoading} /> */}
                <FlatList 
                    data={this.state.locations}
                    renderItem={ this.renderRow.bind(this) }
                    onEndReached={() => {
                        this.loadNextPage();
                    }}
                />
            </View>
        );
    }
        
    renderRow(rowInfo) {
        
        var location = rowInfo.item.location;
        return (
            <LocationRow
                location={location}
                onPress={this.onLocationPressed.bind(this, location)}
            />
        );
    }
    
    onLocationPressed(location) {
        this.props.navigation.navigate('LocationDetails', { locationId: location.id, locationName: location.name });
    }
}

const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: '#f5fcff',
    },
});