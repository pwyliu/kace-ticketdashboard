# kace-ticketdashboard
A simple dashboard for the KACE K1000 service desk. Shows open/stalled tickets.

Flask, jquery and pure.css. Sorry about the blurring in the screenshot, it's real tickets.

[![screenshot](https://github.com/pwyliu/kace-ticketdashboard/master/support/screenshot.png)]

## Installing
The dashboard is just a simple Flask application. Clone the project, install
the prerequisites, configure conf.py with your KACE connection parameters and
you're ready to go.

You should use a virtualenv.

```bash
#MySQl-python needs some headers to compile. On Debian/Ubuntu:
sudo apt-get install python-dev libmysqlclient-dev

#Then clone the project and install the python prereqs
git clone https://github.com/pwyliu/kace-ticketdashboard.git
cd kace-ticketdashboard
pip install -r requirements.txt
#Now edit conf.py to set your Kace DB settings and set up teams if you want to use them
vim conf.py

#Then start up app to see if it runs. For real deployment, see next section.
python kace-ticketdash.py
```

## Deploying on Nginx
You can use the built in webserver for dev, but Kace-ticketdashboard was written
to run on a gunicorn + nginx stack. It's really easy, [see here](http://flask.pocoo.org/docs/deploying/wsgi-standalone/) for more details.

There are some example upstart, nginx and a gunicorn starting script in the
[support](https://github.com/pwyliu/kace-ticketdashboard/tree/master/support) folder.

Gunicorn is included in requirements.txt.
