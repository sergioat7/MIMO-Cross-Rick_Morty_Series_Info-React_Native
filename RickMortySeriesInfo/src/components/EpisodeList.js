import React, { Component } from 'react';
import {
    View
} from 'react-native';
import RickAndMortyApiClient from '../api/RickAndMortyApiClient'

export default class EpisodeList extends Component {
    
    constructor(props) {
        super(props);
        
        this.state = { episodes: [] };
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
            .then( ({resultEpisodes, numberOfPages}) => {
            
                let episodes = resultEpisodes.map( episode => {
                    return {
                        key: episode.id.toString(),
                        episode: episode
                    }
                })
                this.setState({
                    episodes: this.state.episodes.concat(episodes)
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
        return this.apiClient.getEpisodes(page);
    }
    
    render() {

        return (
            <View />
        );
    }
}