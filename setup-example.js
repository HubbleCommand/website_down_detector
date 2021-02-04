exports.watchers = [
    //First watcher
    {
        "sender" : {
            "service"   : "gmail",
            "email"     : "youremail@service.com",
            "password"  : "yourpassword",
        },
        "recievers" : [
            "myfriend@yahoo.com"
        ],
        "timeout"   : 300000,
        "urls"      : [
            "https://www.google.com/",
            "https://en.wikipedia.org/"
        ],
        "message": "An additional message you want to be sent in the content of the email."
    },
    //A different watcher
    {
        "sender" : {
            "service"   : "gmail",
            "email"     : "youremail@service.com",
            "password"  : "yourpassword",
        },
        "recievers" : [
            "myfriend@yahoo.com"
        ],
        "timeout"   : 300000,
        "urls"      : [
            "https://www.google.com/",
            "https://en.wikipedia.org/"
        ],
        "message": "An additional message you want to be sent in the content of the email."
    },
]