import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    ActivityIndicator,
    FlatList,
} from 'react-native';
import RickAndMortyApiClient from '../api/RickAndMortyApiClient'
import EpisodeRow from '../views/EpisodeRow'

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
            <View style={styles.container}>
                {/* <ActivityIndicator size="large" color="#0000ff" animating={this.isLoading} /> */}
                <FlatList 
                    data={this.state.episodes}
                    renderItem={ this.renderRow.bind(this) }
                    onEndReached={() => {
                        this.loadNextPage();
                    }}
                />
            </View>
        );
    }
        
    renderRow(rowInfo) {
        
        var episode = rowInfo.item.episode;
        return (
            <EpisodeRow
                episode={episode}
                onPress={this.onEpisodePressed.bind(this, episode)}
            />
        );
    }
    
    onEpisodePressed(episode) {
        //TODO go to episode detail
        console.log(episode.id)
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