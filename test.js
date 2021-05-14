require("dotenv").config();

const { findUser } = require("./functions/utils/helpers");

const PipedriveApi = require("./functions/utils/Pipedrive");
const Pipedrive = new PipedriveApi(process.env.PIPEDRIVE_API);

const newContact = {
    contact_id: "sRqF0l6lOCIzaucfhwDI",
    first_name: "Robert",
    last_name: "Hoyt",
    full_name: "Robert Hoyt",
    email: "roberthoyt@yorkproperties.com",
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
        // ------------ CREATE NEW ORGANIZATION ------------ //
        // const organization = JSON.stringify({
        //     name: "UNSURE HOW TO NAME",
        //     address: "210 Summit Blvd",
        //     // "2ef18d57c268bff4b27bb9eb79d815a5464a2b53": "15",
        // });
        // const newOrganization = await Pipedrive.createOrganization(organization);
        // console.log(newOrganization);
        // ------------ FIND PERSON ------------ //
        // const existingPerson = await Pipedrive.findPerson("ryan roman");
        // if (existingPerson.organization === null) {
        //     console.log("CONTACT HAS ORGANIZATION");
        // }
        // ------------ CREATE NEW PERSON AND ORGANIZATION ------------ //
    } catch (error) {
        console.log(error.message);
    }
})();
