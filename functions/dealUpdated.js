require("dotenv").config();

const moment = require("moment");

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
        console.log(deal);

        // IF DEAL === DISCOVERY MEETING || ONSITE MEETING
        if (deal.current.stage_id === 1) {
            const triggerCampaign = await Pipedrive.dealFields("Trigger Outreach Campaign");

            const triggerCampaignPrevious = deal.previous[triggerCampaign.key];
            const triggerCampaignCurrent = deal.current[triggerCampaign.key];

            const campaignOption = triggerCampaign.options.find(
                (option) => option.id === Number(triggerCampaignCurrent)
            );

            // IF DISCOVERY MEETING STAGE && triggerCampaignCurrent === DISCOVERY MEETING ID
            // IF ONSITE MEETING STAGE && triggerCampaignCurrent === ONSITE MEETING ID

            if (
                triggerCampaignPrevious !== triggerCampaignCurrent &&
                triggerCampaignCurrent !== null // campaign depends on stage
            ) {
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
                const person = await Pipedrive.findPersonID(deal.current.person_id);

                let highLevelPerson = await Highlevel.getContact(
                    person.email[0].value,
                    person.phone[0].value
                );

                if (!highLevelPerson) {
                    const newHighLevelPerson = {
                        firstName: person.first_name || "",
                        lastName: person.last_name || "",
                        name: person.name || "",
                        email: person.email[0].value || "",
                        phone: person.phone[0].value || "",
                        address1: (person.org_id !== null && person.org_id.address) || "",
                    };

                    highLevelPerson = await Highlevel.createContact(newHighLevelPerson);

                    console.log("NO HIGHLEVEL PERSON");
                }

                // push highlevel person to appropriate campaign
                const campaign = campaigns.find(
                    (campaign) => campaign.name === campaignOption.label
                );

                // const addedToCampaign = await HighLevel.addToCampaign(
                //     highLevelPerson.id,
                //     campaign.id
                // );

                console.log(
                    `\nAdded ${deal.current.person_name} to Highlevel campaign: ${campaign.name}\n`
                );

                // // create note
                // const date = moment(deal.current.add_time).format("dddd, MMMM Do YYYY");

                const note = JSON.stringify({
                    content: `${deal.current.person_name} with ${
                        deal.current.org_name || "empty"
                    } was sent to outreach campaign: ${campaign.name}.`,
                    deal_id: deal.current.id,
                });
                await Pipedrive.createNote(note);
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

// options: [
//     { label: 'Missed Discovery Meeting', id: 18 },
//     { label: 'Missed Onsite Meeting', id: 19 }
//   ],
