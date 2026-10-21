/**
 * Min Table Library - A lightweight table management library
 * Features: Initialize tables, update data, and filter with complex conditions
 */

class HijackTable {
  constructor() {
    this.containerElement = null;
    this.mainElement = null;
    this.bodyElement = null;
    this.activeLayout = null;
    this.activeLayoutKey = null;
    this.resizeHandler = null;
    this.data = [];
    this.columns = [];
    this.filteredData = [];
    this.currentQuery = null;  // Store current query for reapplication
    this.config = {};
  }

  /**
   * Initialize the table with a responsive configuration
   * @param {HTMLElement | string} container - DOM element or selector where the table is rendered
   * @param {Array} data - Array of data objects
   * @param {Object} config - Configuration with layoutBreakPoints, main, dataSelection and responsive
   */
  init(container, data, config = {}) {
    if (typeof container === 'string') {
      this.containerElement = document.querySelector(container);
    } else {
      this.containerElement = container;
    }

    if (!this.containerElement) {
      throw new Error('Container element not found');
    }

    this.data = data || [];
    this.config = config;
    this.columns = config.dataSelection || [];
    this.filteredData = [...this.data];

    if (!this.resizeHandler) {
      this.resizeHandler = () => {
        if (this.resolveLayoutKey() !== this.activeLayoutKey) {
          this.render();
        }
      };
      window.addEventListener('resize', this.resizeHandler);
    }

    this.render();
    return this;
  }

  /**
   * Find the responsive layout that matches the current viewport.
   * Breakpoints are checked in the order they are defined in layoutBreakPoints.
   * If no breakpoint matches, the first defined layout is used.
   * @returns {string | null} Key of the layout in config.responsive
   */
  resolveLayoutKey() {
    const breakPoints = this.config.layoutBreakPoints || {};
    const responsive = this.config.responsive || {};

    for (const key of Object.keys(breakPoints)) {
      if (!responsive[key]) continue;
      // Strip the trailing ";" so the value is a valid media query
      const query = breakPoints[key].replace(/;\s*$/, '').trim();
      if (window.matchMedia(`(${query})`).matches) {
        return key;
      }
    }

    return Object.keys(responsive).find(key => responsive[key]) || null;
  }

  /**
   * Build the table (or card list) for the layout that matches the viewport
   */
  render() {
    this.containerElement.innerHTML = '';
    this.activeLayoutKey = this.resolveLayoutKey();
    const layout = this.activeLayoutKey ? this.config.responsive[this.activeLayoutKey] : null;

    this.mainElement = this.createElementFromConfig(this.config.main, 'div');
    this.containerElement.appendChild(this.mainElement);
    this.bodyElement = null;
    this.activeLayout = layout;

    if (!layout) {
      return this;
    }

    const wrapper = this.createElementFromConfig(layout.wrapper, 'div');
    const head = this.createElementFromConfig(layout.wrapperHead, 'div');
    const body = this.createElementFromConfig(layout.wrapperBody, 'div');

    // Table layouts get their header cells from dataSelection names
    if (layout.type === 'table') {
      const headerRow = document.createElement('tr');
      this.columns.forEach((col) => {
        const th = document.createElement('th');
        th.textContent = col.name || col.id;
        headerRow.appendChild(th);
      });
      head.appendChild(headerRow);
    }

    wrapper.appendChild(head);
    wrapper.appendChild(body);
    this.mainElement.appendChild(wrapper);

    this.bodyElement = body;
    this.renderBody();

    return this;
  }

  /**
   * Create an element from a config object: { element, id, class, style }
   * @param {Object} options - Element configuration
   * @param {string} defaultTag - Tag name used when options.element is not set
   * @returns {HTMLElement}
   */
  createElementFromConfig(options = {}, defaultTag) {
    const element = document.createElement(options.element || defaultTag);
    if (options.id) {
      element.id = options.id;
    }
    if (options.class) {
      element.className = options.class;
    }
    if (options.style) {
      this.applyStyleString(element, options.style);
    }
    return element;
  }

  /**
   * Fill the body with one generated block per filtered row.
   * The layout function runs with `this` set to the row.
   */
  renderBody() {
    if (!this.bodyElement || !this.activeLayout) {
      return this;
    }

    this.bodyElement.innerHTML = '';
    this.filteredData.forEach((row) => {
      this.bodyElement.insertAdjacentHTML('beforeend', this.activeLayout.layout.call(row));
    });

    return this;
  }


  /**
   * Apply CSS style string to element
   * @param {HTMLElement} element - Element to apply styles to
   * @param {string} styleString - CSS style string (e.g., "color: red; font-size: 16px;")
   */
  applyStyleString(element, styleString) {
    const styles = styleString.split(';').filter(s => s.trim());
    styles.forEach(style => {
      const [property, value] = style.split(':').map(s => s.trim());
      if (property && value) {
        // Convert CSS property to camelCase
        const camelCase = property.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        element.style[camelCase] = value;
      }
    });
  }

  /**
   * Update table data without refreshing table structure
   * Only updates tbody rows
   * Reapplies any existing filters or queries to new data
   * @param {Array} newData - New data array
   */
  updateData(newData) {
    this.data = newData || [];
    this.filteredData = [...this.data];

    // Reapply query if one exists
    if (this.currentQuery) {
      let query = this.currentQuery.replace(/^WHERE\s+/i, '').trim();
      this.filteredData = this.data.filter((row) => {
        return this.evaluateQuery(query, row);
      });
    }

    // Rebuild the body rows only; build the whole layout if it does not exist yet
    if (!this.bodyElement) {
      this.render();
      return this;
    }

    this.renderBody();
    return this;
  }

  /**
   * Set filter conditions
   * @deprecated Use setQueryTable() instead for SQL-like filtering
   * @param {Array} filterConditions - Array of filter condition objects
   */
  setFilter(filterConditions) {
    console.warn('setFilter() is deprecated. Use setQueryTable() instead for SQL-like filtering.');
    console.warn('Example: table.setQueryTable("work = \'Engineer\' AND age > 25")');
    return this;
  }

  /**
   * Clear all queries
   */
  clearFilters() {
    this.currentQuery = null;
    this.filteredData = [...this.data];
    this.render();
    return this;
  }

  /**
   * Search across all columns in filtered data (or all data if no query)
   * @param {string} searchTerm - Term to search for
   * @param {Array} searchColumns - Optional array of column IDs to search in (searches all if not specified)
   */
  search(searchTerm, searchColumns = null) {
    if (!searchTerm || searchTerm.trim() === '') {
      // If search term is empty, show filtered data if query exists, otherwise show all data
      if (this.currentQuery) {
        let query = this.currentQuery.replace(/^WHERE\s+/i, '').trim();
        this.filteredData = this.data.filter((row) => {
          return this.evaluateQuery(query, row);
        });
      } else {
        this.filteredData = [...this.data];
      }
      this.render();
      return this;
    }

    const term = String(searchTerm).toLowerCase();

    // If query is applied, search within filtered data; otherwise search in all data
    const dataToSearch = this.currentQuery ? this.filteredData : this.data;

    // Determine which columns to search
    const colsToSearch = searchColumns || this.columns.map(col => col.id);

    this.filteredData = dataToSearch.filter((row) => {
      return colsToSearch.some((colId) => {
        const cellValue = String(row[colId] || '').toLowerCase();
        return cellValue.includes(term);
      });
    });

    this.render();
    return this;
  }

  /**
   * Get filtered data
   */
  getFilteredData() {
    return this.filteredData;
  }

  /**
   * Get all data
   */
  getData() {
    return this.data;
  }

  /**
   * Get table statistics
   */
  getStats() {
    return {
      totalRows: this.data.length,
      filteredRows: this.filteredData.length,
      columns: this.columns.length,
    };
  }

  /**
   * Filter data using SQL-like WHERE clause
   * @param {string} queryString - SQL-like WHERE clause (e.g., "work = 'Engineer' AND age > 25")
   */
  setQueryTable(queryString) {
    if (!queryString || queryString.trim() === '') {
      this.currentQuery = null;  // Clear stored query
      this.filteredData = [...this.data];
      this.render();
      return this;
    }

    // Store the query for reapplication when data updates
    this.currentQuery = queryString;

    // Remove 'WHERE' keyword if present
    let query = queryString.replace(/^WHERE\s+/i, '').trim();

    this.filteredData = this.data.filter((row) => {
      return this.evaluateQuery(query, row);
    });

    this.render();
    return this;
  }

  /**
   * Get data that matches a SQL-like WHERE clause without rendering the table
   * @param {string} queryString - SQL-like WHERE clause (e.g., "work = 'Engineer' AND age > 25")
   * @returns {Array} Array of data objects matching the query
   */
  getQueryData(queryString) {
    if (!queryString || queryString.trim() === '') {
      return [...this.data];
    }

    // Remove 'WHERE' keyword if present
    let query = queryString.replace(/^WHERE\s+/i, '').trim();

    const matchedData = this.data.filter((row) => {
      return this.evaluateQuery(query, row);
    });

    return matchedData;
  }

  /**
   * Parse and evaluate SQL-like query for a single row
   * @param {string} query - Query string to evaluate
   * @param {Object} row - Data row to evaluate against
   */
  evaluateQuery(query, row) {
    try {
      query = query.trim();

      // Handle boolean constants
      if (query === 'true' || query === '___TRUE___') return true;
      if (query === 'false' || query === '___FALSE___') return false;

      // Handle parentheses first (innermost first, replace with true/false)
      while (query.includes('(') && query.includes(')')) {
        const innerMatch = query.match(/\(([^()]*)\)/);
        if (innerMatch) {
          const innerQuery = innerMatch[1];
          const result = this.evaluateQuery(innerQuery, row);
          query = query.substring(0, innerMatch.index) + (result ? '___TRUE___' : '___FALSE___') + query.substring(innerMatch.index + innerMatch[0].length);
        } else {
          break;
        }
      }

      // Handle OR conditions (lower precedence than AND)
      const orMatch = query.match(/\s+OR\s+/i);
      if (orMatch) {
        const orParts = this.splitByOperator(query, /\s+OR\s+/i);
        if (orParts.length > 1) {
          return orParts.some((part) => this.evaluateQuery(part, row));
        }
      }

      // Handle AND conditions (higher precedence than OR)
      const andMatch = query.match(/\s+AND\s+/i);
      if (andMatch) {
        const andParts = this.splitByOperator(query, /\s+AND\s+/i);
        if (andParts.length > 1) {
          return andParts.every((part) => this.evaluateQuery(part, row));
        }
      }

      // Evaluate simple condition
      return this.evaluateCondition(query, row);
    } catch (e) {
      console.error('Query evaluation error:', e, 'query:', query);
      return false;
    }
  }

  /**
   * Split query by operator while respecting parentheses and boolean placeholders
   * @param {string} query - Query string
   * @param {RegExp} operator - Operator regex (OR or AND)
   */
  splitByOperator(query, operator) {
    const parts = [];
    let current = '';
    let parenDepth = 0;
    let i = 0;

    while (i < query.length) {
      const char = query[i];

      if (char === '(') {
        parenDepth++;
        current += char;
        i++;
      } else if (char === ')') {
        parenDepth--;
        current += char;
        i++;
      } else if (parenDepth === 0) {
        // Check for operator at this position
        const remainingQuery = query.substring(i);
        const match = remainingQuery.match(operator);

        if (match && match.index === 0) {
          // Found operator at current position
          if (current.trim()) {
            parts.push(current.trim());
          }
          current = '';
          i += match[0].length;
        } else {
          current += char;
          i++;
        }
      } else {
        current += char;
        i++;
      }
    }

    if (current.trim()) {
      parts.push(current.trim());
    }

    return parts.length > 0 ? parts : [query];
  }

  /**
   * Evaluate a single condition (e.g., "age > 25" or "work = 'Engineer'")
   * @param {string} condition - Condition string
   * @param {Object} row - Data row
   */
  evaluateCondition(condition, row) {
    // Handle special cases
    if (condition === 'true') return true;
    if (condition === 'false') return false;

    // Match various operators
    const operators = ['>=', '<=', '!=', '!==', '===', '==', '=', '>', '<', 'contains', 'in'];

    for (const op of operators) {
      const regex = new RegExp(`^\\s*(\\w+)\\s*${op.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*(.+)$`);
      const match = condition.match(regex);

      if (match) {
        const [, field, value] = match;
        let fieldValue = row[field];
        const compareValue = this.parseValue(value.trim());

        // Convert field value from string to number if needed for numeric operators
        const isNumericComparison = ['>', '<', '>=', '<='].includes(op);
        if (isNumericComparison && typeof fieldValue === 'string' && !isNaN(fieldValue)) {
          fieldValue = Number(fieldValue);
        }

        switch (op) {
          case '=':
          case '==':
          case '===':
            // For equality, try numeric first if both look like numbers, otherwise compare as strings
            if (!isNaN(fieldValue) && !isNaN(compareValue)) {
              return Number(fieldValue) === Number(compareValue);
            }
            return String(fieldValue) === String(compareValue);
          case '!=':
          case '!==':
            // For inequality, try numeric first if both look like numbers, otherwise compare as strings
            if (!isNaN(fieldValue) && !isNaN(compareValue)) {
              return Number(fieldValue) !== Number(compareValue);
            }
            return String(fieldValue) !== String(compareValue);
          case '>':
            return Number(fieldValue) > Number(compareValue);
          case '<':
            return Number(fieldValue) < Number(compareValue);
          case '>=':
            return Number(fieldValue) >= Number(compareValue);
          case '<=':
            return Number(fieldValue) <= Number(compareValue);
          case 'contains':
            return String(fieldValue).toLowerCase().includes(String(compareValue).toLowerCase());
          case 'in':
            const inValues = compareValue.split(',').map(v => v.trim());
            return inValues.includes(String(fieldValue));
          default:
            return false;
        }
      }
    }

    return false;
  }

  /**
   * Parse value from query (handles strings, numbers, etc.)
   * @param {string} value - Value string from query
   */
  parseValue(value) {
    value = value.trim();

    // Remove quotes if present
    if ((value.startsWith("'") && value.endsWith("'")) ||
      (value.startsWith('"') && value.endsWith('"'))) {
      return value.slice(1, -1);
    }

    // Try to parse as number
    if (!isNaN(value) && value !== '') {
      return Number(value);
    }

    return value;
  }
}

