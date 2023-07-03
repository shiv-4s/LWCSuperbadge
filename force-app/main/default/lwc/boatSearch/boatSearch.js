import { LightningElement } from 'lwc';

export default class BoatSearch extends LightningElement {
    isLoading = false;
    boatTypeId; 

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
        this.boatTypeId = event.detail.boatTypeId;
        this.template.querySelector('c-boat-search-results').searchBoats(this.boatTypeId);
        console.log("++++boatTypeId+++++++ " + this.boatTypeId);
    }

    createNewBoat() { }
}