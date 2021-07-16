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
        const { contact, deal, user } = JSON.parse(event.body);

        console.log(deal);
        console.log(user);

        const utcDate = new moment(contact["Scheduled Meeting"], "YYYY-MM-DDTHH:mm").format(
            "YYYY-MM-DD"
        );
        const utcTime = new moment(contact["Scheduled Meeting"], "YYYY-MM-DDTHH:mm")
            .utc()
            .format("HH:mm");

        // const person = await Pipedrive.findPersonName(contact["Full Name"]);

        // let deal = await Pipedrive.deal(person.organization.name, person.id);

        // const user = await Pipedrive.getUser("Danae McDermott"); // !IMPORTANT - CHRIS PEGRAM

        // create activity associated with all 3 items and assign BDM
        const activity = JSON.stringify({
            subject: "Discovery Call",
            person_id: deal.person_id.value,
            org_id: deal.organization.id,
            deal_id: deal.id,
            type: "discovery_call",
            assigned_to_user_id: user.id,
            due_date: utcDate,
            due_time: utcTime,
            duration: "01:00",
        });
        const newActivity = await Pipedrive.createActivity(activity);
        console.log(`Scheduled new discovery call for deal: ${newActivity.deal_title}`);

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
