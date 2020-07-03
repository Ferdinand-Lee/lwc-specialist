import { api, track, LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getAllReviews from '@salesforce/apex/BoatDataService.getAllReviews';
import { reduceErrors } from 'c/ldsUtils';

// imports
export default class BoatReviews extends NavigationMixin(LightningElement) {
  // Private
  @track boatId;
  @track error;
  @track boatReviews;
  @track isLoading;

  // Getter and Setter to allow for logic to run on recordId change
  @api
  get recordId() {
    return this.boatId;
  }
  set recordId(value) {
    //sets boatId attribute
    this.setAttribute('boat-id', value);
    //sets boatId assignment
    this.boatId = value;
    //get reviews associated with boatId
    this.getReviews();
  }

  // Getter to determine if there are reviews to display
  get reviewsToShow() {
    return this.boatReviews !== null && this.boatReviews !== undefined && this.boatReviews.length
  }

  // Public method to force a refresh of the reviews invoking getReviews
  @api
  refresh() {
    this.getReviews();
  }

  // Imperative Apex call to get reviews for given boat
  // returns immediately if boatId is empty or null
  // sets isLoading to true during the process and false when it’s completed
  // Gets all the boatReviews from the result, checking for errors.
  getReviews() {
    this.isLoading = true;
    getAllReviews({ boatId: this.boatId })
      .then(boatReviews => {
        this.boatReviews = boatReviews
      })
      .catch(errors => {

      })
      .finally(() => {
        this.isLoading = false
      })
  }

  // Helper method to use NavigationMixin to navigate to a given record on click
  navigateToRecord(event) {
    this[NavigationMixin.Navigate]({
      type: 'standard__recordPage',
      attributes: {
        recordId: event.target.dataset.recordId,
        actionName: 'view',
      }
    });
  }
}
