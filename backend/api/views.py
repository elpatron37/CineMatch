# views.py

from sentence_transformers import SentenceTransformer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Movie, Like
from django.contrib.auth import get_user_model
import numpy as np
from rest_framework_simplejwt.tokens import RefreshToken 
from django.db import models
from django.db import connection
import os
import requests


User = get_user_model()
model = SentenceTransformer('all-MiniLM-L6-v2')

# view for homepage recommendations
@api_view(['GET'])
def recommendations(request):
    
    random_movies = Movie.objects.order_by('?')[:20]
    results = [
        {
            "id": m.id,
            "title": m.title,
            "plot": m.plot,
            "poster_url": m.poster_url,
        }
        for m in random_movies
    ]
    return Response(results)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search(request):
    q = request.GET.get("q")
    print(f"Received search query: '{q}'")
    if not q:
        return Response([], status=200)
    
    vec = model.encode(q).tolist()
    query = """
        SELECT id, title, plot, poster_url
        FROM api_movie
        ORDER BY embedding <-> %s
        LIMIT 10
    """
    
    
    with connection.cursor() as cursor:
        cursor.execute(query, [str(vec)]) 
        rows = cursor.fetchall()

    # The result from above query is a list of tuples and we need to convert it into list of dictionaries.
    results = [
        {"id": row[0], "title": row[1], "plot": row[2], "poster_url": row[3]}
        for row in rows
    ]
    print(f"Found {len(results)} results for query '{q}'")
    print(f"Top result: {results[0]['title']}")
    return Response(results)


@api_view(['POST', 'GET']) 
@permission_classes([IsAuthenticated])
def like(request):
    user = request.user
    
    if request.method == 'POST':
        movie_id = request.data.get("movie_id")
        like_obj, created = Like.objects.get_or_create(user=user, movie_id=movie_id)
        if not created:
            like_obj.delete() 
            
    
    liked_movies = Like.objects.filter(user=user).select_related('movie')
    results = [
        {
            "id": like.movie.id,
            "title": like.movie.title,
            "plot": like.movie.plot,
            "poster_url": like.movie.poster_url,
        }
        for like in liked_movies
    ]
    return Response(results)


@api_view(['POST'])
def signup(request):
    data = request.data
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return Response({"error": "Username and password are required"}, status=400)
    
    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already taken"}, status=400)
    
    user = User.objects.create_user(username=username, password=password)

    # Generate token for the new user
    refresh = RefreshToken.for_user(user)
    
    return Response({
        "message": "Account created successfully",
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    
    return Response({
        "username": request.user.username,
    })


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request):
    request.user.delete()
    return Response({"message": "Account deleted"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def movie_details(request, movie_id):
    try:
        movie = Movie.objects.get(id=movie_id)
        tmdb_id = movie.tmdb_id
        tmdb_api_key = os.getenv('TMDB_API_KEY')
        if not tmdb_api_key:
            raise ValueError("TMDB_API_KEY not found in environment variables")
            
        url = f"https://api.themoviedb.org/3/movie/{tmdb_id}?api_key={tmdb_api_key}&append_to_response=credits"
        response = requests.get(url)
        response.raise_for_status() 
        tmdb_data = response.json()

        
        details = {
            "id": movie.id,
            "title": movie.title,
            "plot": movie.plot,
            "poster_url": movie.poster_url,
            "release_year": tmdb_data.get('release_date', '').split('-')[0],
            "rating": tmdb_data.get('vote_average', 0),
            "language": tmdb_data.get('original_language', '').upper(),
            "genres": [genre['name'] for genre in tmdb_data.get('genres', [])],
            "cast": [actor['name'] for actor in tmdb_data.get('credits', {}).get('cast', [])[:10]] # Top 10 actors
        }
        return Response(details)

    except Movie.DoesNotExist:
        return Response({"error": "Movie not found"}, status=404)
    except requests.RequestException as e:
        return Response({"error": f"Failed to fetch data from TMDB: {e}"}, status=503)
    except Exception as e:
        return Response({"error": str(e)}, status=500)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def simple_search(request):
    query = request.GET.get("q", "") 
    if not query:
        return Response([])

  
    results = Movie.objects.filter(title__icontains=query)[:20] 

    
    serialized_results = [{
        "id": movie.id,
        "title": movie.title,
        "plot": movie.plot,
        "poster_url": movie.poster_url
    } for movie in results]
    
    return Response(serialized_results)