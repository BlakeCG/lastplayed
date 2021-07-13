const db = require('../util/database')

const { deleteById } = require('./product');

module.exports = class CurrentSong {
    constructor(nowPlaying, date, time) {
        this.nowPlaying = nowPlaying;
        this.date = date;
        this.time = time;
    }

    save() {
        db.execute('INSERT INTO songhistory (songtitle, date, time) VALUES (?, ?, ?)',
            [this.nowPlaying, this.date, this.time]
        )
            .then((result) => {
                console.log(result);
            })
            .catch((err) => {
                console.log(err);
            });
    }
};
