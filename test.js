require("dotenv").config();

const moment = require("moment");

const { findUser } = require("./functions/utils/helpers");

const PipedriveApi = require("./functions/utils/Pipedrive");
const Pipedrive = new PipedriveApi(process.env.PIPEDRIVE_API);
const AirtableApi = require("./src/airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);
const HighlevelApi = require("./src/Highlevel");

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

(async () => {
    try {
        const res = {
            name: "Gordon Grubb",
            meetingTime: "2021-05-26T19:44:00.000Z",
        };

        // const dueDate = moment(res.meetingTime).format("YYYY-MM-DD");
        // const dueTime = moment(res.meetingTime).format("hh:mm");
        // const date = new Date(res.meetingTime);

        // console.log({ dueDate });
        // console.log({ dueTime });
        // console.log(date);

        const utcDate = new moment(res.meetingTime, "YYYY-MM-DDTHH:mm").utc().format("YYYY-MM-DD");
        const utcTime = new moment(res.meetingTime, "YYYY-MM-DDTHH:mm").utc().format("hh:mm");

        console.log({ utcDate });
        console.log({ utcTime });

        // const time = moment(utcTime)

        const activity = JSON.stringify({
            subject: "Discovery Call Title",
            person_id: 1,
            org_id: 1,
            deal_id: 11,
            type: "discovery_call",
            assigned_to_user_id: 12305968,
            due_date: utcDate,
            due_time: utcTime,
            duration: "01:00",
        });
        const newActivity = await Pipedrive.createActivity(activity);

        console.log(newActivity);
    } catch (error) {
        console.log(error.message);
    }
})();
