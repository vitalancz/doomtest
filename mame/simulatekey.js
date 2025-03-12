function simulateKeyEvent(eventType, keyCode, charCode) {
    var e = document.createEventObject ? document.createEventObject() : document.createEvent("Events");
    if (e.initEvent) e.initEvent(eventType, true, true);

    e.keyCode = keyCode;
    e.which = keyCode;
    e.charCode = charCode;

    // Dispatch directly to Emscripten's html5.h API (use this if page uses emscripten/html5.h event handling):
    if (typeof JSEvents !== 'undefined' && JSEvents.eventHandlers && JSEvents.eventHandlers.length > 0) {
        for(var i = 0; i < JSEvents.eventHandlers.length; ++i) {
            if ((JSEvents.eventHandlers[i].target == Module['canvas'] || JSEvents.eventHandlers[i].target == window)
            && JSEvents.eventHandlers[i].eventTypeString == eventType) {
                JSEvents.eventHandlers[i].handlerFunc(e);
            }
        }
    } else {
        // Dispatch to browser for real (use this if page uses SDL or something else for event handling):
        Module['canvas'].dispatchEvent ? Module['canvas'].dispatchEvent(e) : Module['canvas'].fireEvent("on" + eventType, e);
    }
}