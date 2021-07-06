require("dotenv").config();

const PipedriveApi = require("./Pipedrive");
const Pipedrive = new PipedriveApi(process.env.PIPEDRIVE_API);

const { orgInfo } = require("../../src/helpers");

module.exports = async (contact) => {
    try {
        // const foundUser = await findUser("Ryan Roman");

        let org = {
            name: contact.street || "",
            address: contact.address1 || "",
            fullAddress: contact.address1 || "",
            street: contact.street || "",
            city: contact.city || "",
            state: contact.state || "",
            zip: contact.postalCode || "",
        };

        if (contact.street === "") {
            org = orgInfo(contact.address1);
        }

        let organization = await Pipedrive.findOrganization(org.street);

        if (!organization) {
            const category = await Pipedrive.getOrganizationFields("Category");

            const property = category.options.find((option) => option.label === "Property");

            const newOrganization = JSON.stringify({
                name: org.name,
                address: org.fullAddress,
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
