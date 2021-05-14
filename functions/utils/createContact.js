require("dotenv").config();

const PipedriveApi = require("./Pipedrive");
const Pipedrive = new PipedriveApi(process.env.PIPEDRIVE_API);

module.exports = async (event) => {
    try {
        const newContact = JSON.parse(event.body);
        // const foundUser = await findUser("Ryan Roman");

        // ---------------- CREATE ORGANIZATION ---------------- //

        const organization = JSON.stringify({
            name: "UNSURE HOW TO NAME",
            address: newContact.address1,
            // "2ef18d57c268bff4b27bb9eb79d815a5464a2b53": "15",
        });

        const newOrganization = await Pipedrive.createOrganization(organization);

        // ---------------- CREATE CONTACT ---------------- //

        const existingPerson = await Pipedrive.findPerson(newContact.full_name);
        // let personID = existingPerson && existingPerson.id;

        if (!existingPerson) {
            const person = JSON.stringify({
                name: newContact.full_name,
                // owner_id: foundUser.id,
                org_id: newOrganization.id,
                email: newContact.email || "",
                phone: newContact.phone || "",
            });

            const newPerson = await Pipedrive.createPerson(person);
            // personID = newPerson.id;

            return;
        }

        if (existingPerson.organization === null) {
            const newOrganization = await Pipedrive.createOrganization(organization);

            await Pipedrive.updatePerson(existingPerson.id, newOrganization.id);
        }
    } catch (error) {
        console.log("ERROR CREATING || FINDING CONTACT ---", error);
        return false;
    }
};
