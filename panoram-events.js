X.GamePadPanoramSetEvents = function (deadZone, axesSpeed, radius, panoramController) {
    var gamePad = new X.GamePad(deadZone);
    var gamePadProfiles = X.GamePadsProfiles;

    var selectedSpot = undefined;
    var selectedCss;

    this.getGamePad = function () {
        return gamePad.getGamePad();
    };

    panoramController.gamePad = gamePad;

    var spotUnselect = function(spot) {
        if (spot && spot.div) {
            spot.div.firstChild.style.removeProperty('visibility');
            $(spot.div).removeClass('hover');
            $(spot.div).removeClass('hover-press-x');
        }
    };

    var spotRunner = function() {
        scene = panoramController.pannellumViewer.getConfig();
        spots = scene.hotSpots;

        var found = false;
        for (var s in spots) {
            var spot = spots[s];
            var d1 = Math.abs(spot.yaw - scene.yaw);
            var d2 = Math.abs(spot.pitch - scene.pitch);
            // console.log('spotRunner: d: '+d);
            if (d1 < radius && d2 < radius) {
                found = true;

                if (selectedSpot && selectedSpot.yaw == spot.yaw && selectedSpot.pitch == spot.pitch)
                    break;

                // console.log('spotRunner: found: '+spot.text);

                spotUnselect(selectedSpot);
                if (!spot.div)
                    continue;

                spot.div.firstChild.style.visibility = 'visible';
                selectedCss = spot.cssClass;
                if (gamePad.connected())
                    $(spot.div).addClass('hover-press-x');
                else
                    $(spot.div).addClass('hover');
                selectedSpot = spot;
                xxx = spot;
                break;
            }
        }

        if (!found) {
            if (selectedSpot && !selectedSpot.div)
                selectedSpot = undefined;

            spotUnselect(selectedSpot);

            selectedSpot = undefined;
        }
    };

    var handlerAxes = function (x, y) {
        if (panoramController.isDemo())
            return;

        var yaw = panoramController.pannellumViewer.getYaw() + axesSpeed * x;
        var pitch = panoramController.pannellumViewer.getPitch() + axesSpeed * y;
        panoramController.pannellumViewer.setYaw(yaw, 0);
        panoramController.pannellumViewer.setPitch(pitch, 0);

        // spotRunner();

        // console.log('GamePadPannellumControl: yaw: %s | pitch: %s', yaw, pitch);
    };

    var handleWalk = function () {
        if (panoramController.isDemo())
            return;

        // var spot = getElementCenter();
        if (selectedSpot && selectedSpot.hasOwnProperty('picked'))
            selectedSpot.div.onclick = selectedSpot.clickHandlerFunc.bind(selectedSpot);

        if (selectedSpot) {
            prevScene = panoramController.pannellumViewer.getConfig().scene;
            selectedSpot.div.onclick();
            if (selectedSpot.type == 'scene') {
                walkedScenes.push(selectedSpot.sceneId);
                console.log('load scene: ' + selectedSpot.sceneId);
            }
        }
    };

    var spotRunnerTimer;
    if (!X.GetURLParameter('nogamepad'))
        gamePad.onConnected = function(gpid) {
            var profile = gamePadProfiles[gpid];
            if (!profile) {
                profile = gamePadProfiles[gamePadProfiles.default];
                console.warn('Not setting gamepad: using %s profile', gamePadProfiles.default);
            }

            gamePad.resetAxesEvents();
            //AXES
            for (var a in profile.axes) {
                var axe = profile.axes[a];
                gamePad.setAxisEvent(parseInt(a), axe.x, axe.y, axe.mx, axe.my, handlerAxes);
            }

            //BUTTONS
            var walkedScenes = [];
            //WALK
            gamePad.setButtonEvent(profile.buttons.cross, handleWalk);

            //LOAD PREV SCENE
            gamePad.setButtonEvent(profile.buttons.circle, function () {
                if (panoramController.isDemo())
                    return;

                var prevScene = walkedScenes.pop();
                if (prevScene)
                    panoramController.pannellumViewer.loadScene(prevScene);
            });

            //AUTOROTATE
            gamePad.setButtonEvent(profile.buttons.select, panoramController.switchAutoRotate);

            //NEW GAME
            gamePad.setButtonEvent(profile.buttons.square, function () {
                // if (panoramController.isDemo())
                //     return;
                if (X.GetURLParameter('game'))
                    location.reload(true);
                else {
                    var link = location.origin + location.pathname;
                    if (location.search[0] == '?')
                        link += location.search + '&game';
                    else
                        link += '?game';
                    location.href = link;
                }

                // panoramController.newGame();
            });

            //RELOAD
            gamePad.setButtonEvent(profile.buttons.triangle, function () {
                location.reload(true);
            });
        };

    setInterval(spotRunner, 50);

    // $(document).keypress(function (e) {
    //    console.log('keypress ', e);
    // });

    gamePad.onDisconnected = function() {
        clearInterval(spotRunnerTimer);
    };

    return panoramController;
};