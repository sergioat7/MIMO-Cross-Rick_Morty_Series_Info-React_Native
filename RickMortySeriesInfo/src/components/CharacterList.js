import React, { Component } from 'react';
import { View } from 'react-native';
import RickAndMortyApiClient from '../api/RickAndMortyApiClient'

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
          //TODO map characters
          console.log(resultCharacters);
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
      <View />
      );
    }
}