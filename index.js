var nodemailer = require('nodemailer');
var axios = require('axios');

//Setup
var setup = require('./setup');
var printSetup = false;

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

function fixSingleDigit(data){
    if(data == 0){
        return '00';
    } else if(data.length < 2){
        return data = '0' + data;
    } else {
        return data;
    }
}

function printCurrentTimeLogFormat(){
    let d = new Date();
    var minutes = d.getMinutes();
    if(minutes.length < 2){
        minutes = '0' + minutes;
    }
    return monthNames[d.getMonth()].substring(0, 3) + ' ' + fixSingleDigit(d.getDate()) + ' ' + fixSingleDigit(d.getHours()) + ':' + fixSingleDigit(d.getMinutes()) + ':' + fixSingleDigit(d.getSeconds());
}

console.log(' ')
console.log(' ------------------------------ ')
if(printSetup){
    console.log(printCurrentTimeLogFormat() + " Running Site Down Detector with the following settings...")
    console.log(setup);
} else {
    console.log(printCurrentTimeLogFormat() + " Running Site Down Detector...")
}

for(let sItem of setup.watchers){
    for(let url of sItem.urls){
        axios
            .get(url, {
                timeout: sItem.timeout
            })
            .then(() => {
                console.log(`Site "${url}" appears to be online`);
            })
            .catch((err) => {
                console.log(`Site "${url}" appears to be OFFLINE`);
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
