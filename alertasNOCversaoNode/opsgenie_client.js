const axios = require('axios');

class OpsGenieClient {
    constructor(api_endpoint, api_key) {
        this.api_endpoint = api_endpoint;
        this.api_key = api_key;
    }

    async get_alerts(team_name, limit = 100) {
        const url = `${this.api_endpoint}/v2/alerts`;
        const headers = {
            "Authorization": `GenieKey ${this.api_key}`,
            "Content-Type": "application/json"
        };
        const params = {
            "query": `teams:${team_name}`,
            "limit": limit
        };

        try {
            const response = await axios.get(url, { headers, params });
            return response.data.data || [];
        } catch (error) {
            console.error(`Error fetching alerts: ${error.response.status} - ${error.response.data}`);
            return [];
        }
    }

    static process_alerts(alerts) {
        return alerts.map(alert => {
            const alertObj = {
                "tinyId": alert.tinyId,
                "message": alert.message,
                "createdAt": alert.createdAt,
                "status": alert.status,
                "acknowledgedBy": alert.acknowledgedBy.map(ack => ack.name).join(", "),
                "closedBy": alert.closedBy.map(close => close.name).join(", "),
                "ackTime": alert.ackTime,
                "closeTime": alert.closeTime,
                "scaledNext": alert.extraProperties["Scaled Next"],
                "scaledFinal": alert.extraProperties["Scaled Final"],
                "turno": alert.extraProperties["Turno"]
            };

            alert.tags.forEach((tag, index) => {
                alertObj[`tags-${index + 1}`] = tag;
            });

            return alertObj;
        });
    }
}

module.exports = OpsGenieClient;
