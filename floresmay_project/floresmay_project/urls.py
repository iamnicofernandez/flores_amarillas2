
from django.contrib import admin
from django.urls import path
from floresmay import views  # Importar las vistas de tu app floresmay

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home_view, name='home'),  # Ruta para la vista home
    path('Level01_chat/', views.Level01_chat, name='Level01_chat'), 
]