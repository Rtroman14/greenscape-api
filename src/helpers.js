const moment = require("moment");
const today = moment(new Date()).format("YYYY-MM-DD");

module.exports = {
    async minutesWait(minutes) {
        return await new Promise((resolve) => {
            setTimeout(resolve, 60000 * minutes);
        });
    },

    liveCampaigns(campaigns) {
        return campaigns.filter((campaign) => {
            if (
                "Campaign Status" in campaign &&
                "Base ID" in campaign &&
                "API Token" in campaign &&
                "Campaign ID" in campaign
            ) {
                if (campaign["Campaign Status"] !== "Paused") {
                    return campaign;
                }
            }
        });
    },

    campaignsDueToday(campaigns) {
        return campaigns.filter((campaign) => {
            if (!("Last Updated" in campaign)) {
                return campaign;
            }

            if ("Last Updated" in campaign && moment(campaign["Last Updated"]).isBefore(today)) {
                return campaign;
            }
        });
    },

    campaignsToRun(campaigns) {
        let crmCampaigns = [];

        campaigns.forEach((campaign) => {
            // check if client is in crmCampaigns
            const isClientPresent = crmCampaigns.some(
                (newCampaign) => newCampaign.Client === campaign.Client
            );

            if ("Type" in campaign && campaign.Type === "Specific") {
                return crmCampaigns.push(campaign);
            }

            // check if multiple same clients exist in campaigns
            const clientCampaigns = campaigns.filter((obj) => {
                if (!("Type" in obj)) {
                    return obj.Client === campaign.Client;
                }
            });

            if (clientCampaigns.length > 1 && !isClientPresent) {
                let clientAdded = false;

                clientCampaigns.some((obj) => {
                    if (!("Last Updated" in obj)) {
                        clientAdded = true;
                        return crmCampaigns.push(obj);
                    }
                });

                const [nextCampaign] = clientCampaigns.sort(
                    (a, b) => new Date(a["Last Updated"]) - new Date(b["Last Updated"])
                );

                !clientAdded && crmCampaigns.push(nextCampaign);
            }

            if (clientCampaigns.length === 1) {
                crmCampaigns.push(campaign);
            }
        });

        return crmCampaigns;
    },

    mapContact(contact) {
        return {
            firstName: contact["First Name"] || "",
            lastName: contact["Last Name"] || "",
            name: `${contact["First Name"]} ${contact["Last Name"]}`,
            email: contact.Email || "",
            phone: contact["Phone Number"] || "",
            address1: contact.Address || "",
            city: contact.City || "",
            state: contact.State || "",
            postalCode: contact["Zip Code"] || "",
        };
    },

    orgInfo(address) {
        let org = {};

        org.address = address;

        let [city, state, zip] = address.split(" ").slice(-3);
        org.city = city.replace(",", "");
        org.state = state;
        org.zip = zip;

        address = address.split(" ").slice(0, -3).join(" ");

        if (address.includes("-")) {
            const dashIndex = address.indexOf("-");

            let name = address.slice(dashIndex).trim();
            let street = address.slice(0, dashIndex).trim();

            org.name = name.replace("-", "").trim();
            org.street = street.replace("-", "").trim();
        } else {
            org.name = address;
            org.street = address;
        }

        org.fullAddress = `${org.street}, ${org.city}, ${org.state} ${org.zip}`;

        return org;
    },
};
