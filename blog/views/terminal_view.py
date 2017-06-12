import json
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, get_object_or_404

def terminal(request):
    return render(request, 'blog/terminal.html')

def execute_cmd(request):
    value = request.GET.get('parameters')
    params = json.loads(value)
    print(params)
#   return JsonResponse(value+" successfully!!!", safe=False)
    return JsonResponse(params,safe=False)
