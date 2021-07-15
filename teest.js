require("dotenv").config();

const axios = require("axios");

const campaigns = require("./functions/utils/campaigns");

const PipedriveApi = require("./functions/utils/Pipedrive");
const Pipedrive = new PipedriveApi(process.env.PIPEDRIVE_API);

const AirtableApi = require("./src/airtable");
// const HighlevelApi = require("./src/Highlevel");

const HighlevelApi = require("./functions/utils/Highlevel");
const Highlevel = new HighlevelApi(process.env.HIGHLEVEL_API);

const { liveCampaigns, mapContact, campaignsToRun, campaignsDueToday } = require("./src/helpers");
const pipedrivePerson = require("./functions/utils/pipedrivePerson");
const pipedriveOrganization = require("./functions/utils/pipedriveOrganization");

const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

(async () => {
    try {
        // const contact = await Airtable.getContact("appRGIOnGz04cUXz3", "recRwrhXXNT6P3ckn");
        // // console.log(contact);
        // const { data } = await axios.post(
        //     "https://greenscape.netlify.app/.netlify/functions/bookedMeeting",
        //     {
        //         // recordID: "recRwrhXXNT6P3ckn",
        //         recordID: contact.recordID,
        //     }
        // );
        // console.log(data);
        // ----------------------------------------------------------------------
        // const propertyType = "Facility";
        // const deal = {
        //     current: {
        //         stage_id: 1,
        //         name: "Discovery Meeting",
        //     },
        // };
        // let campaign;
        // if (deal.current.stage_id === 1) {
        //     campaign = campaigns.didNotBook.find((campaign) =>
        //         campaign.name.includes(propertyType)
        //     );
        //     if (campaign === undefined) {
        //         campaign = {
        //             name: "Other - Did Not Book",
        //             id: "ozLrdIRTIRnR8AWGI3lI",
        //         };
        //     }
        // }
        // if (deal.current.stage_id === 2) {
        //     campaign = campaigns.onsiteMeetingCanceled.find((campaign) =>
        //         campaign.name.includes(propertyType)
        //     );
        //     if (campaign === undefined) {
        //         campaign = {
        //             name: "Other - Onsite Meeting Canceled",
        //             id: "CM0AGl4EKjyP5IOoCIL7",
        //         };
        //     }
        // }
        // console.log(campaign);
        // ----------------------------------------------------------------------
        const deal = {
            v: 1,
            matches_filters: { current: [] },
            meta: {
                action: "updated",
                change_source: "api",
                company_id: 8091367,
                host: "app.pipedrive.com",
                id: 6,
                is_bulk_update: false,
                matches_filters: { current: [] },
                object: "deal",
                permitted_user_ids: [12422542, 12264715],
                pipedrive_service_name: false,
                timestamp: 1626377567,
                timestamp_micro: 1626377567586844,
                trans_pending: false,
                user_id: 12422542,
                v: 1,
                webhook_id: "715923",
            },
            current: {
                email_messages_count: 0,
                cc_email: "summamedia4+deal6@pipedrivemail.com",
                products_count: 0,
                next_activity_date: null,
                next_activity_type: null,
                next_activity_duration: null,
                id: 6,
                person_id: 17,
                creator_user_id: 12422542,
                expected_close_date: null,
                owner_name: "Johnny Petras",
                participants_count: 1,
                group_name: null,
                stage_id: 2,
                probability: null,
                undone_activities_count: 0,
                renewal_type: "one_time",
                active: true,
                person_name: "Ryan Roman",
                last_activity_date: null,
                close_time: null,
                org_hidden: false,
                next_activity_id: null,
                weighted_value_currency: "USD",
                stage_order_nr: 0,
                next_activity_subject: null,
                rotten_time: null,
                user_id: 12422542,
                visible_to: "3",
                org_id: 11,
                notes_count: 1,
                next_activity_time: null,
                formatted_value: "$0",
                status: "open",
                formatted_weighted_value: "$0",
                first_won_time: null,
                "3c9c0afaed61b587a2f3d3ce7ff14d5df9ae4fcf": "19",
                last_outgoing_mail_time: null,
                title: "3201 Integrity Dr",
                last_activity_id: null,
                update_time: "2021-07-15 19:32:47",
                last_activity: null,
                next_activity: null,
                activities_count: 0,
                pipeline_id: 1,
                lost_time: null,
                currency: "USD",
                weighted_value: 0,
                org_name: "3201 Integrity Dr",
                value: 0,
                person_hidden: false,
                next_activity_note: null,
                files_count: 0,
                last_incoming_mail_time: null,
                label: null,
                lost_reason: null,
                deleted: false,
                won_time: null,
                group_id: null,
                followers_count: 1,
                stage_change_time: null,
                add_time: "2021-07-15 19:19:47",
                done_activities_count: 0,
            },
            previous: {
                email_messages_count: 0,
                cc_email: "summamedia4+deal6@pipedrivemail.com",
                products_count: 0,
                next_activity_date: null,
                next_activity_type: null,
                next_activity_duration: null,
                id: 6,
                person_id: 17,
                creator_user_id: 12422542,
                expected_close_date: null,
                owner_name: "Johnny Petras",
                participants_count: 1,
                group_name: null,
                stage_id: 1,
                probability: null,
                undone_activities_count: 0,
                renewal_type: "one_time",
                active: true,
                person_name: "Ryan Roman",
                last_activity_date: null,
                close_time: null,
                org_hidden: false,
                next_activity_id: null,
                weighted_value_currency: "USD",
                stage_order_nr: 0,
                next_activity_subject: null,
                rotten_time: null,
                user_id: 12422542,
                visible_to: "3",
                org_id: 11,
                notes_count: 0,
                next_activity_time: null,
                formatted_value: "$0",
                status: "open",
                formatted_weighted_value: "$0",
                first_won_time: null,
                "3c9c0afaed61b587a2f3d3ce7ff14d5df9ae4fcf": "18",
                last_outgoing_mail_time: null,
                title: "3201 Integrity Dr",
                last_activity_id: null,
                update_time: "2021-07-15 19:32:46",
                last_activity: null,
                next_activity: null,
                activities_count: 0,
                pipeline_id: 1,
                lost_time: null,
                currency: "USD",
                weighted_value: 0,
                org_name: "3201 Integrity Dr",
                value: 0,
                person_hidden: false,
                next_activity_note: null,
                files_count: 0,
                last_incoming_mail_time: null,
                label: null,
                lost_reason: null,
                deleted: false,
                won_time: null,
                group_id: null,
                followers_count: 1,
                stage_change_time: null,
                add_time: "2021-07-15 19:19:47",
                done_activities_count: 0,
            },
            event: "updated.deal",
            retry: 0,
        };

        // IF DEAL === DISCOVERY MEETING || ONSITE MEETING
        if (deal.current.stage_id === 1 || deal.current.stage_id === 2) {
            const triggerCampaign = await Pipedrive.dealFields("Trigger Outreach Campaign");

            const triggerCampaignPrevious = deal.previous[triggerCampaign.key];
            const triggerCampaignCurrent = deal.current[triggerCampaign.key];

            const campaignOption = triggerCampaign.options.find(
                (option) => option.id === Number(triggerCampaignCurrent)
            );

            if (
                triggerCampaignPrevious !== triggerCampaignCurrent &&
                triggerCampaignCurrent !== null // campaign depends on stage
            ) {
                // get property type
                const propertyType = await Pipedrive.getPropertyType(deal.current.org_id);

                // get person
                const person = await Pipedrive.findPersonID(deal.current.person_id);

                let highLevelPerson = await Highlevel.getContact(
                    person.email[0].value,
                    person.phone[0].value
                );

                if (!highLevelPerson) {
                    const newHighLevelPerson = {
                        firstName: person.first_name || "",
                        lastName: person.last_name || "",
                        name: person.name || "",
                        email: person.email[0].value || "",
                        phone: person.phone[0].value || "",
                        address1: (person.org_id !== null && person.org_id.address) || "",
                    };

                    highLevelPerson = await Highlevel.createContact(newHighLevelPerson);

                    console.log("NO HIGHLEVEL PERSON");
                }

                // choose correct campaign to send prospect to
                let campaign = false;

                if (
                    deal.current.stage_id === 1 &&
                    campaignOption.label === "Missed Discovery Meeting"
                ) {
                    campaign = campaigns[campaignOption.label].find((campaign) =>
                        campaign.name.includes(propertyType)
                    );
                    if (campaign === undefined) {
                        campaign = {
                            name: "Other - Did Not Book",
                            id: "ozLrdIRTIRnR8AWGI3lI",
                        };
                    }
                }
                if (
                    deal.current.stage_id === 2 &&
                    campaignOption.label === "Missed Onsite Meeting"
                ) {
                    campaign = campaigns[campaignOption.label].find((campaign) =>
                        campaign.name.includes(propertyType)
                    );
                    if (campaign === undefined) {
                        campaign = {
                            name: "Other - Onsite Meeting Canceled",
                            id: "CM0AGl4EKjyP5IOoCIL7",
                        };
                    }
                }

                if (campaign) {
                    const addedToCampaign = await Highlevel.addToCampaign(
                        highLevelPerson.id,
                        campaign.id
                    );

                    console.log(
                        `\nAdded ${deal.current.person_name} to Highlevel campaign: ${campaign.name}\n`
                    );

                    const note = JSON.stringify({
                        content: `${deal.current.person_name} with ${
                            deal.current.org_name || "empty"
                        } was sent to outreach campaign: ${campaign.name}.`,
                        deal_id: deal.current.id,
                    });
                    await Pipedrive.createNote(note);
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
})();
