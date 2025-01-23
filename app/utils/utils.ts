class JsonFormatter {
  private static readonly INDENT = "  ";

  // Formats the JSON-like data into a human-readable format without JSON braces/commas.
  public static format(data: unknown, depth = 0): string {
    if (data === null) return `${this.INDENT.repeat(depth)}null`;
    if (data === undefined) return `${this.INDENT.repeat(depth)}undefined`;

    const indent = this.INDENT.repeat(depth);

    // Primitive type handling
    switch (typeof data) {
      case "string":
        return `${indent}"${data}"`;
      case "number":
        return `${indent}${data}`;
      case "boolean":
        return `${indent}${data}`;
    }

    // Array handling
    if (Array.isArray(data)) {
      if (data.length === 0) return `${indent}[]`;

      const items = data
        .map((item) => `${this.format(item, depth + 1)}`)
        .join("\n");
      return `\n${items}`;
    }

    // Object handling
    if (typeof data === "object") {
      const entries = Object.entries(data)
        .map(
          ([key, value]) =>
            `${this.INDENT.repeat(depth + 1)}${key}: ${this.format(
              value,
              depth + 1
            )}`
        )
        .join("\n");
      return `\n${entries}`;
    }

    // Fallback for unknown types
    return String(data);
  }

  /**
   * Processes the response and returns a formatted string representation.
   * @param res - Response object
   * @returns Formatted string
   */
  public static processResponse(res: { response: unknown }): string {
    return typeof res.response === "string"
      ? res.response
      : this.format(res.response);
  }
}

export default JsonFormatter;

// Usage example
interface ApiResponse {
  response: string | Record<string, unknown> | unknown[];
}

function handleResponse(res: ApiResponse): string {
  return JsonFormatter.processResponse(res);
}

// Test case
const testResponse: ApiResponse = {
  response: {
    status: "success",
    data: {
      user: {
        id: 1,
        name: "John Doe",
        isActive: true,
        roles: ["admin", "editor"],
      },
      metadata: null,
      count: 42,
    },
  },
};

console.log(handleResponse(testResponse));
