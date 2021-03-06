/*
 * Copyright (C) 2019-2020 Eliastik (eliastiksofts.com)
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
import "../assets/locales/init.js";
import "../assets/locales/data.js";
import "./main.js";
import DelayBuffer from "./DelayBuffer";
import Limiter from "./Limiter";
import Vocoder from "./Vocoder";
import BufferPlayer from "./BufferPlayer";
import TimerSaveTime from "./TimerSaveTime";
import VoiceRecorder from "./VoiceRecorder";

export default { DelayBuffer, Limiter, Vocoder, BufferPlayer, TimerSaveTime, VoiceRecorder };