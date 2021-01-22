var nodemailer = require('nodemailer');
var axios = require('axios');
var setup = require('./setup');

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

//It may be required to put the following line at the very top: /usr/bin/env node (add #! before /usr/...)

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
console.log()
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

                if(err.code == 'ECONNABORTED'){
                    console.log('TIMEOUT EXCEEDED FOR SITE ' + url + ', sending warning email');
                    for(let reciever of sItem.recievers){
                        sendWarningMail(
                            {
                                email: sItem.sender.email,
                                password: sItem.sender.password,
                                service: sItem.sender.service
                            },
                            reciever,
                            url + ' appears to be down!',
                            url + ' may be down. You should check if you can access the site yourself!'
                        )
                    }
                }
            });
        
    }
    
}
