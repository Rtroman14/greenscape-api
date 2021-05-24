require("dotenv").config();

const { findUser } = require("./functions/utils/helpers");

const PipedriveApi = require("./functions/utils/Pipedrive");
const Pipedrive = new PipedriveApi(process.env.PIPEDRIVE_API);
const AirtableApi = require("./src/airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);
const HighlevelApi = require("./src/Highlevel");

const pipedrivePerson = require("./functions/utils/pipedrivePerson");
const pipedriveOrganization = require("./functions/utils/pipedriveOrganization");

const { campaignsDueToday, liveCampaigns, campaignsToRun, mapContact } = require("./src/helpers");

const newContact = {
    contact_id: "sRqF0l6lOCIzaucfhwDI",
    first_name: "Danae",
    last_name: "McDorment",
    full_name: "Ryan Roman",
    email: "Danae@sumammedia.co",
    phone: "+19196066779",
    tags: "",
    address1: "2241 Avent Ferry Rd - Burger King Raleigh, NC 27606",
    country: "US",
    date_created: "2021-05-14T18:42:22.595Z",
    contact_source: "api v1",
    full_address: "2241 Avent Ferry Rd - Burger King Raleigh, NC 27606",
    contact_type: "lead",
    opportunity_name: "Robert Hoyt - How did you get my number?",
    status: "open",
    opportunity_source: "api v1",
    source: "api v1",
    pipleline_stage: "Responded",
    pipeline_id: "dGRUoKNGZ8Nazik6ZpjC",
    id: "dGRUoKNGZ8Nazik6ZpjC",
    pipeline_name: "Revived Lost Leads Campaign",
    owner: "Chris Pegram",
    location: {
        name: "Greenscape, Inc",
        address: "107 Southerland Street",
        city: "Durham",
        state: "NC",
        country: "US",
        postalCode: "27703",
        fullAddress: "107 Southerland Street, Durham NC 27703",
        id: "H0BFl71Jcm86p91ahJtU",
    },
    user: {
        firstName: "Chris",
        lastName: "Pegram",
        email: "cpegram@replies.greenscapeinc.com",
        phone: "+19196095869",
        extension: "",
    },
};

(async () => {
    try {
        const getCampaigns = await Airtable.getCampaigns();
        let campaigns = liveCampaigns(getCampaigns);
        campaigns = campaignsDueToday(campaigns);
        campaigns = campaignsToRun(campaigns);

        for (let campaign of campaigns) {
            let view = "First Lines";

            if ("Tag" in campaign) {
                view = `First Lines - ${campaign.Tag}`;
            }

            let contacts = await Airtable.getContacts(campaign["Base ID"], view);

            for (let contact of contacts.slice(0, 10)) {
                let org = {};

                const highLevelContact = mapContact(contact);
                let address = highLevelContact.address1;

                org.address = address;

                let [city, state, zip] = address.split(" ").slice(-3);
                org.city = city.replace(",", "");
                org.state = state;
                org.zip = zip;

                address = address.split(" ").slice(0, -3).join(" ");

                if (address.includes("-")) {
                    const dashIndex = address.indexOf("-");

                    let name = address.slice(dashIndex).trim();
                    let street = address.slice(0, dashIndex).trim();

                    org.name = name.replace("-", "").trim();
                    org.street = street.replace("-", "").trim();
                } else {
                    org.name = address;
                    org.street = address;
                }

                org.fullAddress = `${org.street}, ${org.city}, ${org.state} ${org.zip}`;

                console.log(org);
            }
        }
    } catch (error) {
        console.log(error.message);
    }
})();
