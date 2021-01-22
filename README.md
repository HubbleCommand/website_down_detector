# Think Story Down Detector
Checks if a site is down, and sends an email if it seems to be.

## Using
Add your email credentials to the setup.js file, as in the example file setup-example.js

To check that it works, execute `npm start` in the directory of this readme.

You will either get an email that the site is down, or a log saying that it is up!

## Running at intervals
While there are many node packages to run scheduled tasks, it is easy to use [cron](https://www.raspberrypi.org/documentation/linux/usage/cron.md).

So if you want to run something every day at midnight, you would add:

0 0 * * * /usr/bin/node /home/username/think_story_down_detector/index.js >> /path/to/log/file.log
