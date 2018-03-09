
const express = require('express');
const http = require('http');
const app = express();
const todoLocalController = require('./controller/todoLocalController');
const signController = require('./controller/signController');
// const todoController = require('./controller/todoController');
const config = require('config');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const Tool = require('tool_by_zou12e');
const port = process.env.PORT || config.get('port');

const server = http.createServer(app);
app.set('port', port);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * 捕获启动错误
 */
function onError (error) {
    console.log('------error------');
    console.log(error);
    process.exit(1);
}

/**
 * 捕获启动服务
 */
function onListening () {
    console.log('------listening------');
    console.log(server.address());
}

/**
 * 监听结束
 */
process.on('exit', code => {
    console.log(`即将退出，退出码：${code}`);
});

/**
 * 监听异常
 */
process.on('uncaughtException', function () {
    console.log('捕获到一个异常');
});

/**
 * 监听SIGINT信号
 */
process.on('SIGINT', function () {
    console.log('收到 SIGINT 信号。');
    process.exit(0);
});

app.set('view engine', 'ejs');

app.use(express.static('./public'));

// 提供req.cookies
app.use(cookieParser());
// 劫持body内容 提供req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 存日志
const FileStreamRotator = require('file-stream-rotator');
const fs = require('fs');
const logDirectory = path.join(__dirname, 'log');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
const accessLogStream = FileStreamRotator.getStream({
    date_format: 'YYYYMMDD',
    filename: path.join(logDirectory, 'local-%DATE%.log'),
    frequency: 'daily',
    verbose: false
});
// 存日志
app.use(morgan('short', {stream: accessLogStream}));

// 带write方法的对象
// var dbStream = {
//    write: function (line) {
//        //line存数据库
//    }
// };
// //存数据库
// app.use(morgan('dev', { stream: dbStream }));

app.all('*', (req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache');
    console.log(`ip: ${req._ip} | url: ${req.url} | payload: ${JSON.stringify(req.body)} | querystring: ${JSON.stringify(req.query)}`);
    next();
});

// 网络mongoodb
// todoController(app);

// 本地mongoodb
todoLocalController(app);

// 打卡项目
signController(app);

app.get('/check', (req, res) => {
    res.send('' + Tool.checkPhone(Tool.getParms('phone', req.url)));
});

app.get('/cookie', (req, res) => {
    res.cookie('cookie', 'cookie');
    console.log(req.headers.cookie);
    console.log(req.cookies.cookie);// cookie-parser 提供的方法
    res.send('cookie');
});

/*
 * 捕获404
 */
app.use((req, res, next) => {
    const err = new Error();
    err.status = 404;
    err.message = 'Not Found';
    next(err);
    // return res.send('Not Found');
});

/*
 * 捕获内部错误
 * next(err)执行
 * export NODE_ENV=development && node bin/www
 * process.env.NODE_ENV
 * app.get("env") 获取环境变量NODE_ENV
 *
 */
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ code: err.status || 500, message: err.message || '内部错误' });
});
