import conf
import MySQLdb
import datetime
from MySQLdb import cursors
from flask import Flask, jsonify, render_template
from werkzeug.contrib.fixers import ProxyFix

app = Flask(__name__)
app.debug = False
app.wsgi_app = ProxyFix(app.wsgi_app)


@app.route('/')
def frontdoor():
    return render_template('index.html')


@app.route('/api/tickets')
def get_tickets():
    cur = None
    conn = None
    tickets = []

    try:
        conn = MySQLdb.connect(
            host=conf.DB_SERVER,
            user=conf.DB_USER,
            passwd=conf.DB_PASS,
            db=conf.DB_SCHEMA,
            cursorclass=cursors.DictCursor
        )
        cur = conn.cursor()
        cur.execute(conf.DB_QUERY)
        sql = cur.fetchall()

        for row in sql:
            row['OWNER_TEAM'] = 'None'
            if conf.TEAMS:
                for team in conf.TEAMS:
                    if row['OWNER_NAME'] in team['members']:
                        row['OWNER_TEAM'] = team['name']
            tickets.append(row)

        tickets = sorted(
            tickets, key=lambda k: (k['OWNER_TEAM'], k['OWNER_NAME'])
        )

        payload = {
            'status': 'ok',
            'teams': conf.TEAMS,
            'results': tickets,
            'timestamp': datetime.datetime.now()
        }
        return jsonify(payload)
    except Exception as ex:
        return jsonify({
            'status': 'error',
            'exception': ex.message,
            'timestamp': datetime.datetime.now()
        })
    finally:
        if cur is not None:
            cur.close()
        if conn is not None:
            conn.close()


if __name__ == '__main__':
    app.run()
