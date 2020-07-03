import { LightningElement, track } from 'lwc';
export default class BoatEditor extends LightningElement {
  columns = [
    { label: 'Name', fieldName: 'Name', editable: true, type: 'text' },
    { label: 'Length', fieldName: 'Length__c', editable: true, type: 'number' },
    { label: 'Price', fieldName: 'Price__c', editable: true, type: 'currency', typeAttributes: { currencyCode: 'USD' } },
    { label: 'Description', fieldName: 'Description__c', editable: true, type: 'text' }
  ]

  @track data = []
  handleSave(event) {

  }
}