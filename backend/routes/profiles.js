const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', (req, res) => {
    res.json({
        status: 'SUCCESS',
        response: {
            message: 'Default page... no info returned'
        }
    });
});

router.post('/getSummoner', (req,res) => {
    var summonerName = req.body.data.summoner_name;

    axios.get(`${process.env.BASEURL}/tft/summoner/v1/summoners/by-name/${summonerName}`, {
        headers: {
            'X-Riot-Token' : process.env.API_KEY
        }
    }).then((response) => {
        // console.log(response.data);

        res.json({
            status: "SUCCESS",
            data : {
                account_id: response.data.id,
                summoner_name: response.data.name,
                summoner_level: response.data.summonerLevel,
                puuid: response.data.puuid
            }
        })
    }).catch((error) => {
        console.error(error);
        res.json({requestBody: error})
    })
    
})

module.exports = router;