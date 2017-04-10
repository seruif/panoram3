X.Game = function (gameConfig, panoramConfig) {
    var progressBarController = X.ProgressBarController;
    progressBarController.setHeightContainer('200px');
    progressBarController.show();

    var gameSetProgress = function (p) {
        progressBarController.setProgress(p, 'Найдено ' + p + ' из ' + progressBarController.getMax() + ' зачеток');
    };

    var studFound = function () {
        if (this.cssClass == 'x-hide')
            return;

        $(this.div).hide();
        gameSetProgress(progressBarController.getProgress() + 1);
        this.cssClass = 'x-hide';

        if (progressBarController.getProgress() == progressBarController.getMax()) {
            alert('УРАА! Ты нашел(a) все зачетки!');
            progressBarController.hide();
        }

        console.log(this);
    };

    var studExtend = {
        type: 'info',
        cssClass: 'x-stud',
        text: 'Зачеточка!',
        picked: false,
        clickHandlerFunc: studFound
    };

    var gameInit = function () {
        var studCount = 0;

        var lastStudScene;
        for (var s in gameConfig) {
            var arr = gameConfig[s];
            for (var a in arr) {
                var stud = arr[a];

                $.extend(stud, studExtend);

                if (!panoramConfig.scenes[s]) {
                    console.log('game: scene ' + s + ' not found');
                    continue;
                }

                lastStudScene = s;

                panoramConfig.scenes[s].hotSpots.push(stud);

                studCount += 1;
            }
        }

        if (X.GetURLParameter('gameDebug')) {
            panoramConfig.default.firstScene = lastStudScene;
        }

        progressBarController.setMax(studCount);
        gameSetProgress(0);
    };

    gameInit();

    return panoramConfig;
};