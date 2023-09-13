enum Severity {
    trace,
    debug,
    verbose,
    info,
    warning,
    error,
    critical,
    silent,
}

export class Log {
    static #logLevel: Severity = Severity.debug;

    static critical(message: string, ...args: any[]): void {
        Log.#log(Severity.critical, message, ...args);
    }

    static error(message: string, ...args: any[]): void {
        Log.#log(Severity.error, message, ...args);
    }

    static warn(message: string, ...args: any[]): void {
        Log.#log(Severity.warning, message, ...args);
    }

    static info(message: string, ...args: any[]): void {
        Log.#log(Severity.info, message, ...args);
    }

    static verbose(message: string, ...args: any[]): void {
        Log.#log(Severity.verbose, message, ...args);
    }

    static debug(message: string, ...args: any[]): void {
        Log.#log(Severity.debug, message, ...args);
    }

    static trace(message: string, ...args: any[]): void {
        Log.#log(Severity.trace, message, ...args);
    }

    static #log(severity: Severity, message: string, ...args: any[]): void {
        if (severity >= Log.#logLevel) {
            switch (severity) {
                case Severity.critical: console.error(`[CRIT] ${message}`, ...args); break;
                case Severity.error: console.error(`[ERRO] ${message}`, ...args); break;
                case Severity.warning: console.warn(`[WARN] ${message}`, ...args); break;
                case Severity.info: console.info(`[INFO] ${message}`, ...args); break;
                case Severity.verbose: console.info(`[VERB] ${message}`, ...args); break;
                case Severity.debug: console.debug(`[DBUG] ${message}`, ...args); break;
                case Severity.trace: console.debug(`[TRAC] ${message}`, ...args); break;
            }
        }
    }
}
