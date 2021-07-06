require("dotenv").config();

const axios = require("axios");

const AirtableApi = require("./src/airtable");
const HighlevelApi = require("./src/Highlevel");
const { liveCampaigns, mapContact, campaignsToRun, campaignsDueToday } = require("./src/helpers");

const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const numContacts = 1;

(async () => {
    try {
        const getCampaigns = await Airtable.getCampaigns("CRM");
        let campaigns = liveCampaigns(getCampaigns);
        campaigns = campaignsDueToday(campaigns);
        campaigns = campaignsToRun(campaigns);

        campaigns = campaigns.filter((campaign) => campaign.Client === "Greenscape");

        for (let i = 0; i < numContacts; i++) {
            for (let campaign of campaigns) {
                let view = "First Lines";

                if ("Tag" in campaign) {
                    view = `First Lines - ${campaign.Tag}`;
                }

                const contact = await Airtable.getContact(campaign["Base ID"], view);

                if (contact) {
                    const highLevelContact = mapContact(contact);

                    await axios.post(
                        "https://greenscape.netlify.app/.netlify/functions/addToPipedrive",
                        highLevelContact
                    );
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
})();
