from flask import Flask, request, abort, make_response
from settings import dbpwd
import mysql.connector as mysql
import json
import uuid
import bcrypt

db = mysql.connect(
    host="localhost",
    user="root",
    passwd=dbpwd,
    database="website")

print(db)

app = Flask(__name__)


@app.route('/logout', methods=['GET'])
def logout():
    session_id = request.cookies.get("session_id")
    if not session_id:
        abort(401)
    query = "delete from sessions where session_id = %s"
    values = (session_id, )
    cursor = db.cursor()
    cursor.execute(query, values)
    db.commit()
    cursor.close()
    resp = make_response()
    resp.delete_cookie("session_id")
    return resp


@app.route('/posts', methods=['GET', 'POST'])
def manage_posts():
    if request.method == 'GET':
        return get_all_posts()
    else:
        return add_post()


@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    print(data)
    query = "select username from users where username = %s"
    values = (data['sign_user'], )
    cursor = db.cursor()
    cursor.execute(query, values)
    record = cursor.fetchone()
    cursor.close()
    print(record)

    if record:  # user already exists
        abort(401)

    query = "insert into users (username, password) values(%s, %s)"
    values = (data['sign_user'], data['sign_pass'])
    cursor = db.cursor()
    cursor.execute(query, values)
    db.commit()
    cursor.close()
    resp = make_response()
    return resp


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    print(data)
    query = "select id, username, password from users where username=%s"
    values = (data['user'], )
    cursor = db.cursor()
    cursor.execute(query, values)
    record = cursor.fetchone()
    cursor.close()

    if not record:
        abort(401)

    user_id = record[0]
    pwd = record[2]
    # creating a hash pwd from record
    hashed = bcrypt.hashpw(pwd.encode('utf-8'), bcrypt.gensalt())

    if bcrypt.hashpw(data['pass'].encode('utf-8'), hashed) != hashed:
        abort(401)

    query = "insert into sessions (user_id, session_id) values (%s, %s)"
    session_id = str(uuid.uuid4())
    values = (user_id, session_id)
    cursor = db.cursor()
    cursor.execute(query, values)
    db.commit()
    cursor.close()
    resp = make_response()  # http response from server
    resp.set_cookie("session_id", session_id)
    return resp


def get_all_posts():
    query = "select id, title, body from posts"
    cursor = db.cursor()
    cursor.execute(query)
    records = cursor.fetchall()
    cursor.close()
    print(records)
    header = ['id', 'title', 'body']
    data = []
    for r in records:
        data.append(dict(zip(header, r)))
    return json.dumps(data)


def get_post(id):
    query = "select id, title, body from posts where id = %s"
    values = (id,)
    cursor = db.cursor()
    cursor.execute(query, values)
    record = cursor.fetchone()
    cursor.close()
    header = ['id', 'title', 'body']
    return json.dumps(dict(zip(header, record)))


def check_login():
    session_id = request.cookies.get("session_id")
    if not session_id:
        abort(401)
    query = "select user_id from sessions where session_id = %s"
    values = (session_id, )
    cursor = db.cursor()
    cursor.execute(query, values)
    record = cursor.fetchone()
    cursor.close()
    if not record:
        abort(401)

# adds a new post to db and returns it with get_post()


def add_post():
    check_login()
    data = request.get_json()
    print(data)
    query = "insert into posts (title, body) values (%s, %s)"
    values = (data['title'], data['body'])
    cursor = db.cursor()
    cursor.execute(query, values)
    db.commit()
    new_post_id = cursor.lastrowid
    cursor.close()
    return get_post(new_post_id)


if __name__ == "__main__":
    app.run()
