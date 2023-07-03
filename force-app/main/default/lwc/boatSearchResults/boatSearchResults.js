import { LightningElement, api, wire } from 'lwc';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';
import updateBoatList from '@salesforce/apex/BoatDataService.updateBoatList';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';
import { MessageContext, publish} from 'lightning/messageService';
const SUCCESS_TITLE = 'Success';
const MESSAGE_SHIP_IT     = 'Ship it!';
const SUCCESS_VARIANT     = 'success';
const ERROR_TITLE   = 'Error';
const ERROR_VARIANT = 'error'; 

export default class BoatSearchResults extends LightningElement {
    
    selectedBoatId;
    columns = [];
    boatTypeId = '';
    boats;
    isLoading = false;

    // wired message context
    @wire(MessageContext)
    messageContext;
    // wired getBoats method 
    @wire(getBoats,{boatTypeId:'$boatTypeId'})
    wiredBoats(result) {
        this.boats = JSON.parse(JSON.stringify(result.data));
        console.log("++++boats24+++",JSON.stringify(this.boats));
    }

    // public function that updates the existing boatTypeId property
    // uses notifyLoading 
    @api
    searchBoats(boatTypeId){
        this.boatTypeId = boatTypeId;
        this.notifyLoading(this.isLoading);
        getBoats({boatTypeId: boatTypeId})
        .then(result=>{
            console.log("++++result+++",JSON.stringify(result));
        })
        .catch(error=>{
            console.log("++++error+++",error);
        })
    }

    
    // this public function must refresh the boats asynchronously
    // uses notifyLoading
    refresh() {
        this.isLoading = true;
        this.notifyLoading(this.isLoading);
    }
    
    // this function must update selectedBoatId and call sendMessageService
    updateSelectedTile() { 
        this.selectedBoatId = this.boatTypeId;
        this.sendMessageService(this.selectedBoatId);
    }
    
    // Publishes the selected boat Id on the BoatMC.
    sendMessageService(boatId) { 
        // explicitly pass boatId to the parameter recordId
        publish(
            messageContext,
            BOATMC,{recordId: boatId,message: MESSAGE_SHIP_IT}
            );
    }

     // The handleSave method must save the changes in the Boat Editor
    // passing the updated fields from draftValues to the 
    // Apex method updateBoatList(Object data).
    // Show a toast message with the title
    // clear lightning-datatable draft values
    handleSave(event) { 
        // notify loading
        const updatedFields = event.detail.draftValues;
        // Update the records via Apex
        updateBoatList({data: updatedFields})
        .then((result) => {
            console.log("++++result+++",JSON.stringify(result));
        })
        .catch(error => {
            const evt = new ShowToastEvent({
                title: ERROR_TITLE,
                message: error,
                variant: ERROR_VARIANT,
            });
            this.dispatchEvent(evt);
        })
        .finally(() => {});
    }
    // Check the current value of isLoading before dispatching the doneloading or loading custom event
    notifyLoading(isLoading) { 
        if (isLoading) {
            this.dispatchEvent(
                new CustomEvent('loading', {
                    detail: {
                        title: SUCCESS_TITLE,
                        variant: SUCCESS_VARIANT
                    }
                })
            );
        } else {
            this.dispatchEvent(
                new CustomEvent('doneloading', {
                    detail: {
                        title: SUCCESS_TITLE,
                        variant: SUCCESS_VARIANT
                    }
                })
            );
        }
    }
    
}