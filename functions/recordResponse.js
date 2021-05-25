require("dotenv").config();

const { responseStatus, slackNotification } = require("./utils/helpers");

const AirtableApi = require("../src/airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

exports.handler = async (event) => {
    if (event.httpMethod === "GET") {
        return {
            statusCode: 200,
            body: JSON.stringify({ msg: "POST request only" }),
        };
    } else if (event.httpMethod === "POST") {
        const res = JSON.parse(event.body);
        const { full_name, campaign, message } = res;

        const getCampaigns = await Airtable.getCampaigns("CRM");
        const crmCampaigns = getCampaigns.filter(
            (foundCampaign) => foundCampaign.Campaign === campaign.name
        );

        for (let crmCampaign of crmCampaigns) {
            const contact = await Airtable.findTextContact(crmCampaign["Base ID"], full_name);

            if (contact && !("Responded" in contact)) {
                const Status = responseStatus(message.body);

                const updatedFields = {
                    Responded: true,
                    Response: message.body,
                    "Response Date": new Date(),
                    Status,
                };

                await Airtable.updateContact(
                    crmCampaign["Base ID"],
                    contact.recordID,
                    updatedFields
                );

                console.log(
                    `\nClient: ${crmCampaign.Client}\nCampaign: ${campaign.name} \nFrom: ${full_name} \nResponse: ${message.body}\n`
                );

                Status === null &&
                    (await slackNotification(
                        `\nClient: ${crmCampaign.Client}\nCampaign: ${campaign.name} \nFrom: ${full_name} \nResponse: ${message.body}\n`
                    ));
            }
        }

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
