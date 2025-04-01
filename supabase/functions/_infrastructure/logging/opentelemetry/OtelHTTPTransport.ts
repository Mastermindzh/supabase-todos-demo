/**
 * OtelHTTPTransport is a logging transport that sends logs
 * in OpenTelemetry (OTLP) format to a remote HTTP endpoint.
 */
export class OtelHTTPTransport {
  private endpoint: string;
  private serviceName: string;
  private hostname: string;

  /**
   * Creates an instance of OtelHTTPTransport.
   *
   * @param {Object} config - Configuration for the transport.
   * @param {string} config.endpoint - The OTLP HTTP endpoint to send logs to.
   * @param {string} config.serviceName - The name of the emitting service.
   * @param {string} [config.hostname] - Optional hostname; defaults to "unknown-host" if not provided.
   */
  constructor(config: {
    endpoint: string;
    serviceName: string;
    hostname?: string;
  }) {
    this.endpoint = config.endpoint;
    this.serviceName = config.serviceName;
    this.hostname = config.hostname ?? "unknown-host";
  }

  /**
   * Sends a log message to the configured OTLP endpoint.
   *
   * @param {string} level - The severity level of the log (e.g. 'info', 'error').
   * @param {string} message - The main log message.
   * @param {Record<string, unknown>} payload - Additional structured metadata to include in the log as attributes.
   * @returns {Promise<void>} A Promise that resolves when the log is sent or logs a warning on failure.
   */
  async send(
    level: string,
    message: string,
    payload: Record<string, unknown>
  ): Promise<void> {
    const timestamp = Date.now() * 1_000_000;

    const attributes = Object.entries(payload).map(([key, value]) => ({
      key,
      value: { stringValue: String(value) },
    }));

    const body = {
      resourceLogs: [
        {
          resource: {
            attributes: [
              { key: "service.name", value: { stringValue: this.serviceName } },
              { key: "host.name", value: { stringValue: this.hostname } },
            ],
          },
          scopeLogs: [
            {
              logRecords: [
                {
                  timeUnixNano: String(timestamp),
                  severityText: level.toUpperCase(),
                  body: { stringValue: message },
                  attributes,
                },
              ],
            },
          ],
        },
      ],
    };

    try {
      await fetch(this.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.warn("[OtelHTTPTransport] Failed to send log:", errorMessage);
    }
  }
}
