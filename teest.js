require("dotenv").config();

const axios = require("axios");

const AirtableApi = require("./src/airtable");
const HighlevelApi = require("./src/Highlevel");
const { liveCampaigns, mapContact, campaignsToRun, campaignsDueToday } = require("./src/helpers");
const pipedrivePerson = require("./functions/utils/pipedrivePerson");

const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

(async () => {
    try {
        const contact = await Airtable.getContact("appRGIOnGz04cUXz3", "recRwrhXXNT6P3ckn");

        console.log(contact);
    } catch (error) {
        console.log(error);
    }
})();
