require("dotenv").config();

const createOrganization = require("./utils/createOrganization");
const pipedrivePerson = require("./utils/pipedrivePerson");

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

        if (person.organization === null || person.org_id === null) {
            const organization = await pipedriveOrganization(newContact);
            person = await Pipedrive.updatePerson(person.id, organization.id);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ person }),
        };
    } else {
        return {
            statusCode: 500,
            body: JSON.stringify({ msg: "Error" }),
        };
    }
};
