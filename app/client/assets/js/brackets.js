/**
 * Represents a template engine that replaces variables in a template string.
 */
export default class BracketTemplateEngine {
  constructor(template) {
    this.template = template;
  }

  parseVariables(variables) {
    return this.template.replace(/\{\{\s*([\w\s]+)\s*\}\}/g, (match, p1) => {
      const variableName = p1.trim();
      if (variables.hasOwnProperty(variableName)) {
        return variables[variableName];
      } else {
        throw new Error(`Variable '${variableName}' not found in the template.`);
      }
    });
  }

  /**
   * Renders the template string by replacing variables.
   * @param {Object} data - An object containing key-value pairs of variable names and their values.
   * @returns {string} The rendered template string.
   * @throws {Error} If a variable in the template is not found in the provided data.
   */
  render(data) {
    try {
      const parsedTemplate = this.parseVariables(data);
      return parsedTemplate;
    } catch (error) {
      throw new Error(`Error rendering template: ${error.message}`);
    }
  }
}

