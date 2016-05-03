var express = require("express");
var session = require("express-session");
var userLib = require("./user.js");
var app = express();
var bodyParser = require("body-parser");
var errorHandler = require("errorhandler");
var methodOverride = require("method-override");
var hostname = process.env.HOSTNAME || "localhost";
var port = 8080;
var db = require("./node_modules/mongoskin").db("mongodb://user:user@127.0.0.1:27017/MassMural");

app.use(session({secret: "This is a secret"}));

app.get("/", function(req, res) {
    res.redirect("/index.html");
});

app.get("/createUser", function(req, res) {
    userLib.add(req, res, db);
});

app.get("/editUser", function(req, res) {
    userLib.edit(req, res, db);
});

app.get("/changePassword", function(req, res) {
    userLib.changePassword(req, res, db);
});

app.get("/login", function(req, res) {
    userLib.login(req, res, db);
});

app.get("/getUser", function(req, res) {
    userLib.get(req, res, db);
});

app.get("/getPictures", function(req, res) {
    var info = req.query;
        
    db.collection("pics").find({user: info.user}).toArray(function(err, result) {
        if (err) {
            res.send("[]")
        }
        else {
            res.send(JSON.stringify(result));
        }
    });
});

app.get("/savePicture", function(req, res){
    var info = req.query;
    console.log(info);
    // db.collection("pics").findOne({id: info.id}, function(err, result) {
    //     if (result) {
    //         var temp = Object.keys(info);
    //         var key;

    //         for (var t = 0; t < temp.length; t++) {
    //             key = temp[t];
    //             result[key] = info[key];
    //         }
                                  
    //         db.collection("pics").save(result, function(err2) {
    //             if (err2) {
    //                 res.send("0");
    //             }
    //             else {
    //                 res.send("1");
    //             }   
    //         });
    //     }
    //     else {
            db.collection("pics").insert(info, function(err3, r3) {
                if (err3) {
                    res.send("0");
                }
                else {
                    res.send("1");
                }   
            });
        //}
     });
// });

function readURL(url, cb) {
    var data = "";
    var protocol = url.split("://")[0];
    var request = require(protocol).get(url, function(res) {
        res.on("data", function(chunk) {
            data += chunk;
        });

        res.on("end", function() {
            cb(data);
        })
    });

    request.on("error", function(e) {
        console.log("Got error: " + e.message);
    });
}

app.use(methodOverride());
app.use(bodyParser());
app.use(express.static(__dirname + "/public"));
app.use(errorHandler());

console.log("Simple static server listening at http://" + hostname + ":" + port);
app.listen(port);
