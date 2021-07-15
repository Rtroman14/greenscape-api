require("dotenv").config();

const pipedrivePerson = require("./utils/pipedrivePerson");

const PipedriveApi = require("./utils/Pipedrive");
const Pipedrive = new PipedriveApi(process.env.PIPEDRIVE_API);

const AirtableApi = require("../src/airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

exports.handler = async (event) => {
    if (event.httpMethod === "GET") {
        return {
            statusCode: 200,
            body: JSON.stringify({ msg: "POST request only" }),
        };
    } else if (event.httpMethod === "POST") {
        const res = JSON.parse(event.body);
        const { recordID } = JSON.parse(event.body);
        console.log(res);

        const contact = await Airtable.getContact("appRGIOnGz04cUXz3", recordID);

        let person = await pipedrivePerson(contact);

        const note = JSON.stringify({
            content: `${person.name} wishes not to contacted`,
            person_id: person.id,
        });
        const newNote = await Pipedrive.createNote(note);

        // get DND field and update person with field
        const dndField = await Pipedrive.getPersonFields("Label", "Do Not Contact");
        const updatedFields = JSON.stringify({ label: dndField.id });
        await Pipedrive.updatePerson(person.id, updatedFields);

        // update airtable status === "Cold"
        // const contact = await Airtable.findContact("appRGIOnGz04cUXz3", person.name);
        // contact &&
        //     (await Airtable.updateContact("appRGIOnGz04cUXz3", contact.recordID, {
        //         Status: "Cold",
        //     }));

        return {
            statusCode: 200,
            body: JSON.stringify({ newNote }),
        };
    } else {
        return {
            statusCode: 500,
            body: JSON.stringify({ msg: "Error" }),
        };
    }
};
