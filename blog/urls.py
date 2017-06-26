from django.conf.urls import url, include
from .views import views, terminal_view, feeds

app_name = 'blog'
urlpatterns = [
    url(r'^search', include('haystack.urls')),
    url(r'^$', views.IndexView.as_view(), name='index'),
    url(r'^post/(?P<pk>[0-9]+)/$', views.PostDetailView.as_view(), name='detail'),
    url(r'^archives/(?P<year>[0-9]{4})/(?P<month>[0-9]{1,2})/$', views.ArchivesView.as_view(), name='archives'),
    url(r'^category/(?P<pk>[0-9]+)/$', views.CategoryView.as_view(), name='category'),
    url(r'^tag/(?P<pk>[0-9]+)/$', views.TagView.as_view(), name='tag'),
    url(r'^all/rss/$', feeds.AllPostsRssFeed(), name='rss'),
    url(r'^terminal$', terminal_view.terminal, name='terminal'),
    url(r'^terminal/api/execute_cmd/$', terminal_view.execute_cmd, name='execute-cmd'),
    url(r'^terminal/api/get_client_ip/$', terminal_view.get_client_ip, name='get-client-ip'),
]
