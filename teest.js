require("dotenv").config();

const moment = require("moment");
const axios = require("axios");

const AirtableApi = require("./src/airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);
const PipedriveApi = require("./functions/utils/Pipedrive");
const Pipedrive = new PipedriveApi(process.env.PIPEDRIVE_API);

(async (event) => {
    try {
        const contact = await Airtable.getContact("appRGIOnGz04cUXz3", "recRwrhXXNT6P3ckn");

        const utcDate = new moment(contact["Scheduled Meeting"], "YYYY-MM-DDTHH:mm").format(
            "YYYY-MM-DD"
        );
        const utcTime = new moment(contact["Scheduled Meeting"], "YYYY-MM-DDTHH:mm")
            .utc()
            .format("HH:mm");

        const person = await Pipedrive.findPersonName(contact["Full Name"]);

        let deal = await Pipedrive.deal(person.organization.name, person.id);

        const user = await Pipedrive.getUser("Danae McDermott"); // !IMPORTANT - CHRIS PEGRAM

        // create activity associated with all 3 items and assign BDM
        const activity = JSON.stringify({
            subject: "Discovery Call",
            person_id: deal.person.id,
            org_id: deal.organization.id,
            deal_id: deal.id,
            type: "discovery_call",
            assigned_to_user_id: user.id,
            due_date: utcDate,
            due_time: utcTime,
            duration: "01:00",
        });
        const newActivity = await Pipedrive.createActivity(activity);
        console.log(newActivity);
    } catch (error) {
        console.log(error);
    }
})();
