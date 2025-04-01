import { context, trace } from "../../deps.ts";
import { OtelHTTPTransport } from "./opentelemetry/OtelHTTPTransport.ts";

/**
 * Represents additional structured metadata for logs.
 */
interface LogDetails {
  [key: string]: unknown;
}

/**
 * Defines log levels and their numeric severity.
 * Modelled after winston
 */
export const LogLevels: Record<string, number> = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

/**
 * Logger is a singleton class that supports structured logging
 * with log levels, OpenTelemetry trace context, and optional OTLP transport.
 */
export class Logger {
  private static instance: Logger;
  private meta: LogDetails;
  private requestId?: string;
  private otlpTransport?: OtelHTTPTransport;
  private currentLevel: number;
  private otelEnabled: boolean;

  /**
   * Private constructor to enforce singleton pattern.
   * Initializes logger configuration from environment variables.
   */
  private constructor() {
    const hostname = Deno.hostname();
    const env = Deno.env.get("ENV") ?? "unknown";
    const configuredLevel = Deno.env.get("LOG_LEVEL") ?? "info";
    const otlpEndpoint = Deno.env.get("OTEL_ENDPOINT") ?? "";
    const otelEnabled = Deno.env.get("OTEL_ENABLED") === "true";
    const serviceName = "Business integration platform";

    this.currentLevel = LogLevels[configuredLevel] ?? LogLevels["info"];
    this.otelEnabled = otelEnabled;

    this.meta = {
      env,
      hostname,
      service: serviceName,
    };

    if (otelEnabled && otlpEndpoint) {
      this.otlpTransport = new OtelHTTPTransport({
        endpoint: otlpEndpoint,
        serviceName,
        hostname,
      });
    }
  }

  /**
   * Returns the singleton instance of the logger.
   *
   * @returns {Logger} The logger instance.
   */
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Sets a request ID for the current log context.
   *
   * @param {string} requestId - A unique request identifier.
   */
  static setRequestId(requestId: string) {
    Logger.getInstance().requestId = requestId;
  }

  /**
   * Determines whether the given log level should be logged.
   *
   * @param {string} level - The log level to check.
   * @returns {boolean} True if the level is within the configured threshold.
   */
  private shouldLog(level: string): boolean {
    const levelNum = LogLevels[level];
    return levelNum !== undefined && levelNum <= this.currentLevel;
  }

  /**
   * Internal method that formats, prints, and optionally transmits logs.
   *
   * @param {string} level - The severity level of the log.
   * @param {string} message - The main log message.
   * @param {LogDetails} [details] - Optional additional metadata.
   */
  private write(level: string, message: string, details?: LogDetails) {
    if (!this.shouldLog(level)) return;

    const span = trace.getSpan(context.active());
    const traceCtx = span?.spanContext();

    const payload: Record<string, unknown> = {
      ...this.meta,
      ...(traceCtx
        ? { traceId: traceCtx.traceId, spanId: traceCtx.spanId }
        : {}),
      ...(this.requestId ? { requestId: this.requestId } : {}),
      ...(details ? { details } : {}),
    };

    const output = JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        level,
        message,
        ...payload,
      },
      null,
      2
    );

    if (level === "error") {
      console.error(output);
    } else if (level === "warn") {
      console.warn(output);
    } else if (level === "debug") {
      console.debug(output);
    } else {
      console.log(output);
    }

    if (this.otelEnabled) {
      this.otlpTransport?.send(level, message, payload);
    }
  }

  /**
   * Logs a message at the "info" level.
   *
   * @param {string} message - The log message.
   * @param {LogDetails} [details] - Optional metadata.
   */
  static log(message: string, details?: LogDetails) {
    Logger.getInstance().write("info", message, details);
  }

  /**
   * Logs a message at the "error" level.
   *
   * @param {string} message - The error message.
   * @param {LogDetails} [details] - Optional metadata.
   */
  static error(message: string, details?: LogDetails) {
    Logger.getInstance().write("error", message, details);
  }

  /**
   * Logs a message at the "warn" level.
   *
   * @param {string} message - The warning message.
   * @param {LogDetails} [details] - Optional metadata.
   */
  static warn(message: string, details?: LogDetails) {
    Logger.getInstance().write("warn", message, details);
  }

  /**
   * Logs a message at the "info" level.
   *
   * @param {string} message - The informational message.
   * @param {LogDetails} [details] - Optional metadata.
   */
  static info(message: string, details?: LogDetails) {
    Logger.getInstance().write("info", message, details);
  }

  /**
   * Logs a message at the "http" level.
   *
   * @param {string} message - The HTTP log message.
   * @param {LogDetails} [details] - Optional metadata.
   */
  static http(message: string, details?: LogDetails) {
    Logger.getInstance().write("http", message, details);
  }

  /**
   * Logs a message at the "verbose" level.
   *
   * @param {string} message - The verbose log message.
   * @param {LogDetails} [details] - Optional metadata.
   */
  static verbose(message: string, details?: LogDetails) {
    Logger.getInstance().write("verbose", message, details);
  }

  /**
   * Logs a message at the "debug" level.
   *
   * @param {string} message - The debug message.
   * @param {LogDetails} [details] - Optional metadata.
   */
  static debug(message: string, details?: LogDetails) {
    Logger.getInstance().write("debug", message, details);
  }

  /**
   * Logs a message at the "silly" level.
   *
   * @param {string} message - The silly/debug-level message.
   * @param {LogDetails} [details] - Optional metadata.
   */
  static silly(message: string, details?: LogDetails) {
    Logger.getInstance().write("silly", message, details);
  }
}
