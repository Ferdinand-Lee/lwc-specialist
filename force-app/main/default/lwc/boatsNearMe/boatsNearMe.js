import getBoatsByLocation from "@salesforce/apex/BoatDataService.getBoatsByLocation";
import { reduceErrors } from "c/ldsUtils";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { api, LightningElement, track, wire } from "lwc";
const LABEL_YOU_ARE_HERE = 'You are here!';
const ICON_STANDARD_USER = 'standard:user';
const ERROR_TITLE = 'Error loading Boats Near Me';
const ERROR_VARIANT = 'error';
export default class BoatsNearMe extends LightningElement {
  @api boatTypeId;
  @track mapMarkers = [];
  @track isLoading = true;
  isRendered;
  @track latitude;
  @track longitude;

  // Add the wired method from the Apex Class
  // Name it getBoatsByLocation, and use latitude, longitude and boatTypeId
  // Handle the result and calls createMapMarkers
  @wire(getBoatsByLocation, { latitude: '$latitude', longitude: '$longitude', boatTypeId: '$boatTypeId' })
  wiredBoatsJSON({ error, data }) {
    if (error) {
      this.dispatchEvent(new ShowToastEvent({
        title: ERROR_TITLE,
        message: reduceErrors(ERROR_TITLE),
        variant: ERROR_VARIANT
      }));
    } else if (data) {
      this.createMapMarkers(data);
    }
    this.isLoading = false;
  }

  // Controls the isRendered property
  // Calls getLocationFromBrowser()
  renderedCallback() {
    if (!this.isRendered) {
      this.getLocationFromBrowser();
      this.isRendered = true;
    }
  }

  // Gets the location from the Browser
  // position => {latitude and longitude}
  getLocationFromBrowser() {
    navigator.geolocation.getCurrentPosition(position => {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
    })
  }

  // Creates the map markers
  createMapMarkers(boatData) {
    this.mapMarkers = [
      {
        location: {
          Latitude: this.latitude,
          Longitude: this.longitude
        },
        icon: ICON_STANDARD_USER,
        title: LABEL_YOU_ARE_HERE
      },
      ...JSON.parse(boatData).map(boat => ({
        localocation: {
          Latitude: boat.Geolocation__Latitude__s,
          Longitude: boat.Geolocation__Longitude__s
        },
        title: boat.Name
      }))
    ];
  }
}