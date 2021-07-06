const addToPipedrive = require("../src/addToPipedrive");

exports.handler = async (event) => {
    if (event.httpMethod === "GET") {
        return {
            statusCode: 200,
            body: JSON.stringify({ msg: "POST request only" }),
        };
    } else if (event.httpMethod === "POST") {
        const res = JSON.parse(event.body);
        const { highLevelContact } = JSON.parse(event.body);

        console.log("res", res);
        console.log("highLevelContact", highLevelContact);

        // create contact in pipedrive
        // const person = await addToPipedrive(highLevelContact);

        return {
            statusCode: 200,
            body: JSON.stringify({ res }),
        };
    } else {
        return {
            statusCode: 500,
            body: JSON.stringify({ msg: "Error" }),
        };
    }
};
