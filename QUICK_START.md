# setQueryData() Quick Start Guide

## What It Does
Retrieves filtered data from your table based on query conditions - **without** changing the table display.

## One-Liner Example
```javascript
const engineers = table.setQueryData("work = 'Engineer'");
```

## Common Patterns

### Get all records matching a condition
```javascript
const doctors = table.setQueryData("work = 'Doctor'");
const adults = table.setQueryData("age > 25");
```

### Multiple conditions (AND)
```javascript
const youngEngineers = table.setQueryData("work = 'Engineer' AND age <= 30");
```

### Multiple options (OR)
```javascript
const medical = table.setQueryData("work = 'Doctor' OR work = 'Nurse'");
```

### Complex conditions
```javascript
const result = table.setQueryData("(work = 'Engineer' OR work = 'Doctor') AND age >= 25");
```

### Get all data
```javascript
const allData = table.setQueryData("");
```

## Available Operators
| Operator | Example | Meaning |
|----------|---------|---------|
| `=` | `age = 25` | Equals |
| `>` | `age > 25` | Greater than |
| `<` | `age < 30` | Less than |
| `>=` | `age >= 25` | Greater or equal |
| `<=` | `age <= 30` | Less or equal |
| `!=` | `work != 'Student'` | Not equal |
| `AND` | `work = 'Engineer' AND age > 25` | Both true |
| `OR` | `work = 'Engineer' OR work = 'Doctor'` | Either true |

## Complete Working Example

```javascript
// In your script.js
function updateFilter() {
    // 1. Show filter on table
    table.setQuery("work = 'Engineer' AND (age <= 40 OR sno <= 10)");
    
    // 2. Get filtered data for use
    var result = table.setQueryData("work = 'Engineer' AND (age <= 40 OR sno <= 10)");
    
    // 3. Use the result
    console.log(`Found ${result.length} engineers`);
    
    // Can export, calculate stats, send to API, etc.
    return result;
}
```

## Key Differences from setQuery()

| | setQuery() | setQueryData() |
|---|-----------|----------------|
| Displays filter on table | ✅ Yes | ❌ No |
| Returns data | ❌ No | ✅ Yes |
| You get | Nothing | Array of matched records |

## Real-World Usage

### Export Filtered Data
```javascript
function exportEngineers() {
    const engineers = table.setQueryData("work = 'Engineer'");
    exportToCSV(engineers, 'engineers.csv');
}
```

### Calculate Statistics
```javascript
function getAverageAge(jobTitle) {
    const data = table.setQueryData(`work = '${jobTitle}'`);
    const avg = data.reduce((sum, r) => sum + r.age, 0) / data.length;
    return avg;
}
```

### Count Records
```javascript
function countByWork(jobTitle) {
    return table.setQueryData(`work = '${jobTitle}'`).length;
}
```

### Multi-Level Filtering
```javascript
function getEmployees(work, minAge, maxAge) {
    return table.setQueryData(
        `work = '${work}' AND age >= ${minAge} AND age <= ${maxAge}`
    );
}
```

## String Format Rules
- **String values** must use single quotes: `work = 'Engineer'`
- **Numbers** no quotes: `age = 25` or `age > 30`
- **Operators** are case-insensitive: `AND`, `and`, `And` all work
- **WHERE keyword** is optional

## Examples of Each Operator

### Equals
```javascript
table.setQueryData("work = 'Engineer'");
table.setQueryData("age = 25");
```

### Comparison
```javascript
table.setQueryData("age > 25");        // Greater than
table.setQueryData("age < 30");        // Less than
table.setQueryData("age >= 25");       // Greater or equal
table.setQueryData("age <= 30");       // Less or equal
table.setQueryData("age != 25");       // Not equal
```

### Logical
```javascript
table.setQueryData("work = 'Engineer' AND age > 25");  // Both
table.setQueryData("work = 'Engineer' OR work = 'Doctor'"); // Either
table.setQueryData("(work = 'Engineer' OR work = 'Doctor') AND age >= 25"); // Complex
```

## Return Value
Always returns an **Array** of objects that matched.

```javascript
const result = table.setQueryData("work = 'Engineer'");
console.log(result);        // Array
console.log(result.length); // Count of matches
console.log(result[0]);     // First match (if exists)
```

## Handling Empty Results
```javascript
const result = table.setQueryData("work = 'Astronaut'");
if (result.length === 0) {
    console.log('No matches found');
} else {
    console.log(`Found ${result.length} records`);
}
```

## Quick Testing
1. Open `test-setQueryData.html` in a browser
2. Click each test button to see it in action
3. Check browser console for detailed output

---
**That's it!** You're ready to use `setQueryData()` to get filtered data without affecting your table display.
