require("dotenv").config();

const PipedriveApi = require("./Pipedrive");
const Pipedrive = new PipedriveApi(process.env.PIPEDRIVE_API);

module.exports = async (name, address) => {
    try {
        const organization = JSON.stringify({ name, address });

        const newOrganization = await Pipedrive.createOrganization(organization);

        return newOrganization.id;
    } catch (error) {
        console.log("ERROR CREATING || FINDING CONTACT ---", error);
        return false;
    }
};

// NEED TO SET CATEGORY AS PROPERTY
