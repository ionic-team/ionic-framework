import { __decorate } from "tslib";
import { Injectable, InjectionToken } from '@angular/core';
let Config = class Config {
    get(key, fallback) {
        const c = getConfig();
        if (c) {
            return c.get(key, fallback);
        }
        return null;
    }
    getBoolean(key, fallback) {
        const c = getConfig();
        if (c) {
            return c.getBoolean(key, fallback);
        }
        return false;
    }
    getNumber(key, fallback) {
        const c = getConfig();
        if (c) {
            return c.getNumber(key, fallback);
        }
        return 0;
    }
};
Config = __decorate([
    Injectable({
        providedIn: 'root',
    })
], Config);
export { Config };
export const ConfigToken = new InjectionToken('USERCONFIG');
const getConfig = () => {
    if (typeof window !== 'undefined') {
        const Ionic = window.Ionic;
        if (Ionic === null || Ionic === void 0 ? void 0 : Ionic.config) {
            return Ionic.config;
        }
    }
    return null;
};
