const Airtable = require("airtable");

module.exports = class AirtableApi {
    constructor(apiKey) {
        if (!apiKey) {
            throw new Error("Using Airtable requires an API key.");
        }

        this.apiKey = apiKey;
    }

    async assignAirtable(baseID) {
        try {
            return new Airtable({ apiKey: this.apiKey }).base(baseID);
        } catch (error) {
            console.log("NO API KEY PROVIDED ---", error);
        }
    }

    async getCampaigns(view) {
        try {
            const base = await this.assignAirtable("appGB7S9Wknu6MiQb");

            const res = await base("Campaigns").select({ view }).firstPage();

            const campaigns = res.map((campaign) => {
                return {
                    ...campaign.fields,
                    recordID: campaign.getId(),
                };
            });

            return campaigns;
        } catch (error) {
            console.log("ERROR GETCAMPAIGNS() ---", error);
        }
    }

    async updateCampaign(recordID, updatedFields) {
        try {
            const base = await this.assignAirtable("appGB7S9Wknu6MiQb");

            await base("Campaigns").update(recordID, updatedFields);
        } catch (error) {
            console.log("ERROR UPDATECAMPAIGN() ---", error);
        }
    }

    // async getContact(baseID, view) {
    //     try {
    //         const base = await this.assignAirtable(baseID);

    //         const res = await base("Prospects").select({ maxRecords: 1, view }).firstPage();

    //         return res.length > 0 ? { ...res[0].fields, recordID: res[0].getId() } : false;
    //     } catch (error) {
    //         console.log("ERROR GETCONTACT() ---", error);
    //     }
    // }

    async getContact(baseID, recordID) {
        try {
            const base = await this.assignAirtable(baseID);

            const res = await base("Prospects").find(recordID);

            return { ...res.fields, recordID: res.getId() };
        } catch (error) {
            console.log("ERROR GETCONTACT() ---", error);
            return false;
        }
    }

    async getContacts(baseID, view) {
        try {
            const base = await this.assignAirtable(baseID);

            const res = await base("Prospects").select({ view }).all();

            const contacts = res.map((contact) => {
                return {
                    ...contact.fields,
                    recordID: contact.getId(),
                };
            });

            return contacts;
        } catch (error) {
            console.log("ERROR GETCAMPAIGNS() ---", error);
        }
    }

    async updateContact(baseID, recordID, updatedFields) {
        try {
            const base = await this.assignAirtable(baseID);

            await base("Prospects").update(recordID, updatedFields);
        } catch (error) {
            console.log("ERROR UPDATECONTACT() ---", error);
        }
    }

    async findContact(baseID, fullName) {
        try {
            const base = await this.assignAirtable(baseID);

            const res = await base("Prospects")
                .select({
                    maxRecords: 10,
                    filterByFormula: `AND(({Full Name} = "${fullName}"))`,
                })
                .firstPage();

            const contacts = res.map((contact) => ({
                ...contact.fields,
                recordID: contact.getId(),
            }));

            return contacts.length > 0 ? contacts[0] : false;
        } catch (error) {
            console.log("ERROR FINDTEXTCONTACTS() ---", error);
        }
    }
};
