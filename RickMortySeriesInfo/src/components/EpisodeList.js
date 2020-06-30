import React, { Component } from 'react';
import {
    View,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    RefreshControl,
} from 'react-native';
import RickAndMortyApiClient from '../api/RickAndMortyApiClient'
import EpisodeRow from '../views/EpisodeRow'

export default class EpisodeList extends Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            episodes: [],
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
            .then( ({resultEpisodes, numberOfPages}) => {
            
                let episodes = resultEpisodes.map( episode => {
                    return {
                        key: episode.id.toString(),
                        episode: episode
                    }
                });
                this.setState({
                    ...this.state,
                    episodes: this.nextPage == 1 ? episodes : this.state.episodes.concat(episodes),
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
        return this.apiClient.getEpisodes(page);
    }
    
    render() {

        return (
            <View style={styles.container}>
                <FlatList 
                    data={this.state.episodes}
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
        
        var episode = rowInfo.item.episode;
        return (
            <EpisodeRow
                episode={episode}
                onPress={this.onEpisodePressed.bind(this, episode)}
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