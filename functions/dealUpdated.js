require("dotenv").config();

const moment = require("moment");

const PipedriveApi = require("./utils/Pipedrive");
const Pipedrive = new PipedriveApi(process.env.PIPEDRIVE_API);
const HighlevelApi = require("./utils/Highlevel");
const Highlevel = new HighlevelApi(process.env.HIGHLEVEL_API);

const campaigns = require("./utils/campaigns");

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
        const discoveryMeetingStage = 1;
        const onsiteMeetingStage = 36;

        if (
            deal.current.stage_id === discoveryMeetingStage ||
            deal.current.stage_id === onsiteMeetingStage
        ) {
            const triggerCampaign = await Pipedrive.dealFields("Trigger Outreach Campaign");

            const triggerCampaignPrevious = deal.previous[triggerCampaign.key];
            const triggerCampaignCurrent = deal.current[triggerCampaign.key];

            const campaignOption = triggerCampaign.options.find(
                (option) => option.id === Number(triggerCampaignCurrent)
            );

            if (
                triggerCampaignPrevious !== triggerCampaignCurrent &&
                triggerCampaignCurrent !== null // campaign depends on stage
            ) {
                // get property type
                const propertyType = await Pipedrive.getPropertyType(deal.current.org_id);

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

                // choose correct campaign to send prospect to
                let campaign = false;

                if (
                    deal.current.stage_id === discoveryMeetingStage &&
                    campaignOption.label === "Missed Discovery Meeting"
                ) {
                    campaign = campaigns[campaignOption.label].find((campaign) =>
                        campaign.name.includes(propertyType)
                    );
                    if (campaign === undefined) {
                        campaign = {
                            name: "Other - Did Not Book",
                            id: "ozLrdIRTIRnR8AWGI3lI",
                        };
                    }
                }
                if (
                    deal.current.stage_id === onsiteMeetingStage &&
                    campaignOption.label === "Missed Onsite Meeting"
                ) {
                    campaign = campaigns[campaignOption.label].find((campaign) =>
                        campaign.name.includes(propertyType)
                    );
                    if (campaign === undefined) {
                        campaign = {
                            name: "Other - Onsite Meeting Canceled",
                            id: "CM0AGl4EKjyP5IOoCIL7",
                        };
                    }
                }

                if (campaign) {
                    const addedToCampaign = await Highlevel.addToCampaign(
                        highLevelPerson.id,
                        campaign.id
                    );

                    console.log(
                        `\nAdded ${deal.current.person_name} to Highlevel campaign: ${campaign.name}\n`
                    );

                    const note = JSON.stringify({
                        content: `${deal.current.person_name} with ${
                            deal.current.org_name || "empty"
                        } was sent to outreach campaign: ${campaign.name}.`,
                        deal_id: deal.current.id,
                    });
                    await Pipedrive.createNote(note);
                }
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
