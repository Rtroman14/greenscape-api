require("dotenv").config();

const moment = require("moment");
const axios = require("axios");

const AirtableApi = require("./src/airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);
const PipedriveApi = require("./functions/utils/Pipedrive");
const Pipedrive = new PipedriveApi(process.env.PIPEDRIVE_API);

(async (event) => {
    try {
        const campaignKey = "8ea95ab608f436c0cb6ea27ddf89882754b77f63";

        const contacts = await Pipedrive.getPersons();
        // console.log(contacts);
    } catch (error) {
        console.log(error);
    }
})();
