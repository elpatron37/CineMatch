# api/urls.py

from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    path("token/", TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path("token/refresh/", TokenRefreshView.as_view(), name='token_refresh'),
    path("signup/", views.signup, name='signup'),
    path("me/", views.me, name='me'),
    path("delete/", views.delete_user, name='delete_user'),
    path("recommendations/", views.recommendations, name='recommendations'),
    path("search/", views.search, name='search'),
    path("simple-search/", views.simple_search, name='simple_search'),
    path("like/", views.like, name='like'),
    path("movie/<int:movie_id>/", views.movie_details, name='movie_details'),
]