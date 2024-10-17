from django.shortcuts import render


def home_view(request):
    return render(request, 'home.html')


def Level01_chat(request):
    return render(request, 'Level01_chat.html')