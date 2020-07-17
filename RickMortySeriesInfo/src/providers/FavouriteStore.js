import {
    action,
    observable
} from 'mobx';

export default class FavouriteStore {
    
    // CHARACTERS
    @observable favouriteCharacters = new Map();
  
    @action addCharacter(characterId, value) {
        this.favouriteCharacters.set(characterId, value);
    }
    
    // LOCATIONS
    @observable favouriteLocations = new Map();
  
    @action addLocation(locationId, value) {
        this.favouriteLocations.set(locationId, value);
    }
    
    // EPISODES
    @observable favouriteEpisodes = new Map();
  
    @action addEpisode(episodeId, value) {
        this.favouriteEpisodes.set(episodeId, value);
    }
}