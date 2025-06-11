
import uuid
from django.db import models
from pgvector.django import VectorField
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

class Movie(models.Model):
    title = models.TextField()
    plot = models.TextField()
    embedding = VectorField(dimensions=384)
    type = models.TextField()
    tmdb_id = models.IntegerField(unique=True)
    poster_url = models.TextField(null=True, blank=True)

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'movie')