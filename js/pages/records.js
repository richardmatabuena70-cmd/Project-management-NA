/* ============================================================
   EMPLOYEE RECORDS
============================================================ */

function records() {

    return `

        <div class="section-header">

            <h3>Employee Records</h3>

            <button

                class="btn primary"

                onclick="addRecord()">

                + Add Record

            </button>

        </div>

        <div class="panel">

            <div class="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>Employee</th>

                            <th>Record</th>

                            <th>Date</th>

                        </tr>

                    </thead>

                    <tbody>

                        ${data.records.map(r => `

                            <tr>

                                <td>

                                    ${employeeName(

                                        r.employeeId

                                    )}

                                </td>

                                <td>

                                    ${escapeHTML(r.title)}

                                </td>

                                <td>${r.date}</td>

                            </tr>

                        `).join("")}

                    </tbody>

                </table>

            </div>

        </div>

    `;

}


function addRecord() {

    openModal(

        "Add Employee Record",

        `

        <form id="recordForm">

            <label>

                Employee

                <select name="employee">

                    ${data.employees.map(e => `

                        <option value="${e.id}">

                            ${employeeName(e.id)}

                        </option>

                    `).join("")}

                </select>

            </label>

            <br>

            <label>

                Record Title

                <input name="title" required>

            </label>

            <br>

            <label>

                Date

                <input name="date" type="date" required>

            </label>

            <br>

            <button class="btn primary">

                Save Record

            </button>

        </form>

        `

    );



    document.getElementById(

        "recordForm"

    ).onsubmit = function(e) {

        e.preventDefault();

        const formToken = this.dataset.token;

        if (!formToken || formToken !== sessionStorage.getItem("hrms_form_token")) {

            toast("Invalid form submission.");

            return;

        }

        const f =

            new FormData(this);

        const titleErr = validateRequired(f.get("title"), "Record title");

        if (titleErr) { toast(titleErr); return; }

        const dateErr = validateRequired(f.get("date"), "Date");

        if (dateErr) { toast(dateErr); return; }

        const record = {

            id:id("r"),

            employeeId:

                f.get("employee"),

            title:

                f.get("title"),

            date:

                f.get("date")

        };

        ensureAuditFields(record, currentUser);

        data.records.push(record);

        saveData(data);

        closeModal();

        render();

    };

}
