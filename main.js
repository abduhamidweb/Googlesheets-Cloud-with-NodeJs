import express from "express"
import {
    google
} from 'googleapis'
import bodyParser from 'body-parser'
import dotenv from "dotenv";
dotenv.config()
const app = express();
app.use(bodyParser.json());
const oAuth2Client = new google.auth.GoogleAuth({
    keyFile: './keys.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
});
const sheets = google.sheets({
    version: 'v4',
    auth: oAuth2Client
});
const spreadsheetId = process.env.spreadsheetId;
// CREATE
app.post('/api/data', async (req, res) => {
    const {
        id,
        name,
        age
    } = req.body;
    const range = 'demo!A1:D1000';
    const values = [
        [id, name, age]
    ];
    const resource = {
        values
    };
    try {
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range,
            valueInputOption: 'USER_ENTERED',
            resource,
        });
        res.json(response);
    } catch (error) {
        console.log(error);
        res.status(500).send('Serverda xatolik yuz berdi');
    }
});
// READ
app.get('/api/data', async (req, res) => {
    // console.log(1);
    const range = 'demo!A1:D10';
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });
        const values = response.data.values;
        if (values) {
            res.json(values);
        } else {
            res.json([]);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Serverda xatolik yuz berdi');
    }
});
// UPDATE
app.put('/api/data/:row', async (req, res) => {
    const {
        name,
        age,
        id
    } = req.body;
    const range = `demo!A${req.params.row}:C${req.params.row}`;
    const values = [
        [name, age, id]
    ];
    const resource = {
        values
    };

    try {
        const response = await sheets.spreadsheets.values.update({
            spreadsheetId,
            range,
            valueInputOption: 'USER_ENTERED',
            resource,
        });

        res.json(response);
    } catch (error) {
        console.log(error);
        res.status(500).send('Serverda xatolik yuz berdi');
    }
});
// DELETE
app.delete('/api/data/:row', async (req, res) => {
    const range = `demo!A${req.params.row}:C${req.params.row}`;

    try {
        const response = await sheets.spreadsheets.values.clear({
            spreadsheetId,
            range,
        });

        res.json(response);
    } catch (error) {
        console.log(error);
        res.status(500).send('Serverda xatolik yuz berdi');
    }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));