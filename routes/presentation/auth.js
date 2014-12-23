var express = require('express');
var router = express.Router();
var user = require('../mongodb/user');

var async = require('async');

var jwt = require('jwt-simple');
var jwt_secret = "hello_world";
var moment = require('moment');

var google = require('googleapis');
var CLIENT_ID = "1027187169589-etnigni4qe7fgm5m09bjnag975lvq681.apps.googleusercontent.com";
var CLIENT_SECRET = "3y_yBWSUjCbSYttpMw-yejSb";
var REDIRECT_URL = 'postmessage';

router.post('/google/callback',function(req,res){
    if (req.body.code) {
        var code = req.body.code;
        console.log(code);
        async.waterfall([
            function(cb){
                var OAuth2Client = google.auth.OAuth2;
                var plus = google.plus('v1');
                var oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
                oauth2Client.getToken(code, function(err, tokens) {
                    if (err) {
                        console.log("Error getting Token", err);
                        cb(err);
                    }
                    else{
                        // set tokens to the client
                        // TODO: tokens should be set by OAuth2 client.
                        oauth2Client.setCredentials(tokens);
                        plus.people.get({ userId: 'me', auth: oauth2Client }, function(err, profile) {
                            if (err) {
                                console.log('Error getting Profile', err);
                                cb(err);
                            }
                            else{
                                cb(null,profile);
                            }
                        });
                    }
                });
            },
            function (profile,cb) {
                var email =  profile.emails[0].value ;
                user.findUserByEmail(email,function(err,usr){
                    if (err) {
                        cb(err);
                    }
                    if (usr) {
                        cb(null,usr);
                    }
                    else{
                        var name = profile.displayName;
                        user.addUser(name,email,undefined,function(err,usr){
                            if (err) {
                                cb(err);
                            }
                            else{
                                cb(null,usr);
                            }
                        });
                    }
                });
            },
            function(user,cb){
                var expires = moment().add(7,'days').valueOf();
                var token = jwt.encode({
                    iss: user._id,
                    exp: expires
                },jwt_secret);
                cb(null,user,token,expires);
            }],
        function(err,user,token,expires){
            if (err) {
                res.status(500).send({ message : err.message });
            }
            else{
                res.send({ user : user , token : token , expires : expires });
            }
        });
    }
    else{
        res.send(400);
    }
});

module.exports = router;