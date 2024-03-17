from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

from .views import PostListCreateAPIView, PostDetailAPIView, PostLikeAPIView, PostDislikeAPIView, SignInView, SignOutView,SignUpView,PostUserAPIView

urlpatterns = [
    path('posts/', PostListCreateAPIView.as_view(), name='post-list-create'),
    path('posts/<int:pk>/', PostDetailAPIView.as_view(), name='post-detail'),
    path('posts/user/<str:pk>/', PostUserAPIView.as_view(), name='post-detail'),
    path('posts/<int:pk>/like/', PostLikeAPIView.as_view(), name='post-like'),
    path('posts/<int:pk>/dislike/', PostDislikeAPIView.as_view(), name='post-dislike'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('login/', SignInView.as_view(), name='signin'),
    path('signout/', SignOutView.as_view(), name='signout'),
    path('signup/',SignUpView.as_view(),name='signUp'),
]
