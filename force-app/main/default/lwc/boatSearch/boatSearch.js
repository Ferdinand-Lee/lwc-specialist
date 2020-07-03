import { NavigationMixin } from 'lightning/navigation';
import { LightningElement, track } from 'lwc';

export default class BoatSearch extends NavigationMixin(LightningElement) {
  @track isLoading = false;

  // Handles loading event
  handleLoading() {
    this.isLoading = true;
  }

  // Handles done loading event
  handleDoneLoading() {
    this.isLoading = false;
  }

  // Handles search boat event
  // This custom event comes from the form
  searchBoats(event) {
    const searchResult = this.template.querySelector('c-boat-search-results');
    searchResult.searchBoats(event.detail.boatTypeId);
  }

  createNewBoat() {
    this[NavigationMixin.Navigate]({
      type: 'standard__objectPage',
      attributes: {
        objectApiName: 'Boat__c',
        actionName: 'new'
      },
      state: {
        defaultFieldValues: '',
        nooverride: '1'
      }
    });
  }
}