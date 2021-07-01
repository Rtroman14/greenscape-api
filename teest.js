require("dotenv").config();

const moment = require("moment");

const AirtableApi = require("./src/airtable");
const HighlevelApi = require("./src/Highlevel");
const {
    liveCampaigns,
    mapContact,
    minutesWait,
    campaignsToRun,
    campaignsDueToday,
} = require("./src/helpers");
const slackNotification = require("./src/slackNotification");
const addToPipedrive = require("./src/addToPipedrive");

const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const today = moment(new Date()).format("MM/DD/YYYY");

const numContacts = 1;

(async () => {
    try {
        const getCampaigns = await Airtable.getCampaigns("CRM");
        let campaigns = liveCampaigns(getCampaigns);
        campaigns = campaignsDueToday(campaigns);
        campaigns = campaignsToRun(campaigns);

        campaigns = campaigns.find((campaign) => campaign.Client === "Greenscape");

        console.log(campaigns);
    } catch (error) {
        console.log(error);
    }
})();
