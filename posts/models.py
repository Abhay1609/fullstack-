
from django.db import models
from django.contrib.auth.models import User
def user_directory_path(instance, filename):
    # File will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return 'author_{0}/{1}'.format(instance.author.id, filename)

class Post(models.Model):
    event_name = models.CharField(max_length=100)
    data = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    location = models.CharField(max_length=100,null=True)
    image = models.ImageField(upload_to=user_directory_path,null=True)
    likes = models.ManyToManyField(User, related_name='liked_posts',blank=True)
    time = models.DateTimeField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
