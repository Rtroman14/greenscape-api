require("dotenv").config();

const PipedriveApi = require("./Pipedrive");
const Pipedrive = new PipedriveApi(process.env.PIPEDRIVE_API);

module.exports = async (contact) => {
    try {
        // const foundUser = await findUser("Ryan Roman");

        let person = await Pipedrive.findPersonName(contact.full_name);

        if (!person) {
            const newPerson = JSON.stringify({
                name: contact.full_name,
                // owner_id: foundUser.id,
                // org_id: orgID,
                visible_to: "7", // verify in greenscape database
                email: contact.email || "",
                phone: contact.phone || "",
            });

            person = await Pipedrive.createPerson(newPerson);
        }

        return person;
    } catch (error) {
        console.log("ERROR CREATING || FINDING CONTACT ---", error);
        return false;
    }
};
