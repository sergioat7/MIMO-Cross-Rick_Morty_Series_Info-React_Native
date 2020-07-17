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

    getCharacter(characterIds) {

        var ids = ""
        for (i in characterIds) {
            ids += characterIds[i]
            ids += ","
        }
        
        let url = `${RickAndMortyApiClient.BASE_URL}/character/${ids}`;
        return fetch(url)
                .then( response => response.json() );
    }

    getLocations(page) {
        
        let url = `${RickAndMortyApiClient.BASE_URL}/location?page=${page}`;
        return fetch(url)
                .then( response => response.json() )
                .then( responseJSON => ({
                    resultLocations: responseJSON.results,
                    numberOfPages: responseJSON.info.pages
                }) );
    }

    getLocation(locationId) {
        
        let url = `${RickAndMortyApiClient.BASE_URL}/location/${locationId}`;
        return fetch(url)
                .then( response => response.json() );
    }

    getEpisodes(page) {
        
        let url = `${RickAndMortyApiClient.BASE_URL}/episode?page=${page}`;
        return fetch(url)
                .then( response => response.json() )
                .then( responseJSON => ({
                    resultEpisodes: responseJSON.results,
                    numberOfPages: responseJSON.info.pages
                }) );
    }

    getEpisode(episodeId) {
        
        let url = `${RickAndMortyApiClient.BASE_URL}/episode/${episodeId}`;
        return fetch(url)
                .then( response => response.json() );
    }
}