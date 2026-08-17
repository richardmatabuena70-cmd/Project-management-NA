/* ============================================================
   EMPLOYEES
============================================================ */

function employees() {

    return `

        <div class="section-header">

            <div>

                <h3>Employee Records</h3>

            </div>

            <button

                class="btn primary"

                onclick="createEmployee()">

                + Create Employee

            </button>

        </div>


        <div class="panel">

            <div class="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>Employee Number</th>

                            <th>Name</th>

                            <th>Position</th>

                            <th>Department</th>

                            <th>Salary</th>

                            <th>Status</th>

                        </tr>

                    </thead>

                    <tbody>

                        ${data.employees.map(e => `

                            <tr>

                                <td>${escapeHTML(e.employeeNumber)}</td>

                                <td>

                                    ${employeeName(e.id)}

                                </td>

                                <td>

                                    ${positionName(e.position)}

                                </td>

                                <td>

                                    ${departmentName(e.department)}

                                </td>

                                <td>

                                    ₱${Number(

                                        e.salary

                                    ).toLocaleString()}

                                </td>

                                <td>

                                    ${badge(e.status)}

                                </td>

                            </tr>

                        `).join("")}

                    </tbody>

                </table>

            </div>

        </div>

    `;

}


function createEmployee() {

    const accepted =

        data.offers.filter(

            o => o.status === "Accepted"

        );

    if (!accepted.length) {

        toast(

            "No accepted offers available."

        );

        return;

    }


    openModal(

        "Create Employee Record",

        `

        <form id="employeeForm">

            <label>

                Applicant

                <select name="applicantId">

                    ${accepted.map(o => `

                        <option

                            value="${o.applicantId}">

                            ${applicantName(

                                o.applicantId

                            )}

                        </option>

                    `).join("")}

                </select>

            </label>

            <br>

            <label>

                Hire Date

                <input

                    name="hireDate"

                    type="date"

                    required>

            </label>

            <br>

            <button class="btn primary">

                Create Employee

            </button>

        </form>

        `

    );



    document.getElementById(

        "employeeForm"

    ).onsubmit = function(e) {

        e.preventDefault();

        const formToken = this.dataset.token;

        if (!formToken || formToken !== sessionStorage.getItem("hrms_form_token")) {

            toast("Invalid form submission.");

            return;

        }

        const f =

            new FormData(this);

        const hireDateErr = validateRequired(f.get("hireDate"), "Hire date");

        if (hireDateErr) { toast(hireDateErr); return; }

        const applicant =

            data.applicants.find(

                a =>

                    a.id ===

                    f.get("applicantId")

            );

        const offer =

            data.offers.find(

                o =>

                    o.applicantId ===

                    applicant.id

            );

        const vacancy =

            data.vacancies.find(

                v =>

                    v.title ===

                    offer.position

            );


        const employee = {

            id:id("e"),

            employeeNumber:

                "EMP-" +

                String(

                    data.employees.length + 1

                ).padStart(4,"0"),

            firstName:

                applicant.firstName,

            lastName:

                applicant.lastName,

            email:

                applicant.email,

            position:

                vacancy?.position || "p1",

            department:

                vacancy?.department || "d1",

            salary:

                offer.salary,

            hireDate:

                f.get("hireDate"),

            status:"Active"

        };

        ensureAuditFields(employee, currentUser);

        data.employees.push(employee);

        saveData(data);

        closeModal();

        toast(

            "Employee record created."

        );

        render();

    };

}
