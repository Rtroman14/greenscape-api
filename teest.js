require("dotenv").config();

const moment = require("moment");
const axios = require("axios");

const AirtableApi = require("./src/airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);
const PipedriveApi = require("./functions/utils/Pipedrive");
const Pipedrive = new PipedriveApi(process.env.PIPEDRIVE_API);

(async (event) => {
    try {
        // const summaLeadSource = await Pipedrive.getPersonFields("Lead Source", "Summa");
        // console.log(summaLeadSource);
        const contact = await Airtable.getContact("appRGIOnGz04cUXz3", "recoZviPZlLEhRSSp");
        // console.log(contact);

        // const leadSource = await Pipedrive.personFields("Lead Source");
        // console.log(leadSource);
        // const summaLeadSource = leadSource.options.find((option) => option.label === "Summa");
        // console.log(summaLeadSource);

        const leadSource = await Pipedrive.dealFields("Lead Source");
        const summaLeadSource = leadSource.options.find((option) => option.label === "Summa");
        console.log(summaLeadSource);
    } catch (error) {
        console.log(error);
    }
})();
