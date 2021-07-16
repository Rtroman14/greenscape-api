require("dotenv").config();

const moment = require("moment");

const AirtableApi = require("./src/airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

(async (event) => {
    try {
        const contact = await Airtable.getContact("appRGIOnGz04cUXz3", "recRwrhXXNT6P3ckn");
        console.log(contact);

        const utcDate = new moment(contact["Scheduled Meeting"], "YYYY-MM-DDTHH:mm").format(
            "YYYY-MM-DD"
        );
        const utcTime = new moment(contact["Scheduled Meeting"], "YYYY-MM-DDTHH:mm")
            .utc()
            .format("HH:mm");

        console.log({ utcDate });
        console.log({ utcTime });
    } catch (error) {
        console.log(error);
    }
})();
