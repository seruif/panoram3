var X = {};
var X = {};

X.GetURLParameter = function(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1));
    var sURLVariables = sPageURL.split('&');
    var sParameterName;
    var i;
    var result;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            result = sParameterName[1] === undefined ? true : sParameterName[1];
            break;
        }
    }

    if (result == 'true')
        return true;

    if (result == 'false')
        return false;

    // if (result) 
    //     return result;
    // else
    //     result = X.DefaultURLParameters[sParam];

    // if (result)
    //     return result;
    // else
    //     return 

    result = result || X.DefaultURLParameters[sParam];
    return result;
};

X.DefaultURLParameters = {
    nogamepad: false,   //no gamepad execute events
    game: true,        //enable game on load
    loadall: true,      //preload all images
    debug: true,        //debug mode of pannellum
    gameDebug: false    //load last scene with include зачеточка
};