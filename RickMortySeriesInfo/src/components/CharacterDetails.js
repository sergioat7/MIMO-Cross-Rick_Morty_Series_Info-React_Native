import React, { Component } from 'react';
import {
  View
} from 'react-native';
import RickAndMortyApiClient from '../api/RickAndMortyApiClient'

export default class MovieDetails extends Component {
    
    constructor(props) {
        super(props);
    
        params = props.route.params;
        this.characterId = params.character.id;
        this.state = {
            character: params.character,
        };
        this.apiClient = new RickAndMortyApiClient();
    
        props.navigation.setOptions({
          title: params.character.name,
        });
      }
    
    render() {
        return (
        <View />
        );
    }
}