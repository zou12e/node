/** 异步回调写法 **/



const url = 'mongodb://localhost:27017/mydb';

const mongo = require('../lib/mongo');

const mongoTool = mongo(url, 'mycoll');

// mongoTool.insert([{ x: 1 }], function(result) {
//     console.log(result);
// });

// mongoTool.find({}, function(result) {
//     console.log(result);
// });

// mongoTool.update({ x: 1 }, { x: 2 }, function(result) {
//     console.log(result);
// });

// mongoTool.remove({item: 'MyFirstData!'}, function(result) {
//     console.log(result);
// });



var bodyParser = require('body-parser');
// 对数据进行解析
var urlencodeParser = bodyParser.urlencoded({ extended: false });

module.exports = function(app) {
    // 获取数据
    app.get('/todo', function(req, res) {
        mongoTool.find({}, function(result) {
            res.render('todo', { todos: result });
        });
    });

    // 传递数据
    app.post('/todo', urlencodeParser, function(req, res) {
        mongoTool.insert([req.body]);
    });

    // 删除数据
    app.delete('/todo/:item', function(req, res) {
        mongoTool.remove({ item: req.params.item }, function(result) {
            res.json(result);
        });
    });
}