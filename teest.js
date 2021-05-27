require("dotenv").config();

const { findUser } = require("./functions/utils/helpers");

const PipedriveApi = require("./functions/utils/Pipedrive");
const Pipedrive = new PipedriveApi(process.env.PIPEDRIVE_API);
const AirtableApi = require("./src/airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);
const HighlevelApi = require("./functions/utils/Highlevel");
const Highlevel = new HighlevelApi(process.env.HIGHLEVEL_API);

(async () => {
    try {
        const campaigns = await Highlevel.getCampaigns();
        console.log(campaigns);
    } catch (error) {
        console.log(error.message);
    }
})();
