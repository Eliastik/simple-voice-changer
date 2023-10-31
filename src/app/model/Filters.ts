import Filter from "./Filter";
import { Bassboost } from "./filters/Bassboost";
import { Bitcrusher } from "./filters/Bitcrusher";
import { Echo } from "./filters/Echo";
import { Highpass } from "./filters/Highpass";
import { Limiter } from "./filters/Limiter";
import { Lowpass } from "./filters/Lowpass";
import { ReturnAudio } from "./filters/ReturnAudio";
import { Reverb } from "./filters/Reverb";
import { Soundtouch } from "./filters/Soundtouch";
import { Telephonizer } from "./filters/Telephonizer";
import { Vocoder } from "./filters/Vocoder";

const filters: Filter[] = [
    Soundtouch,
    Bassboost,
    Bitcrusher,
    Echo,
    Highpass,
    Lowpass,
    Reverb,
    Vocoder,
    ReturnAudio,
    Telephonizer,
    Limiter
];

export default filters;