require("dotenv").config();

const axios = require("axios");

const AirtableApi = require("./src/airtable");
const HighlevelApi = require("./src/Highlevel");
const { liveCampaigns, mapContact, campaignsToRun, campaignsDueToday } = require("./src/helpers");
const pipedrivePerson = require("./functions/utils/pipedrivePerson");
const pipedriveOrganization = require("./functions/utils/pipedriveOrganization");

const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

(async () => {
    try {
        const contact = await Airtable.getContact("appRGIOnGz04cUXz3", "recRwrhXXNT6P3ckn");
        // console.log(contact);

        const { data } = await axios.post(
            "https://greenscape.netlify.app/.netlify/functions/bookedMeeting",
            {
                // recordID: "recRwrhXXNT6P3ckn",
                recordID: contact.recordID,
            }
        );

        console.log(data);
    } catch (error) {
        console.log(error);
    }
})();
