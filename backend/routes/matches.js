const express = require('express');
const router = express.Router();

const axios  = require('axios');
const url = require('url');

const matchUtils = require('../helpers/matchUtils')

router.get('/', (req, res) => {
    res.send(`Matches home on port : ${process.env.API_KEY}`);
});

router.post('/getMatchAverages', (req, res) => {
    if(!req.body.data.hasOwnProperty('puuid')){
        res.status(400).send("Missing PUUID");
        return;
        // console.log(req.body);
    }
    var puuid = req.body.data.puuid;
    var start = req.body.data.hasOwnProperty('start') ? req.body.data.start : 0;
    var numMatches = req.body.data.hasOwnProperty('numMatches') ? req.body.data.numMatches : 5;

    var matchList = [];

    var params = new URLSearchParams({
        start: start,
        count: numMatches
    });
    axios.get(`${process.env.BASEURL_americas}/tft/match/v1/matches/by-puuid/${puuid}/ids?${params}`,{
        headers: {
            'X-Riot-Token' : process.env.API_KEY
        }
    }).then(async (response) => {
        let matchIDs = response.data;
        let promises = [];
        for(var i = 0; i < matchIDs.length; i++){
            // console.log(matchIDs[i]);
            // get some kind of promise array of axios requests here
            promises.push(
                axios.get(`${process.env.BASEURL_americas}/tft/match/v1/matches/${matchIDs[i]}`,{
                    headers:{
                        'X-Riot-Token' : process.env.API_KEY
                    }
                }).then((response) => {
                    for(var j = 0; j < response.data.info.participants.length ; j++){
                        let participant = response.data.info.participants[j];
                        if(participant.puuid.valueOf() == puuid.valueOf()){
                            matchList.push(participant);
                            break;
                        }
                    }
                }).catch((error)=>{
                    res.status(400).send(error)
                })
            )
        }

        Promise.all(promises).then(()=>{
            // Process the matchlist THEN return the response
            matchStats = matchUtils.calculateMatchAverages(matchList);
            res.json({
                status: "SUCCESS",
                data: {
                    // matchList: matchList
                    avgGoldLeft: matchStats["avgGold"],
                    avgDamage: matchStats["avgDmgToPlayers"],
                    avgLevel: matchStats["avgLevel"],
                    avgPlacement: matchStats["avgPlacement"],
                    traits: matchStats["traits"],
                    topTrait : matchStats["topTrait"],
                    champs: matchStats["champs"],
                    topChamp: matchStats["topChamps"],
                    augments: matchStats["augments"],
                    topAugment: matchStats["topAugment"],
                    metaData: matchList
                }
            })
        })

        // res.json({status: "SUCCESS"});

    }).catch((error)=>{
        res.status(400).send(error)
    })

    
})

module.exports = router;