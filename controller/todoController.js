
// 引入mongoose模块
const mongoose = require('mongoose');

// 链接数据库
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://zou:123456@ds046357.mlab.com:46357/data');

// 创建图表
const todoSchema = new mongoose.Schema({
    item: String
});

// 往数据库中存储数据
const Todo = mongoose.model('Todo', todoSchema);

const bodyParser = require('body-parser');
// 对数据进行解析
const urlencodeParser = bodyParser.urlencoded({extended: false});

module.exports = function (app) {
    // 获取数据
    app.get('/todo', function (req, res) {
        Todo.find({}, function (err, data) {
            if (err) throw err;

            res.render('todo', {todos: data});
        });
        // res.render('todo',{todos:data});
    });

    // 传递数据
    app.post('/todo', urlencodeParser, function (req, res) {
        Todo(req.body).save(function (err, data) {
            if (err) throw err;
            res.json(data);
        });
        // data.push(req.body);
    });

    // 删除数据
    app.delete('/todo/:item', function (req, res) {
        Todo.find({item: req.params.item}).remove(function (err, data) {
            if (err) throw err;
            res.json(data);
        });
    });
};
