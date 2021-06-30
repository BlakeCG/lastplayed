const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'history.json'
);

module.exports = class CurrentSong {
    constructor(nowPlaying, date, time) {
        this.nowPlaying = nowPlaying;
        this.date = date;
        this.time = time;
    }

    save() {
        getSongsFromFile(songs => {

            let lastSongInHistory = {};

            lastSongInHistory = songs[songs.length - 1];

            if (lastSongInHistory.nowPlaying !== this.nowPlaying) {
                songs.push(this);
                fs.writeFile(p, JSON.stringify(songs, null, 2), err => {
                    console.log(err);
                });
            }
        });
    }
};

const getSongsFromFile = cb => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    });
};
