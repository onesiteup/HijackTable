# setQueryData() Feature Diagram

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│               HijackTable Instance                       │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Original Data Array (this.data)                 │  │
│  │  [                                               │  │
│  │    {sno: 1, age: 25, work: 'Engineer'},         │  │
│  │    {sno: 2, age: 30, work: 'Doctor'},           │  │
│  │    {sno: 3, age: 22, work: 'Student'},          │  │
│  │    ...                                           │  │
│  │  ]                                               │  │
│  └──────────────────────────────────────────────────┘  │
│                          │                               │
│                          │                               │
│  ┌──────────────────────▼──────────────────────────┐  │
│  │  Query Parser & Evaluator                       │  │
│  │  (evaluateQuery method)                         │  │
│  │  - Parses: "work = 'Engineer' AND age > 25"    │  │
│  │  - Supports: AND, OR, (), >, <, =, >=, <=, !=  │  │
│  └──────────────────────┬──────────────────────────┘  │
│                          │                               │
│                ┌─────────┴─────────┐                    │
│                │                   │                    │
│   setQuery()   │          setQueryData()               │
│   ┌────────────▼────────┐ ┌──────────────────┐        │
│   │ Filter & RENDER     │ │ Filter & RETURN  │        │
│   │ Updates Table View  │ │ Returns Array    │        │
│   │                     │ │ No Side Effects  │        │
│   └──────────┬──────────┘ └────────┬─────────┘        │
│              │                     │                   │
│              │                     │                   │
│     ┌────────▼───────┐   ┌────────▼─────────┐        │
│     │ Table Display  │   │ Returned Array   │        │
│     │ Changes        │   │ For Processing   │        │
│     │ (Visible)      │   │ (For Your Code)  │        │
│     └────────────────┘   └──────────────────┘        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Flow Diagram

### Using setQuery() (Affects Display)
```
table.setQuery("work = 'Engineer'")
         │
         ▼
    Filter Data
         │
         ▼
   Update Display ◄─── Table Changes
         │
         ▼
    Store Query ◄─── Used for search/updates
```

### Using setQueryData() (No Side Effects)
```
table.setQueryData("work = 'Engineer'")
         │
         ▼
    Filter Data
         │
         ▼
   Return Array ◄─── You get the data
         │
         ▼
   Your Code Use
   (Export, Stats, API, etc.)
         │
         ▼
   Table UNCHANGED
```

## Method Comparison Matrix

```
┌──────────────────┬────────────┬──────────────────┐
│ Feature          │ setQuery() │ setQueryData()   │
├──────────────────┼────────────┼──────────────────┤
│ Parse Query      │     ✓      │        ✓         │
│ Filter Data      │     ✓      │        ✓         │
│ Update Display   │     ✓      │        ✗         │
│ Render Table     │     ✓      │        ✗         │
│ Store Query      │     ✓      │        ✗         │
│ Return Data      │     ✗      │        ✓         │
│ Effect on Search │     ✓      │        ✗         │
│ Effect on State  │     ✓      │        ✗         │
└──────────────────┴────────────┴──────────────────┘
```

## Data Flow Example

### Scenario: Get Engineers Over 25

```
Input: "work = 'Engineer' AND age > 25"
│
├─ Step 1: Parse Query
│  └─ Identify: work = 'Engineer', age > 25, AND operator
│
├─ Step 2: For Each Row in Data:
│  ├─ Row 1: {sno:1, age:25, work:'Engineer'}
│  │         work='Engineer'✓ AND age>25✗ → SKIP
│  │
│  ├─ Row 2: {sno:2, age:30, work:'Doctor'}
│  │         work='Engineer'✗ → SKIP
│  │
│  ├─ Row 3: {sno:6, age:28, work:'Engineer'}
│  │         work='Engineer'✓ AND age>25✓ → INCLUDE ✓
│  │
│  └─ Row 4: {sno:9, age:29, work:'Engineer'}
│            work='Engineer'✓ AND age>25✓ → INCLUDE ✓
│
└─ Step 3: Return Matched Rows
   [
     {sno:6, age:28, work:'Engineer'},
     {sno:9, age:29, work:'Engineer'}
   ]
```

## Query Evaluation Tree

```
Query: "(work = 'Engineer' OR work = 'Doctor') AND age >= 25"

                            AND
                           /   \
                          /     \
                         OR      >=
                        / \      / \
                       =   =   age  25
                      / \ / \
                    work Engine Doctor
                   (field) (values)
```

## Integration Points

```
┌─────────────┐
│  Your Code  │
│   (script.js)
└──────┬──────┘
       │
       │ table.setQueryData("...")
       │
       ▼
┌─────────────────────────────────────┐
│      HijackTable Class              │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  setQueryData() Method      │   │
│  │  - Takes query string       │   │
│  │  - Calls evaluateQuery()    │   │
│  │  - Returns filtered array   │   │
│  │  - No side effects          │   │
│  └────────────┬────────────────┘   │
│               │                     │
│  ┌────────────▼────────────────┐   │
│  │  evaluateQuery() Method     │   │
│  │  - Parses conditions        │   │
│  │  - Evaluates AND/OR logic   │   │
│  │  - Handles parentheses      │   │
│  │  - Compares values          │   │
│  └──────────────────────────────┘   │
│                                     │
└──────────────┬──────────────────────┘
               │
               │ Returns: Array
               │
               ▼
        ┌─────────────────┐
        │  Result Array   │
        │  [{...}, {...}] │
        │  (Matched Data) │
        └─────────────────┘
               │
               │
               ▼
        ┌──────────────────────┐
        │ Your Code Uses Data: │
        │ - Export to CSV      │
        │ - Calculate stats    │
        │ - Send to API        │
        │ - Display count      │
        │ - Filter further     │
        └──────────────────────┘
```

## Query Processing Steps

```
1. Input Validation
   "work = 'Engineer' AND age > 25"
           │
           ▼ Check if empty/null
           │
           ├─ Yes ─→ Return [...this.data]
           └─ No ──→ Continue

2. Cleanup
   "work = 'Engineer' AND age > 25"
           │
           ▼ Remove optional WHERE keyword
           │
   "work = 'Engineer' AND age > 25"

3. Filtering
   this.data.filter(row => 
     evaluateQuery(query, row)
   )
           │
           ▼ For each row:
           │ - Parse conditions
           │ - Evaluate against row data
           │ - Return true/false

4. Return
   [
     {sno:6, age:28, work:'Engineer'},
     {sno:9, age:29, work:'Engineer'}
   ]
```

## Use Case Scenarios

```
Scenario 1: Data Export
┌─────────────────┐
│ Get Engineers   │  table.setQueryData("work='Engineer'")
└────────┬────────┘
         │
         ▼
    [5 Engineers]
         │
         ▼
    Convert to CSV
         │
         ▼
    Download File

Scenario 2: Statistics
┌──────────────────────┐
│ Get Young Workers    │  table.setQueryData("age<30")
└────────┬─────────────┘
         │
         ▼
    [12 Young Workers]
         │
         ▼
    Calculate Avg Age
         │
         ▼
    Display Result

Scenario 3: API Call
┌────────────────────────┐
│ Get Senior Managers    │  table.setQueryData("work='Manager' AND age>=40")
└────────┬───────────────┘
         │
         ▼
    [3 Senior Managers]
         │
         ▼
    POST /api/report
         │
         ▼
    Backend processes
```

---

This diagram shows how `setQueryData()` provides a clean, non-invasive way to get filtered data without affecting your table display.
