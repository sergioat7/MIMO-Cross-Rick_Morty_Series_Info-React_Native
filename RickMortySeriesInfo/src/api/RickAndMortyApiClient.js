export default class RickAndMortyApiClient {
    
    static BASE_URL = 'https://rickandmortyapi.com/api';

    getCharacters(page) {
        
        let url = `${RickAndMortyApiClient.BASE_URL}/character?page=${page}`;
        return fetch(url)
                .then( response => response.json() )
                .then( responseJSON => ({
                    resultCharacters: responseJSON.results,
                    numberOfPages: responseJSON.info.pages
                }) );
    }

    getCharacter(characterId) {
        
        let url = `${RickAndMortyApiClient.BASE_URL}/character/${characterId}`;
        return fetch(url)
                .then( response => response.json() );
    }
}