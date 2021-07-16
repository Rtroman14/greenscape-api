require("dotenv").config();

const axios = require("axios");

const pipedrivePerson = require("./utils/pipedrivePerson");
const pipedriveOrganization = require("./utils/pipedriveOrganization");

const PipedriveApi = require("./utils/Pipedrive");
const Pipedrive = new PipedriveApi(process.env.PIPEDRIVE_API);

const AirtableApi = require("../src/airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

exports.handler = async (event) => {
    if (event.httpMethod === "GET") {
        return {
            statusCode: 200,
            body: JSON.stringify({ msg: "POST request only" }),
        };
    } else if (event.httpMethod === "POST") {
        const { recordID } = JSON.parse(event.body);

        const contact = await Airtable.getContact("appRGIOnGz04cUXz3", recordID);

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

        const user = await Pipedrive.getUser("Chris Pegram"); // !IMPORTANT - CHRIS PEGRAM

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

        // add activity if Scheduled Call
        if ("Scheduled Meeting" in contact) {
            await axios.post("https://greenscape.netlify.app/.netlify/functions/activity", {
                contact,
                deal: newDeal,
                user,
            });
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ newDeal }),
        };
    } else {
        return {
            statusCode: 500,
            body: JSON.stringify({ msg: "Error" }),
        };
    }
};
