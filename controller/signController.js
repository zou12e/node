/** 异步回调写法 **/

const url = 'mongodb://localhost:27017/sign';

const mongo = require('../lib/mongo');

const moment = require('moment');

const m = mongo(url, 'history');

const cnWeek = ['天', '一', '二', '三', '四', '五', '六'];
// const bodyParser = require('body-parser');
// 对数据进行解析
// const urlencodeParser = bodyParser.urlencoded({ extended: false });

module.exports = function (app) {
    // 获取数据
    app.get('/sign', async function (req, res) {
        // 当前时间
        const now = new Date();

        // 当前星期几
        const week = now.getDay();

        // 当前周星期一日期
        const cDay = moment(now).subtract(week - 1, 'days').format('YYYY-MM-DD 00:00');

        // 当前周星期一日期
        // const bDay = moment(now).subtract(week - 1 + 7, 'days').format('YYYY-MM-DD 00:00');

        // 查询当前周打卡情况
        const cData = await m.findAsync({ 'date': { '$gte': new Date(cDay) } }, { '_id': 0 });

        // 查询上前周打卡情况
        // const bData = await m.findAsync({ 'date': { '$gte': new Date(bDay), '$lt': new Date(cDay) } });
        //
        const cDataDetal = [];

        // console.log(cData);
        cData.forEach(ele => {
            ele.ymd = moment(ele.date).format('YYYY-MM-DD');
            ele.hm = moment(ele.date).format('HH:mm');
            ele.ymdhm = ele.ymd + ele.hm;
            ele.week = `星期${cnWeek[moment(ele.date).weekday()]}`;
            if (!cDataDetal[ele.ymd]) cDataDetal[ele.ymd] = { sb: {}, xb: {} };
            // 储存数据
            cDataDetal[ele.ymd][ele.type].ymd = ele.ymd;
            cDataDetal[ele.ymd][ele.type].hm = ele.hm;
            cDataDetal[ele.ymd][ele.type].ymdhm = ele.ymdhm;
            cDataDetal[ele.ymd][ele.type].week = ele.week;
            cDataDetal[ele.ymd][ele.type].date = ele.date;
        });

        const cDataInfo = [];
        for (const cd in cDataDetal) {
            cDataInfo.push({
                date: cd,
                duration: getDuration(cDataDetal[cd].sb.ymd, cDataDetal[cd].sb.date, cDataDetal[cd].xb.date),
                info: cDataDetal[cd]
            });
        }

        console.log('----------------------');
        res.render('sign/index', { cDataInfo: cDataInfo });
    });

    app.get('/sign/add', async function (req, res) {
        m.drop();

        let d1 = new Date('2018-03-05 09:45');
        let d2 = new Date('2018-03-06 09:23');
        let d3 = new Date('2018-03-07 10:12');
        let d4 = new Date('2018-03-08 09:44');
        let d5 = new Date('2018-03-09 10:25');
        // 上班
        m.insert({ type: 'sb', date: d1 });
        m.insert({ type: 'sb', date: d2 });
        m.insert({ type: 'sb', date: d3 });
        m.insert({ type: 'sb', date: d4 });
        m.insert({ type: 'sb', date: d5 });

        d1 = new Date('2018-03-05 18:46');
        d2 = new Date('2018-03-06 19:21');
        d3 = new Date('2018-03-07 20:17');
        d4 = new Date('2018-03-08 21:42');
        d5 = new Date('2018-03-09 18:22');
        // 下班
        m.insert({ type: 'xb', date: d1 });
        m.insert({ type: 'xb', date: d2 });
        m.insert({ type: 'xb', date: d3 });
        m.insert({ type: 'xb', date: d4 });
        // m.insert({ type: 'xb', date: d5 });

        res.end('ok');
    });

    // db.history.find({'date': { '$gte': new Date('2018-03-08 00:00') });
    // db.history.find({"sendTime":{"$gte":new Date("2018-03-08")}}).count();
    // db.history.find({ "date":{$gt:new Date()}});
    //     {}
    /***
     *
     *
     *
     *
     * db.history.insert({});
     */
    // );

    // sb:上班打卡   xb: 下班打卡
    app.post('/api/:type', function (req, res) {
        const now = new Date();
        const date = moment(now).format('YYYY-MM-DD HH:mm');
        m.insert(
            {
                type: req.params.type,
                date: now
            }
        );
        res.end(date.split(' ')[1]);
    });

    // // 传递数据
    // app.post('/todo', urlencodeParser, function (req, res) {
    //     mongoTool.insert([req.body]);
    // });

    // // 删除数据
    // app.delete('/todo/:item', function (req, res) {
    //     mongoTool.remove({ item: req.params.item }, function (result) {
    //         res.json(result);
    //     });
    // });
};

function getDuration (ymd, sb, xb) {
    if (!sb || !xb) return '';

    const d0 = new Date(`${ymd} 09:00`).getTime();
    const d1 = new Date(`${ymd} 12:00`).getTime();
    const d2 = new Date(`${ymd} 13:30`).getTime();
    const d3 = new Date(`${ymd} 18:00`).getTime();
    const d4 = new Date(`${ymd} 19:00`).getTime();

    sb = new Date(sb).getTime();
    xb = new Date(xb).getTime();

    const tm = [];
    if (sb > d0 && sb < d1 && xb > d3 && xb < d4) {
        tm.push((d1 - sb) / 1000 / 60); // 早上时间
        tm.push((d3 - d2) / 1000 / 60); // 下午时间 270分钟 4.5小时
        tm.push((xb - d3) / 1000 / 60); // 晚上时间 18-19点之间时间

        return (tm[0] + tm[1] + tm[2]) / 60;
    }
    if (sb > d0 && sb < d1 && xb > d4) {
        tm.push((d1 - sb) / 1000 / 60); // 早上时间
        tm.push((d3 - d2) / 1000 / 60); // 下午时间 270分钟 4.5小时
        tm.push((xb - d4) / 1000 / 60); // 晚上时间 19点之间时间

        return (tm[0] + tm[1] + tm[2]) / 60;
    }

    return 10;
}
