require("dotenv").config();

const axios = require("axios");
const moment = require("moment");

const pipedrivePerson = require("./functions/utils/pipedrivePerson");
const pipedriveOrganization = require("./functions/utils/pipedriveOrganization");

const PipedriveApi = require("./functions/utils/Pipedrive");
const Pipedrive = new PipedriveApi(process.env.PIPEDRIVE_API);

const AirtableApi = require("./src/airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

(async () => {
    const contact = await Airtable.getContact("appRGIOnGz04cUXz3", "recRwrhXXNT6P3ckn");

    let person = await pipedrivePerson(contact);

    let organizationID;
    let organizationName;

    if (person.organization === null || person.org_id === null) {
        const organization = await pipedriveOrganization(contact);
        organizationName = organization.name;
        person = await Pipedrive.updatePerson(person.id, {
            org_id: organization.id,
        });

        console.log(`Assigned ${organization.name} to ${person.name}`);

        organizationID = organization.id;
    } else {
        organizationID = person.org_id || person.organization.id;
        organizationName = person.org_name || person.organization.name;
    }

    const user = await Pipedrive.getUser("Danae McDermott"); // !IMPORTANT - CHRIS PEGRAM

    const deal = JSON.stringify({
        title: organizationName,
        person_id: person.id,
        user_id: user.id,
        org_id: organizationID,
        stage_id: 1,
        status: "open",
    });

    const newDeal = await Pipedrive.createDeal(deal);
    console.log(`Created new deal: ${newDeal.title}`);

    // set person label === "Hot Lead"
    const label = await Pipedrive.getPersonFields("Label", "Hot lead");
    const updatedFields = JSON.stringify({ label: label.id });
    await Pipedrive.updatePerson(person.id, updatedFields);

    try {
        const deal = newDeal;

        const utcDate = new moment(contact["Scheduled Meeting"], "YYYY-MM-DDTHH:mm").format(
            "YYYY-MM-DD"
        );
        const utcTime = new moment(contact["Scheduled Meeting"], "YYYY-MM-DDTHH:mm")
            .utc()
            .format("HH:mm");

        // create activity associated with all 3 items and assign BDM
        const activity = JSON.stringify({
            subject: "Discovery Call",
            person_id: deal.person_id.value,
            org_id: deal.org_id.value,
            deal_id: deal.id,
            type: "discovery_call",
            assigned_to_user_id: user.id,
            due_date: utcDate,
            due_time: utcTime,
            duration: "01:00",
        });
        const newActivity = await Pipedrive.createActivity(activity);
        console.log(`Scheduled new discovery call for deal: ${newActivity.deal_title}`);
    } catch (error) {
        console.log(error);
    }
})();
