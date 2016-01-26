var libs = {};
libs.Ivona = require('ivona-node');

var ivona = new libs.Ivona({
    accessKey: 'IVONA_ACCESS_KEY',
    secretKey: 'IVONA_SECRET_KEY'
});

libs.fs = require('fs');

libs.crypto = require('crypto');
libs.http = require('http');


var tvChannel = 'x-sonos-htastream:RINCON_000E58B0737B01400:spdif';

var players = [
    {
        "host": "192.168.1.13",
        "name": "Tv Room"
    },
    {
        "host": "192.168.1.15",
        "name": "Arbeitszimmer"
    },
    {
        "host": "192.168.1.16",
        "name": "Fitness"
    }
];

var sayitEngines = {
    "ru-RU_AZ_Female": {
        "gender": "Female",
        engine: "ivona",
        params: ['accessKey', 'secretKey'],
        "language": "ru-RU",
        "ename": "Tatyana",
        "name": "Ivona - Русский - Татьяна"
    },
    "ru-RU_AZ_Male": {
        "gender": "Male",
        engine: "ivona",
        params: ['accessKey', 'secretKey'],
        "language": "ru-RU",
        "ename": "Maxim",
        "name": "Ivona - Русский - Максим"
    },
    "de-DE_AZ_Female": {
        "gender": "Female",
        engine: "ivona",
        params: ['accessKey', 'secretKey'],
        "language": "de-DE",
        "ename": "Marlene",
        "name": "Ivona - Deutsch - Marlene"
    },
    "de-DE_AZ_Male": {
        "gender": "Male",
        engine: "ivona",
        params: ['accessKey', 'secretKey'],
        "language": "de-DE",
        "ename": "Hans",
        "name": "Ivona - Deutsch - Hans"
    },
    "en-US_AZ_Female": {
        "gender": "Female",
        engine: "ivona",
        params: ['accessKey', 'secretKey'],
        "language": "en-US",
        "ename": "Salli",
        "name": "Ivona - en-US - Female - Salli"
    },
    "en-US_AZ_Male": {
        "gender": "Male",
        engine: "ivona",
        params: ['accessKey', 'secretKey'],
        "language": "en-US",
        "ename": "Joey",
        "name": "Ivona - en-US - Male - Joey"
    },
    "en-GB_AZ_Female_Amy": {
        "gender": "Female",
        engine: "ivona",
        params: ['accessKey', 'secretKey'],
        "language": "en-GB",
        "ename": "Amy",
        "name": "Ivona - en-GB - Female - Amy"
    },
    "en-GB_AZ_Male": {
        "gender": "Male",
        engine: "ivona",
        params: ['accessKey', 'secretKey'],
        "language": "en-GB",
        "ename": "Brian",
        "name": "Ivona - en-GB - Male - Brian"
    },
    "en-GB_AZ_Female_Emma": {
        "gender": "Female",
        engine: "ivona",
        params: ['accessKey', 'secretKey'],
        "language": "en-GB",
        "ename": "Emma",
        "name": "Ivona - en-GB - Female - Emma"
    },
    "en-GB-WLS_AZ_Female": {
        "gender": "Female",
        engine: "ivona",
        params: ['accessKey', 'secretKey'],
        "language": "en-GB-WLS",
        "ename": "Gwyneth",
        "name": "Ivona - en-GB-WLS - Female - Gwyneth"
    },
    "en-GB-WLS_AZ_Male": {
        "gender": "Male",
        engine: "ivona",
        params: ['accessKey', 'secretKey'],
        "language": "en-GB-WLS",
        "ename": "Geraint",
        "name": "Ivona - en-GB-WLS - Male - Geraint"
    },
    "en-US_AZ_Male_Chipmunk": {
        "gender": "Male",
        engine: "ivona",
        params: ['accessKey', 'secretKey'],
        "language": "en-US",
        "ename": "Chipmunk",
        "name": "Ivona - en-US - Male - Chipmunk"
    },
    "en-US_AZ_Male_Eric": {
        "gender": "Male",
        engine: "ivona",
        params: ['accessKey', 'secretKey'],
        "language": "en-US",
        "ename": "Eric",
        "name": "Ivona - en-US - Male - Eric"
    },
    "en-US_AZ_Female_Ivy": {
        "gender": "Female",
        engine: "ivona",
        params: ['accessKey', 'secretKey'],
        "language": "en-US",
        "ename": "Ivy",
        "name": "Ivona - en-US - Female - Ivy"
    },
    "en-US_AZ_Female_Jennifer": {
        "gender": "Female",
        engine: "ivona",
        params: ['accessKey', 'secretKey'],
        "language": "en-US",
        "ename": "Jennifer",
        "name": "Ivona - en-US - Female - Jennifer"
    },
    "en-US_AZ_Male_Justin": {
        "gender": "Male",
        engine: "ivona",
        params: ['accessKey', 'secretKey'],
        "language": "en-US",
        "ename": "Justin",
        "name": "Ivona - en-US - Male - Justin"
    },
    "en-US_AZ_Female_Kendra": {
        "gender": "Female",
        engine: "ivona",
        params: ['accessKey', 'secretKey'],
        "language": "en-US",
        "ename": "Kendra",
        "name": "Ivona - en-US - Female - Kendra"
    },
    "en-US_AZ_Female_Kimberly": {
        "gender": "Female",
        engine: "ivona",
        params: ['accessKey', 'secretKey'],
        "language": "en-US",
        "ename": "Kimberly",
        "name": "Ivona - en-US - Female - Kimberly"
    }
};

function sayItGetSpeechAmazon(text, language, volume, callback) {


    try {
        ivona.createVoice(text, {
            body: {
                voice: {
                    name: sayitEngines[language].ename,
                    language: sayitEngines[language].language,
                    gender: sayitEngines[language].gender
                }
            }
        }).pipe(libs.fs.createWriteStream(__dirname + '/public/cache/say.mp3')).on('finish', function () {
            if (callback) callback(text, language, volume);
        });
    } catch (e) {
        console.log(e.toString());
        if (callback) callback('$$$ERROR$$$' + text, language, volume);
    }
}

function cacheFile(text, language, volume, seconds, callback) {
    if (text.substring(0, 11) !== '$$$ERROR$$$') {

        var md5filename = './public/cache/' + libs.crypto.createHash('md5').update(language + ';' + text).digest('hex') + '.mp3';

        var stat = libs.fs.statSync(__dirname + '/public/cache/say.mp3');
        if (stat.size < 100) {
            console.log('Received file is too short: ' + libs.fs.readFileSync(__dirname + '/public/cache/say.mp3').toString());
        } else {
            copyFile(text, language, volume, __dirname + '/public/cache/say.mp3', md5filename, callback);
        }
    }
}

function copyFile(text, language, volume, source, dest, callback) {
    try {
        var input = libs.fs.createReadStream(source);               // Input stream
        var output = libs.fs.createWriteStream(dest);                // Output stream

        input.on("data", function (d) {
            output.write(d);
        });

        // Copy in to out
        input.on("error", function (err) {
            throw err;
        });

        // Raise errors
        input.on("end", function () {                               // When input ends
            output.end();                                            // close output
            console.log("Copied file '" + source + "' to '" + dest + "'");
            if (callback) callback(text, language, volume, dest);          // And notify callback
        });
    } catch (e) {
        console.log('Cannot copy file "' + source + '" to "' + dest + '": ' + e);
        if (callback) callback('', '', volume, dest);              // And notify callback
    }
}


var sonos = require('sonos');


var express = require('express');
var app = express();
var mp3Duration = require('mp3-duration');

/*app.get('/', function (req, res) {
 res.send('Hello World!');
 });*/

app.get('/languages', function (req, res) {
    res.send(sayitEngines);
});
app.get('/players', function (req, res) {
    res.send(players);
});

app.get('/say', function (req, res) {
    var text = req.param('text');
    var lang = req.param('language', 'ru-RU_AZ_Female');
    var player = req.param('player', '192.168.1.13');
    var vol = req.param('volume', 50);


    sayItGetSpeechAmazon(text, lang, 23, function (_text, _language, _volume, seconds) {
        cacheFile(_text, _language, _volume, seconds, function (text, language, volume, dest) {
            mp3Duration(dest, function (err, duration) {
                if (err) return console.log(err.message);
                console.log('Your file is ' + duration + ' seconds long');

                var filename = dest.replace(/^.*[\\\/]/, '');
                var mp3 = 'http://192.168.1.25:5005/cache/' + filename;
                var playbar = new sonos.Sonos(player);

                var oldVolume = 33;

                playbar.getVolume(function (err, volume) {
                    oldVolume = volume;
                });

                playbar.setVolume(vol, function (err, data) {
                    setTimeout(function () {
                        playbar.play(mp3, function (err, playing) {
                            setTimeout(function () {
                                playbar.setVolume(oldVolume, function () {
                                    playbar.queueNext(tvChannel, function (err, playing) {
                                    });
                                });
                            }, duration * 1000);
                        });
                    }, 500);
                });
                res.send(mp3);
            });
        });
    });

});

app.use(express.static('public'));

app.listen(5005, function () {
    console.log('Example app listening on port 5005!');
});
