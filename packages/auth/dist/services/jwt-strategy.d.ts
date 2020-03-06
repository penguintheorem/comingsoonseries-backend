/// <reference types="express-jwt" />
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    static readonly STRATEGY_OPTIONS: {
        secretOrKeyProvider: import("express-jwt").SecretCallback;
        jwtFromRequest: any;
        audience: string;
        issuer: string;
        algorithms: string[];
    };
    constructor();
    validate(payload: any): any;
}
export {};
