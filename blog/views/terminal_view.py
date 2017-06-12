import json
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, get_object_or_404

def cmd_contact(params):
    return "You can reach me on email: 710222122@qq.com"

def cmd_not_found(params):
    return params[0]+': command not found'

def cmd_nothing(params):
    return "Error command"

commands = {
    'contact': cmd_contact,
    'Nothing': cmd_nothing
    }

def terminal(request):
    return render(request, 'blog/terminal.html')

def execute_cmd(request):
    value = request.GET.get('parameters')
    params = json.loads(value)
    cmd = params[0]
    try:
        ret = commands.get(cmd, 'Nothing')(params)
    except:
        ret = cmd_not_found(params)
    return JsonResponse(ret, safe=False)

def get_client_ip(request):
    if 'HTTP_X_FORWARDED_FOR' in request.META:
        ret = request.META['HTTP_X_FORWARDED_FOR']
    else:
        ret = request.META['REMOTE_ADDR']
    return JsonResponse(ret, safe=False)
