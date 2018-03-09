'use strict';

const MongoClient = require('mongodb').MongoClient;

function MongoTool (url, collname) {
    this.url = url;
    this.collname = collname;
    const _self = this;
    if (_self.url) {
        if (collname) {
            _self.createCollection(_self.collname);
        } else {
            _self.connect();
        }
    }
}

MongoTool.prototype.connect = function (callback) {
    MongoClient.connect(this.url, function (err, db) {
        if (err) {
            console.error(err);
            throw err;
        }
        // console.log('数据库已创建');
        if (callback) {
            callback(db);
        } else {
            db.close();
        }
    });
};

MongoTool.prototype.createCollection = function (collname) {
    this.collname = collname;
    const _self = this;
    _self.connect(function (db) {
        db.createCollection(_self.collname, function (err, res) {
            if (err) {
                console.error(err);
                throw err;
            }
            // console.log('集合已创建');
            db.close();
        });
    });
};

MongoTool.prototype.insert = function (data, callback) {
    const _self = this;
    _self.connect(function (db) {
        const collection = db.collection(_self.collname);

        collection.insert(data, function (err, result) {
            if (err) {
                console.error(err);
                throw err;
            }
            // console.log('数据已插入');
            if (callback) { callback(result.result); }
            db.close();
        });
    });
};

MongoTool.prototype.remove = function (removeData, callback) {
    const _self = this;
    _self.connect(function (db) {
        const collection = db.collection(_self.collname);
        collection.remove(removeData, function (err, result) {
            if (err) {
                console.error(err);
                throw err;
            }
            // console.log('数据已删除');
            if (callback) { callback(result.result); }
            db.close();
        });
    });
};

MongoTool.prototype.update = function (findData, updateData, callback) {
    const _self = this;
    _self.connect(function (db) {
        const collection = db.collection(_self.collname);
        collection.update(findData, updateData, function (err, result) {
            if (err) {
                console.error(err);
                throw err;
            }
            // console.log('数据修改成功');
            if (callback) { callback(result.result); }
            db.close();
        });
    });
};

MongoTool.prototype.find = function (findData, callback) {
    const _self = this;
    _self.connect(function (db) {
        const collection = db.collection(_self.collname);
        collection.find(findData).toArray(function (err, result) {
            if (err) {
                console.error(err);
                throw err;
            }
            // console.log('查询数据成功');
            if (callback) { callback(result); }
            db.close();
        });
    });
};

MongoTool.prototype.findAsync = async function (findData, mySort) {
    const _self = this;
    return new Promise(function (resolve, reject) {
        _self.connect(function (db) {
            const collection = db.collection(_self.collname);
            // .sort(mySort)
            collection.find(findData).toArray(function (err, result) {
                if (err) {
                    reject(err);
                }
                resolve(result);
                db.close();
            });
        });
    });
};

MongoTool.prototype.drop = async function () {
    const _self = this;
    return new Promise(function (resolve, reject) {
        _self.connect(function (db) {
            const collection = db.collection(_self.collname);
            collection.drop(function (err, result) {
                if (err) {
                    reject(err);
                }
                resolve(result);
                db.close();
            });
        });
    });
};

// module.exports = {
//     mongo(url, collname) {
//         return new MongoTool(url, collname);
//     }
// }

module.exports = function (url, collname) {
    return new MongoTool(url, collname);
};
