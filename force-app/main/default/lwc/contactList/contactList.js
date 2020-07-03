import getContacts from '@salesforce/apex/ContactController.getContacts';
import CONTACT_EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import CONTACT_FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import CONTACT_LASTNAME_FIELD from '@salesforce/schema/Contact.LastName';
import { LightningElement, wire } from 'lwc';
import { reduceErrors } from 'c/ldsUtils';
const COLUMNS = [
  { label: 'FirstName', fieldName: CONTACT_FIRSTNAME_FIELD.fieldApiName, type: 'text' },
  { label: 'LastName', fieldName: CONTACT_LASTNAME_FIELD.fieldApiName, type: 'text' },
  { label: 'Email', fieldName: CONTACT_EMAIL_FIELD.fieldApiName, type: 'email' }
];
export default class ContactList extends LightningElement {
  columns = COLUMNS

  @wire(getContacts)
  contacts;

  get errors() {
    return (this.contacts.error) ?
      reduceErrors(this.contacts.error) : [];
  }
}