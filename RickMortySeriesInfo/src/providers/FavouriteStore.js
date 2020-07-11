import {
    action,
    observable
} from 'mobx';

export default class FavouriteStore {
    
  @observable isLoading = true;


  @action loadingCompleted() {
    this.isLoading = false;
  }

  @action toggleLoading() {
      this.isLoading = !this.isLoading;
  }
}