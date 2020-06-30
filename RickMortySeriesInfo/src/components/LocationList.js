import React, { Component } from 'react';
import {
    View,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    RefreshControl,
} from 'react-native';
import RickAndMortyApiClient from '../api/RickAndMortyApiClient'
import LocationRow from '../views/LocationRow'

export default class LocationList extends Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            locations: [],
            isLoading: false,
            isRefreshing: false,
        };
        this.apiClient = new RickAndMortyApiClient();
        this.nextPage = 1;
        this.numberOfPages = 1;
    }
    
    componentDidMount() {
        this.loadNextPage()
    }
    
    loadNextPage() {

        if (this.nextPage > this.numberOfPages) {
            return;
        }
        
        if (this.state.isLoading) {
            return;
        }
        
        this.setState({
            ...this.state,
            isLoading: true,
        })
                
        this.loadPage(this.nextPage)
            .then( ({resultLocations, numberOfPages}) => {
            
                let locations = resultLocations.map( location => {
                    return {
                        key: location.id.toString(),
                        location: location
                    }
                });
                this.setState({
                    ...this.state,
                    locations: this.nextPage == 1 ? locations : this.state.locations.concat(locations),
                });
                this.nextPage++;
                this.numberOfPages = numberOfPages;
            })
            .catch( error => {
                console.error(error);
                this.setState({
                    ...this.state,
                    isLoading: false,
                    isRefreshing: false,
                });
            })
            .finally( () => {
                this.setState({
                    ...this.state,
                    isLoading: false,
                    isRefreshing: false,
                });
            });
    }
    
    loadPage(page) {
        return this.apiClient.getLocations(page);
    }
    
    render() {

        return (
            <View style={styles.container}>
                <FlatList 
                    data={this.state.locations}
                    ListFooterComponent={this.renderFooter.bind(this)}
                    renderItem={ this.renderRow.bind(this) }
                    keyExtractor={(item, index) => index.toString()}
                    onEndReached={() => {
                        this.loadNextPage();
                    }}
                    refreshControl={
                        <RefreshControl
                          refreshing={this.state.isRefreshing}
                          onRefresh={this.onPullToRefresh.bind(this)}
                        />
                    }
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

    renderFooter() {
        return (this.state.isLoading ? <ActivityIndicator size="large" color="#0000ff"/> : null);
    }

    onPullToRefresh() {

        this.setState({
            ...this.state,
            isRefreshing: true,
        })
        this.nextPage = 1;
        this.loadNextPage();
    }
    
    onLocationPressed(location) {
        this.props.navigation.navigate('LocationDetails', { locationId: location.id });
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