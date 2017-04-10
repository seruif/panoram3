X.ProgressBarController.setCenter();

X.LoadConfig = function (panoramConfig, imageDirectory, extenstion, defaultScene, onloaded) {
    var loadScene = function () {
        if (this.type == 'scene')
            console.log('load scene ' + this.sceneId);
    };

    var getCssClass = function(type) {
        switch (type) {
            case 'up':
                return 'x-up';
            case 'down':
                return 'x-down';
            case 'go':
                return 'x-go';
            case 'stud':
                return 'x-stud';
            default:
                console.warn('invalid hotspot csstype ' + type);
                return undefined;
        }
    };

    if (X.GetURLParameter('debug'))
        panoramConfig.default.hotSpotDebug = true;

    panoramConfig.default.firstScene = X.GetURLParameter('scene') || panoramConfig.default.firstScene || defaultScene;

    //LOAD IMAGES
    var totalSize = 0;
    var scenesHead = [];
    var scenesGet = [];
    var loadall = X.GetURLParameter('loadall');
    // var loadall = true;

    var loaderror = function(method, url, status, text) {
         var text = method+' ERROR '+url+' '+status+' '+text;
         console.warn(text);
         alert(text);
    };

    for (var p in panoramConfig.scenes) {
        var scene = panoramConfig.scenes[p];
        scene.panorama = location.origin + imageDirectory + p + extenstion;

        for (var h in scene.hotSpots) {
            scene.hotSpots[h].clickHandlerFunc = loadScene;
            scene.hotSpots[h].cssClass = getCssClass(scene.hotSpots[h].cssClass);
        }

        scenesHead.push(scene);
        scenesGet.push(scene);
    }

    var loadFinished = function(panoramConfig) {
        X.ProgressBarController.hide();
        onloaded(panoramConfig);
    };

    var loadAllImages = function() {
        X.ProgressBarController.setMax(totalSize);

        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        var loadingScene;
        var loadImages = function () {
            loadingScene = scenesGet.pop();
            if (!loadingScene) {
                X.ProgressBarController.hide();
                loadFinished(panoramConfig);
                return;
            }

            xhr.open('GET', loadingScene.panorama, true);
            xhr.send();
        };

        xhr.onload = function () {
            if (this.status == 200) {
                var urlCreator = window.URL || window.webkitURL;
                var imageUrl = urlCreator.createObjectURL(this.response);
                loadingScene.panorama = imageUrl;
                X.ProgressBarController.setProgress(X.ProgressBarController.getProgress() + this.response.size);
                // console.log('loaded image: ' + imageUrl);
                loadImages();
            }
            else
                loaderror('GET', this.responseURL, this.status, this.statusText)
        };

        xhr.onerror = function (message) {
            loaderror('GET REQUEST', this.url, message.status, message.statusText)
        };

        loadImages();
    };

    var loadAllHeads = function() {
        var scene = scenesHead.pop();
        if (!scene) {
            loadAllImages();
            return;
        }

        $.ajax({type: "HEAD", async: true, url: scene.panorama})
            .done(function (message, text, jqXHR) {
                totalSize += parseInt(jqXHR.getResponseHeader('Content-Length'));
                loadAllHeads();
            })
            .catch(function (message) {
                loaderror('HEAD', this.url, message.status, message.statusText);
            });
    };

    if (loadall)
        loadAllHeads();
    else
        loadFinished(panoramConfig);

};

