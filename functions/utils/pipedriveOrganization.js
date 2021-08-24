require("dotenv").config();

const PipedriveApi = require("./Pipedrive");
const Pipedrive = new PipedriveApi(process.env.PIPEDRIVE_API);

const slackNotification = require("../../src/slackNotification");

const { orgInfo } = require("../../src/helpers");

module.exports = async (contact) => {
    try {
        let org = {
            name: contact.street || contact.Street || "",
            address: contact.address1 || contact.Address || "",
            fullAddress: contact.address1 || contact.Address || "",
            street: contact.street || contact.Street || "",
            city: contact.city || contact.City || "",
            state: contact.state || contact.State || "",
            zip: contact.postalCode || contact.Zip || "",
        };

        if (org.street === "") {
            org = orgInfo(org.address);
        }

        let organization = await Pipedrive.findOrganization(org.street);

        if (!organization) {
            const user = await Pipedrive.getUser("Chris Pegram"); // !IMPORTANT - CHRIS PEGRAM

            const category = await Pipedrive.getOrganizationFields("Category");
            const leadSource = await Pipedrive.getOrganizationFields("Lead Source");

            const property = category.options.find((option) => option.label === "Property");

            const newOrganization = JSON.stringify({
                name: org.name,
                owner_id: user.id,
                address: org.fullAddress,
                visible_to: "7", // verify in greenscape database
                [category.key]: property.id,
                [leadSource.key]: "Summa",
            });

            organization = await Pipedrive.createOrganization(newOrganization);

            console.log(`Created new organization: ${organization.name}`);
        }

        return organization;
    } catch (error) {
        console.log("ERROR FINDING || CREATING ORGANIZATION ---", error);

        await slackNotification(`\n*File:* pipedriveOrganization\n*Error:* ${error.message}\n`);
        return false;
    }
};
