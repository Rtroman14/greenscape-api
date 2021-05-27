require("dotenv").config();

const moment = require("moment");

const { findUser } = require("./functions/utils/helpers");

const PipedriveApi = require("./functions/utils/Pipedrive");
const Pipedrive = new PipedriveApi(process.env.PIPEDRIVE_API);
const AirtableApi = require("./src/airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);
const HighlevelApi = require("./functions/utils/Highlevel");
const HighLevel = new HighlevelApi(process.env.HIGHLEVEL_API);

const pipedrivePerson = require("./functions/utils/pipedrivePerson");
const pipedriveOrganization = require("./functions/utils/pipedriveOrganization");

const { slackNotification } = require("./functions/utils/helpers");

const { campaignsDueToday, liveCampaigns, campaignsToRun, mapContact } = require("./src/helpers");

// const newContact = {
//     contact_id: "sRqF0l6lOCIzaucfhwDI",
//     first_name: "Danae",
//     last_name: "McDorment",
//     full_name: "Ryan Roman",
//     email: "Danae@sumammedia.co",
//     phone: "+19196066779",
//     tags: "",
//     address1: "2241 Avent Ferry Rd - Burger King Raleigh, NC 27606",
//     country: "US",
//     date_created: "2021-05-14T18:42:22.595Z",
//     contact_source: "api v1",
//     full_address: "2241 Avent Ferry Rd - Burger King Raleigh, NC 27606",
//     contact_type: "lead",
//     opportunity_name: "Robert Hoyt - How did you get my number?",
//     status: "open",
//     opportunity_source: "api v1",
//     source: "api v1",
//     pipleline_stage: "Responded",
//     pipeline_id: "dGRUoKNGZ8Nazik6ZpjC",
//     id: "dGRUoKNGZ8Nazik6ZpjC",
//     pipeline_name: "Revived Lost Leads Campaign",
//     owner: "Chris Pegram",
//     location: {
//         name: "Greenscape, Inc",
//         address: "107 Southerland Street",
//         city: "Durham",
//         state: "NC",
//         country: "US",
//         postalCode: "27703",
//         fullAddress: "107 Southerland Street, Durham NC 27703",
//         id: "H0BFl71Jcm86p91ahJtU",
//     },
//     user: {
//         firstName: "Chris",
//         lastName: "Pegram",
//         email: "cpegram@replies.greenscapeinc.com",
//         phone: "+19196095869",
//         extension: "",
//     },
// };

const deal = {
    v: 1,
    matches_filters: { current: [] },
    meta: {
        v: 1,
        action: "updated",
        object: "deal",
        id: 19,
        company_id: 8023165,
        user_id: 12305968,
        host: "summamedia.pipedrive.com",
        timestamp: 1622130341,
        timestamp_micro: 1622130341802813,
        request_timestamp: 1622130341726,
        permitted_user_ids: [12305968],
        trans_pending: false,
        is_bulk_update: false,
        pipedrive_service_name: null,
        change_source: "app",
        wa_bookmark_id: null,
        matches_filters: { current: [] },
        prepublish_timestamp: 1622130341853,
        webhook_id: "492035",
    },
    current: {
        id: 19,
        creator_user_id: 12305968,
        user_id: 12305968,
        person_id: 29,
        org_id: 29,
        stage_id: 1,
        title: "Phase II",
        value: 0,
        currency: "USD",
        add_time: "2021-05-27 15:28:40",
        update_time: "2021-05-27 15:45:41",
        stage_change_time: null,
        active: true,
        deleted: false,
        status: "open",
        probability: null,
        next_activity_date: null,
        next_activity_time: null,
        next_activity_id: null,
        last_activity_id: null,
        last_activity_date: null,
        lost_reason: null,
        visible_to: "3",
        close_time: null,
        pipeline_id: 1,
        won_time: null,
        first_won_time: null,
        lost_time: null,
        products_count: 0,
        files_count: 0,
        notes_count: 0,
        followers_count: 1,
        email_messages_count: 0,
        activities_count: 0,
        done_activities_count: 0,
        undone_activities_count: 0,
        participants_count: 1,
        expected_close_date: null,
        last_incoming_mail_time: null,
        last_outgoing_mail_time: null,
        label: null,
        renewal_type: "one_time",
        "38b90adfeffed7b1cb6910b9b7724f12875a5730": "15",
        stage_order_nr: 0,
        person_name: "Chris Pendy",
        org_name: "Phase II",
        next_activity_subject: null,
        next_activity_type: null,
        next_activity_duration: null,
        next_activity_note: null,
        group_id: null,
        group_name: null,
        formatted_value: "$0",
        weighted_value: 0,
        formatted_weighted_value: "$0",
        weighted_value_currency: "USD",
        rotten_time: null,
        owner_name: "Nick Peret",
        cc_email: "summamedia+deal19@pipedrivemail.com",
        org_hidden: false,
        person_hidden: false,
    },
    previous: {
        id: 19,
        creator_user_id: 12305968,
        user_id: 12305968,
        person_id: 29,
        org_id: 29,
        stage_id: 1,
        title: "Phase II",
        value: 0,
        currency: "USD",
        add_time: "2021-05-27 15:28:40",
        update_time: "2021-05-27 15:28:40",
        stage_change_time: null,
        active: true,
        deleted: false,
        status: "open",
        probability: null,
        next_activity_date: null,
        next_activity_time: null,
        next_activity_id: null,
        last_activity_id: null,
        last_activity_date: null,
        lost_reason: null,
        visible_to: "3",
        close_time: null,
        pipeline_id: 1,
        won_time: null,
        first_won_time: null,
        lost_time: null,
        products_count: 0,
        files_count: 0,
        notes_count: 0,
        followers_count: 1,
        email_messages_count: 0,
        activities_count: 0,
        done_activities_count: 0,
        undone_activities_count: 0,
        participants_count: 1,
        expected_close_date: null,
        last_incoming_mail_time: null,
        last_outgoing_mail_time: null,
        label: null,
        renewal_type: "one_time",
        "38b90adfeffed7b1cb6910b9b7724f12875a5730": null,
        stage_order_nr: 0,
        person_name: "Chris Pendy",
        org_name: "Phase II",
        next_activity_subject: null,
        next_activity_type: null,
        next_activity_duration: null,
        next_activity_note: null,
        group_id: null,
        group_name: null,
        formatted_value: "$0",
        weighted_value: 0,
        formatted_weighted_value: "$0",
        weighted_value_currency: "USD",
        rotten_time: null,
        owner_name: "Nick Peret",
        cc_email: "summamedia+deal19@pipedrivemail.com",
        org_hidden: false,
        person_hidden: false,
    },
    event: "updated.deal",
    retry: 0,
};

(async () => {
    try {
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
                const person = await Pipedrive.findPersonID(deal.current.person_id);

                let highLevelPerson = await HighLevel.getContact(
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

                    highLevelPerson = await HighLevel.createContact(newHighLevelPerson);

                    console.log("NO HIGHLEVEL PERSON");
                }

                // push highlevel person to appropriate campaign
                const campaign = campaigns.find(
                    (campaign) => campaign.name === campaignOption.label
                );

                const addedToCampaign = await HighLevel.addToCampaign(
                    highLevelPerson.id,
                    campaign.id
                );

                console.log(
                    `\nAdd ${deal.current.person_name} to Highlevel campaign: ${campaign.name}\n`
                );
            }
        }
    } catch (error) {
        console.log(error.message);
    }
})();
