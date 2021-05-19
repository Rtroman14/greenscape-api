require("dotenv").config();

const pipedrivePerson = require("./utils/pipedrivePerson");

const PipedriveApi = require("./utils/Pipedrive");
const Pipedrive = new PipedriveApi(process.env.PIPEDRIVE_API);

exports.handler = async (event) => {
    if (event.httpMethod === "GET") {
        return {
            statusCode: 200,
            body: JSON.stringify({ msg: "POST request only" }),
        };
    } else if (event.httpMethod === "POST") {
        const newContact = JSON.parse(event.body);

        let person = await pipedrivePerson(newContact);

        const note = JSON.stringify({
            content: `${person.name} wishes not to contacted`,
            person_id: person.id,
        });
        const newNote = await Pipedrive.createNote(note);

        // get DND field and update person with field
        const dndField = await Pipedrive.getPersonFields("Label", "Do Not Contact");
        const updatedFields = JSON.stringify({ label: dndField.id });
        await Pipedrive.updatePerson(person.id, updatedFields);

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
