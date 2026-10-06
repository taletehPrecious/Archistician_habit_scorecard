#Create API endpoints

import sqlite3
import os
from flask import Flask, jsonify, request, g, session
from flask_cors import CORS  # Import the CORS library
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

# secret key for signing session cookie
app.secret_key = os.environ.get('FLASK_SECRET_KEY', 'My secret key')

# To allow cross-origin requests and allow cookies to be transferred
# between front and backend with are running on different ports
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax' 
app.config['SESSION_COOKIE_SECURE'] = False   # Must be False for local HTTP
app.config['SESSION_COOKIE_DOMAIN'] = 'localhost' # Explicitly set the domain
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

DB_FILE = 'archistician.db'

#------------------------------------------------------------------------
# Helper function to get a database connection for each request
def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DB_FILE)
        db.row_factory = sqlite3.Row # This makes fetching results as dictionaries easier
    return db

#------------------------------------------------------------------------
# Close the database connection automatically when the request ends
@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

# ------------------------------------------------------------------------------
# API Endpoint: GET all habits
@app.route('/habits', methods=['GET'])
def get_user_habits():
    if 'user_id' not in session:
        return jsonify({"error": "Not logged in"}), 401

    user_id = session['user_id']

    cur = get_db().cursor()
    cur.execute("SELECT * FROM habits WHERE user_id = ? ORDER by id DESC", (user_id,))
    habits = cur.fetchall()

    return jsonify([dict(row) for row in habits])

#------------------------------------------------------------------------------
# API Endpoint: GET all ideas
@app.route('/ideas', methods=['GET'])
def get_user_ideas():
    if 'user_id' not in session:
        return jsonify({"error": "Not logged in"}), 401

    user_id = session['user_id']

    cur = get_db().cursor()
    cur.execute("SELECT * FROM ideas WHERE user_id = ? ORDER BY idea_added DESC", (user_id,))
    ideas = cur.fetchall()

    return jsonify([dict(row) for row in ideas])

# ---------------------------------------------------------------------------------
# API Endpoint: GET all user's scores for past num days
@app.route('/scores/<int:num>', methods=['GET'])
def get_n_user_scores(num):
    if 'user_id' not in session:
        return jsonify({"error": "Not logged in"}), 401

    user_id = session['user_id']

    cur = get_db().cursor()
    cur.execute("SELECT score_added, score FROM scores WHERE user_id = ? ORDER BY score_added ASC LIMIT ?", (user_id, num))
    scores = cur.fetchall()

    return jsonify([dict(row) for row in scores])

#--------------------------------------------------------------------------------
# API Endpoint: POST a new habit
@app.route('/habits', methods=['POST'])
def add_habit():
    if 'user_id' not in session:
        return jsonify({"error": "Not logged in"}), 401

    new_habit = request.get_json() or {}
    title = new_habit.get('title')
    description = new_habit.get('description') or None
    value = new_habit.get('value')
    user_id = session['user_id']

    if not title or not value:
        return jsonify({"error": "Missing title or value"}), 400

    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""INSERT INTO habits (user_id, habit_name, habit_description, habit_value)
            VALUES (?, ?,?,?)
        """, (user_id, title, description, value))
        conn.commit()
    except sqlite3.IntegrityError: # Ensure no duplicate habit names
        return jsonify({"error": "You already added a habit with that name"}), 409

    return jsonify({"message": "Habit added successfully", "id": cursor.lastrowid}), 201

#-------------------------------------------------------------------------------
# API Endpoint: POST a new idea
@app.route('/ideas', methods=['POST'])
def add_idea():
    if 'user_id' not in session: #Check that user is authenticated
        return jsonify({"error": "Not logged in"}), 401

    new_idea = request.get_json() or {}
    title = new_idea.get('title')
    description = new_idea.get('description') or None
    user_id = session['user_id']

    if not title:
        return jsonify({"error": "Missing title"}), 400

    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO ideas (user_id, idea_name, idea_description)
            VALUES (?, ?,?)
        """, (user_id, title, description))
        conn.commit()
    except sqlite3.IntegrityError: # Ensure no duplicate idea names
        return jsonify({"error": "You already added an idea with that name"}), 409

    return jsonify({"message": "Idea added successfully", "id": cursor.lastrowid}), 201

#------------------------------------------------------------------------------
# API Endpoint: POST a new score
@app.route('/scores', methods=['POST'])
def add_score():
    if 'user_id' not in session:
        return jsonify({"error": "Not logged in"}), 401

    new_score = request.get_json() or {}
    score = new_score.get('score')

    # Usine score is None instead of not score because  score = 0 must be allowed
    if score is None:
        return jsonify({"error": "Missing score"}), 400

    user_id = session['user_id']

    conn = get_db()
    cur = conn.cursor()

    # Either insert or update score for today, ensuring only one score per day
    cur.execute("""
        INSERT INTO scores (user_id, score)
        VALUES (?, ?)
        ON CONFLICT(user_id, score_added)
        DO UPDATE SET score = excluded.score
    """, (user_id, score))

    conn.commit()

    # Re-selects row to return correct id as lastrowid is unreliable on conflict
    cur.execute("""
        SELECT id, score, score_added
        FROM scores
        WHERE user_id = ? AND score_added = DATE('now')
    """, (user_id,))
    row = cur.fetchone()

    return jsonify({
        "message": "Score saved successfully",
        "score": {
            "id": row["id"],
            "score": row["score"],
            "date": row["score_added"]
        }
    }), 201

#------------------------------------------------------------------------------
#Delete A Habit
@app.route('/habits/<int:habit_id>', methods=['DELETE'])
def delete_habit(habit_id):

    #check that the user is authenticated
    if 'user_id' not in session:
        return jsonify({"error": "Not logged in"}), 401

    user_id = session['user_id']

    conn = get_db()
    cur = conn.cursor()

    # Delete only if the habit belongs to the logged-in user
    cur.execute("""
        DELETE FROM habits
        WHERE id = ? AND user_id = ?
    """, (habit_id, user_id))

    conn.commit()

    # rowcount checks how many rows were affected by the query
    if cur.rowcount == 0: #, then the habit was not deleted, so it was not found
        return jsonify({"error": "Habit not found or unauthorized"}), 404

    return jsonify({"message": "Habit deleted successfully"})

#----------------------------------------------------------------------
#Delete an Idea
@app.route('/ideas/<int:idea_id>', methods=['DELETE'])
def delete_idea(idea_id): #Receives the id of the idea to be deleted from the url

    #Ensure that user is authenticated
    if 'user_id' not in session:
        return jsonify({"error": "Not logged in"}), 401

    user_id = session['user_id']

    conn = get_db()
    cur = conn.cursor()

    # Delete only if the idea belongs to the logged-in user
    cur.execute("""
        DELETE FROM ideas
        WHERE id = ? AND user_id = ?
    """, (idea_id, user_id))

    conn.commit()

    # rowcount checks how many rows were affected by the query
    if cur.rowcount == 0: #, then the idea was not deleted, so it was not found
        return jsonify({"error": "Idea not found or unauthorized"}), 404

    return jsonify({"message": "Idea deleted successfully"})

#-----------------------------------------------------------------------
# API Endpoint: GET a single habit by ID
@app.route('/habits/<int:habit_id>', methods=['GET'])
def get_habit(habit_id):

    #Check that user is authenticated
    if 'user_id' not in session:
        return jsonify({"error": "Not logged in"}), 401

    user_id = session['user_id']

    cur = get_db().cursor()

    #Select habit only if it is the user's habit
    cur.execute("SELECT * FROM habits WHERE id = ? and user_id = ?", (habit_id, user_id))
    habit = cur.fetchone()
    
    if habit:
        return jsonify(dict(habit))
    else:
        return jsonify({"error": "Habit not found"}), 404
    
#-----------------------------------------------------------------------
# API Endpoint: GET a single habit by ID
@app.route('/ideas/<int:idea_id>', methods=['GET'])
def get_idea(idea_id):

    #Check that user is authenticated
    if 'user_id' not in session:
        return jsonify({"error": "Not logged in"}), 401

    user_id = session['user_id']

    cur = get_db().cursor()

    #Select idea only if it is the user's idea
    cur.execute("SELECT * FROM ideas WHERE id = ? and user_id = ?", (idea_id, user_id))
    idea = cur.fetchone()
    
    if idea:
        return jsonify(dict(idea))
    else:
        return jsonify({"error": "Idea not found"}), 404
    
#-----------------------------------------------------------------------
#Change color of an idea note
@app.route('/ideas/<int:idea_id>/color', methods=['PUT'])
def update_idea_color(idea_id):

    #Check that user is authenticated
    if 'user_id' not in session:
        return jsonify({"error": "Not logged in"}), 401

    data = request.get_json()
    new_color = data.get('color')

    conn = get_db()
    cur = conn.cursor()

    #Update the color only if the idea belong to the user
    cur.execute("""
        UPDATE ideas
        SET color = ?
        WHERE id = ? AND user_id = ?
    """, (new_color, idea_id, session['user_id']))

    conn.commit()

    return jsonify({"success": True, "color": new_color})

    
#-----------------------------------------------------------------------
# API Endpoint: GET a single user by ID, not getting the password_hash
@app.route('/users/<int:user_id>', methods=['GET'])
def get_user_by_id(user_id):
    cur = get_db().cursor()
    cur.execute("SELECT id, username FROM users WHERE id = ?", (user_id,))
    user = cur.fetchone()
    
    if user:
        return jsonify(dict(user))
    else:
        return jsonify({"error": "User not found"}), 404

#-----------------------------------------------------------------------
# API Endpoint: POST a new user (sign up)
@app.route('/users', methods=['POST'])
def add_user():
    data = request.get_json() or {}
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Missing username or password"}), 400

    pw_hash = generate_password_hash(password)

    conn = get_db()
    cur = conn.cursor()

    try:
        cur.execute(
            "INSERT INTO users (username, password_hash) VALUES (?, ?)",
            (username, pw_hash)
        )
        conn.commit()
    except sqlite3.IntegrityError: #There is a unique constraint on username
        return jsonify({"error": "Username already exists"}), 409

    return jsonify({
        "message": "User created successfully",
        "user": {"id": cur.lastrowid, "username": username}
    }), 201

#Log a user in
#---------------------------------------------------------------------------
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    username = data.get('username')
    if not username or not data.get('password'):
        return jsonify({'error': 'username and password required'}), 400

    cur = get_db().cursor()
    cur.execute("SELECT * FROM users WHERE username = ?", (username,))
    row = cur.fetchone()
    if not row:
        return jsonify({'error': 'invalid credentials'}), 401

    if not check_password_hash(row['password_hash'], data.get('password')):
        return jsonify({'error': 'Wrong password'}), 401

    # set session cookie
    session['user_id'] = row['id']
    session['username'] = row['username']
    return jsonify({'message': 'login successful', 'user': {'id': row['id'], 'username': row['username']}})


#--------------------------------------------------------------------------
#Log user out
@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'logged out'})

#-------------------------------------------------------------------------
#Check if user is loggen in/ get user's information
@app.route('/session', methods=['GET'])
def session_status():
    user_id = session.get('user_id')
    if user_id:
        username = session.get('username')
        return jsonify({'authenticated': True, 'user': {'id': user_id, 'username': username}})
    return jsonify({'authenticated': False})