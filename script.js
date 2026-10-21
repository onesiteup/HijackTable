

const table = new HijackTable();
const table2 = new HijackTable();


function setMyTable() {
    const config = {
        layoutBreakPoints: {
            mobile: "max-width: 768px;",
            // tablet: "min-width: 769px; max-width: 1024px;",
            desktop: "min-width: 769px;"
        },
        main: {
            element: "div",
            class: "responsive",
            style: "max-height: calc(100vh - 175px); overflow-y: auto;"
        },

        // Shared data fields
        dataSelection: [
            { id: "sno", name: "S No" },
            { id: "age", name: "Age" },
            { id: "height", name: "Height" },
            { id: "work", name: "Work" }
        ],

        // Define layouts only for devices you need
        responsive: {
            desktop: {
                type :"table",
                wrapper: {
                    element: "table",
                    class: "table table-bordered",
                    style: "width: 100%;"
                },

                wrapperHead: {
                    element: "thead",
                    class: "sticky-top",
                    style: "background: white;"
                },

                wrapperBody: {
                    element: "tbody",
                    class: ""
                },

                layout: function () {
                    const badge = this.age <= 40
                        ? '<span class="badge bg-success">Young</span>'
                        : '<span class="badge bg-danger">Old</span>';

                    return `
                        <tr>
                            <td>${this.sno}</td>
                            <td>${this.age} ${badge}</td>
                            <td>${this.height}</td>
                            <td>${this.work}</td>
                        </tr>
                    `;
                }
            },

            mobile: {
                type :"card",
                wrapper: {
                    element: "div",
                    class: "mobile-list",
                    style: "display: grid; gap: 10px;"
                },

                wrapperHead: {
                    element: "div",
                    class: "d-none",
                    style: ""
                },

                wrapperBody: {
                    element: "ul",
                    class: "mobile-list-body",
                    style: ""
                },

                layout: function () {
                    return `
                        <li class="card mb-2">
                            <div class="card-body">
                                <div>
                                    <strong>${this.sno}.</strong>
                                    ${this.work}
                                </div>
                                <div>Age: ${this.age}</div>
                                <div>Height: ${this.height}</div>
                            </div>
                        </li>
                    `;
                }
            }
        }
    };
    table.init('#table-12', [], config);
}






// Initialize
setMyTable();



function updateData() {
    // 100 + Entry Add
    const newData = [
        { sno: 1, age: 25, height: 175, work: "Engineer" },
        { sno: 1.1, age: "25", height: 175, work: "Engineer" },
        { sno: 2, age: 30, height: 180, work: "Doctor" },
        { sno: 3, age: 22, height: 165, work: "Student" },
        { sno: 4, age: 28, height: 170, work: "Teacher" },
        { sno: 5, age: 35, height: 178, work: "Lawyer" }
    ];

    for (let i = 6; i <= 100; i++) {
        newData.push({ sno: i, age: 20 + (i % 30), height: 160 + (i % 20), work: "Worker" });
    }
    
    table.updateData(newData);
}


function updateFilter() {
    table.setQueryTable("work = 'Engineer' AND  (age <= 40  Or sno <= 10)");
    var result = table.getQueryData("work = 'Engineer' AND  (age <= 40  Or sno <= 10)");
    console.log(result);
}


// Search functionality
// If filter input exists, add event listener for real-time search
const filterInput = document.getElementById('filter-input');
if (filterInput) {
    filterInput.addEventListener('keyup', function(e) {
        const searchTerm = e.target.value;
        // Search in filtered data if filter exists, otherwise search all data
        table.search(searchTerm);
    });
}

function clearFilter() {
    table.clearFilters();
}

function resetTable() {
    setMyTable();
}