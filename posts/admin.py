from django.contrib import admin
from .models import Post  # Import the Post model

# Define the admin class for the Post model
class PostAdmin(admin.ModelAdmin):
    list_display = ('event_name', 'data', 'created_at')  # Customize displayed fields in the admin panel

# Register the Post model with the admin site
admin.site.register(Post, PostAdmin)