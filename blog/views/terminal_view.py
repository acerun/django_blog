import json
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, get_object_or_404

def cmd_help(paramts):
    jsCmds = ['clear','clock','date','uname','whoami']
    djCmds = list(commands.keys())
    allCmds = jsCmds + djCmds
    allCmds.sort()
    return ('<div class="ls-files">' + '<br>'.join(allCmds) + '</div>')

def cmd_whoareyou(params):
    return ('I\'m Run. A software developer from China:)<br>'
            '<img src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1350262701,1461542550&fm=26&gp=0.jpg"></img>')

def cmd_contact(params):
    return "You can reach me on email: 710222122@qq.com"

def cmd_not_found(params):
    return f'{params[0]}: command not found'

commands = {
    'help': cmd_help,
    'whoareyou':cmd_whoareyou,
    'contact': cmd_contact,
    }

def terminal(request):
    return render(request, 'blog/terminal.html')

def execute_cmd(request):
    value = request.GET.get('parameters')
    params = json.loads(value)
    cmd = params[0]
#    ret = commands.get(cmd, 'Nothing')(params)
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
