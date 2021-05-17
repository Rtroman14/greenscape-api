require("dotenv").config();

const PipedriveApi = require("./Pipedrive");
const Pipedrive = new PipedriveApi(process.env.PIPEDRIVE_API);

module.exports = async (contact) => {
    try {
        // const foundUser = await findUser("Ryan Roman");

        let organization = await Pipedrive.findOrganization(contact.address1);

        if (!organization) {
            const newOrganization = JSON.stringify({
                name: `${contact.full_name} - ${contact.address1}`,
                address: contact.address1,
                visible_to: "7", // verify in greenscape database
            });

            organization = await Pipedrive.createOrganization(newOrganization);

            console.log(`Created new contact: ${organization.name}`);
        }

        return organization;
    } catch (error) {
        console.log("ERROR FINDING || CREATING ORGANIZATION ---", error);
        return false;
    }
};
