import json
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, get_object_or_404

def terminal(request):
    return render(request, 'blog/terminal.html')

def get_test(request):
    value = request.GET.get('test_value')
    return JsonResponse(value+" successfully!!!", safe=False)

