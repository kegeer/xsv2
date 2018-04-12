from django.conf.urls import url, include
from rest_framework.routers import SimpleRouter

from scholar.apps.highlights.views import HighlightViewSet
from scholar.apps.projects import views

r = SimpleRouter(trailing_slash=False)

r.register(r'projects', views.ProjectViewSet, 'project')
r.register(r'documents', views.DocumentViewSet, 'document')
r.register(r'papers', views.PaperViewSet, 'papers')
r.register(r'files', views.FileViewSet, 'file')
r.register(r'osses', views.OssViewset, 'oss')

urlpatterns = [
    url(r'^', include(r.urls)),
    url(r'^files/(?P<file_pk>[^/.]+)/highlights',
        HighlightViewSet.as_view({'get': 'list', 'post': 'create'}), name='file-highlights'),
    url(r'^projects/(?P<project_pk>[^/.]+)/files', views.FileViewSet.as_view({'get': 'list', 'post': 'create'}),
        name="project-files"),
    url(r'^projects/(?P<project_pk>[^/.]+)/documents', views.DocumentViewSet.as_view({'get': 'list', 'post': 'create'}),
        name="project-documents"),
]
