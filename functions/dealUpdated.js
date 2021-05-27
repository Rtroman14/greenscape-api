require("dotenv").config();

const PipedriveApi = require("./utils/Pipedrive");
const Pipedrive = new PipedriveApi(process.env.PIPEDRIVE_API);
const HighlevelApi = require("./utils/Highlevel");
const Highlevel = new HighlevelApi(process.env.HIGHLEVEL_API);

exports.handler = async (event) => {
    if (event.httpMethod === "GET") {
        return {
            statusCode: 200,
            body: JSON.stringify({ msg: "POST request only" }),
        };
    } else if (event.httpMethod === "POST") {
        const deal = JSON.parse(event.body);

        if (deal.current.stage_id === 1) {
            const triggerCampaign = await Pipedrive.dealFields("Trigger Outreach Campaign");

            const triggerCampaignPrevious = deal.previous[triggerCampaign.key];
            const triggerCampaignCurrent = deal.current[triggerCampaign.key];

            const campaignOption = triggerCampaign.options.find(
                (option) => option.id === Number(triggerCampaignCurrent)
            );

            if (triggerCampaignPrevious !== triggerCampaignCurrent) {
                const campaigns = [
                    {
                        name: "Missed Discovery Meeting",
                        id: "123",
                    },
                    {
                        name: "Missed Onsite Meeting",
                        id: "456",
                    },
                ];

                // get person
                // const person = await Pipedrive.findPersonID(deal.current.person_id);

                // const [highLevelPerson] = await HighLevel.getContact(
                //     person.email[0].value,
                //     person.phone[0].value
                // );

                // push highlevel person to appropriate campaign
                const campaign = campaigns.find(
                    (campaign) => campaign.name === campaignOption.label
                );
                // const addedToCampaign = await HighLevel.addToCampaign(
                //     highLevelPerson.id,
                //     campaign.id
                // );

                // console.log(addedToCampaign);

                console.log(
                    `\nAdd ${deal.current.person_name} to Highlevel campaign: ${campaign.name}\n`
                );
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ deal }),
        };
    } else {
        return {
            statusCode: 500,
            body: JSON.stringify({ msg: "Error" }),
        };
    }
};
