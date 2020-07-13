import {
    action,
    observable
} from 'mobx';

export default class FavouriteStore {
    
    @observable favouriteCharacters = new Map();
  
    @action addCharacter(characterId, value) {
        this.favouriteCharacters.set(characterId, value);
    }
}