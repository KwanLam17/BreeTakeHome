const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.listen(8080, () => {
    console.log("server listening on port 8080");
});

app.post("/", async (req, res, next) => {
    try {
        const searchResponse = await axios.post(
            process.env.OFAC_API_URL,
            {
                apiKey: process.env.OFAC_API_KEY,
                cases: [
                    {
                        name: req.body.name,
                        dob: req.body.dob,
                        address: {
                            country: req.body.country,
                        },
                    },
                ],
            }
        );

        const matches = searchResponse.data.matches[req.body.name];
        const nameMatch = matches.length > 0;
        const dobMatch = !!matches.find(({ dob }) => {
            const dobFormatted = new Date(dob).toISOString().split("T")[0];
            return dobFormatted === req.body.dob;
        });
        const countryMatch = !!matches.find(
            ({ addresses }) =>
                addresses &&
                !!addresses.find(({ country }) => country === req.body.country)
        );
        res.json({
            matches,
            hit: nameMatch || dobMatch || countryMatch,
            nameMatch,
            dobMatch,
            countryMatch,
        });
    } catch (e) {
        next(e);
    }
});
