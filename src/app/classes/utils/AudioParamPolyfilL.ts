export default class AudioParamPolyfill implements AudioParam {
    private _value: number = 0;
    private _minValue: number = 0;
    private _maxValue: number = 1;
    private _defaultValue: number = 0;
    private context: BaseAudioContext | null = null;
    automationRate: AutomationRate = "a-rate";

    constructor(context: BaseAudioContext, defaultValue?: number) {
        this._defaultValue = defaultValue !== undefined ? defaultValue : 0;
        this._value = this._defaultValue;
        this.context = context;
    }

    get value(): number {
        return this._value;
    }

    set value(newValue: number) {
        this._value = Math.max(this._minValue, Math.min(this._maxValue, newValue));
    }

    get minValue(): number {
        return this._minValue;
    }

    get maxValue(): number {
        return this._maxValue;
    }

    get defaultValue(): number {
        return this._defaultValue;
    }

    setValueAtTime(value: number, startTime: number): AudioParam {
        console.warn("setValueAtTime used with AudioParamPolyfill, is not fully compatible with standard AudioParam");
        this.value = value;
        return new AudioParamPolyfill(this.context!, value);
    }

    linearRampToValueAtTime(value: number, endTime: number): AudioParam {
        console.warn("linearRampToValueAtTime used with AudioParamPolyfill, is not fully compatible with standard AudioParam");
        this.value = value;
        return new AudioParamPolyfill(this.context!, value);
    }

    exponentialRampToValueAtTime(value: number, endTime: number): AudioParam {
        console.warn("exponentialRampToValueAtTime used with AudioParamPolyfill, is not fully compatible with standard AudioParam");
        this.value = value;
        return new AudioParamPolyfill(this.context!, value);
    }

    cancelAndHoldAtTime(cancelTime: number): AudioParam {
        throw new Error("Method not implemented.");
    }

    cancelScheduledValues(cancelTime: number): AudioParam {
        throw new Error("Method not implemented.");
    }

    setTargetAtTime(target: number, startTime: number, timeConstant: number): AudioParam {
        throw new Error("Method not implemented.");
    }

    setValueCurveAtTime(values: unknown, startTime: unknown, duration: unknown): AudioParam {
        throw new Error("Method not implemented.");
    }
}
