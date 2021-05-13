require("dotenv").config();

const { findUser } = require("./functions/utils/helpers");

const PipedriveApi = require("./functions/utils/Pipedrive");
const Pipedrive = new PipedriveApi(process.env.PIPEDRIVE_API);

(async () => {
    try {
        // ------------ CREATE NEW ORGANIZATION ------------ //
        const data = JSON.stringify({
            name: "New Organization",
            address: "220 Summit Blvd, Broomfield CO",
        });

        const newOrganization = await Pipedrive.createOrganization(data);
        console.log(newOrganization);

        // ------------ CREATE NEW ORGANIZATION ------------ //
    } catch (error) {
        console.log(error.message);
    }
})();
