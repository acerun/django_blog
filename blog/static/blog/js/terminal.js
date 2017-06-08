var util = util || {};
util.toArray = function(list) {
  return Array.prototype.slice.call(list || [], 0);
};

var Terminal = Terminal || function(cmdLineContainer, outputContainer) {
  window.URL = window.URL || window.webkitURL;
  window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

  var cmdLine_ = document.querySelector(cmdLineContainer);
  var output_ = document.querySelector(outputContainer);

  const CMDS_ = [
    'about', 'clear', 'work', 'hobbies', 'contact', 'help'
  ];
  
  var fs_ = null;
  var cwd_ = null;
  var history_ = [];
  var histpos_ = 0;
  var histtemp_ = 0;

  window.addEventListener('click', function(e) {
    cmdLine_.focus();
  }, false);

  cmdLine_.addEventListener('click', inputTextClick_, false);
  cmdLine_.addEventListener('keydown', historyHandler_, false);
  cmdLine_.addEventListener('keydown', processNewCommand_, false);

  //
  function inputTextClick_(e) {
    this.value = this.value;
  }

  //
  function historyHandler_(e) {
    if (history_.length) {
      if (e.keyCode == 38 || e.keyCode == 40) {
        if (history_[histpos_]) {
          history_[histpos_] = this.value;
        } else {
          histtemp_ = this.value;
        }
      }

      if (e.keyCode == 38) { // up
        histpos_--;
        if (histpos_ < 0) {
          histpos_ = 0;
        }
      } else if (e.keyCode == 40) { // down
        histpos_++;
        if (histpos_ > history_.length) {
          histpos_ = history_.length;
        }
      }

      if (e.keyCode == 38 || e.keyCode == 40) {
        this.value = history_[histpos_] ? history_[histpos_] : histtemp_;
        this.value = this.value; // Sets cursor to end of input.
      }
    }
  }

  //
  function processNewCommand_(e) {

    if (e.keyCode == 9) { // tab
      e.preventDefault();
      // Implement tab suggest.
    } else if (e.keyCode == 13) { // enter
      // Save shell history.
      if (this.value) {
        history_[history_.length] = this.value;
        histpos_ = history_.length;
      }

      // Duplicate current input and append to output section.
      var line = this.parentNode.parentNode.cloneNode(true);
      line.removeAttribute('id')
      line.classList.add('line');
      var input = line.querySelector('input.cmdline');
      input.autofocus = false;
      input.readOnly = true;
      output_.appendChild(line);

      if (this.value && this.value.trim()) {
        var args = this.value.split(' ').filter(function(val, i) {
          return val;
        });
        var cmd = args[0].toLowerCase();
        args = args.splice(1); // Remove cmd from arg list.
      }

      // 'about', 'clear', 'work', 'hobbies', 'contact', 'help'
      switch (cmd) {
        case 'cat':
          var url = args.join(' ');
          if (!url) {
            output('Usage: ' + cmd + ' http://s.codepen.io/...');
            output('Example: ' + cmd + ' http://s.codepen.io/AndrewBarfield/pen/LEbPJx.js');
            break;
          }
          $.get( url, function(data) {
            var encodedStr = data.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
               return '&#'+i.charCodeAt(0)+';';
            });
            output('<pre>' + encodedStr + '</pre>');
          });
          break;
        case 'clear':
          output_.innerHTML = '';
          this.value = '';
          return;
        case 'clock':
          var appendDiv = jQuery($('.clock-container')[0].outerHTML);
          appendDiv.attr('style', 'display:inline-block');
          output_.appendChild(appendDiv[0]);
          break;
        case 'date':
          output( new Date() );
          break;
        case 'echo':
          output( args.join(' ') );
          break;
        case 'help':
          output('<div class="ls-files">' + CMDS_.join('<br>') + '</div>');
          break;
        case 'uname':
          output(navigator.appVersion);
          break;
        case 'whoami':
          var result = "<img src=\"" + codehelper_ip["Flag"]+ "\"><br><br>";
          for (var prop in codehelper_ip)
            result += prop + ": " + codehelper_ip[prop] + "<br>";
          output(result);
          break;
// CUSTOM COMMANDS
        case 'about':
          output('I\'m Nejc Kikelj. A software developer from Slovenia.');
          break;
        case 'work':
            if (args[0] != undefined) {
              switch (args[0]) {
                case 'MyGPService' :
                  output("I'm the Chief Of Software Development at a company providing tracking solutions for logistic companys and more. Most of developement is done in PHP, some in Perl and Java.");
                  break;
                case 'Geocacher.si' :
                  output("I'm the current IT support guy for the site.");
                  break;
                case 'Rider.si' :
                  output("I was one of the initial crew that created the site. I have since then abandoned it becouse of some personal reasons. Currently it's maintained by other people.");
                  break;
                default:
                  output(args[0] + ": Unknown project!");
              }
            } else {
              output('Some of my projects include: MyGPService (GPS tracking platform), Geocacher.si (Geocaching comunity website), Rider.si (Comunity site for watter sports), Proksi.si (Simple hardware store), ...');
              output('For details, use command work with parameter (example: \'work MyGPService\' ).');
            }
          break;
        case 'hobbies':
          output("My hobbies include wakebording, hiking, dog waking, ...");
          break;
        case 'contact':
          output("You can reach me on my email: nejc@kikelj.com");
          break;
        default:
          if (cmd) {
            output(cmd + ': command not found');
          }
      };

      window.scrollTo(0, getDocHeight_());
      this.value = ''; // Clear/setup line for next input.
    }
  }

  //
  function formatColumns_(entries) {
    var maxName = entries[0].name;
    util.toArray(entries).forEach(function(entry, i) {
      if (entry.name.length > maxName.length) {
        maxName = entry.name;
      }
    });

    var height = entries.length <= 3 ?
        'height: ' + (entries.length * 15) + 'px;' : '';

    // 12px monospace font yields ~7px screen width.
    var colWidth = maxName.length * 7;

    return ['<div class="ls-files" style="-webkit-column-width:',
            colWidth, 'px;', height, '">'];
  }

  //
  function output(html) {
    output_.insertAdjacentHTML('beforeEnd', '<p>' + html + '</p>');
  }

  // Cross-browser impl to get document's height.
  function getDocHeight_() {
    var d = document;
    return Math.max(
        Math.max(d.body.scrollHeight, d.documentElement.scrollHeight),
        Math.max(d.body.offsetHeight, d.documentElement.offsetHeight),
        Math.max(d.body.clientHeight, d.documentElement.clientHeight)
    );
  }

  //
  return {
    init: function() {
      output('<h2 style="letter-spacing: 4px">Kikelj.Com</h2><p>' + new Date() + '</p><p>Enter "help" for more information.</p>');
    },
    output: output
  }
};