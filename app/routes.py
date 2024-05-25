from flask import render_template, flash, redirect, url_for, request, jsonify
from app import app, db
from flask_login import current_user, login_user, logout_user, login_required
import sqlalchemy as sa
from app.models import User, FavoriteMovie
from urllib.parse import urlsplit

@app.route('/liked_movies')
def liked_movies():
    return render_template('liked_movies.html')

@app.route('/search')
def search():
    return render_template('search.html')

@app.route('/recomendation')
def recomendation():
    return render_template('recomendation.html')

@app.route('/main1')
def main1():
    return render_template('main1.html')

@app.route('/')
@app.route('/index')
@login_required
def index():
    return render_template('main1.html', title='Home')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('recomendation'))
    
    if request.method == 'POST':
        username = request.form['Username']
        password = request.form['Password']
        user = db.session.scalar(sa.select(User).where(User.username == username))
        if user is None or not user.check_password(password):
            flash('Invalid username or password')
            return redirect(url_for('login'))
        
        login_user(user, remember=False)
        next_page = request.args.get('next', url_for('recomendation'))       
        if not next_page or urlsplit(next_page).netloc!= '':
            next_page = url_for('recomendation')
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


@app.route('/api/favorites/add', methods=['POST'])
def add_to_favorites():
    movie_data = request.json
    print(movie_data)
    print('aaaaaaaaaaaaaaaaaaaaaaaaaa')

    if not isinstance(movie_data, list):
        return jsonify({"error": "Expected list of movies"}), 400  # Проверяем, что movie_data - список

    # Обработка каждого фильма в списке
    for data in movie_data:
        existing_movie = FavoriteMovie.query.filter_by(
            user_id=current_user.id, 
            name=data['name']
        ).first()

        if existing_movie:
            # Если фильм уже в списке понравившихся, пропускаем его
            print('aaaaaaaaaaaaaaaaaa')
            continue

        movie = FavoriteMovie(
            name=data['name'],
            description=data['description'],
            shortDescription=data['shortDescription'],
            kp_rating=data['rating']['kp'],
            imdb_rating=data['rating']['imdb'],
            ageRating=data['ageRating'],
            posterUrl=data['poster']['url'],
            posterPreviewUrl=data['poster']['previewUrl'],
            genres=', '.join([genre['name'] for genre in data['genres']]),  # Преобразуем в строку
            countries=', '.join([country['name'] for country in data['countries']]),  # Преобразуем в строку
            releaseStart=data['releaseYears'][0]['start'],  # Год начала
            releaseEnd=data['releaseYears'][0]['end'],  # Год окончания
            user_id=current_user.id,  # Идентификатор текущего пользователя
        )
    db.session.add(movie)  # Добавляем фильм в базу данных
    # Сохраняем все изменения в базе данных
    db.session.commit()

    return jsonify({'message': 'Movies added to favorites'}), 200


@app.route('/api/favorites', methods=['GET'])
def get_favorites():
    favorites = db.session.query(FavoriteMovie).filter_by(user_id=current_user.id).all()
    return jsonify([
        {
            'id': favorite.id,
            'name': favorite.name,
            'description': favorite.description,
            'shortDescription': favorite.shortDescription,
            'kp_rating': favorite.kp_rating,
            'imdb_rating': favorite.imdb_rating,
            'ageRating': favorite.ageRating,
            'posterUrl': favorite.posterUrl,
            'posterPreviewUrl': favorite.posterPreviewUrl,
            'genres': favorite.genres,
            'countries': favorite.countries,
            'releaseStart': favorite.releaseStart,
            'releaseEnd': favorite.releaseEnd,
        }
        for favorite in favorites
    ])
