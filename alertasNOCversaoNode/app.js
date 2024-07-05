import { promises as fs } from 'fs';
import OpsGenieClient, { process_alerts } from './opsgenie_client';

const app = express();

// Configurações
const api_endpoint = "https://api.opsgenie.com";
const api_key = "43423c25-6ac8-468c-b6d3-022c84704a26";
const team_name = "NATIS - NOC";

const file_path = "alertas_noc.json";

app.get('/getAlerts', async (req, res) => {
    const opsgenie_client = new OpsGenieClient(api_endpoint, api_key);
    const alerts = await opsgenie_client.get_alerts(team_name);

    if (alerts.length > 0) {
        const processed_alerts = process_alerts(alerts);

        try {
            // Salvar os alertas processados em um arquivo JSON
            await fs.writeFile(file_path, JSON.stringify(processed_alerts, null, 2));
            res.send("Alertas salvos em arquivo JSON com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar os alertas no arquivo JSON: ", error);
            res.status(500).send("Erro ao salvar os alertas no arquivo JSON.");
        }
    } else {
        res.status(500).send("Erro ao buscar os alertas.");
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
