require("dotenv").config();

const axios = require("axios");
const moment = require("moment");

const AirtableApi = require("./src/airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

(async (event) => {
    try {
        const res = await axios.post("https://greenscape.netlify.app/.netlify/functions/test", {
            contact: "This is a contact",
        });
    } catch (error) {
        console.log(error);
    }
})();
