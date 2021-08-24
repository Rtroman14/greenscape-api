require("dotenv").config();

const moment = require("moment");
const axios = require("axios");

const AirtableApi = require("./src/airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);
const PipedriveApi = require("./functions/utils/Pipedrive");
const Pipedrive = new PipedriveApi(process.env.PIPEDRIVE_API);

(async (event) => {
    try {
        // get all contacts in "Texted" view
        // loop through everyone contact
        // find contact in PD && update lead source
        // find every organization in PD && update lead source
        const contacts = await Airtable.getContacts("appRGIOnGz04cUXz3", "Texted");

        for (let contact of contacts) {
            const pdContact = await Pipedrive.findPersonName(contact["Full Name"]);

            const updatedPerson = await Pipedrive.updatePerson(pdContact.id, {
                b5bcd14be147c43d1d3604129ddb83b7be1d9978: "215",
            });

            if (updatedPerson) {
                console.log(`Updated lead source for: ${updatedPerson.name}`);
            } else {
                console.log(`ERROR with contact: ${pdContact.name}`);
            }
        }
    } catch (error) {
        console.log(error);
    }
})();
