# Getting Started with HijackTable Library

## 📍 Quick Links

- 📖 **[Full API Reference](./API_REFERENCE.md)** - All methods and features
- 🔍 **[Query Examples](./query-examples.html)** - SQL-like WHERE clause examples
- 🎨 **[Search Examples](./search-example.html)** - Search functionality examples
- ⚙️ **[Interactive Demo](./getting-started.html)** - 7 complete examples

---

## 🎯 What You'll Learn

1. How to use the library
2. How to initialize a table
3. How to update data
4. How to filter data with complex conditions
5. How to search across columns
6. How to use SQL-like queries
7. How to customize it

---

## 🔧 Step 1: Basic Setup (2 minutes)

### Create an HTML file:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Table</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        th { background: #007bff; color: white; padding: 10px; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #ddd; }
        th, td { border-right: 1px solid #ddd; }
    </style>
</head>
<body>
    <h1>Employee Directory</h1>
    <div id="table-container"></div>

    <!-- Include the library -->
    <script src="min-table-lib.js"></script>
    
    <!-- Your code -->
    <script>
        // Your code goes here (next step)
    </script>
</body>
</html>
```

---

## 📊 Step 2: Add Your Data (1 minute)

Add this inside the `<script>` tag:

```javascript
// Step 1: Define your data
const employees = [
    { id: 1, name: "Alice Johnson", age: 30, department: "Sales", salary: 50000 },
    { id: 2, name: "Bob Smith", age: 25, department: "IT", salary: 45000 },
    { id: 3, name: "Charlie Brown", age: 30, department: "Sales", salary: 55000 },
    { id: 4, name: "Diana Prince", age: 28, department: "Marketing", salary: 48000 },
    { id: 5, name: "Eve Wilson", age: 32, department: "IT", salary: 60000 }
];

// Step 2: Define columns
const columns = [
    { id: "id", name: "ID" },
    { id: "name", name: "Name" },
    { id: "age", name: "Age" },
    { id: "department", name: "Department" },
    { id: "salary", name: "Salary" }
];

// Step 3: Create and initialize table
const table = new HijackTable();
table.init('#table-container', employees, columns);
```

**Result:** You now have a fully functional table! 🎉

---

## 🔍 Step 3: SQL-like Query Filtering (1 minute)

Use simple SQL-like WHERE clauses to filter data:

```javascript
// Filter IT department employees with salary >= 50000
table.setQuery("department = 'IT' AND salary >= 50000");
```

This is a clean, readable way to filter your data!

### More Query Examples:

**Simple Equality:**
```javascript
table.setQuery("department = 'IT'");
```

**Numeric Comparison:**
```javascript
table.setQuery("age >= 28");
table.setQuery("salary > 50000");
```

**AND Logic (all conditions must match):**
```javascript
table.setQuery("department = 'IT' AND age > 25");
```

**OR Logic (any condition can match):**
```javascript
table.setQuery("department = 'IT' OR department = 'HR'");
```

**Complex with Parentheses:**
```javascript
table.setQuery("department = 'IT' AND (age <= 40 OR salary > 60000)");
```

**Not Equal:**
```javascript
table.setQuery("status != 'inactive'");
```

**Contains (Text Search):**
```javascript
table.setQuery("name contains 'John'");
```

**All Operators:**
- `=`  → Equals
- `!=` → Not equals
- `>`  → Greater than
- `<`  → Less than
- `>=` → Greater or equal
- `<=` → Less or equal
- `contains` → String contains
- `AND` → All conditions true
- `OR`  → Any condition true

---

## 💾 Step 4: Update Data Dynamically (1 minute)

Add this button to your HTML:

```html
<button id="update-btn">Add New Employee</button>

<script>
    // ... your existing code ...

    document.getElementById('update-btn').addEventListener('click', function() {
        const newData = [
            ...employees,
            { id: 6, name: "Frank Miller", age: 35, department: "HR", salary: 52000 }
        ];
        
        table.updateData(newData);
        console.log("Data updated! New total:", table.getData().length, "rows");
    });
</script>
```

---

## 🎨 Step 5: Custom Rendering (Optional)

Format cell content with custom functions:

```javascript
const columns = [
    { id: "id", name: "ID" },
    { id: "name", name: "Name" },
    { id: "age", name: "Age" },
    { 
        id: "department", 
        name: "Department",
        render: (value) => {
            const colors = { "Sales": "blue", "IT": "green", "Marketing": "purple", "HR": "orange" };
            const bgColor = colors[value] || "gray";
            return `<span style="background: ${bgColor}; color: white; padding: 4px 8px; border-radius: 3px;">${value}</span>`;
        }
    },
    { 
        id: "salary", 
        name: "Salary",
        render: (value) => `$${value.toLocaleString()}`
    }
];

table.init('#table-container', employees, columns);
```

---

## 🔍 Step 6: Add Search Functionality (1 minute)

Add real-time search across table columns:

```html
<input type="text" id="search-input" placeholder="Search table...">

<script>
    const searchInput = document.getElementById('search-input');
    
    searchInput.addEventListener('keyup', (e) => {
        table.search(e.target.value);
    });
</script>
```

### Search Examples:

**Search All Columns:**
```javascript
table.search("Engineer");  // Finds "Engineer" anywhere in table
```

**Search Specific Columns:**
```javascript
table.search("Engineer", ["department"]);  // Only search in department
table.search("John", ["name", "department"]);  // Search in multiple columns
```

**Search with Active Filter:**
```javascript
// Apply filter first
table.setQuery("age > 25");

// Then search only finds results in filtered data
table.search("Engineer");  // Only searches engineers with age > 25
```

**Clear Search:**
```javascript
table.search('');  // Clear search, show filtered/all data
```

---

## 📚 Complete Working Example

```html
<!DOCTYPE html>
<html>
<head>
    <title>Min Table - Getting Started</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 900px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        h1 { color: #007bff; }
        .controls { margin: 20px 0; }
        button { padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px; }
        button:hover { background: #0056b3; }
        button.secondary { background: #6c757d; }
        button.secondary:hover { background: #545b62; }
        .stats { background: #f8f9fa; padding: 10px; border-radius: 4px; margin: 10px 0; font-size: 14px; }
        table { border-collapse: collapse; width: 100%; }
        th { background: #007bff; color: white; padding: 12px; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #ddd; }
        th, td { border-right: 1px solid #ddd; }
        tbody tr:hover { background: #f9f9f9; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Min Table Library - Getting Started</h1>
        
        <div class="controls">
            <button onclick="showAll()">Show All</button>
            <button onclick="filterIT()">Filter: IT Department</button>
            <button onclick="filterHighSalary()">Filter: Salary ≥ 50,000</button>
            <button class="secondary" onclick="showStats()">Show Stats</button>
        </div>

        <div id="stats" class="stats">Ready. Click a button to interact with the table.</div>
        
        <div id="table-container"></div>
    </div>

    <script src="min-table-lib.js"></script>
    <script>
        // Data
        const employees = [
            { id: 1, name: "Alice Johnson", age: 30, department: "Sales", salary: 50000 },
            { id: 2, name: "Bob Smith", age: 25, department: "IT", salary: 45000 },
            { id: 3, name: "Charlie Brown", age: 30, department: "Sales", salary: 55000 },
            { id: 4, name: "Diana Prince", age: 28, department: "Marketing", salary: 48000 },
            { id: 5, name: "Eve Wilson", age: 32, department: "IT", salary: 60000 }
        ];

        // Columns with custom rendering
        const columns = [
            { id: "id", name: "ID" },
            { id: "name", name: "Name" },
            { id: "age", name: "Age" },
            { 
                id: "department", 
                name: "Department",
                render: (value) => {
                    const colors = { 
                        "Sales": "#007bff", 
                        "IT": "#28a745", 
                        "Marketing": "#ffc107", 
                        "HR": "#6f42c1" 
                    };
                    return `<span style="background: ${colors[value] || '#999'}; color: white; padding: 4px 8px; border-radius: 3px;">${value}</span>`;
                }
            },
            { 
                id: "salary", 
                name: "Salary",
                render: (value) => `$${value.toLocaleString()}`
            }
        ];

        // Initialize
        const table = new HijackTable();
        table.init('#table-container', employees, columns);

        // Filter functions
        function showAll() {
            table.clearFilters();
            updateStats();
        }

        function filterIT() {
            table.setQuery("department = 'IT'");
            updateStats();
        }

        function filterHighSalary() {
            table.setQuery("salary >= 50000");
            updateStats();
        }

        function showStats() {
            updateStats();
        }

        function updateStats() {
            const stats = table.getStats();
            document.getElementById('stats').textContent = 
                `Total Employees: ${stats.totalRows} | Showing: ${stats.filteredRows} | Columns: ${stats.columns}`;
        }
    </script>
</body>
</html>
```

Copy this into a file named `getting-started.html`, open it in your browser, and click the buttons!

---

## ✅ Next Steps

1. ✅ You've learned the basics
2. 📖 Read [API_REFERENCE.md](./API_REFERENCE.md) for complete API
3. 💻 Check [getting-started.html](./getting-started.html) for 7 interactive examples
4. 🔍 Run [query-examples.html](./query-examples.html) to see setQuery in action
5. 🎨 Check [search-example.html](./search-example.html) for search examples
6. 📚 Read [README.md](./README.md) for complete feature overview

---

## 🚀 You're Ready!

You now know:
- ✓ How to include the library
- ✓ How to initialize a table
- ✓ How to update data dynamically
- ✓ How to filter with setFilter() (complex AND/OR)
- ✓ How to filter with setQuery() (SQL-like)
- ✓ How to search across columns
- ✓ How to render custom content

**Start building!** 🎉

---

## 🔍 Quick Method Reference

### Initialize
```javascript
const table = new HijackTable();
table.init('#container', data, columns, config);
```

### Update Data
```javascript
table.updateData(newData);  // Only updates tbody
```

### SQL-like Query
```javascript
// Clean, readable syntax!
table.setQuery("department = 'IT' AND age >= 25");
table.setQuery("work = 'Engineer' AND (age <= 40 OR sno <= 10)");
```

### Search
```javascript
table.search("Engineer");              // All columns
table.search("Engineer", ["work"]);    // Specific column
```

### Clear
```javascript
table.clearFilters();  // Remove all filters
table.search('');      // Clear search
```

---

## 💡 Common Questions

**Q: Where do I get the library?**
A: It's in the same folder: `min-table-lib.js`

**Q: How do I use it with my framework?**
A: Same way! The library works with any framework (React, Vue, Angular, etc.)

**Q: Can I filter multiple conditions?**
A: Yes! Use `setQuery()` for SQL-like filtering with AND/OR logic.

**Example:**
```javascript
table.setQuery("department = 'IT' AND salary > 50000");
table.setQuery("status = 'active' OR status = 'pending'");
```

**Q: How do I style the table?**
A: Use CSS classes or pass config object with classes and styles.

**Q: What if my data changes?**
A: Use `.updateData()` to refresh the table (only updates tbody).

**Q: Does it support sorting?**
A: Sort your data array before passing it: `data.sort((a, b) => a.age - b.age)`

**Q: Can I search and filter together?**
A: Yes! Apply filter first with setQuery(), then search only searches filtered results.

---

**Need help? Check the other documentation files in this folder!**
