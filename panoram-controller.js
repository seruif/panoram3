X.PanoramController = function (config, gameConfig, ar) {
    var pannellumViewer;
    var autorotate = false;

    var autoTotateStop = function () {
        autorotate = false;
        $('#autorotate').hide();
        pannellumViewer.stopAutoRotate();
    };

    var gameConfiged = false;

    var newGame = function () {
        if (pannellumViewer && autorotate) {
            autoTotateStop();
        }

        if (pannellumViewer) {
            pannellumViewer.destroy();
        }

        if (!gameConfiged) {
            config = X.Game(gameConfig, config);
            gameConfiged = true;
        }

        pannellumViewer = pannellum.viewer('panorama', config);
        // pannellumViewer.loadScene(config.default.firstScene);
    };

    if (X.GetURLParameter('game'))
        newGame();
    else
        pannellumViewer = pannellum.viewer('panorama', config);

    var sceneIDs = [];
    for (var s in config.scenes)
        sceneIDs.push(s);

    var timerStarter;

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    var autoWalker = function () {
        if (!autorotate)
            return;

        // var spots = pannellumViewer.getConfig().hotSpots;
        // var spot = spots[getRandomInt(0, spots.length)];
        var sceneId = sceneIDs[getRandomInt(0, sceneIDs.length)];
        // spot.div.onclick();
        pannellumViewer.loadScene(sceneId);
        // setTimeout(pannellumViewer.startAutoRotate.bind(this, ar.speed), ar.startTimeout);
        timerStarter = setInterval(autoRotateStart, 100);
    };

    var autoRotateStart = function() {
        if (!autorotate || pannellumViewer.getRenderer().isLoading())
            return;

        $('#autorotate').show();
        pannellumViewer.startAutoRotate(ar.speed);
        clearInterval(timerStarter);
        setTimeout(autoWalker, ar.walkTimeout);
    };

    var reloadScene = function () {
        var conf = pannellumViewer.getConfig();
        pannellumViewer.loadScene(conf.scene, conf.itch, conf.yaw);
    };


    $('#autorotate').hide();
    var switchAutoRotate = function () {
        autorotate = !autorotate;

        if (autorotate) {
            timerStarter = setInterval(autoRotateStart, 100);
        }
        else {
            autoTotateStop();
            reloadScene();
        }
    };

    this.pannellumViewer = pannellumViewer;
    this.switchAutoRotate = switchAutoRotate;
    this.newGame = newGame;
    this.isDemo = function () {
        return autorotate;
    };
};