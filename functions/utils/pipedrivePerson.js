require("dotenv").config();

const PipedriveApi = require("./Pipedrive");
const Pipedrive = new PipedriveApi(process.env.PIPEDRIVE_API);

const slackNotification = require("../../src/slackNotification");

module.exports = async (contact) => {
    try {
        const user = await Pipedrive.getUser("Chris Pegram"); // !IMPORTANT - CHRIS PEGRAM

        let personName = contact.full_name || contact.name;

        let person = await Pipedrive.findPersonName(personName);

        const label = await Pipedrive.getPersonFields("Label", "Prospect");

        if (!person) {
            const newPerson = JSON.stringify({
                name: personName,
                label: label.id,
                owner_id: user.id,
                // org_id: orgID,
                visible_to: "7", // verify in greenscape database
                email: contact.email || "",
                phone: contact.phone || "",
            });

            person = await Pipedrive.createPerson(newPerson);

            console.log(`Created new contact: ${personName}`);
        }

        return person;
    } catch (error) {
        console.log("ERROR CREATING || FINDING CONTACT ---", error);

        await slackNotification(`\n*File:* pipedrivePerson\n*Error:* ${error.message}\n`);

        return false;
    }
};
