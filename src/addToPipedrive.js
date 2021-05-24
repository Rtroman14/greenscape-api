require("dotenv").config();

const pipedrivePerson = require("../functions/utils/pipedrivePerson");
const pipedriveOrganization = require("../functions/utils/pipedriveOrganization");

const PipedriveApi = require("../functions/utils/Pipedrive");
const Pipedrive = new PipedriveApi(process.env.PIPEDRIVE_API);

module.exports = async (newContact) => {
    let person = await pipedrivePerson(newContact);

    if (person.organization === null || person.org_id === null) {
        const organization = await pipedriveOrganization(newContact.address1);

        const updatedFields = JSON.stringify({ org_id: organization.id });
        person = await Pipedrive.updatePerson(person.id, updatedFields);

        console.log(`Assigned ${organization.name} to ${newContact.name}`);
    }

    return person;
};
