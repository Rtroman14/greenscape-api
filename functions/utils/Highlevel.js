require("dotenv").config();

const axios = require("axios");

module.exports = class HighLevel {
    constructor(token) {
        this.token = token;
    }

    getConfig(method, url, data) {
        try {
            if (data) {
                return {
                    method,
                    url,
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                    },
                    data,
                };
            }

            return {
                method,
                url,
                headers: {
                    Authorization: `Bearer ${this.token}`,
                },
            };
        } catch (error) {
            console.log("ERROR CONFIG ---", error);
        }
    }

    async createContact(data) {
        try {
            const config = this.getConfig(
                "post",
                "https://rest.gohighlevel.com/v1/contacts/",
                data
            );

            const res = await axios(config);

            return res.data.contact;
        } catch (error) {
            console.log("ERROR CREATECONTACT ---", error);
        }
    }

    async getContact(email) {
        try {
            const config = this.getConfig(
                "get",
                `https://rest.gohighlevel.com/v1/contacts/lookup?email=${email}`
            );

            const res = await axios(config);

            return res.data.contacts;
        } catch (error) {
            console.log("ERROR GETCONTACT ---", error);

            return [];
        }
    }

    async getPipelines() {
        try {
            const config = this.getConfig("get", "https://rest.gohighlevel.com/v1/pipelines/");

            const res = await axios(config);

            return res.data;
        } catch (error) {
            console.log("ERROR GETCONTACT ---", error);

            return [];
        }
    }

    async getOpportunities(pipelineID) {
        try {
            const config = this.getConfig(
                "get",
                `https://rest.gohighlevel.com/v1/pipelines/${pipelineID}/opportunities?&limit=20`
            );

            const res = await axios(config);

            return res.data;
        } catch (error) {
            console.log("ERROR GETCONTACT ---", error);

            return [];
        }
    }

    async nextPipeline(account) {
        try {
            let pipelines = [];

            for (const pipeline of account.pipelines) {
                const numOpportunities = await this.getOpportunities(pipeline.pipelineId);

                pipelines.push({
                    ...pipeline,
                    numOpportunities: numOpportunities.meta.total,
                });
            }

            return pipelines.reduce((prev, current) =>
                prev.numOpportunities > current.numOpportunities ? current : prev
            );
        } catch (error) {
            console.log("ERROR NEXTPIPELINE ---", error);
        }
    }

    async createOpportunity(pipelineId, data) {
        try {
            const config = this.getConfig(
                "post",
                `https://rest.gohighlevel.com/v1/pipelines/${pipelineId}/opportunities/`,
                data
            );

            const res = await axios(config);

            return res.data;
        } catch (error) {
            console.log("ERROR CREATENEWOPPORTUNITY ---", error);
        }
    }

    async newPipelineOpportunity(account, contact) {
        try {
            // CREATE NEW CONTACT
            const { id, firstName, lastName } = await this.createContact(contact);
            id && console.log(`Created new contact: ${firstName} ${lastName}`);

            // GET NEXT PIPELINE
            const { name, pipelineId, stageId } = await this.nextPipeline(account);
            name && console.log(`Next pipeline: ${name}`);

            // CREATE OPPORTUNITY
            const data = {
                title: `${firstName} ${lastName}`,
                stageId,
                status: "open",
                contactId: id,
            };
            const newOpportunity = await this.createOpportunity(pipelineId, data);
            newOpportunity && console.log(newOpportunity);
        } catch (error) {
            console.log("ERROR NEWPIPELINEOPPORTUNITY ---", error);
        }
    }
};
