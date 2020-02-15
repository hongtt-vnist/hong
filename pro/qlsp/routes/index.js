var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var chuyenOb = require('mongodb').ObjectID;

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'qldh';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// them du lieu
router.get('/them', function(req, res, next) {
  res.render('them', { title: 'Thêm sản phẩm' });
});

router.post('/them', function(req, res, next) {
  var dulieu = {
    "tensp" : req.body.tensp ,
    "sl" : req.body.sl ,
    "gia" : req.body.gia
  }
  const insertDocuments = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('donhang');
    // Insert some documents
    collection.insert(dulieu, function(err, result) {
      assert.equal(err, null);
      callback(result);
    });
  }
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    insertDocuments(db, function() {
      client.close();
    });
  });
  res.redirect('/them');
});

// xem du lieu
router.get('/xem', function(req, res, next) {
  const findDocuments = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('donhang');
    // Find some documents
    collection.find({}).toArray(function(err, docs) {
      assert.equal(err, null);
      callback(docs);
    });
  }
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    const db = client.db(dbName);
    findDocuments(db, function(dulieu) {
      res.render('xem',{title: 'Xem thông tin đơn hàng',data : dulieu})
        client.close();
      });
  });
});

// xoa du lieu
router.get('/xoa/:idxoa', function(req, res, next) {
  var idxoa = chuyenOb(req.params.idxoa);
  const remove = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('donhang');
    // Delete document where a is 3
    collection.deleteOne({ _id: idxoa}, function(err, result) {
      assert.equal(err, null);
      console.log("Xóa thành công");
      callback(result);
    });
  }
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    const db = client.db(dbName);
    remove(db, function() {
          client.close();
    });
  });
  res.redirect('/xem');
});

//sua du lieu
router.get('/sua/:idsua', function(req, res, next) {
  var idsua = chuyenOb(req.params.idsua);
  const findDocuments = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('donhang');
    // Find some documents
    collection.find({_id: idsua}).toArray(function(err, docs) {
      assert.equal(err, null);
      callback(docs);
    });
  }
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    const db = client.db(dbName);
    findDocuments(db, function(dulieu) {
      res.render('sua',{title:"Sửa dữ liệu", data: dulieu});
        client.close();
    });
  });
});

// cap nhat du lieu
router.post('/sua/:idsua', function(req, res, next) {
  var idsua = chuyenOb(req.params.idsua);
  var dulieu = {
    "tensp" : req.body.tensp ,
    "sl" : req.body.sl ,
    "gia" : req.body.gia
  }
  const update = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('donhang');
    // Update document where a is 2, set b equal to 1
    collection.updateOne({ _id: idsua }
      , { $set: dulieu }, function(err, result) {
      assert.equal(err, null);
      assert.equal(1, result.result.n);
      console.log("Updated the document with the field a equal to 2");
      callback(result);
    });
  }
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
  
    const db = client.db(dbName);

    update(db, function() {
        client.close();
        res.redirect('/xem');
    });
  });
});

module.exports = router;
