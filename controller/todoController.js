
// 引入mongoose模块
var mongoose = require('mongoose');

// 链接数据库
mongoose.Promise = global.Promise;    

mongoose.connect('mongodb://zou:123456@ds046357.mlab.com:46357/data')

// 创建图表
var todoSchema = new mongoose.Schema({
    item:String
});

// 往数据库中存储数据
var Todo = mongoose.model('Todo',todoSchema);

// Todo({item:'Hello Everyone!'}).save(function (err,data) {
//     if (err) throw err;
//     console.log('Item saved');
// })


var bodyParser = require('body-parser');
// 对数据进行解析
var urlencodeParser = bodyParser.urlencoded({extended:false});

// var data = [
//     {item:"欢迎大家来到蓝鸥课堂!"},
//     {item:"希望大家能够喜欢我们的课程!"},
//     {item:"在课程中能够学到真实知识!"}
// ];

module.exports = function (app) {
    // 获取数据
    app.get('/todo',function (req,res) {
        Todo.find({},function (err,data) {

            console.log(err);
            if (err) throw err;

            res.render('todo',{todos:data});
        })

        // res.render('todo',{todos:data});
    });

    // 传递数据
    app.post('/todo',urlencodeParser,function (req,res) {
        Todo(req.body).save(function (err,data) {
            if (err) throw err;
            res.json(data);
        })

        // data.push(req.body);

    });

    // 删除数据
    app.delete('/todo/:item',function (req,res) {
        console.log(req.params.item);
        Todo.find({item:req.params.item}).remove(function (err,data) {
            if (err) throw err;
            res.json(data);
        })
        // data = data.filter(function (todo) {
        //     return req.params.item !== todo.item;
        // });
        
        // res.json(data);
    });
}