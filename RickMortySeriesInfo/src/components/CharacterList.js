import React, { Component } from 'react';
import {
    View,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    RefreshControl,
} from 'react-native';
import RickAndMortyApiClient from '../api/RickAndMortyApiClient'
import CharacterRow from '../views/CharacterRow'

export default class CharacterList extends Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            characters: [],
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
            .then( ({resultCharacters, numberOfPages}) => {
            
                let characters = resultCharacters.map( character => {
                    return {
                        key: character.id.toString(),
                        character: character
                    }
                });
                this.setState({
                    ...this.state,
                    characters: this.nextPage == 1 ? characters : this.state.characters.concat(characters),
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
        return this.apiClient.getCharacters(page);
    }
    
    render() {

        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.characters}
                    ListFooterComponent={this.renderFooter.bind(this)}
                    renderItem={ this.renderRow.bind(this) }
                    keyExtractor={(_, index) => index.toString()}
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
        
        var character = rowInfo.item.character;
        return (
            <CharacterRow
                character={character}
                showStatus={false}
                onPress={this.onCharacterPressed.bind(this, character)}
            />
        );
    }

    renderFooter() {
        return (this.state.isLoading ? <ActivityIndicator size="large" color="#0000ff"/> : null);
    }

    onPullToRefresh() {

        this.nextPage = 1;

        this.setState({
            characters: [],
            isRefreshing: true,
        }, this.loadNextPage() );
    }
    
    onCharacterPressed(character) {
        this.props.navigation.push('CharacterDetails', { characterId: character.id });
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