# from django.shortcuts import render

# # Create your views here.
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from rest_framework.permissions import IsAuthenticated
# from rest_framework_simplejwt.authentication import JWTAuthentication
# from .models import Post

# class PostLikeAPIView(APIView):
#     authentication_classes = [JWTAuthentication]
#     permission_classes = [IsAuthenticated]

#     def post(self, request, pk):
#         try:
#             post = Post.objects.get(pk=pk)
#             post.likes.add(request.user)
#             return Response({'message': 'Post liked successfully'}, status=status.HTTP_200_OK)
#         except Post.DoesNotExist:
#             return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

# class PostDislikeAPIView(APIView):
#     authentication_classes = [JWTAuthentication]
#     permission_classes = [IsAuthenticated]

#     def post(self, request, pk):
#         try:
#             post = Post.objects.get(pk=pk)
#             post.dislikes.add(request.user)
#             return Response({'message': 'Post disliked successfully'}, status=status.HTTP_200_OK)
#         except Post.DoesNotExist:
#             return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Post
from .serializers import PostSerializer
from django.contrib.auth import authenticate, login
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
class PostListCreateAPIView(APIView):


    def get(self, request):
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

    def post(self, request):
        authentication_classes = [JWTAuthentication]
        permission_classes = [IsAuthenticated]
        try:
            # Create a serializer instance with the request data
            serializer = PostSerializer(data=request.data)
         
            # Check if the data is valid
            if serializer.is_valid():
                # Save the serializer data with the authenticated user as the author
                serializer.save(author=request.user)
                # Return a success response with the serialized data
                print(serializer.data)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
#             time
# : 
# "2024-03-12T18:00:00Z"
            else:
                # Return an error response with the serializer errors
             
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except ValidationError as e:
            # If a ValidationError occurs, return an error response with the details
            print(str(e))
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
class PostUserAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk):
        # Retrieve the user based on the provided ID (pk)
        user = get_object_or_404(User, pk=pk)
        
        # Retrieve all posts associated with the user
        posts = Post.objects.filter(author=pk)
        
        # Serialize the posts data
        serializer = PostSerializer(posts, many=True)
        
        # Return the serialized data as a JSON response
        return Response(serializer.data, status=status.HTTP_200_OK)
        

   
class PostDetailAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            return None

    def get(self, request, pk):
        post = self.get_object(pk)
        if post:
            serializer = PostSerializer(post)
            return Response(serializer.data)
        return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, pk):
        post = self.get_object(pk)
        if post and post.author == request.user:
            serializer = PostSerializer(post, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

    def delete(self, request, pk):
        post = self.get_object(pk)
        if post and post.author == request.user:
            post.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

class PostLikeAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        post = Post.objects.get(pk=pk)
        post.likes.add(request.user)
        return Response({'message': 'Post liked successfully'}, status=status.HTTP_200_OK)

class PostDislikeAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        post = Post.objects.get(pk=pk)
        post.likes.remove(request.user)
        return Response({'message': 'Post disliked successfully'}, status=status.HTTP_200_OK)

class SignInView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if username is None or password is None:
            return Response({'error': 'Please provide both username and password'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)

        if user is None:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        login(request, user)
        id=user.id
        refresh = RefreshToken.for_user(user)
        return Response({
            'id':str(id),
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })

class SignOutView(APIView):
    def post(self, request):
        refresh_token = request.data.get('refresh_token')
        if refresh_token:
            try:
                refresh_token = str(refresh_token)
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)

class SignUpView(APIView):
    def post(self, request):
        print(request.data)
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if username is None or email is None or password is None:
            return Response({'error': 'Please provide username, email, and password'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password)

        if user is None:
            return Response({'error': 'Failed to create user'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        login(request, user)  # Automatically log in the user after registration
        id=user.id
        refresh = RefreshToken.for_user(user)
        return Response({
            'id':str(id),
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)