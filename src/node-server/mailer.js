var nodemailer = require("nodemailer");
var wellknown = require('nodemailer-wellknown');
var fs = require('fs')
var config = wellknown('Zoho');
var app_config = require('./config.js')
config.auth = app_config.auth;
var smtpTransport = nodemailer.createTransport(config);

module.exports = {
        config : config,
        sendMail : function( options, callback){
                smtpTransport.sendMail(options, callback);
        },
        sendMailByTemplate : function(data, template, callback){

                fs.readFile(template, 'utf8', function(err, file){

                        var res = file
                        for(var k in data)
                        {
                                var regex = new RegExp( "{{" + k + "}}", 'i')
                                res = res.replace(regex, data[k]);
                        }
                        var options = {
                                from: app_config.from,
                                to: data.to,
                                subject :data.subject,

                                html :res
                        }
                        console.log('options===')
                        console.log(options)
                        smtpTransport.sendMail(options, callback);
                })




        }

}
