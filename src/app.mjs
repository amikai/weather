import Koa from 'koa';
import Router from 'koa-router';
import mount from 'koa-mount';
import serve from 'koa-static';
import fetch from 'node-fetch';
import cors from '@koa/cors';


let app = new Koa();
let router = new Router();
const token = process.env.TOKEN;

app.use(cors());
router.get('/weather', async (ctx, next) => {
    const apiUrl = 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-063';
    let params = [
        `Authorization=${token}`,
        `format=JSON`,
        `locationName=中山區`,
    ].join('&');

    let response = await fetch(encodeURI(`${apiUrl}?${params}`), {
        method: 'get',
        headers: {'Content-Type': 'application/json'},
    });
    let data = await response.json();
    let weather = (() => { // parse data
        let target = data.records.locations[0].location[0].weatherElement
            .filter( ele => ele.elementName == 'T' || ele.elementName == 'PoP12h')
            .map(ele => ele.time);
        let res = {'t': target[1], 'pop12h': target[0]};
        let now = new Date();
        let first = new Date(res.t[0].startTime);
        let firstDate = new Date(first.getFullYear(), first.getMonth(), first.getDate(),
            now.getHours(), now.getMinutes(), now.getMilliseconds());

        let ret = [];
        for(let i = 0 ; i < 7 ; i++) {
            let d = new Date(firstDate.getTime() + i * 24 * 60 * 60 * 1000);
            for(let j = 0 ; j < res.t.length ; j++) {
                const startTime = new Date(res.t[j].startTime);
                const endTime = new Date(res.t[j].endTime);
                if (startTime < d && d <= endTime) {
                    ret.push({'date': `${d.getMonth() + 1}/${d.getDate()}`,
                        't': res.t[j].elementValue[0].value,
                        'pop': res.pop12h[j].elementValue[0].value});
                }
            }
        }
        return ret;
    })();
    ctx.body = JSON.stringify(weather);
});

app.use(mount('/', serve("./public")));
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);


