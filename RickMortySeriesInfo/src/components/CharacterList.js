import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import RickAndMortyApiClient from '../api/RickAndMortyApiClient'
import CharacterRow from '../views/CharacterRow'

export default class CharacterList extends Component {

  constructor(props) {
    super(props);

    this.state = { characters: [] };
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
        .then( ({resultCharacters, numberOfPages}) => {

          let characters = resultCharacters.map( (character) => {
            return {
              key: character.id.toString(),
              character: character
            }
          })
          this.setState({ characters: this.state.characters.concat(characters) });
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
    return this.apiClient.getCharacters(page);
  }
  
  render() {
    return (
      <View>
        <FlatList 
          data={this.state.characters}
          renderItem={ this.renderRow.bind(this) }
          onEndReached={() => {
            this.loadNextPage();
          }}
          >
        </FlatList>
      </View>
      );
    }

    renderRow(rowInfo) {

      item = rowInfo.item;
      character = item.character;
      return (
        <CharacterRow 
          character={character}
          onPress={this.onCharacterPressed.bind(this, character)}
        />
      );
    }
  
    onCharacterPressed(character) {
      console.log(character)
    }
}