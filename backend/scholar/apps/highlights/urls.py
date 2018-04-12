from django.conf.urls import url, include
from rest_framework.routers import SimpleRouter

from .views import HighlightViewSet, AnnotationViewSet, CommentViewSet

r = SimpleRouter(trailing_slash=False)

r.register(r'highlights', HighlightViewSet, 'highlight')
r.register(r'annotations', AnnotationViewSet, 'annotations')


urlpatterns = [
    url(r'^', include(r.urls)),
    # url(r'^annotations/(?P<annotation_pk>[^/.]+)/favorite',
    #     AnnotationFavoriteAPIView.as_view(), name='annotation-favorite'),
    url(r'^highlights/(?P<highlight_pk>[^/.]+)/annotations',
        AnnotationViewSet.as_view({
            'get': 'list',
            'post': 'create',
        }), name='highlight-annotations'),
    url(r'^annotations/(?P<annotation_pk>[^/.]+)/comments',
        CommentViewSet.as_view({
            'get': 'list',
            'post': 'create', 
        }), name='annotation-comments'),
    # url(r'^annotations/(?P<annotation_pk>[^/.]+)/relationships/(?P<related_field>\w+)',
    #     AnnotationFavoriteAPIView.as_view(), name='annotation-relationships'),
]