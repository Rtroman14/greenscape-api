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

    async deal(term, personID) {
        try {
            const config = this.getConfig(
                "get",
                `deals/search?term=${term}&person_id=${personID}&`
            );
            const res = await axios(config);

            return res.data.data.items[0].item;
        } catch (error) {
            console.log("ERROR GETTING DEALS ---", error);
            return false;
        }
    }

    async dealByPersonID(term, personID) {
        try {
            const config = this.getConfig(
                "get",
                `deals/search?term=${term}&person_id=${personID}&`
            );
            const res = await axios(config);

            return res.data.data.items[0].item;
        } catch (error) {
            console.log("ERROR GETTING DEALS ---", error);
            return false;
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

    async dealFields(fieldName) {
        try {
            const config = this.getConfig("get", `dealFields/?`);
            const res = await axios(config);

            const data = res.data.data;

            const options = data.find((field) => field.name === fieldName);

            return options;
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
            return false;
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

    async getPersons() {
        try {
            const config = this.getConfig("get", `persons?limit=500&`);
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

    async updatePerson(personID, data) {
        try {
            const config = this.getConfig("put", `persons/${personID}?`, data);
            const res = await axios(config);

            return res.data.data;
        } catch (error) {
            console.log("ERROR UPDATEPERSON ---", error);
            return false;
        }
    }

    async updateOrganization(orgID, data) {
        try {
            const config = this.getConfig("put", `organizations/${orgID}?`, data);
            const res = await axios(config);

            return res.data.data;
        } catch (error) {
            console.log("ERROR UPDATEORGANIZATION ---", error);
            return false;
        }
    }

    async updateDeal(id, data) {
        try {
            const config = this.getConfig("put", `deals/${id}?`, data);
            const res = await axios(config);

            return res.data.data;
        } catch (error) {
            console.log("ERROR UPDATEDEAL ---", error);
            return false;
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

    async getUser(name) {
        try {
            const config = this.getConfig("get", `users/find?term=${name}&`);
            const { data } = await axios(config);

            return data.data[0];
        } catch (error) {
            console.log("ERROR GETTING USER ---", error);
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

    async findOrganizationByID(id) {
        try {
            const config = this.getConfig("get", `organizations/${id}?`);
            const { data } = await axios(config);

            // return organization.length > 0 ? organization[0].item : false;
            return data.data;
        } catch (error) {
            console.log("ERROR FINDING ORGANIZATION ---", error);
            return false;
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

    async personFields(fieldName) {
        try {
            const config = this.getConfig("get", "personFields?");
            const res = await axios(config);

            const data = res.data.data;

            return data.find((field) => field.name === fieldName);
        } catch (error) {
            console.log("ERROR PERSONFIELDS ---", error);
        }
    }

    async getPersonFields(fieldName, label) {
        try {
            const config = this.getConfig("get", "personFields?");
            const res = await axios(config);

            const data = res.data.data;

            const options = data.find((field) => field.name === fieldName).options;

            return options.find((option) => option.label === label);
        } catch (error) {
            console.log("ERROR CREATING GETPERSONFIELDS ---", error);
        }
    }

    async getOrganizationFields(fieldName) {
        try {
            const config = this.getConfig("get", "organizationFields?");
            const res = await axios(config);

            const data = res.data.data;

            const options = data.find((field) => field.name === fieldName);

            return options;
        } catch (error) {
            console.log("ERROR CREATING ORGANIZATION ---", error);
        }
    }

    async createNote(data) {
        try {
            const config = this.getConfig("post", "notes?", data);
            const res = await axios(config);

            return res.data.data;
        } catch (error) {
            console.log("ERROR CREATING ORGANIZATION ---", error);
        }
    }

    async createActivity(data) {
        try {
            const config = this.getConfig("post", "activities?", data);
            const res = await axios(config);

            return res.data.data;
        } catch (error) {
            console.log("ERROR CREATING ORGANIZATION ---", error);
        }
    }

    async getPropertyType(orgID) {
        try {
            const orgFields = await this.getOrganizationFields("Property Type");

            const org = await this.findOrganizationByID(orgID);

            const propertyType = orgFields.options.find(
                (option) => option.id === Number(org[orgFields.key])
            );

            return propertyType.label;
        } catch (error) {
            console.log("ERROR GETPROPERTYTYPE ---", error);
            return false;
        }
    }
};
