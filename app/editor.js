(function(window, document) {
    var global = window;
    
    if (typeof EDITOR === 'undefined') {
        global.EDITOR = {};
    } 

    EDITOR.global = global;
    EDITOR.root = 'app/';

    EDITOR.classList = [
        'EDITOR.Workspace',
        'EDITOR.Tab',
        'EDITOR.Paper',
        'EDITOR.paper.Controls',
        'EDITOR.paper.control.LoadTemplate',
        'EDITOR.Controls',

        // Controls
        'EDITOR.Control',
        'EDITOR.control.Pointer',
        'EDITOR.control.DrawBlock',
        'EDITOR.control.DrawImage',
        'EDITOR.control.AddPage',

        // Objects
        'EDITOR.Object',
        'EDITOR.object.block.Controls',
        'EDITOR.object.Block',
        'EDITOR.object.Image',

        // Events
        'EDITOR.Event',
        'EDITOR.event.Move',
        'EDITOR.event.Resize',
        'EDITOR.event.TabSelect',
        'EDITOR.event.Execute',
    ]

    EDITOR.extends = function(s, o) {
        for (var p in o) {
            try {
              // Property in destination object set; update its value.
              if (s[p].constructor == Object) {
                s[p] = EDITOR.extends(s[p], o[p]);
              } else {
                s[p] = o[p];
              }
            } catch(e) {
              // Property in destination object not set; create it and set its value.
              s[p] = o[p];
            }
        }
        return s;
    }

    EDITOR.extends(EDITOR, {
        fileLoaded: 0,
        isFileLoaded: {},
        scriptElement: {},
        bind: function(scope, fn) {
            return function() {
                fn.apply(scope, arguments);
            }
        },
        addEvent: function(elem, type, eventHandle) {
            if (elem == null || elem == undefined) 
                return;
            if (elem.addEventListener) {
                elem.addEventListener( type, eventHandle, false );
            } else if ( elem.attachEvent ) {
                elem.attachEvent( "on" + type, eventHandle );
            } else {
                elem["on"+type]=eventHandle;
            }
        },
        injectScriptElement: function(url, onLoad, scope) {
            var script = document.createElement('script'),
                me = this,
                onLoadFn = function() {
                    me.cleanupScriptElement(script);
                    onLoad.call(scope);
                },
                onErrorFn = function() {
                    me.cleanupScriptElement(script);
                    throw new Error("Class Not Found : " + url);    
                };

            script.type = 'text/javascript';
            script.src = url;
            script.onload = onLoadFn;
            script.onerror = onErrorFn;
            script.onreadystatechange = function() {
                if (this.readyState === 'loaded' || this.readyState === 'complete') {
                    onLoadFn();
                }
            };
            
            document.head.appendChild(script);

            return script;
        },
        cleanupScriptElement: function(script, remove) {
            script.onload = null;
            script.onreadystatechange = null;
            script.onerror = null;

            if (remove) {
                document.head.removeChild(script);
            }

            return this;
        },
        cancelBubble: function(e) {
            if (!e) var e = window.event;
            e.cancelBubble = true;
            if (e.stopPropagation) e.stopPropagation();
        },
        disableFocus: function(elem){
            elem.onmouseover = EDITOR.cancelBubble;
            elem.onmouseout = EDITOR.cancelBubble;
        },
        isDescendant: function(parent, child) {
            var node = child.parentElement;
            while (node != null) {
                if (node == parent) {
                    return true;
                }
                node = node.parentElement;
            }
            return false;
        }
    });

    Element.prototype.hasClassName = function(name) 
    {
        return new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)").test(this.className);
    };

    Element.prototype.addClassName = function(name) 
    {
        if (!this.hasClassName(name)) {
            this.className = this.className ? [this.className, name].join(' ') : name;
        }
    };

    Element.prototype.removeClassName = function(name) 
    {
        if (this.hasClassName(name)) {
            var c = this.className;
            this.className = c.replace(new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)", "g"), "");
        }
    }; 

    window.onload = function() {
        for (var i = 0; i < EDITOR.classList.length; i++) {
            var className = EDITOR.classList[i],
                path = className.split('.'),
                name = path.pop() + '.js',
                url = EDITOR.root + path.join('/') + '/' + name + '?_dc=' + (new Date());
            if (!EDITOR.isFileLoaded[className]) {
                // EDITOR.injectScriptElement(url, function(){
                //     EDITOR.fileLoaded++;
                //     if (EDITOR.fileLoaded == EDITOR.classList.length) {
                //         EDITOR.self = new EDITOR.Workspace();
                //         console.log('Load complete!');
                //     }
                // }, EDITOR);
                if (typeof XMLHttpRequest != 'undefined') {
                    xhr = new XMLHttpRequest();
                } else {
                    xhr = new ActiveXObject('Microsoft.XMLHTTP');
                }

                try {
                    xhr.open('GET', url, false);
                    xhr.send(null);
                }
                catch (e) {
                    //<debug error>
                    console.log('Failed: ' + url);
                    //</debug>
                }

                status = (xhr.status == 1223) ? 204 : xhr.status;
                content = xhr.responseText;

                if ((status >= 200 && status < 300) || status == 304 || (status == 0 && content.length > 0)) {
                    // Debugger friendly, file names are still shown even though they're eval'ed code
                    // Breakpoints work on both Firebug and Chrome's Web Inspector
                    eval(content + "\n//@ sourceURL=" + url);
                    EDITOR.fileLoaded++;
                    if (EDITOR.fileLoaded == EDITOR.classList.length) {
                        EDITOR.self = new EDITOR.Workspace();
                        console.log('Load complete!');
                    }
                }
                else {
                    //<debug>
                    console.log("Failed loading synchronously via XHR: '" + url + "'; please " +
                                       "verify that the file exists. " +
                                       "XHR status code: " + status);
                    //</debug>
                }

                // Prevent potential IE memory leak
                xhr = null;
            }
        }
    };
})(this, this.document);

