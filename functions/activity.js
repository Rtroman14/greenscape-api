require("dotenv").config();

const pipedrivePerson = require("./utils/pipedrivePerson");
const pipedriveOrganization = require("./utils/pipedriveOrganization");

const PipedriveApi = require("./utils/Pipedrive");
const Pipedrive = new PipedriveApi(process.env.PIPEDRIVE_API);

exports.handler = async (event) => {
    if (event.httpMethod === "GET") {
        return {
            statusCode: 200,
            body: JSON.stringify({ msg: "POST request only" }),
        };
    } else if (event.httpMethod === "POST") {
        const newContact = JSON.parse(event.body);

        let person = await pipedrivePerson(newContact);

        let deal = await Pipedrive.findPersonID(person.id);

        // create activity associated with all 3 items and assign BDM
        const activity = JSON.stringify({
            subject: "Discovery Call Title",
            person_id: person.id,
            org_id: organizationID,
            deal_id: newDeal.id,
            type: "discovery_call",
            assigned_to_user_id: 12305968,
            due_date: "2021-06-20",
            due_time: "10:00",
        });
        const newActivity = await Pipedrive.createActivity(activity);

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
