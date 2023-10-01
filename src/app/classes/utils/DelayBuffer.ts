/*
 * Copyright (C) 2019-2023 Eliastik (eliastiksofts.com)
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
// Source: https://webaudiotech.com/2016/01/21/should-your-web-audio-app-have-a-limiter/
// Original code: https://webaudiotech.com/sites/limiter_comparison/limiter.js
// Additions by Eliastik (eliastiksofts.com): Stereo and multi-channel support, code simplified in one object class (Limiter)
export default class DelayBuffer {
    private _array: Float32Array = new Float32Array();
    private n: number = 0;
    private length: number = 0;
    private readPointer: number = 0;
    private writePointer: number = 0;

    constructor(n: number) {
        this.n = Math.floor(n);
        this.init();
    }

    init() {
        this._array = new Float32Array(2 * this.n);
        this.length = this._array.length;
        this.readPointer = 0;
        this.writePointer = this.n - 1;

        for(let i = 0; i < this.length; i++) {
            this._array[i] = 0;
        }
    }

    read() {
        const value = this._array[this.readPointer % this.length];
        this.readPointer++;
        return value;
    }

    push(v: number) {
        this._array[this.writePointer % this.length] = v;
        this.writePointer++;
    }

    reset() {
        this.init();
    }
}