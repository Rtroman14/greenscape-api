require("dotenv").config();

const PipedriveApi = require("./Pipedrive");
const Pipedrive = new PipedriveApi(process.env.PIPEDRIVE_API);

module.exports = async (contact) => {
    try {
        // const foundUser = await findUser("Ryan Roman");

        let organization = await Pipedrive.findOrganization(contact.address1);

        if (!organization) {
            const category = await Pipedrive.getOrganizationFields("Category");

            const property = category.options.find((option) => option.label === "Property");

            const newOrganization = JSON.stringify({
                name: `${contact.name} - ${contact.address1}`,
                address: contact.address1,
                visible_to: "7", // verify in greenscape database
                [category.key]: property.id,
            });

            organization = await Pipedrive.createOrganization(newOrganization);

            console.log(`Created new organization: ${organization.name}`);
        }

        return organization;
    } catch (error) {
        console.log("ERROR FINDING || CREATING ORGANIZATION ---", error);
        return false;
    }
};

// NEED TO SET PROPERTY !!!!
