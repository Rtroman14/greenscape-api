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

        let organizationID;
        let organizationName;

        if (person.organization === null || person.org_id === null) {
            const organization = await pipedriveOrganization(newContact);
            organizationName = organization.name;
            person = await Pipedrive.updatePerson(person.id, {
                org_id: organization.id,
            });

            console.log(`Assigned ${organization.name} to ${newContact.full_name}`);

            organizationID = organization.id;
        } else {
            organizationID = person.org_id || person.organization.id;
            organizationName = person.org_name || person.organization.name;
        }

        const deal = JSON.stringify({
            title: organizationName,
            person_id: person.id,
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
