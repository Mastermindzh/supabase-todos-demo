import { WinstonLogLevel } from "../Logger.ts";

/**
 * Represents the OpenTelemetry severity metadata for a log level.
 * - `severityNumber` is a numeric code aligned with the OpenTelemetry Log Data Model.
 * - `severityText` is a string representation of the severity.
 */
type OtelLogLevel = {
  severityNumber: number;
  severityText: string;
};

/**
 * Maps Winston log levels to their corresponding OpenTelemetry severity numbers and text values.
 *
 * This ensures consistent translation between Winston's logging system and OpenTelemetry's structured log format.
 */
const WinstonToOtelLogLevel: Record<WinstonLogLevel, OtelLogLevel> = {
  error: { severityNumber: 17, severityText: "ERROR" },
  warn: { severityNumber: 13, severityText: "WARN" },
  info: { severityNumber: 9, severityText: "INFO" },
  http: { severityNumber: 9, severityText: "INFO" },
  verbose: { severityNumber: 5, severityText: "DEBUG" },
  debug: { severityNumber: 5, severityText: "DEBUG" },
  silly: { severityNumber: 1, severityText: "TRACE" },
};

/**
 * Returns the corresponding OpenTelemetry log level metadata for a given Winston log level.
 *
 * @param level - The Winston log level to convert.
 * @returns An object containing the OpenTelemetry `severityNumber` and `severityText`.
 */
export function getOtelLogLevel(level: WinstonLogLevel): OtelLogLevel {
  return WinstonToOtelLogLevel[level];
}
