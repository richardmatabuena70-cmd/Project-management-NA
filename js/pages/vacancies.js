/* ============================================================
   VACANCIES
============================================================ */

function vacancies() {

    return `

        <div class="section-header">

            <div>

                <h3>Job Vacancy Management</h3>

            </div>

            ${currentUser.role === "HR"
                ?
                `<button

                    class="btn primary"

                    onclick="addVacancy()">

                    + Create Vacancy

                </button>`
                :
                ""
            }

        </div>


        <div class="job-grid">

            ${data.vacancies.filter(v => !v.deleted).map(v => `

                <div class="job-card">

                    <h3>

                        ${escapeHTML(v.title)}

                    </h3>

                    <p>

                        ${departmentName(v.department)}

                    </p>

                    <p>

                        ${escapeHTML(v.description)}

                    </p>

                    <p>

                        <b>Salary:</b>

                        ₱${Number(v.salary).toLocaleString()}

                    </p>

                    <p>

                        <b>Deadline:</b>

                        ${v.deadline}

                    </p>

                    <span class="badge blue">Open Job</span>

                    <br><br>

                    <button

                        class="btn light small"

                        onclick="viewVacancy('${v.id}')">

                        View

                    </button>

                    ${currentUser.role === "HR"
                        ?
                        `<button

                            class="btn danger small"

                            onclick="deleteVacancy('${v.id}')">

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


function addVacancy() {

    openModal(

        "Create Job Vacancy",

        `

        <form id="vacancyForm">

            <div class="form-grid">

                <label>

                    Job Title

                    <input name="title" required>

                </label>

                <label>

                    Department

                    <select name="department" required>

                        ${data.departments.map(d => `

                            <option value="${d.id}">

                                ${escapeHTML(d.name)}

                            </option>

                        `).join("")}

                    </select>

                </label>

                <label>

                    Salary

                    <input name="salary" type="number" required>

                </label>

                <label>

                    Employment Type

                    <select name="type">

                        <option>Full-Time</option>

                        <option>Part-Time</option>

                        <option>Contractual</option>

                    </select>

                </label>

                <label>

                    Application Deadline

                    <input name="deadline" type="date" required>

                </label>

                <label class="full-width">

                    Job Description

                    <textarea name="description" rows="4"></textarea>

                </label>

            </div>

            <div class="form-actions">

                <button

                    type="button"

                    class="btn light"

                    onclick="closeModal()">

                    Cancel

                </button>

                <button

                    class="btn primary">

                    Publish Vacancy

                </button>

            </div>

        </form>

        `

    );



    document.getElementById(

        "vacancyForm"

    ).onsubmit = function(e) {

        e.preventDefault();

        const formToken = this.dataset.token;

        if (!formToken || formToken !== sessionStorage.getItem("hrms_form_token")) {

            toast("Invalid form submission.");

            return;

        }

        const form =

            new FormData(this);

        const titleErr = validateRequired(form.get("title"), "Job title");

        if (titleErr) { toast(titleErr); return; }

        const salaryErr = validateRequired(form.get("salary"), "Salary");

        if (salaryErr) { toast(salaryErr); return; }

        const deadlineErr = validateRequired(form.get("deadline"), "Deadline");

        if (deadlineErr) { toast(deadlineErr); return; }

        const vacancy = {

            id:id("v"),

            title:form.get("title"),

            department:form.get("department"),

            salary:form.get("salary"),

            type:form.get("type"),

            deadline:form.get("deadline"),

            description:form.get("description"),

            status:"Open",

            deleted:false

        };

        ensureAuditFields(vacancy, currentUser);

        data.vacancies.push(vacancy);

        saveData(data);

        closeModal();

        toast("Job vacancy created.");

        render();

    };

}


function viewVacancy(vacancyId) {

    const v =

        data.vacancies.find(

            x => x.id === vacancyId

        );

    if (!v) return;

    openModal(

        escapeHTML(v.title),

        `

        <h3>${escapeHTML(v.title)}</h3>

        <p>

            <b>Department:</b>

            ${departmentName(v.department)}

        </p>

        <p>

            <b>Employment:</b>

            ${escapeHTML(v.type)}

        </p>

        <p>

            <b>Salary:</b>

            ₱${Number(v.salary).toLocaleString()}

        </p>

        <p>

            <b>Deadline:</b>

            ${v.deadline}

        </p>

        <hr>

        <p>

            ${escapeHTML(v.description)}

        </p>

        ${

            currentUser.role === "APPLICANT"

            ?

            `<button

                class="btn primary"

                onclick="apply('${v.id}')">

                Apply for this Position

            </button>`

            :

            ""

        }

        `

    );

}


function deleteVacancy(idValue) {

    confirmAction(

        "Delete this vacancy?",

        function() {

            softDelete(data.vacancies, idValue);

            saveData(data);

            toast("Vacancy deleted.");

            render();

        }

    );

}
