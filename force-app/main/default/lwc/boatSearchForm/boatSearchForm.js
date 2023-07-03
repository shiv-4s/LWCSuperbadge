import { LightningElement, wire } from 'lwc';
import getBoatTypes from '@salesforce/apex/BoatDataService.getBoatTypes';
export default class BoatSearchForm extends LightningElement {
    value = 'All Types';
    searchOptions;
    selectedBoatTypeId = ''; 
    error = undefined; 

    @wire(getBoatTypes)
    boatTypes({ error, data }) {
        if (data) {
            console.log("++++data++++", JSON.stringify(data));
           // this.searchOptions = JSON.parse(JSON.stringify(data));
            this.searchOptions = data.map(type => {
                console.log("+++++type+++++", type);
                return { label: type.Name, value: type.Id };
                });
            this.searchOptions.unshift({ label: 'All Types', value: '' });
        } else if (error) {
            this.searchOptions = undefined;
            console.log("++++++error: " + error);
            //this.error = error;
        }
    }

    // Fires event that the search option has changed.
    // passes boatTypeId (value of this.selectedBoatTypeId) in the detail
    handleSearchOptionChange(event) {
        console.log("+++++DOM+++++", event.target);
        this.selectedBoatTypeId = event.target.value;
        console.log("++++selectedBoatTypeId++++ " + this.selectedBoatTypeId);
        const searchEvent = new CustomEvent('search', { detail : {boatTypeId : this.selectedBoatTypeId}});
        this.dispatchEvent(searchEvent);
    }
}