import React, { Component } from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';
import RickAndMortyApiClient from '../api/RickAndMortyApiClient'

export default class EpisodeList extends Component {
    
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
            <View style={styles.container} />
        );
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