from django.contrib import admin
from .models import Post  # Import the Post model

class PostAdmin(admin.ModelAdmin):
    list_display = ('event_name', 'data', 'created_at') 

admin.site.register(Post, PostAdmin)