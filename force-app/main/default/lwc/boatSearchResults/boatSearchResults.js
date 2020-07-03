import { refreshApex } from '@salesforce/apex';
import getBoats from "@salesforce/apex/BoatDataService.getBoats";
import BOATMC from "@salesforce/messageChannel/BoatMessageChannel__c";
import { reduceErrors } from 'c/ldsUtils';
import { MessageContext, publish } from 'lightning/messageService';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from 'lightning/uiRecordApi';
import { api, LightningElement, track, wire } from 'lwc';

export default class BoatSearchResults extends LightningElement {
  @track selectedBoatId;
  columns = [
    { label: 'Name', fieldName: 'Name', editable: true, type: 'text' },
    { label: 'Length', fieldName: 'Length__c', editable: true, type: 'number' },
    { label: 'Price', fieldName: 'Price__c', editable: true, type: 'currency', typeAttributes: { currencyCode: 'USD' } },
    { label: 'Description', fieldName: 'Description__c', editable: true, type: 'text' }
  ];
  @track boatTypeId = '';
  @track boats
  isLoading = false;

  // wired message context
  @wire(MessageContext)
  messageContext;

  @wire(getBoats, { boatTypeId: '$boatTypeId' })
  wiredBoats(result) {
    this.boats = result;
    this.notifyLoading(false);
  }

  // public function that updates the existing boatTypeId property
  // uses notifyLoading
  @api
  searchBoats(boatTypeId) {
    this.boatTypeId = boatTypeId;
    this.notifyLoading(true);
  }

  // this public function must refresh the boats asynchronously 
  // uses notifyLoading
  @api
  async refresh() {
    this.notifyLoading(true);
    await refreshApex(this.boats);
    this.notifyLoading(false);
  }

  // this function must update selectedBoatId and call sendMessageService
  updateSelectedTile(event) {
    this.selectedBoatId = event.detail.boatId;
    this.sendMessageService(this.selectedBoatId);
  }

  // Publishes the selected boat Id on the BoatMC.
  sendMessageService(boatId) {
    publish(this.messageContext, BOATMC, { recordId: boatId });
  }

  // This method must save the changes in the Boat Editor
  // Show a toast message with the title
  // clear lightning-datatable draft values
  handleSave(event) {
    const recordInputs = event.detail.draftValues.slice().map(draft => {
      const fields = Object.assign({}, draft);
      return { fields };
    });
    const promises = recordInputs.map(recordInput =>
      //update boat record
      updateRecord(recordInput)
    );
    Promise.all(promises)
      .then(() => {
        this.dispatchEvent(new ShowToastEvent({
          title: 'Success',
          message: 'Ship It!',
          variant: 'success'
        }));
        this.refresh();
        this.template.querySelector('lightning-datatable').draftValues = [];
      })
      .catch(error => {
        this.dispatchEvent(new ShowToastEvent({
          title: 'Error',
          message: reduceErrors(error),
          variant: 'error'
        }));
      })
      .finally(() => { });
  }
  // Check the current value of isLoading before dispatching the doneloading or loading custom event
  notifyLoading(isLoading) {
    if (this.isLoading === isLoading) return
    this.isLoading = isLoading;
    if (isLoading) {
      this.dispatchEvent(new CustomEvent('loading'));
    } else {
      this.dispatchEvent(new CustomEvent('doneloading'));
    }
  }
}