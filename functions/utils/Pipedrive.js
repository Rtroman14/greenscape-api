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
            console.log("ERROR GETTING DEAL ---", error);
        }
    }

    async deals() {
        try {
            const config = this.getConfig("get", `deals?`);
            const res = await axios(config);

            return res.data.data;
        } catch (error) {
            console.log("ERROR GETTING DEAL ---", error);
        }
    }

    async dealFields() {
        try {
            const config = this.getConfig("get", `dealFields/?`);
            const res = await axios(config);

            return res.data.data;
        } catch (error) {
            console.log("ERROR GETTING DEAL ---", error);
        }
    }

    async createNewDeal() {
        try {
            var qs = require("qs");
            var data = qs.stringify({
                title: "Deal Title",
                person_id: "<integer>",
                org_id: "<integer>",
                stage_id: "<integer>",
                status: "<string>",
            });
            const res = await axios.post(
                `https://${this.company}.pipedrive.com/api/v1/deals?api_token=${this.token}`
            );

            return res.data;
        } catch (error) {
            console.log("ERROR GETTING DEAL ---", error);
        }
    }

    async personByTerm(name) {
        try {
            const config = this.getConfig("get", `persons/search?term=${name}&`);
            const res = await axios(config);

            return res.data.data.items[0].item;
        } catch (error) {
            console.log("ERROR GETTING DEAL ---", error);
        }
    }

    async createPerson(data) {
        try {
            const config = this.getConfig("post", `persons?`, data);
            const res = await axios(config);

            return res.data.data;
        } catch (error) {
            console.log("ERROR GETTING DEAL ---", error);
        }
    }
};
