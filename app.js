var express = require('express');

// 自定义模块todoController
var todoController = require('./controller/todoController');
var todoLocalController = require('./controller/todoLocalController');

var app = express();

app.set('view engine','ejs');

app.use(express.static('./public'));


//网络mongoodb
// todoController(app);


//本地mongoodb
todoLocalController(app);


app.listen(3000);