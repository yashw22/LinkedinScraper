const puppeteer = require('puppeteer');

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function scrape(url) {

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto(url);
    await page.waitForNavigation();
    var bodyHandle = await page.$('body');

    var profile_data = await page.evaluate((document) => {
        var data = {
            'name': '', 'description': '', 'location': '', 'about': '',
            'experiences': [], 'education': [], 'recommendations': []
        };

        data['name'] = document.querySelector('.top-card-layout__title').innerText.trim();
        data['description'] = document.querySelector('.top-card-layout__headline').innerText.trim();
        data['location'] = document.querySelector('.top-card__subline-item').innerText.trim();
        data['about'] = document.querySelector('.core-section-container__content')
            .innerText.trim().replace(/\s\s+/g, ' | ').replace(/\n/g, ' | ');

        document.querySelectorAll('.experience-item')
            .forEach(item => {
                // var exp = {};
                // exp['start'] = item.querySelectorAll('time')[0].textContent.trim();
                // exp['end'] = item.querySelectorAll('time').length;
                // exp['loc'] = item.querySelector('.date-range').innerHTML;
                // exp['duration'] = item.querySelector('.date-range__duration').textContent.trim();
                // data['experiences'].push(var);
                data['experiences']
                    .push(item.innerText.replace(/\s\s+/g, ' | ').replace(/\n/g, ' | '));
            });

        document.querySelectorAll('.education__list-item')
            .forEach(item => {
                data['education']
                    .push(item.innerText.replace(/\s\s+/g, ' | ').replace(/\n/g, ' | '));
            });

        document.querySelectorAll('.recommendations__list-item')
            .forEach(item => {
                data['recommendations']
                    .push(item.innerText.replace(/\s\s+/g, ' | ').replace(/\n/g, ' | '));
            });
        return data;
    }, bodyHandle);
    await browser.close();
    return profile_data;
}

module.exports = { scrape };