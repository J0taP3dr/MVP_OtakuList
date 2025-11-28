from flask import render_template
from main import app
from anilist_api import (
    get_popular_animes,
    get_trending_animes,
    get_seasonal_animes,
    get_all_animes
)

@app.route('/')
def homepage():
    populares = get_popular_animes()
    trends = get_trending_animes()
    temporada = get_seasonal_animes()
    return render_template(
        'homepage.html',
        populares=populares,
        trends=trends,
        temporada=temporada
    )

@app.route('/animes')
def all_animes():
    animes = get_all_animes()
    return render_template('animes.html', animes=animes)

@app.route('/minha-lista')
def my_list():
    return render_template('minha-lista.html')

@app.route('/perfil')
def profile():
    return render_template('perfil.html')

from flask import request, jsonify

user_list = []

@app.route("/api/add_to_list", methods=["POST"])
def add_to_list():
    data = request.json
    anime_id = data.get("id")
    anime_title = data.get("title")
    anime_image = data.get("image")

    for item in user_list:
        if item["id"] == anime_id:
            return jsonify({"message": "Anime já está na lista"}), 200

    user_list.append({
        "id": anime_id,
        "title": anime_title,
        "image": anime_image
    })

    return jsonify({"message": "Adicionado com sucesso"}), 200


@app.route("/api/get_list", methods=["GET"])
def get_list():
    return jsonify(user_list)


@app.route("/api/remove_from_list", methods=["POST"])
def remove_from_list():
    data = request.json
    anime_id = data.get("id")
    global user_list
    user_list = [item for item in user_list if item["id"] != anime_id]
    return jsonify({"message": "Removido com sucesso"})
