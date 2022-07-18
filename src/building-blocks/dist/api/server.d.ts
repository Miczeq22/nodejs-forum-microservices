import express from 'express';
import { Controller } from './controller';
interface Dependencies {
    controllers: Controller[];
}
export declare class Server {
    private readonly dependencies;
    private app;
    constructor(dependencies: Dependencies);
    getApp(): express.Application;
}
export {};
