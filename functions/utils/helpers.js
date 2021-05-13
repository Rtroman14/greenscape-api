require("dotenv").config();

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
};
