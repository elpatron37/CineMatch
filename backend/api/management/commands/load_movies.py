import csv
import ast  
from django.core.management.base import BaseCommand
from django.db import IntegrityError
from api.models import Movie

class Command(BaseCommand):
    help = 'Load movies from a CSV file (with pre-computed embeddings) into the database'

    def handle(self, *args, **kwargs):
        csv_file_path = 'movies_rows.csv'

        self.stdout.write(f"Starting to load movies from {csv_file_path}...")
        movies_created = 0
        movies_updated = 0
        skipped_rows = 0

        with open(csv_file_path, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            
            for i, row in enumerate(reader):
                tmdb_id_str = row.get('tmdb_id')
                embedding_str = row.get('embedding')
                if not tmdb_id_str or not embedding_str:
                    self.stdout.write(self.style.WARNING(f"Skipping row {i+2}: Missing tmdb_id or embedding."))
                    skipped_rows += 1
                    continue
                
                
                try:
                    tmdb_id = int(float(tmdb_id_str)) 
                    embedding = ast.literal_eval(embedding_str)
                    if len(embedding) != 384:
                        self.stdout.write(self.style.WARNING(f"Skipping row {i+2} for tmdb_id {tmdb_id}: Embedding dimension is {len(embedding)}, expected 384."))
                        skipped_rows += 1
                        continue

                except (ValueError, SyntaxError) as e:
                    self.stdout.write(self.style.ERROR(f"Skipping row {i+2}: Could not parse data. Error: {e}"))
                    skipped_rows += 1
                    continue

                
                try:
                    movie, created = Movie.objects.update_or_create(
                        tmdb_id=tmdb_id,
                        defaults={
                            'title': row.get('title', 'No Title Provided'),
                            'plot': row.get('plot', 'No Plot Provided'),
                            'embedding': embedding,
                            'type': row.get('type', 'Unknown'),
                            'poster_url': row.get('poster_url')
                        }
                    )

                    if created:
                        movies_created += 1
                    else:
                        movies_updated += 1
                    
                    if (movies_created + movies_updated) % 200 == 0:
                        self.stdout.write(f"Processed {movies_created + movies_updated} movies...")

                except IntegrityError as e:
                    self.stdout.write(self.style.ERROR(f"Skipping row {i+2} due to a database integrity error (e.g., duplicate tmdb_id if not handled by update_or_create): {e}"))
                    skipped_rows += 1

        self.stdout.write(self.style.SUCCESS('---------------------------------'))
        self.stdout.write(self.style.SUCCESS('Movie loading process finished!'))
        self.stdout.write(f'New movies created: {movies_created}')
        self.stdout.write(f'Existing movies updated: {movies_updated}')
        self.stdout.write(f'Rows skipped due to errors or missing data: {skipped_rows}')