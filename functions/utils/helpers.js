require("dotenv").config();

const axios = require("axios");
const { coldPhrase, coldWord } = require("./keywords");

const PipedriveApi = require("./Pipedrive");
const Pipedrive = new PipedriveApi(process.env.PIPEDRIVE_API);

module.exports = {
    async findUser(user) {
        try {
            const allUsers = await Pipedrive.getAllUsers();

            return allUsers.find((pipedriveUser) => pipedriveUser.name === user);
        } catch (error) {
            console.log("USER DIDN'T MATCH PIPEDRIVE USERS --- ERROR", error.message);
        }
    },

    responseStatus(response) {
        for (let phrase of coldWord) {
            if (response.toLowerCase() === phrase.toLowerCase()) {
                return "Cold";
            }
        }
        let coldRe = new RegExp(coldPhrase, "i");
        return coldRe.test(response) ? "Cold" : null;
    },

    async slackNotification(text) {
        // notify me about this in Slack
        await axios.post(process.env.SLACK_TEXT_NOTIFICATIONS, {
            text,
        });
    },
};
