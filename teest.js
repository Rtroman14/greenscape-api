require("dotenv").config();

const moment = require("moment");
const axios = require("axios");

const AirtableApi = require("./src/airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);
const PipedriveApi = require("./functions/utils/Pipedrive");
const Pipedrive = new PipedriveApi(process.env.PIPEDRIVE_API);

(async (event) => {
    try {
        const contact = await Airtable.getContact("appRGIOnGz04cUXz3", "recRwrhXXNT6P3ckn");

        // add activity if Scheduled Call
        if ("Scheduled Meeting" in contact) {
            await axios.post("https://greenscape.netlify.app/.netlify/functions/activity", {
                contact,
            });
        }
    } catch (error) {
        console.log(error);
    }
})();
