var nodemailer = require('nodemailer'); 
var http = require('http');
var axios = require('axios');
var setup = require('./setup');

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

console.log("Running Site Down Detector with the following settings...")
console.log(setup);

for(let sItem of setup.watchers){
    for(let url of sItem.urls){
        axios
            .get(url, {
                timeout: sItem.timeout
            })
            .then(() => {

            })
            .catch((err) => {
                console.log(err.code)
                console.log(err.message)

                if(err.code == 'ECONNABORTED'){
                    console.log('TIMEOUT EXCEEDED FOR SITE ' + url + ', sending warning email')

                    console.log(sItem.sender)

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
            })
        
    }
    
}
