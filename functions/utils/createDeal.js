require("dotenv").config();

const PipedriveApi = require("./Pipedrive");
const Pipedrive = new PipedriveApi(process.env.PIPEDRIVE_API);

module.exports = async (event) => {
    try {
        const res = JSON.parse(event.body);

        const newContact = {
            name: "Nick Perent",
            email: "nick@summamedia.co",
            phone: "715 252-3333",
            address1: "220 Summit Blvd, Broomfield, CO 80021",
        };
        const foundUser = await findUser("Ryan Roman");
        const existingPerson = await Pipedrive.findPerson("Chris Pendy");

        let personID = existingPerson.id;

        if (!existingPerson) {
            const data = JSON.stringify({
                name: newContact.name,
                // owner_id: foundUser.id,
                // org_id: "<integer>",
                email: newContact.email,
                phone: newContact.phone,
            });

            const newPerson = await Pipedrive.createPerson(data);
            personID = newPerson.id;
        }

        const deal = JSON.stringify({
            title: "New Deal Title",
            person_id: personID,
            // org_id: "<integer>",
            stage_id: 1,
            status: "open",
        });

        const newDeal = await Pipedrive.createDeal(deal);

        console.log(newDeal);

        return {
            statusCode: 200,
            body: JSON.stringify({ res }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ msg: error }),
        };
    }
};
