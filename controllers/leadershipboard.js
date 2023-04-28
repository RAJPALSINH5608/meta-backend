const Broker = require("../models/brokerRegistration");
const User = require("../models/userRegistration");

const leadershipboardBroker = (req,res) => {
    console.log(req.query);
    if(req.query.by == undefined){
        req.query.by = "nft";
    }
    if(req.query.by == "nft"){
        Broker.find({}).sort({totalNFTMinted:-1}).then((result)=>{
            console.log("By NFT");
            res.send(result);
        }).catch((err)=>{
            res.status(400).send(err);
        })
    }else if(req.query.by == "tiles"){
        Broker.find({}).sort({totalTilesMinted:-1}).then((result)=>{
            console.log("by Tiles");
            res.send(result);
        }).catch((err)=>{
            res.status(400).send(err);
        })
    }else{
        res.status(400).send("Invalid query parameter");
    }
}

const leadershipboardUser = (req,res) => {
    console.log(req.query);
    if(req.query.by == undefined){
        req.query.by = "nft";
    }
    if(req.query.by == "nft"){
        User.find({}).sort({noOfNFT:-1}).then((result)=>{
            console.log("By NFT");
            res.send(result);
        }).catch((err)=>{
            res.status(400).send(err);
        })
    }else if(req.query.by == "tiles"){
        User.find({}).sort({noOfTiles:-1}).then((result)=>{
            console.log("by Tiles");   
            res.send(result);
        }).catch((err)=>{
            res.status(400).send(err);
        })
    }else{
        res.status(400).send("Invalid query parameter");
    }
}

module.exports = {
    leadershipboardBroker,
    leadershipboardUser
}