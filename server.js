const express = require('express')
const puppeteer = require('puppeteer');
const scraper = require("./scraper.js")

const app = express()

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/frontend/index.html");
});


app.get("/urldata", async (req, res) => {
    var url_data = '';
    try {
        url_data = await scraper.scrape(req.query.url);
    }
    catch (error) {
        // console.log(error);
    }
    res.status(200).send(url_data);
});


const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});