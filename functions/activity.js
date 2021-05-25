require("dotenv").config();

const moment = require("moment");

const PipedriveApi = require("./utils/Pipedrive");
const Pipedrive = new PipedriveApi(process.env.PIPEDRIVE_API);

exports.handler = async (event) => {
    if (event.httpMethod === "GET") {
        return {
            statusCode: 200,
            body: JSON.stringify({ msg: "POST request only" }),
        };
    } else if (event.httpMethod === "POST") {
        const contact = JSON.parse(event.body);

        const dueDate = moment(contact.meetingTime).format("YYYY-MM-DD");
        const dueTime = moment(contact.meetingTime).format("hh-mm");

        console.log({ dueDate });
        console.log({ dueTime });

        const person = await Pipedrive.findPersonName(contact.name);

        let deal = await Pipedrive.deal(person.organization.name, person.id);

        // create activity associated with all 3 items and assign BDM
        const activity = JSON.stringify({
            subject: "Discovery Call Title",
            person_id: deal.person.id,
            org_id: deal.organization.id,
            deal_id: deal.id,
            type: "discovery_call",
            assigned_to_user_id: 12305968,
            due_date: dueDate,
            due_time: dueTime,
            duration: "01:00",
        });
        const newActivity = await Pipedrive.createActivity(activity);

        return {
            statusCode: 200,
            body: JSON.stringify({ newActivity }),
        };
    } else {
        return {
            statusCode: 500,
            body: JSON.stringify({ msg: "Error" }),
        };
    }
};
