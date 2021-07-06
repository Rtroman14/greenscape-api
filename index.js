require("dotenv").config();

const moment = require("moment");
const axios = require("axios");

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

        campaigns = campaigns.filter((campaign) => campaign.Client === "Greenscape");

        for (let i = 0; i < numContacts; i++) {
            for (let campaign of campaigns) {
                const Highlevel = new HighlevelApi(campaign["API Token"]);

                let view = "First Lines";

                if ("Tag" in campaign) {
                    view = `First Lines - ${campaign.Tag}`;
                }

                const contact = await Airtable.getContact(campaign["Base ID"], view);

                if (contact) {
                    const highLevelContact = mapContact(contact);

                    try {
                        // const texted = await Highlevel.textContact(
                        //     highLevelContact,
                        //     campaign["Campaign ID"]
                        // );

                        // if (texted.status == "200") {
                        //     await Airtable.updateContact(campaign["Base ID"], contact.recordID, {
                        //         "In Campaign": true,
                        //         Campaign: campaign.Campaign,
                        //     });

                        console.log(
                            `Client: ${campaign.Client} | Campaign: ${campaign.Campaign} | texted: ${highLevelContact.name}`
                        );

                        // create contact in pipedrive
                        await axios.post(
                            "https://greenscape.netlify.app/.netlify/functions/addToPipedrive",
                            highLevelContact
                        );
                        // }
                    } catch (error) {
                        // // RUNS IF ERROR WHILE TEXTING
                        // await Airtable.updateContact(campaign["Base ID"], contact.recordID, {
                        //     Error: true,
                        // });

                        console.log(
                            `ERROR TEXTING CONTACT --- ${campaign.Client} --- ${error.message}`
                        );
                    }
                } else {
                    // remove campaign from list
                    campaigns = campaigns.filter(
                        (currentCampaign) => currentCampaign.Campaign !== campaign.Campaign
                    );

                    await Airtable.updateCampaign(campaign.recordID, {
                        "Campaign Status": "Need More Contacts",
                    });

                    await slackNotification(
                        `\n*Client:* ${campaign.Client}\n*Campaign:* ${campaign.Campaign} \n*Number of contacts:* 0\n`
                    );
                }

                // if (i === numContacts - 1) {
                //     const contacts = await Airtable.getContacts(campaign["Base ID"], view);

                //     if (contacts.length < 100) {
                //         await slackNotification(
                //             `\n*Client:* ${campaign.Client}\n*Campaign:* ${campaign.Campaign} \n*Number of contacts:* ${contacts.length}\n`
                //         );
                //     }
                // }
            }

            console.log(`\n --- Texts sent: ${i + 1} --- \n`);
            // await minutesWait(2);
        }

        // for (let campaign of campaigns) {
        //     // run at the end of loop
        //     await Airtable.updateCampaign(campaign.recordID, {
        //         "Last Updated": today,
        //     });

        //     await minutesWait(0.05);
        // }
    } catch (error) {
        console.log(error);
    }
})();

// 1. Add "await addToPipedrive(highLevelContact);" to textCampaign code
//      a. Migrate all necessary code to textCampaign
// 2. In pipedrivePerson.js --> find Chris Pegram, uncomment his id when creating person
//      a. Change "visible_to" to all
// 3. Update "const org = orgInfo(address);" in pipedriveOrganization.js
//      a. Change "visible_to" to all
// 4. Add Deals/Leads single select
// 5. Add webhook for updated.deal --> https://greenscape.netlify.app/.netlify/functions/dealUpdated
// 6. Update .env variables

// MAKE FETCH REQUEST FROM TEXTCAMPAIGN APP TO THIS REPO
