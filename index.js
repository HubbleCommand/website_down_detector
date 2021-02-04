var nodemailer = require('nodemailer');
var axios = require('axios');
var setup = require('./setup');

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function sendWarningMail(sender, reciever, subject, message){
    var transporter = nodemailer.createTransport({
        service: sender.service,
        auth: {
            user: sender.email,
            pass: sender.password
        }
    });
    
    var mailOptions = {
        from: sender.email,
        to: reciever,
        subject: subject,
        text: message
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    }); 
}

function printCurrentTimeLogFormat(){
    let d = new Date();
    return monthNames[d.getMonth()].substring(0, 3) + ' ' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
}

console.log(' ')
console.log(' ------------------------------ ')
console.log(printCurrentTimeLogFormat() + " Running Site Down Detector with the following settings...")
console.log(setup);

for(let sItem of setup.watchers){
    for(let url of sItem.urls){
        axios
            .get(url, {
                timeout: sItem.timeout
            })
            .then(() => {
                console.log('Site appears to be online');
            })
            .catch((err) => {
                console.log(err.code + ':' + err.message);

                sendWarningMail(
                    {
                        email: sItem.sender.email,
                        password: sItem.sender.password,
                        service: sItem.sender.service
                    },
                    sItem.recievers.join(', '),
                    url + ' may be down, code: ' + err.code,
                    url + ' may be down. \nThe following error was encountered: ' + err.code + '. \n' + sItem.message + '. \nYou should check if you can access the site yourself!'
                )
            });
    }
}
