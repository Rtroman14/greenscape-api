require("dotenv").config();

module.exports = async (event) => {
    try {
        const res = JSON.parse(event.body);

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
