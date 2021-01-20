/*
 * Copyright (C) 2019-2021 Eliastik (eliastiksofts.com)
 *
 * This file is part of "Simple Voice Changer".
 *
 * "Simple Voice Changer" is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * "Simple Voice Changer" is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with "Simple Voice Changer".  If not, see <http://www.gnu.org/licenses/>.
 */
export default class TimerSaveTime {
    constructor(id, idProgress, seconds, incr) {
        this.id = id;
        this.idProgress = idProgress;
        this.seconds = seconds;
        this.initialSeconds = seconds;
        this.interval;
        this.incr = incr;
    }

    start() {
        document.getElementById(this.id).innerHTML = ("0" + Math.trunc(this.seconds / 60)).slice(-2) + ":" + ("0" + Math.trunc(this.seconds % 60)).slice(-2);
        if(this.idProgress != null && document.getElementById(this.idProgress) != null) document.getElementById(idProgress).style.width = "0%";
        this.interval = setInterval(() => this.count(), 1000);
    }

    stop() {
        clearInterval(this.interval);
    }

    count() {
        this.seconds += this.incr;

        if(document.getElementById(this.id) != null) document.getElementById(this.id).innerHTML = ("0" + Math.trunc(this.seconds / 60)).slice(-2) + ":" + ("0" + Math.trunc(this.seconds % 60)).slice(-2);

        if(this.idProgress != null && document.getElementById(this.idProgress) != null) document.getElementById(idProgress).style.width = Math.round((this.initialSeconds - this.seconds) / this.initialSeconds * 100) + "%";

        if(this.seconds <= 0) {
            this.stop();
        }
    }
}