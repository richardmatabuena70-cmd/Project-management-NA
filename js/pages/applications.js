/* ============================================================
   APPLICATIONS
============================================================ */

function apply(vacancyId) {

    closeModal();

    openModal(

        "Application Form",

        `

        <form id="applicationForm">

            <div class="form-grid">

                <label>

                    First Name

                    <input name="firstName" required>

                </label>

                <label>

                    Last Name

                    <input name="lastName" required>

                </label>

                <label>

                    Email

                    <input name="email" type="email" required>

                </label>

                <label>

                    Phone

                    <input name="phone" required>

                </label>

                <label>

                    Education

                    <input name="education" required>

                </label>

                <label>

                    Work Experience

                    <input name="experience">

                </label>

                <label>

                    Resume

                    <input name="resume" type="file">

                </label>

                <label>

                    Valid ID

                    <input name="validId" type="file">

                </label>

            </div>

            <p>

                Applying for:

                <b>${vacancyName(vacancyId)}</b>

            </p>

            <div class="form-actions">

                <button class="btn primary">

                    Submit Application

                </button>

            </div>

        </form>

        `

    );



    document.getElementById(

        "applicationForm"

    ).onsubmit = function(e) {

        e.preventDefault();

        const formToken = this.dataset.token;

        if (!formToken || formToken !== sessionStorage.getItem("hrms_form_token")) {

            toast("Invalid form submission.");

            return;

        }

        const f =

            new FormData(this);

        const firstErr = validateRequired(f.get("firstName"), "First name");

        if (firstErr) { toast(firstErr); return; }

        const lastErr = validateRequired(f.get("lastName"), "Last name");

        if (lastErr) { toast(lastErr); return; }

        const emailErr = validateEmail(f.get("email"));

        if (emailErr) { toast(emailErr); return; }

        const phoneErr = validateRequired(f.get("phone"), "Phone");

        if (phoneErr) { toast(phoneErr); return; }

        const eduErr = validateRequired(f.get("education"), "Education");

        if (eduErr) { toast(eduErr); return; }

        const applicant = {

            id:

                currentUser.role === "APPLICANT"

                ?

                (

                    data.applicants.find(

                        a =>

                            a.userId === currentUser.id

                    )?.id || id("a")

                )

                :

                id("a"),

            userId:currentUser.id,

            firstName:f.get("firstName"),

            lastName:f.get("lastName"),

            email:f.get("email"),

            phone:f.get("phone"),

            education:f.get("education"),

            experience:f.get("experience"),

            vacancyId:vacancyId,

            status:"Submitted"

        };

        ensureAuditFields(applicant, currentUser);

        const existing =

            data.applicants.find(

                a => a.id === applicant.id

            );

        if (existing) {

            Object.assign(

                existing,

                applicant

            );

        } else {

            data.applicants.push(applicant);

        }


        data.applications.push({

            id:id("app"),

            applicantId:applicant.id,

            vacancyId:vacancyId,

            status:"Submitted",

            date:new Date().toLocaleDateString(),

            requirements:[],

            archived:false

        });

        ensureAuditFields(data.applications[data.applications.length - 1], currentUser);


        saveData(data);

        closeModal();

        toast("Application submitted.");

        currentPage = "application";

        buildMenu();

        render();

    };

}


function applications() {

    return `

        <div class="panel">

            <h3>Applications</h3>

            <input

                type="search"

                id="applicationSearch"

                placeholder="Search by applicant name..."

                class="search-input"

                oninput="filterApplications(this.value)"

            >

            <div id="applicationsTable">

                ${renderApplicationsTable("")}

            </div>

        </div>

    `;

}


function renderApplicationsTable(filterText) {

    let list = data.applications.filter(a => !a.archived);

    if (filterText && filterText.trim()) {

        const q = filterText.toLowerCase();

        list = list.filter(a =>

            applicantName(a.applicantId).toLowerCase().includes(q)

        );

    }

    return `

        <div class="table-container">

            <table>

                <thead>

                    <tr>

                        <th>Applicant</th>

                        <th>Position</th>

                        <th>Date</th>

                        <th>Status</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    ${list.map(a => `

                        <tr>

                            <td>

                                ${applicantName(a.applicantId)}

                            </td>

                            <td>

                                ${vacancyName(a.vacancyId)}

                            </td>

                            <td>

                                ${a.date}

                            </td>

                            <td>

                                ${badge(a.status)}

                            </td>

                            <td class="actions">

                                <button

                                    class="btn success small"

                                    onclick="qualify('${a.id}')">

                                    Qualify

                                </button>

                                <button

                                    class="btn danger small"

                                    onclick="rejectApplication('${a.id}')">

                                    Reject

                                </button>

                                <button

                                    class="btn light small"

                                    onclick="archiveApplication('${a.id}')">

                                    Archive

                                </button>

                            </td>

                        </tr>

                    `).join("")}

                </tbody>

            </table>

        </div>

    `;

}


function filterApplications(value) {

    document.getElementById("applicationsTable").innerHTML = renderApplicationsTable(value);

}


function archiveApplication(applicationId) {

    const app =

        data.applications.find(

            x => x.id === applicationId

        );

    if (!app) return;

    app.archived = true;

    app.status = "Archived";

    ensureAuditFields(app, currentUser);

    const a =

        data.applicants.find(

            x => x.id === app.applicantId

        );

    if (a) {

        a.archived = true;

        ensureAuditFields(a, currentUser);

    }

    saveData(data);

    toast("Application archived.");

    render();

}


function reviewApplicant(idValue) {

    openModal(

        "HR Application Review",

        `

        <div class="notice">

            Review the applicant before proceeding

            to the interview stage.

        </div>

        <button

            class="btn warning"

            onclick="underReview('${idValue}')">

            Under Review

        </button>

        <button

            class="btn success"

            onclick="qualifyApplicant('${idValue}')">

            Qualified

        </button>

        <button

            class="btn danger"

            onclick="rejectApplicant('${idValue}')">

            Reject

        </button>

        `

    );

}


function underReview(idValue) {

    const a =

        data.applicants.find(

            x => x.id === idValue

        );

    if (a) {

        a.status = "Under Review";

        ensureAuditFields(a, currentUser);

        saveData(data);

    }

    closeModal();

    render();

}


function qualifyApplicant(idValue) {

    const a =

        data.applicants.find(

            x => x.id === idValue

        );

    if (a) {

        a.status = "Qualified";

        ensureAuditFields(a, currentUser);

        saveData(data);

    }

    closeModal();

    toast("Applicant qualified.");

    render();

}


function qualify(applicationId) {

    const app =

        data.applications.find(

            x => x.id === applicationId

        );

    if (!app) return;

    app.status = "Qualified";

    ensureAuditFields(app, currentUser);

    const a =

        data.applicants.find(

            x => x.id === app.applicantId

        );

    if (a) {

        a.status = "Qualified";

        ensureAuditFields(a, currentUser);

    }

    saveData(data);

    toast("Applicant qualified.");

    render();

}


function rejectApplication(applicationId) {

    confirmAction(

        "Reject this application?",

        function() {

            const app =

                data.applications.find(

                    x => x.id === applicationId

                );

            if (!app) return;

            app.status = "Rejected";

            app.archived = true;

            ensureAuditFields(app, currentUser);

            const a =

                data.applicants.find(

                    x => x.id === app.applicantId

                );

            if (a) {

                a.status = "Rejected";

                a.archived = true;

                ensureAuditFields(a, currentUser);

            }

            saveData(data);

            toast("Application rejected.");

            render();

        }

    );

}


function rejectApplicant(idValue) {

    const a =

        data.applicants.find(

            x => x.id === idValue

        );

    if (a) {

        a.status = "Rejected";

        ensureAuditFields(a, currentUser);

        saveData(data);

    }

    closeModal();

    render();

}


function myApplication() {

    const a =

        data.applicants.find(

            x => x.userId === currentUser.id

        );

    if (!a)
        return `<div class="panel empty">

            You have not submitted an application yet.

        </div>`;

    const app =

        data.applications.find(

            x => x.applicantId === a.id

        );

    return `

        <div class="panel">

            <h3>My Application</h3>

            <p>

                <b>Name:</b>

                ${escapeHTML(applicantName(a.id))}

            </p>

            <p>

                <b>Position:</b>

                ${vacancyName(a.vacancyId)}

            </p>

            <p>

                <b>Application Date:</b>

                ${app?.date || "—"}

            </p>

            <p>

                <b>Status:</b>

                ${badge(a.status)}

            </p>

        </div>

    `;

}
