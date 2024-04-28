from flask import render_template, flash, redirect, url_for, request
from app import app, db
from app.forms import LoginForm, RegistrationForm
from flask_login import current_user, login_user, logout_user, login_required
import sqlalchemy as sa
from app.models import User
from urllib.parse import urlsplit


@app.route('/')
@app.route('/index')
@login_required
def index():
    return render_template('main1.html', title='Home')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    
    if request.method == 'POST':
        username = request.form['Username']
        password = request.form['Password']
        user = db.session.scalar(sa.select(User).where(User.username == username))
        if user is None or not user.check_password(password):
            flash('Invalid username or password')
            return redirect(url_for('login'))
        
        login_user(user, remember=False)
        next_page = request.args.get('next', url_for('index'))       
        if not next_page or urlsplit(next_page).netloc!= '':
            next_page = url_for('index')
        return redirect(next_page)
    return render_template('login.html', title='Login')


@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))


@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    
    if request.method == 'POST':
        username = request.form.get('Username')
        email = request.form.get('Email')
        password = request.form.get('Password')
        repeat_password = request.form.get('RepeatPassword')

        if not username or not password or not repeat_password or not email:
            flash('All fields are required')
            return redirect(url_for('register'))
        
        if password!= repeat_password:
            flash('Passwords do not match')
            return redirect(url_for('register'))
        
        if db.session.scalar(sa.select(User).where(User.username == username)):
            flash('Username already exists')
            return redirect(url_for('register'))
        
        if db.session.scalar(sa.select(User).where(User.email == email)):
            flash('Email already exists')
            return redirect(url_for('register'))
        
        new_user = User(username=username, email=email)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()

        flash('Congratulations, you are now a registered user!')
        return redirect(url_for('login'))
    
    return render_template('registration.html', title='Register')