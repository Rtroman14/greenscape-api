require("dotenv").config();

const axios = require("axios");

module.exports = class PipeDriveApi {
    constructor(token, company) {
        this.token = token;
        this.company = company;
    }

    getConfig(method, url, data) {
        try {
            if (data) {
                return {
                    method,
                    url: `https://api.pipedrive.com/v1/${url}api_token=${this.token}`,
                    data,
                    headers: {
                        "Content-Type": "application/json",
                    },
                };
            }

            return { method, url: `https://api.pipedrive.com/v1/${url}api_token=${this.token}` };
        } catch (error) {
            console.log("ERROR CONFIG ---", error);
        }
    }

    async dealByID(dealID) {
        try {
            const config = this.getConfig("get", `deals/${dealID}?`);
            const res = await axios(config);

            return res.data.data;
        } catch (error) {
            console.log("ERROR GETTING DEAL ID ---", error);
        }
    }

    async deals() {
        try {
            const config = this.getConfig("get", `deals?`);
            const res = await axios(config);

            return res.data.data;
        } catch (error) {
            console.log("ERROR GETTING DEALS ---", error);
        }
    }

    async dealFields() {
        try {
            const config = this.getConfig("get", `dealFields/?`);
            const res = await axios(config);

            return res.data.data;
        } catch (error) {
            console.log("ERROR GETTING DEAL FIELDS ---", error);
        }
    }

    async createDeal(data) {
        try {
            const config = this.getConfig("post", "deals?", data);
            const res = await axios(config);

            return res.data.data;
        } catch (error) {
            console.log("ERROR CREATING DEAL ---", error);
        }
    }

    async findPersonName(name) {
        try {
            const config = this.getConfig("get", `persons/search?term=${name}&`);
            const res = await axios(config);

            const person = res.data.data.items;

            return person.length > 0 ? person[0].item : false;
        } catch (error) {
            console.log("ERROR FINDING PERSON ---", error);
        }
    }

    async findPersonID(id) {
        try {
            const config = this.getConfig("get", `persons/${id}?`);
            const res = await axios(config);

            const person = res.data.data;

            return person;
        } catch (error) {
            console.log("ERROR FINDING PERSON ---", error);
        }
    }

    async createPerson(data) {
        try {
            const config = this.getConfig("post", `persons?`, data);
            const res = await axios(config);

            return res.data.data;
        } catch (error) {
            console.log("ERROR CREATING PERSON ---", error);
        }
    }

    async updatePerson(personID, org_id) {
        try {
            const config = this.getConfig("put", `persons/${personID}?`, {
                org_id,
            });
            const res = await axios(config);

            return res.data.data;
        } catch (error) {
            console.log("ERROR CREATING PERSON ---", error);
        }
    }

    async getAllUsers() {
        try {
            const config = this.getConfig("get", "users?");
            const res = await axios(config);

            return res.data.data;
        } catch (error) {
            console.log("ERROR GETTING USERS ---", error);
        }
    }

    async findOrganization(address) {
        try {
            const config = this.getConfig("get", `organizations/search?term=${address}&`);
            const res = await axios(config);

            const organization = res.data.data.items;

            return organization.length > 0 ? organization[0].item : false;
        } catch (error) {
            console.log("ERROR FINDING ORGANIZATION ---", error);
        }
    }

    async createOrganization(data) {
        try {
            const config = this.getConfig("post", "organizations?", data);
            const res = await axios(config);

            return res.data.data;
        } catch (error) {
            console.log("ERROR CREATING ORGANIZATION ---", error);
        }
    }

    async addNote(person_id, content) {
        try {
            const config = this.getConfig("post", "notes?", { content, person_id });
            const res = await axios(config);

            return res.data.data;
        } catch (error) {
            console.log("ERROR CREATING ORGANIZATION ---", error);
        }
    }
};
