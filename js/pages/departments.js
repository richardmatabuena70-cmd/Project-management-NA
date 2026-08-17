/* ============================================================
   DEPARTMENTS
============================================================ */

function departments() {

    return `

        <div class="section-header">

            <h3>Departments</h3>

            <button

                class="btn primary"

                onclick="addDepartment()">

                + Add Department

            </button>

        </div>

        <div class="job-grid">

            ${data.departments.filter(d => !d.deleted).map(d => `

                <div class="job-card">

                    <h3>${escapeHTML(d.name)}</h3>

                    <p>

                        Hotel & Restaurant

                        organizational department.

                    </p>

                    ${currentUser.role === "HR"
                        ?
                        `<button

                            class="btn danger small"

                            onclick="deleteDepartment('${d.id}')">

                            Delete

                        </button>`
                        :
                        ""
                    }

                </div>

            `).join("")}

        </div>

    `;

}


function addDepartment() {

    openModal(

        "Add Department",

        `

        <form id="departmentForm">

            <label>

                Department Name

                <input name="name" required>

            </label>

            <br>

            <button class="btn primary">

                Add Department

            </button>

        </form>

        `

    );



    document.getElementById(

        "departmentForm"

    ).onsubmit = function(e) {

        e.preventDefault();

        const formToken = this.dataset.token;

        if (!formToken || formToken !== sessionStorage.getItem("hrms_form_token")) {

            toast("Invalid form submission.");

            return;

        }

        const f =

            new FormData(this);

        const nameErr = validateRequired(f.get("name"), "Department name");

        if (nameErr) { toast(nameErr); return; }

        const dept = {

            id:id("d"),

            name:f.get("name"),

            deleted:false

        };

        ensureAuditFields(dept, currentUser);

        data.departments.push(dept);

        saveData(data);

        closeModal();

        render();

    };

}


function deleteDepartment(idValue) {

    const hasVacancies = data.vacancies.some(v => v.department === idValue && !v.deleted);

    const hasPositions = data.positions.some(p => p.department === idValue);

    const hasEmployees = data.employees.some(e => e.department === idValue && !e.deleted);

    let warning = "Delete this department?";

    if (hasVacancies || hasPositions || hasEmployees) {

        warning = "This department is referenced by existing records (vacancies, positions, or employees). Delete anyway?";

    }

    confirmAction(

        warning,

        function() {

            softDelete(data.departments, idValue);

            saveData(data);

            toast("Department deleted.");

            render();

        }

    );

}
