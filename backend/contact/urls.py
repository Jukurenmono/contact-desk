from django.urls import path
from .views import (TagViewSet, UserViewSet, ContactViewSet, CategoryViewSet, CountryViewSet)

urlpatterns = [

    #Tag
    path('tags/', TagViewSet.as_view({
        'get' : 'list',
        'post' : 'post'
    })),
    path('tags/<int:pk>', TagViewSet.as_view({
        'patch' : 'patch',
        'get' : 'get',
        'delete' : 'delete'
    })),

    #User
    path('users/', UserViewSet.as_view({
        'get' : 'list',
        'post' : 'post'
    })),
    path('users/<int:pk>', UserViewSet.as_view({
        'patch' : 'patch',
        'get' : 'get',
        'delete' : 'delete'
    })),

    #Contact
    path('', ContactViewSet.as_view({
        'get' : 'list',
        'post' : 'post'
    })),
    path('<int:pk>', ContactViewSet.as_view({
        'patch' : 'patch',
        'get' : 'get',
        'delete' : 'delete'
    })),

    #Category
    path('categories/', CategoryViewSet.as_view({
        'get' : 'list',
        'post' : 'post'
    })),
    path('categories/<int:pk>', CategoryViewSet.as_view({
        'patch' : 'patch',
        'get' : 'get',
        'delete' : 'delete'
    })),

    #Address
    path('country/', CountryViewSet.as_view({
        'get' : 'list',
        'post' : 'post'
    })),
    path('country/<int:pk>', CountryViewSet.as_view({
        'patch' : 'patch',
        'get' : 'get',
        'delete' : 'delete'
    })),
]