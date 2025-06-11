from django.contrib import admin
from .models import User, Movie, Like

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'date_joined', 'is_staff')
    search_fields = ('username', 'email')

@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ('title', 'type', 'tmdb_id')
    search_fields = ('title', 'plot')
    list_filter = ('type',)

@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ('user', 'movie')
    list_filter = ('user',)