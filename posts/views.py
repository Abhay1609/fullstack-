
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
#to get all post/event and create new posts/event
class PostListCreateAPIView(APIView):


    def get(self, request):
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

    def post(self, request):
        authentication_classes = [JWTAuthentication]
        permission_classes = [IsAuthenticated]
        try:
         
            serializer = PostSerializer(data=request.data)
  
            if serializer.is_valid():

                serializer.save(author=request.user)

                print(serializer.data)
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            else:

             
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except ValidationError as e:
  
            print(str(e))
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    #to get all post/event of specific user
class PostUserAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request, pk):

        user = get_object_or_404(User, pk=pk)
        

        posts = Post.objects.filter(author=pk)

        serializer = PostSerializer(posts, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
        

 #use to get datail of specific post and allow to update and delete events  
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
#it use handle like on evnet
class PostLikeAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        post = Post.objects.get(pk=pk)
        post.likes.add(request.user)
        return Response({'message': 'Post liked successfully'}, status=status.HTTP_200_OK)
#it is use for handle dislike
class PostDislikeAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        post = Post.objects.get(pk=pk)
        post.likes.remove(request.user)
        return Response({'message': 'Post disliked successfully'}, status=status.HTTP_200_OK)
#it create token and allow login for user 
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


#allow new user to signUp with fields of username,email,password
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