/**
 * index
 */

"use strict";


/* Node modules */
import {EventEmitter} from "events";
import * as https from "https";


/* Third-party modules */
import * as expressLib from "express";
import * as _ from "lodash";
import {Promise} from "es6-promise";
import {IServerStrategy} from "steeplejack/interfaces/serverStrategy";


/* Files */
import {IExpressOpts} from "./interfaces/expressOpts";


/* Expose express */
export { expressLib };


export class Express extends EventEmitter implements IServerStrategy {


    /**
     * Inst
     *
     * The instance of the Express application
     *
     * @type {any}
     * @private
     */
    protected _inst: any = null;


    /**
     * Listener
     *
     * This is the result of what is returned
     * from the listen method, so we can close
     * the server receiving connections if we
     * want to.
     *
     * @type {any}
     * @private
     */
    private _listener: any = null;


    public constructor (protected _opts: IExpressOpts = {}) {

        super();

        this._inst = expressLib();

    }


    /**
     * Add Routes
     *
     * Adds a new route to the
     *
     * @param httpMethod
     * @param route
     * @param iterator
     */
    public addRoute (httpMethod: string, route: string, iterator: (request: any, response: any) => any) {

        /* Express requires in lower case */
        const method = httpMethod.toLowerCase();

        this.getServer()[method](route, (req, res, next) => {

            return iterator(req, res)
                .catch(err => {
                    next(err);
                    throw err;
                });

        });

    }


    /**
     * Close
     *
     * Stops the server from receiving any
     * more connections.
     *
     * @returns {Express}
     */
    public close () {
        this._listener.close();

        return this;
    }


    /**
     * Get Raw Server
     *
     * Same as getServer
     */
    public getRawServer () {
        return this.getServer();
    }


    /**
     * Get Server
     *
     * Gets the instance of the express server
     *
     * @returns {Object}
     */
    public getServer () {
        return this._inst;
    }


    /**
     * Output Handler
     *
     * This handles the output. This can be activated
     * directly or bundled up in to a closure and passed
     * around.
     *
     * @param {Number} statusCode
     * @param {*} output
     * @param {*} request
     * @param {*} response
     * @returns {any}
     */
    public outputHandler (statusCode: Number, output: any, request: any, response: any) {

        if (response.headersSent === false) {

            /* Set the status */
            response.status(statusCode);

            try {

                /* Look for rendered output - first, see if status code is changed */
                const renderStatusCode = output.getStatusCode();
                if (renderStatusCode !== null) {
                    response.status(renderStatusCode);
                }

                /* Set any headers */
                response.set(output.getHeaders());

                /* Do the output */
                const format = {
                    html: () => response.render(output.getRenderTemplate(), output.getRenderData()),
                    json: () => response.json(output.getRenderData())
                };

                return response.format(format);

            } catch (err) {

                /* Just send output as is */
                return response.send(output);

            }

        }

    }


    /**
     * Set
     *
     * Wraps the express set method
     *
     * @param {*[]} args
     * @returns {Express}
     */
    public set (...args: any[]) {
        this.getServer()
            .set(...args);
        return this;
    }


    /**
     * Start
     *
     * Starts the Express server. Wraps the
     * NodeJS HTTP.listen method. If there are
     * any SSL options set, it uses the HTTPS
     * library instead of the HTTP one.
     *
     * @param {number} port
     * @param {string} hostname
     * @param {number} backlog
     * @returns {Promise<T>|Promise}
     */
    public start (port: number, hostname: string, backlog: number) {

        return new Promise((resolve: Function, reject: Function) => {

            let factory;

            if (_.isEmpty(this._opts.ssl)) {
                factory = this.getServer();
            } else {
                factory = https.createServer(this._opts.ssl, this.getServer());
            }

            this._listener = factory.listen(port, hostname, backlog, (err: any, result: any) => {

                if (err) {
                    reject(err);
                    return;
                }

                resolve(result);

            });

        });

    }


    /**
     * Uncaught Exception
     *
     * Listens for an uncaught exception.
     * Uncaught exceptions in Express need
     * to receive 4 arguments, even though
     * you might not need all of them.
     *
     * We're calling our received function
     * like this to decouple the Steeplejack
     * requirement from the Express logic.
     * This means that a Steeplejack application
     * doesn't need to remember to call their
     * uncaughtException method with four
     * arguments.
     *
     * Notice that the order in the use function
     * is different to the function that is
     * invoked (Express returns err first,
     * Steeplejack requires err to be third).
     *
     * @param {function} fn
     * @returns {Express}
     */
    public uncaughtException (fn: Function) {
        return this.use((err, req, res, next) => fn(req, res, err, next));
    }


    /**
     * Use
     *
     * Exposes the use method. This is to
     * add middleware function to the stack
     *
     * @param {*[]} args
     * @returns {Express}
     */
    public use (...args: any[]) {

        this.getServer()
            .use(...args);

        return this;

    }


}
