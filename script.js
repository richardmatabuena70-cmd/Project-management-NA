/* ============================================================
   HOTEL & RESTAURANT HRMS
   HTML + CSS + JAVASCRIPT ONLY
   Data is stored in browser localStorage
============================================================ */


/* ============================================================
   DATA
============================================================ */

const defaultData = {

    users: [],

    departments: [],

    positions: [],

    vacancies: [],

    applicants: [],

    applications: [],

    interviews: [],

    offers: [],

    onboarding: [],

    employees: [],

    documents: [],

    records: [],

    leaves: [],

    notifications: []

};


/* ============================================================
   LOCAL STORAGE
============================================================ */

function loadData() {

    if (!localStorage.getItem("HRMS_DATA")) {

        localStorage.setItem(
            "HRMS_DATA",
            JSON.stringify(defaultData)
        );

    }

    return JSON.parse(
        localStorage.getItem("HRMS_DATA")
    );

}


function saveData(data) {

    localStorage.setItem(
        "HRMS_DATA",
        JSON.stringify(data)
    );

}


let data = loadData();

let currentUser = null;
let currentPage = "dashboard";


/* ============================================================
   HELPERS
============================================================ */

function id(prefix) {

    return prefix +
        Date.now() +
        Math.floor(Math.random() * 1000);

}


function escapeHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function departmentName(id) {

    return data.departments.find(
        d => d.id === id
    )?.name || "—";

}


function positionName(id) {

    return data.positions.find(
        p => p.id === id
    )?.name || "—";

}


function vacancyName(id) {

    return data.vacancies.find(
        v => v.id === id
    )?.title || "—";

}


function applicantName(id) {

    const a = data.applicants.find(
        x => x.id === id
    );

    if (!a) return "—";

    return `${a.firstName} ${a.lastName}`;

}


function employeeName(id) {

    const e = data.employees.find(
        x => x.id === id
    );

    if (!e) return "—";

    return `${e.firstName} ${e.lastName}`;

}


function badge(status) {

    let color = "blue";

    if (
        status === "Hired" ||
        status === "Accepted" ||
        status === "Approved" ||
        status === "Completed" ||
        status === "Active" ||
        status === "Verified" ||
        status === "Passed"
    ) {
        color = "green";
    }

    if (
        status === "Pending" ||
        status === "Submitted" ||
        status === "Under Review" ||
        status === "Scheduled"
    ) {
        color = "orange";
    }

    if (
        status === "Rejected" ||
        status === "Declined" ||
        status === "Failed"
    ) {
        color = "red";
    }

    return `<span class="badge ${color}">
        ${escapeHTML(status)}
    </span>`;

}


function toast(message) {

    const container =
        document.getElementById("toast");

    const item =
        document.createElement("div");

    item.className = "toast";

    item.textContent = message;

    container.appendChild(item);

    setTimeout(() => {

        item.remove();

    }, 2500);

}


function openModal(title, html) {

    document.getElementById(
        "modalTitle"
    ).textContent = title;

    document.getElementById(
        "modalContent"
    ).innerHTML = html;

    document.getElementById(
        "modal"
    ).classList.remove("hidden");

}


function closeModal() {

    document.getElementById(
        "modal"
    ).classList.add("hidden");

}


/* ============================================================
   LOGIN
============================================================ */

document.getElementById("loginForm")
    .addEventListener("submit", function(e) {

        e.preventDefault();

        const username =
            document.getElementById("username").value;

        const password =
            document.getElementById("password").value;

        const user = data.users.find(
            u =>
                (u.username === username ||
                 u.email === username)
                &&
                u.password === password
        );

        if (!user) {

            toast("Invalid username or password.");

            return;

        }

        currentUser = user;

        document.getElementById(
            "loginPage"
        ).classList.add("hidden");

        document.getElementById(
            "system"
        ).classList.remove("hidden");

        updateUser();

        buildMenu();

        render();

        toast("Login successful.");

    });


function logout() {

    currentUser = null;

    document.getElementById(
        "system"
    ).classList.add("hidden");

    document.getElementById(
        "loginPage"
    ).classList.remove("hidden");

}


function updateUser() {

    document.getElementById(
        "userName"
    ).textContent = currentUser.name;

    document.getElementById(
        "userRole"
    ).textContent = currentUser.role;

    document.getElementById(
        "avatar"
    ).textContent =
        currentUser.name.charAt(0);

}


/* ============================================================
   MENU
============================================================ */

function buildMenu() {

    const menu =
        document.getElementById("menu");

    let items = [];

    if (currentUser.role === "HR") {

        items = [
            ["dashboard","📊","Dashboard"],
            ["vacancies","💼","Job Vacancies"],
            ["applicants","👥","Applicants"],
            ["applications","📄","Applications"],
            ["archived","🗄️","Archived Applications"],
            ["interviews","📅","Interviews"],
            ["hiring","🤝","Hiring Decisions"],
            ["offers","✉️","Employment Offers"],
            ["onboarding","✅","Onboarding"],
            ["employees","👨‍💼","Employees"],
            ["departments","🏢","Departments"],
            ["positions","📌","Positions"],
            ["records","🗂️","Employee Records"],
            ["documents","📁","Documents"],
            ["leave","🗓️","Leave Requests"],
            ["reports","📈","Reports"]
        ];

    }

    else if (currentUser.role === "APPLICANT") {

        items = [
            ["dashboard","🏠","Dashboard"],
            ["vacancies","💼","Job Vacancies"],
            ["application","📄","My Application"],
            ["interview","📅","My Interview"],
            ["offer","✉️","My Offer"],
            ["onboarding","✅","My Onboarding"]
        ];

    }

    else if (currentUser.role === "GUEST") {

        items = [
            ["vacancies","💼","Job Vacancies"]
        ];

    }

    else {

        items = [
            ["dashboard","🏠","Dashboard"],
            ["profile","👤","My Profile"],
            ["employment","💼","My Employment"],
            ["documents","📁","My Documents"],
            ["records","🗂️","My Records"],
            ["leave","🗓️","Leave Requests"],
            ["notifications","🔔","Notifications"]
        ];

    }

    menu.innerHTML = items.map(item => `

        <button
            class="menu-btn ${currentPage === item[0] ? "active" : ""}"
            onclick="navigate('${item[0]}')">

            ${item[1]} ${item[2]}

        </button>

    `).join("");

}


function navigate(page) {

    currentPage = page;

    buildMenu();

    render();

}


/* ============================================================
   RENDER
============================================================ */

function render() {

    const content =
        document.getElementById("content");

    const titles = {

        dashboard:"Dashboard",
        vacancies:"Job Vacancies",
        applicants:"Applicants",
        applications:"Applications",
        archived:"Archived Applications",
        interviews:"Interviews",
        hiring:"Hiring Decisions",
        offers:"Employment Offers",
        onboarding:"Onboarding",
        employees:"Employees",
        departments:"Departments",
        positions:"Positions",
        records:"Employee Records",
        documents:"Documents",
        leave:"Leave Requests",
        reports:"Reports",
        application:"My Application",
        interview:"My Interview",
        offer:"My Offer",
        profile:"My Profile",
        employment:"My Employment",
        notifications:"Notifications"

    };

    document.getElementById(
        "pageTitle"
    ).textContent =
        titles[currentPage] || "Dashboard";


    if (currentPage === "dashboard")
        content.innerHTML = dashboard();

    else if (currentPage === "vacancies")
        content.innerHTML = vacancies();

    else if (currentPage === "applicants")
        content.innerHTML = applicants();

    else if (currentPage === "applications")
        content.innerHTML = applications();

    else if (currentPage === "archived")
        content.innerHTML = archivedApplications();

    else if (currentPage === "interviews")
        content.innerHTML = interviews();

    else if (currentPage === "hiring")
        content.innerHTML = hiring();

    else if (currentPage === "offers")
        content.innerHTML = offers();

    else if (currentPage === "onboarding")
        content.innerHTML = onboarding();

    else if (currentPage === "employees")
        content.innerHTML = employees();

    else if (currentPage === "departments")
        content.innerHTML = departments();

    else if (currentPage === "positions")
        content.innerHTML = positions();

    else if (currentPage === "records")
        content.innerHTML = records();

    else if (currentPage === "documents")
        content.innerHTML = documents();

    else if (currentPage === "leave")
        content.innerHTML = leavePage();

    else if (currentPage === "reports")
        content.innerHTML = reports();

    else if (currentPage === "application")
        content.innerHTML = myApplication();

    else if (currentPage === "interview")
        content.innerHTML = myInterview();

    else if (currentPage === "offer")
        content.innerHTML = myOffer();

    else if (currentPage === "profile")
        content.innerHTML = profile();

    else if (currentPage === "employment")
        content.innerHTML = employment();

    else if (currentPage === "notifications")
        content.innerHTML = notifications();

}


/* ============================================================
   DASHBOARD
============================================================ */

function dashboard() {

    if (currentUser.role === "APPLICANT")
        return applicantDashboard();

    if (currentUser.role === "EMPLOYEE")
        return employeeDashboard();

    return `

        <div class="cards">

            ${statCard(
                "💼",
                data.vacancies.filter(v => v.status === "Open").length,
                "Open Vacancies"
            )}

            ${statCard(
                "👥",
                data.applicants.length,
                "Applicants"
            )}

            ${statCard(
                "📄",
                data.applications.length,
                "Applications"
            )}

            ${statCard(
                "🤝",
                data.applicants.filter(a => a.status === "Hired").length,
                "Hired Applicants"
            )}

        </div>


        <div class="panel">

            <h3>Recruitment → Onboarding → Core HR</h3>

            <div class="flow">

                ${flowStep(1,"Job Vacancy")}
                <span class="flow-arrow">→</span>

                ${flowStep(2,"Applicant")}
                <span class="flow-arrow">→</span>

                ${flowStep(3,"Application")}
                <span class="flow-arrow">→</span>

                ${flowStep(4,"HR Review")}
                <span class="flow-arrow">→</span>

                ${flowStep(5,"Interview")}
                <span class="flow-arrow">→</span>

                ${flowStep(6,"Hiring")}
                <span class="flow-arrow">→</span>

                ${flowStep(7,"Offer")}
                <span class="flow-arrow">→</span>

                ${flowStep(8,"Onboarding")}
                <span class="flow-arrow">→</span>

                ${flowStep(9,"Employee")}
                <span class="flow-arrow">→</span>

                ${flowStep(10,"ESS")}

            </div>

        </div>


        <div class="panel">

            <h3>Recent Applicants</h3>

            ${applicantTable(false)}

        </div>

    `;

}


function statCard(icon,value,label) {

    return `

        <div class="card">

            <div class="card-icon">${icon}</div>

            <div class="card-value">${value}</div>

            <div class="card-label">${label}</div>

        </div>

    `;

}


function flowStep(number,text) {

    return `

        <div class="flow-step">

            <div class="flow-number">
                ${number}
            </div>

            <small>${text}</small>

        </div>

    `;

}


/* ============================================================
   RECRUITMENT
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

            ${data.vacancies.map(v => `

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

                    ${badge(v.status)}

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
                                ${d.name}
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

        const form =
            new FormData(this);

        data.vacancies.push({

            id:id("v"),

            title:form.get("title"),

            department:form.get("department"),

            salary:form.get("salary"),

            type:form.get("type"),

            deadline:form.get("deadline"),

            description:form.get("description"),

            status:"Open"

        });

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

    openModal(

        v.title,

        `

        <h3>${escapeHTML(v.title)}</h3>

        <p>
            <b>Department:</b>
            ${departmentName(v.department)}
        </p>

        <p>
            <b>Employment:</b>
            ${v.type}
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

    if (!confirm("Delete this vacancy?"))
        return;

    data.vacancies =
        data.vacancies.filter(
            v => v.id !== idValue
        );

    saveData(data);

    toast("Vacancy deleted.");

    render();

}


/* ============================================================
   APPLICANT
============================================================ */

function applicants() {

    return `

        <div class="section-header">

            <h3>Applicant Management</h3>

            <button
                class="btn primary"
                onclick="addApplicant()">

                + Add Applicant

            </button>

        </div>

        <div class="panel">

            ${applicantTable(true)}

        </div>

    `;

}


function applicantTable(actions) {

    if (data.applicants.length === 0)
        return `<div class="empty">No applicants.</div>`;

    return `

        <div class="table-container">

            <table>

                <thead>

                    <tr>

                        <th>Applicant</th>
                        <th>Position</th>
                        <th>Email</th>
                        <th>Status</th>

                        ${
                            actions
                            ?
                            "<th>Actions</th>"
                            :
                            ""
                        }

                    </tr>

                </thead>

                <tbody>

                    ${data.applicants.map(a => `

                        <tr>

                            <td>
                                <b>
                                    ${escapeHTML(
                                        applicantName(a.id)
                                    )}
                                </b>
                            </td>

                            <td>
                                ${vacancyName(a.vacancyId)}
                            </td>

                            <td>
                                ${escapeHTML(a.email)}
                            </td>

                            <td>
                                ${badge(a.status)}
                            </td>

                            ${
                                actions
                                ?
                                `<td class="actions">

                                    <button
                                        class="btn light small"
                                        onclick="viewApplicant('${a.id}')">

                                        View

                                    </button>

                                    <button
                                        class="btn primary small"
                                        onclick="reviewApplicant('${a.id}')">

                                        Review

                                    </button>

                                </td>`
                                :
                                ""
                            }

                        </tr>

                    `).join("")}

                </tbody>

            </table>

        </div>

    `;

}


function addApplicant() {

    openModal(

        "Add Applicant",

        `

        <form id="applicantForm">

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
                    <input name="phone">
                </label>

            </div>

            <div class="form-actions">

                <button class="btn primary">
                    Save Applicant
                </button>

            </div>

        </form>

        `

    );

    document.getElementById(
        "applicantForm"
    ).onsubmit = function(e) {

        e.preventDefault();

        const f =
            new FormData(this);

        data.applicants.push({

            id:id("a"),

            firstName:f.get("firstName"),

            lastName:f.get("lastName"),

            email:f.get("email"),

            phone:f.get("phone"),

            status:"Draft"

        });

        saveData(data);

        closeModal();

        render();

    };

}


function viewApplicant(idValue) {

    const a =
        data.applicants.find(
            x => x.id === idValue
        );

    openModal(

        "Applicant Information",

        `

        <h3>
            ${escapeHTML(applicantName(a.id))}
        </h3>

        <p>
            <b>Email:</b> ${escapeHTML(a.email)}
        </p>

        <p>
            <b>Phone:</b> ${escapeHTML(a.phone)}
        </p>

        <p>
            <b>Education:</b>
            ${escapeHTML(a.education || "—")}
        </p>

        <p>
            <b>Experience:</b>
            ${escapeHTML(a.experience || "—")}
        </p>

        <p>
            <b>Position:</b>
            ${vacancyName(a.vacancyId)}
        </p>

        <p>
            <b>Status:</b>
            ${badge(a.status)}
        </p>

        `

    );

}


/* ============================================================
   APPLICATION
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

        const f =
            new FormData(this);

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


        saveData(data);

        closeModal();

        toast("Application submitted.");

        currentPage = "application";

        buildMenu();

        render();

    };

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


/* ============================================================
   HR REVIEW
============================================================ */

function applications() {

    return `

        <div class="panel">

            <h3>Applications</h3>

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

                        ${data.applications.map(a => `

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

        </div>

    `;

}


function archiveApplication(applicationId) {

    const app =
        data.applications.find(
            x => x.id === applicationId
        );

    if (!app) return;

    app.archived = true;

    saveData(data);

    toast("Application archived.");

    render();

}


function archivedApplications() {

    const archived =
        data.applications.filter(
            a => a.archived === true
        );

    return `

        <div class="panel">

            <h3>Archived Applications</h3>

            <p>
                Rejected and deleted applications
                are stored here for reference.
            </p>

            <div class="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>Applicant</th>
                            <th>Position</th>
                            <th>Date</th>
                            <th>Status</th>

                        </tr>

                    </thead>

                    <tbody>

                        ${archived.length === 0
                            ?
                            `<tr>
                                <td colspan="4">
                                    <div class="empty">
                                        No archived applications.
                                    </div>
                                </td>
                            </tr>`
                            :
                            archived.map(a => `

                                <tr>

                                    <td>
                                        ${applicantName(a.applicantId)}
                                    </td>

                                    <td>
                                        ${vacancyName(a.vacancyId)}
                                    </td>

                                    <td>${a.date}</td>

                                    <td>
                                        ${badge(a.status)}
                                    </td>

                                </tr>

                            `).join("")
                        }

                    </tbody>

                </table>

            </div>

        </div>

    `;

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

    a.status = "Under Review";

    saveData(data);

    closeModal();

    render();

}


function qualifyApplicant(idValue) {

    const a =
        data.applicants.find(
            x => x.id === idValue
        );

    a.status = "Qualified";

    saveData(data);

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

    const a =
        data.applicants.find(
            x => x.id === app.applicantId
        );

    if (a)
        a.status = "Qualified";

    saveData(data);

    toast("Applicant qualified.");

    render();

}


function rejectApplication(applicationId) {

    const app =
        data.applications.find(
            x => x.id === applicationId
        );

    if (!app) return;

    app.status = "Rejected";

    const a =
        data.applicants.find(
            x => x.id === app.applicantId
        );

    if (a)
        a.status = "Rejected";

    saveData(data);

    toast("Application rejected.");

    render();

}


function rejectApplicant(idValue) {

    const a =
        data.applicants.find(
            x => x.id === idValue
        );

    if (a)
        a.status = "Rejected";

    saveData(data);

    closeModal();

    render();

}


/* ============================================================
   INTERVIEW
============================================================ */

function interviews() {

    return `

        <div class="section-header">

            <div>

                <h3>Interview Management</h3>

            </div>

            <button
                class="btn primary"
                onclick="scheduleInterview()">

                + Schedule Interview

            </button>

        </div>


        <div class="panel">

            <div class="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>Applicant</th>
                            <th>Position</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Status</th>
                            <th>Result</th>
                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        ${data.interviews.map(i => {

                            const app =
                                data.applications.find(
                                    a => a.id === i.applicationId
                                );

                            return `

                                <tr>

                                    <td>
                                        ${applicantName(
                                            app?.applicantId
                                        )}
                                    </td>

                                    <td>
                                        ${vacancyName(
                                            app?.vacancyId
                                        )}
                                    </td>

                                    <td>${i.date}</td>

                                    <td>${i.time}</td>

                                    <td>${badge(i.status)}</td>

                                    <td>${badge(i.result)}</td>

                                    <td>

                                        <button
                                            class="btn primary small"
                                            onclick="completeInterview('${i.id}')">

                                            Record Result

                                        </button>

                                    </td>

                                </tr>

                            `;

                        }).join("")}

                    </tbody>

                </table>

            </div>

        </div>

    `;

}


function scheduleInterview() {

    const qualified =
        data.applications.filter(
            a => a.status === "Qualified"
        );

    if (!qualified.length) {

        toast("No qualified applicants.");

        return;

    }


    openModal(

        "Schedule Interview",

        `

        <form id="interviewForm">

            <label>
                Applicant

                <select name="applicationId">

                    ${qualified.map(a => `

                        <option value="${a.id}">

                            ${applicantName(a.applicantId)}

                        </option>

                    `).join("")}

                </select>

            </label>

            <br>

            <label>
                Date
                <input name="date" type="date" required>
            </label>

            <br>

            <label>
                Time
                <input name="time" type="time" required>
            </label>

            <br>

            <label>
                Location
                <input name="location" value="HR Office">
            </label>

            <br>

            <button class="btn primary">
                Schedule Interview
            </button>

        </form>

        `

    );


    document.getElementById(
        "interviewForm"
    ).onsubmit = function(e) {

        e.preventDefault();

        const f =
            new FormData(this);

        data.interviews.push({

            id:id("i"),

            applicationId:
                f.get("applicationId"),

            date:f.get("date"),

            time:f.get("time"),

            location:f.get("location"),

            status:"Scheduled",

            result:"Pending"

        });


        const app =
            data.applications.find(
                a => a.id === f.get("applicationId")
            );

        if (app)
            app.status = "Interview Scheduled";


        saveData(data);

        closeModal();

        toast("Interview scheduled.");

        render();

    };

}


function completeInterview(interviewId) {

    openModal(

        "Interview Result",

        `

        <button
            class="btn success"
            onclick="interviewResult('${interviewId}','Passed')">

            Passed

        </button>

        <button
            class="btn danger"
            onclick="interviewResult('${interviewId}','Failed')">

            Failed

        </button>

        `

    );

}


function interviewResult(idValue,result) {

    const i =
        data.interviews.find(
            x => x.id === idValue
        );

    i.status = "Completed";

    i.result = result;

    const app =
        data.applications.find(
            x => x.id === i.applicationId
        );

    if (app) {

        app.status =
            result === "Passed"
            ? "Interview Completed"
            : "Rejected";

    }

    saveData(data);

    closeModal();

    toast("Interview result recorded.");

    render();

}


/* ============================================================
   HIRING
============================================================ */

function hiring() {

    const candidates =
        data.applications.filter(
            a =>
                a.status === "Interview Completed"
        );

    return `

        <div class="panel">

            <h3>Hiring Decision</h3>

            <div class="table-container">

                <table>

                    <thead>

                        <tr>
                            <th>Applicant</th>
                            <th>Position</th>
                            <th>Status</th>
                            <th>Decision</th>
                        </tr>

                    </thead>

                    <tbody>

                        ${candidates.map(a => `

                            <tr>

                                <td>
                                    ${applicantName(a.applicantId)}
                                </td>

                                <td>
                                    ${vacancyName(a.vacancyId)}
                                </td>

                                <td>
                                    ${badge(a.status)}
                                </td>

                                <td>

                                    <button
                                        class="btn success small"
                                        onclick="hire('${a.id}')">

                                        Hire

                                    </button>

                                    <button
                                        class="btn danger small"
                                        onclick="rejectApplication('${a.id}')">

                                        Reject

                                    </button>

                                </td>

                            </tr>

                        `).join("")}

                    </tbody>

                </table>

            </div>

        </div>

    `;

}


function hire(applicationId) {

    const app =
        data.applications.find(
            a => a.id === applicationId
        );

    if (!app) return;

    app.status = "Hired";

    const a =
        data.applicants.find(
            x => x.id === app.applicantId
        );

    if (a)
        a.status = "Hired";


    const vacancy =
        data.vacancies.find(
            x => x.id === app.vacancyId
        );


    data.offers.push({

        id:id("offer"),

        applicationId:app.id,

        applicantId:a.id,

        position:vacancy.title,

        department:departmentName(
            vacancy.department
        ),

        salary:vacancy.salary,

        startDate:"2026-09-01",

        status:"Pending"

    });


    saveData(data);

    toast("Applicant hired. Employment offer created.");

    render();

}


/* ============================================================
   OFFERS
============================================================ */

function offers() {

    return `

        <div class="panel">

            <h3>Employment Offers</h3>

            <div class="table-container">

                <table>

                    <thead>

                        <tr>
                            <th>Applicant</th>
                            <th>Position</th>
                            <th>Department</th>
                            <th>Salary</th>
                            <th>Status</th>
                        </tr>

                    </thead>

                    <tbody>

                        ${data.offers.map(o => `

                            <tr>

                                <td>
                                    ${applicantName(o.applicantId)}
                                </td>

                                <td>${o.position}</td>

                                <td>${o.department}</td>

                                <td>
                                    ₱${Number(o.salary).toLocaleString()}
                                </td>

                                <td>
                                    ${badge(o.status)}
                                </td>

                            </tr>

                        `).join("")}

                    </tbody>

                </table>

            </div>

        </div>

    `;

}


function myOffer() {

    const a =
        data.applicants.find(
            x => x.userId === currentUser.id
        );

    const offer =
        data.offers.find(
            x => x.applicantId === a?.id
        );

    if (!offer)
        return `<div class="panel empty">
            No employment offer yet.
        </div>`;


    return `

        <div class="panel">

            <h3>Employment Offer</h3>

            <p>
                <b>Position:</b>
                ${offer.position}
            </p>

            <p>
                <b>Department:</b>
                ${offer.department}
            </p>

            <p>
                <b>Salary:</b>
                ₱${Number(
                    offer.salary
                ).toLocaleString()}
            </p>

            <p>
                <b>Start Date:</b>
                ${offer.startDate}
            </p>

            <p>
                <b>Status:</b>
                ${badge(offer.status)}
            </p>

            ${
                offer.status === "Pending"
                ?
                `

                <button
                    class="btn success"
                    onclick="acceptOffer('${offer.id}')">

                    Accept Offer

                </button>

                <button
                    class="btn danger"
                    onclick="declineOffer('${offer.id}')">

                    Decline Offer

                </button>

                `
                :
                ""
            }

        </div>

    `;

}


function acceptOffer(idValue) {

    const offer =
        data.offers.find(
            x => x.id === idValue
        );

    offer.status = "Accepted";

    saveData(data);

    toast("Offer accepted.");

    render();

}


function declineOffer(idValue) {

    const offer =
        data.offers.find(
            x => x.id === idValue
        );

    offer.status = "Declined";

    saveData(data);

    toast("Offer declined.");

    render();

}


/* ============================================================
   ONBOARDING
============================================================ */

function onboarding() {

    return `

        <div class="panel">

            <h3>Onboarding Management</h3>

            <div class="job-grid">

                ${data.offers
                    .filter(o => o.status === "Accepted")
                    .map(o => {

                        const existing =
                            data.onboarding.find(
                                x =>
                                    x.applicantId ===
                                    o.applicantId
                            );

                        return `

                        <div class="job-card">

                            <h3>
                                ${applicantName(
                                    o.applicantId
                                )}
                            </h3>

                            <p>
                                ${o.position}
                            </p>

                            <p>
                                ${badge(
                                    existing
                                    ? existing.status
                                    : "Not Started"
                                )}
                            </p>

                            <button
                                class="btn primary"
                                onclick="startOnboarding('${o.applicantId}')">

                                Manage Onboarding

                            </button>

                        </div>

                        `;

                    }).join("")}

            </div>

        </div>

    `;

}


function startOnboarding(applicantId) {

    let on =
        data.onboarding.find(
            x => x.applicantId === applicantId
        );

    if (!on) {

        on = {

            id:id("on"),

            applicantId:applicantId,

            status:"In Progress",

            requirements:[

                {
                    name:"Employment Contract",
                    status:"Pending"
                },

                {
                    name:"Medical Certificate",
                    status:"Pending"
                },

                {
                    name:"Government ID",
                    status:"Pending"
                },

                {
                    name:"Emergency Contact",
                    status:"Pending"
                }

            ]

        };

        data.onboarding.push(on);

    }


    openModal(

        "Onboarding Requirements",

        `

        ${on.requirements.map((r,index) => `

            <div class="panel">

                <b>${r.name}</b>

                <p>
                    Status:
                    ${badge(r.status)}
                </p>

                ${
                    r.status === "Pending"
                    ?
                    `<button
                        class="btn success small"
                        onclick="verifyRequirement('${on.id}',${index})">

                        Verify

                    </button>`
                    :
                    ""
                }

            </div>

        `).join("")}

        <button
            class="btn primary"
            onclick="completeOnboarding('${on.id}')">

            Complete Onboarding

        </button>

        `

    );

}


function verifyRequirement(onboardingId,index) {

    const on =
        data.onboarding.find(
            x => x.id === onboardingId
        );

    on.requirements[index].status =
        "Verified";

    saveData(data);

    closeModal();

    toast("Requirement verified.");

    render();

}


function completeOnboarding(idValue) {

    const on =
        data.onboarding.find(
            x => x.id === idValue
        );

    const allVerified =
        on.requirements.every(
            r => r.status === "Verified"
        );

    if (!allVerified) {

        toast(
            "Verify all requirements first."
        );

        return;

    }

    on.status = "Completed";

    saveData(data);

    toast("Onboarding completed.");

    render();

}


/* ============================================================
   EMPLOYEES / CORE HR
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

                                <td>${e.employeeNumber}</td>

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

        const f =
            new FormData(this);

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


        data.employees.push(employee);

        saveData(data);

        closeModal();

        toast(
            "Employee record created."
        );

        render();

    };

}


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

            ${data.departments.map(d => `

                <div class="job-card">

                    <h3>${d.name}</h3>

                    <p>
                        Hotel & Restaurant
                        organizational department.
                    </p>

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

        const f =
            new FormData(this);

        data.departments.push({

            id:id("d"),

            name:f.get("name")

        });

        saveData(data);

        closeModal();

        render();

    };

}


/* ============================================================
   POSITIONS
============================================================ */

function positions() {

    return `

        <div class="section-header">

            <h3>Positions</h3>

            <button
                class="btn primary"
                onclick="addPosition()">

                + Add Position

            </button>

        </div>

        <div class="panel">

            <div class="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>Position</th>
                            <th>Department</th>

                        </tr>

                    </thead>

                    <tbody>

                        ${data.positions.map(p => `

                            <tr>

                                <td>${p.name}</td>

                                <td>
                                    ${departmentName(
                                        p.department
                                    )}
                                </td>

                            </tr>

                        `).join("")}

                    </tbody>

                </table>

            </div>

        </div>

    `;

}


function addPosition() {

    openModal(

        "Add Position",

        `

        <form id="positionForm">

            <label>
                Position Name
                <input name="name" required>
            </label>

            <br>

            <label>
                Department

                <select name="department">

                    ${data.departments.map(d => `

                        <option value="${d.id}">
                            ${d.name}
                        </option>

                    `).join("")}

                </select>

            </label>

            <br>

            <button class="btn primary">
                Add Position
            </button>

        </form>

        `

    );


    document.getElementById(
        "positionForm"
    ).onsubmit = function(e) {

        e.preventDefault();

        const f =
            new FormData(this);

        data.positions.push({

            id:id("p"),

            name:f.get("name"),

            department:
                f.get("department")

        });

        saveData(data);

        closeModal();

        render();

    };

}


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

        const f =
            new FormData(this);

        data.records.push({

            id:id("r"),

            employeeId:
                f.get("employee"),

            title:
                f.get("title"),

            date:
                f.get("date")

        });

        saveData(data);

        closeModal();

        render();

    };

}


/* ============================================================
   DOCUMENTS
============================================================ */

function documents() {

    let employeeId =
        currentUser.role === "EMPLOYEE"
        ?
        currentUser.employeeId
        :
        null;

    let docs =
        employeeId
        ?
        data.documents.filter(
            d => d.employeeId === employeeId
        )
        :
        data.documents;


    return `

        <div class="section-header">

            <h3>Employee Documents</h3>

            <button
                class="btn primary"
                onclick="addDocument()">

                + Upload Document

            </button>

        </div>

        <div class="panel">

            <div class="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>Employee</th>
                            <th>Document</th>
                            <th>Date</th>

                        </tr>

                    </thead>

                    <tbody>

                        ${docs.map(d => `

                            <tr>

                                <td>
                                    ${employeeName(
                                        d.employeeId
                                    )}
                                </td>

                                <td>
                                    ${escapeHTML(d.name)}
                                </td>

                                <td>${d.date}</td>

                            </tr>

                        `).join("")}

                    </tbody>

                </table>

            </div>

        </div>

    `;

}


function addDocument() {

    openModal(

        "Upload Document",

        `

        <form id="documentForm">

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
                Document
                <input
                    type="file"
                    name="file"
                    required>
            </label>

            <br>

            <button class="btn primary">
                Upload
            </button>

        </form>

        `

    );


    document.getElementById(
        "documentForm"
    ).onsubmit = function(e) {

        e.preventDefault();

        const f =
            new FormData(this);

        const file =
            document.querySelector(
                '#documentForm input[type="file"]'
            ).files[0];


        data.documents.push({

            id:id("doc"),

            employeeId:
                f.get("employee"),

            name:
                file?.name || "Document",

            date:
                new Date()
                    .toLocaleDateString()

        });


        saveData(data);

        closeModal();

        toast("Document uploaded.");

        render();

    };

}


/* ============================================================
   LEAVE
============================================================ */

function leavePage() {

    const isEmployee =
        currentUser.role === "EMPLOYEE";

    let leaves =
        isEmployee
        ?
        data.leaves.filter(
            l =>
                l.employeeId ===
                currentUser.employeeId
        )
        :
        data.leaves;


    return `

        <div class="section-header">

            <h3>Leave Requests</h3>

            ${
                isEmployee
                ?
                `<button
                    class="btn primary"
                    onclick="requestLeave()">

                    + Request Leave

                </button>`
                :
                ""
            }

        </div>


        <div class="panel">

            <div class="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>Employee</th>
                            <th>Type</th>
                            <th>Start</th>
                            <th>End</th>
                            <th>Status</th>

                            ${
                                !isEmployee
                                ?
                                "<th>Actions</th>"
                                :
                                ""
                            }

                        </tr>

                    </thead>

                    <tbody>

                        ${leaves.map(l => `

                            <tr>

                                <td>
                                    ${employeeName(
                                        l.employeeId
                                    )}
                                </td>

                                <td>${l.type}</td>

                                <td>${l.start}</td>

                                <td>${l.end}</td>

                                <td>${badge(l.status)}</td>

                                ${
                                    !isEmployee
                                    ?
                                    `<td>

                                        <button
                                            class="btn success small"
                                            onclick="approveLeave('${l.id}')">

                                            Approve

                                        </button>

                                        <button
                                            class="btn danger small"
                                            onclick="rejectLeave('${l.id}')">

                                            Reject

                                        </button>

                                    </td>`
                                    :
                                    ""
                                }

                            </tr>

                        `).join("")}

                    </tbody>

                </table>

            </div>

        </div>

    `;

}


function requestLeave() {

    openModal(

        "Leave Request",

        `

        <form id="leaveForm">

            <label>
                Leave Type

                <select name="type">

                    <option>Vacation Leave</option>
                    <option>Sick Leave</option>
                    <option>Emergency Leave</option>
                    <option>Personal Leave</option>

                </select>

            </label>

            <br>

            <label>
                Start Date
                <input name="start" type="date" required>
            </label>

            <br>

            <label>
                End Date
                <input name="end" type="date" required>
            </label>

            <br>

            <label>
                Reason
                <textarea name="reason"></textarea>
            </label>

            <br>

            <button class="btn primary">
                Submit Request
            </button>

        </form>

        `

    );


    document.getElementById(
        "leaveForm"
    ).onsubmit = function(e) {

        e.preventDefault();

        const f =
            new FormData(this);

        data.leaves.push({

            id:id("leave"),

            employeeId:
                currentUser.employeeId,

            type:
                f.get("type"),

            start:
                f.get("start"),

            end:
                f.get("end"),

            reason:
                f.get("reason"),

            status:"Pending"

        });

        saveData(data);

        closeModal();

        toast("Leave request submitted.");

        render();

    };

}


function approveLeave(idValue) {

    const l =
        data.leaves.find(
            x => x.id === idValue
        );

    l.status = "Approved";

    saveData(data);

    render();

}


function rejectLeave(idValue) {

    const l =
        data.leaves.find(
            x => x.id === idValue
        );

    l.status = "Rejected";

    saveData(data);

    render();

}


/* ============================================================
   EMPLOYEE SELF SERVICE
============================================================ */

function profile() {

    const employee =
        data.employees.find(
            e =>
                e.id === currentUser.employeeId
        );

    if (!employee)
        return `<div class="panel">
            Profile not available.
        </div>`;


    return `

        <div class="panel">

            <h3>My Profile</h3>

            <p>
                <b>Name:</b>
                ${employeeName(employee.id)}
            </p>

            <p>
                <b>Employee Number:</b>
                ${employee.employeeNumber}
            </p>

            <p>
                <b>Email:</b>
                ${employee.email}
            </p>

        </div>

    `;

}


function employment() {

    const employee =
        data.employees.find(
            e =>
                e.id === currentUser.employeeId
        );

    if (!employee)
        return `<div class="panel">
            Employment information not found.
        </div>`;


    return `

        <div class="panel">

            <h3>My Employment</h3>

            <p>
                <b>Position:</b>
                ${positionName(employee.position)}
            </p>

            <p>
                <b>Department:</b>
                ${departmentName(employee.department)}
            </p>

            <p>
                <b>Salary:</b>
                ₱${Number(
                    employee.salary
                ).toLocaleString()}
            </p>

            <p>
                <b>Hire Date:</b>
                ${employee.hireDate}
            </p>

            <p>
                <b>Status:</b>
                ${badge(employee.status)}
            </p>

        </div>

    `;

}


function employeeDashboard() {

    return `

        <div class="cards">

            ${statCard(
                "👨‍💼",
                "1",
                "Employee Record"
            )}

            ${statCard(
                "📁",
                data.documents.filter(
                    d =>
                        d.employeeId ===
                        currentUser.employeeId
                ).length,
                "Documents"
            )}

            ${statCard(
                "🗂️",
                data.records.filter(
                    r =>
                        r.employeeId ===
                        currentUser.employeeId
                ).length,
                "Records"
            )}

            ${statCard(
                "🗓️",
                data.leaves.filter(
                    l =>
                        l.employeeId ===
                        currentUser.employeeId
                ).length,
                "Leave Requests"
            )}

        </div>


        <div class="panel">

            <h3>
                Employee Self-Service
            </h3>

            <p>
                Welcome to your employee portal.
            </p>

        </div>

    `;

}


/* ============================================================
   APPLICANT DASHBOARD
============================================================ */

function applicantDashboard() {

    const a =
        data.applicants.find(
            x =>
                x.userId ===
                currentUser.id
        );

    return `

        <div class="cards">

            ${statCard(
                "💼",
                data.vacancies.filter(
                    v => v.status === "Open"
                ).length,
                "Available Jobs"
            )}

            ${statCard(
                "📄",
                a ? 1 : 0,
                "My Application"
            )}

            ${statCard(
                "📅",
                data.interviews.filter(
                    i => {

                        const app =
                            data.applications.find(
                                a =>
                                    a.id ===
                                    i.applicationId
                            );

                        return app?.applicantId ===
                            currentUser.id;

                    }
                ).length,
                "Interviews"
            )}

            ${statCard(
                "✉️",
                data.offers.filter(
                    o => {

                        const ap =
                            data.applicants.find(
                                a =>
                                    a.id ===
                                    o.applicantId
                            );

                        return ap?.userId ===
                            currentUser.id;

                    }
                ).length,
                "Offers"
            )}

        </div>


        <div class="panel">

            <h3>
                Recruitment Process
            </h3>

            <div class="flow">

                ${flowStep(1,"View Vacancy")}
                <span class="flow-arrow">→</span>

                ${flowStep(2,"Select Position")}
                <span class="flow-arrow">→</span>

                ${flowStep(3,"Create Account")}
                <span class="flow-arrow">→</span>

                ${flowStep(4,"Application")}
                <span class="flow-arrow">→</span>

                ${flowStep(5,"Requirements")}
                <span class="flow-arrow">→</span>

                ${flowStep(6,"Submit")}

            </div>

        </div>

    `;

}


/* ============================================================
   APPLICANT INTERVIEW
============================================================ */

function myInterview() {

    const a =
        data.applicants.find(
            x => x.userId === currentUser.id
        );

    const applications =
        data.applications.filter(
            x =>
                x.applicantId === a?.id
        );

    const interviews =
        data.interviews.filter(
            i =>
                applications.some(
                    a =>
                        a.id ===
                        i.applicationId
                )
        );


    if (!interviews.length)
        return `<div class="panel empty">
            No interview scheduled yet.
        </div>`;


    return `

        <div class="panel">

            <h3>My Interview</h3>

            ${interviews.map(i => `

                <p>

                    <b>Date:</b>
                    ${i.date}

                    <br>

                    <b>Time:</b>
                    ${i.time}

                    <br>

                    <b>Status:</b>
                    ${badge(i.status)}

                    <br>

                    <b>Result:</b>
                    ${badge(i.result)}

                </p>

            `).join("")}

        </div>

    `;

}


/* ============================================================
   ONBOARDING APPLICANT
============================================================ */

function myOnboarding() {

    const a =
        data.applicants.find(
            x => x.userId === currentUser.id
        );

    const on =
        data.onboarding.find(
            x =>
                x.applicantId === a?.id
        );

    if (!on)
        return `<div class="panel empty">
            Your onboarding process has not started yet.
        </div>`;


    return `

        <div class="panel">

            <h3>My Onboarding</h3>

            ${on.requirements.map(r => `

                <div class="panel">

                    <b>${r.name}</b>

                    <p>
                        ${badge(r.status)}
                    </p>

                </div>

            `).join("")}

            <p>
                Overall Status:
                ${badge(on.status)}
            </p>

        </div>

    `;

}


/* ============================================================
   REPORTS
============================================================ */

function reports() {

    return `

        <div class="cards">

            ${statCard(
                "👥",
                data.applicants.length,
                "Total Applicants"
            )}

            ${statCard(
                "🤝",
                data.applicants.filter(
                    a => a.status === "Hired"
                ).length,
                "Hired"
            )}

            ${statCard(
                "❌",
                data.applicants.filter(
                    a => a.status === "Rejected"
                ).length,
                "Rejected"
            )}

            ${statCard(
                "👨‍💼",
                data.employees.length,
                "Employees"
            )}

        </div>


        <div class="panel">

            <h3>HR Reports</h3>

            <p>
                Recruitment, hiring and employee
                information summary.
            </p>

            <table>

                <tr>
                    <th>Category</th>
                    <th>Total</th>
                </tr>

                <tr>
                    <td>Job Vacancies</td>
                    <td>${data.vacancies.length}</td>
                </tr>

                <tr>
                    <td>Applications</td>
                    <td>${data.applications.length}</td>
                </tr>

                <tr>
                    <td>Interviews</td>
                    <td>${data.interviews.length}</td>
                </tr>

                <tr>
                    <td>Employment Offers</td>
                    <td>${data.offers.length}</td>
                </tr>

                <tr>
                    <td>Employees</td>
                    <td>${data.employees.length}</td>
                </tr>

            </table>

        </div>

    `;

}


/* ============================================================
   NOTIFICATIONS
============================================================ */

function notifications() {

    return `

        <div class="panel">

            <h3>Notifications</h3>

            <div class="empty">

                No new notifications.

            </div>

        </div>

    `;

}


/* ============================================================
   REGISTER HR / ADMIN
============================================================ */

function registerHR() {

    openModal(

        "Create HR / Admin Account",

        `

        <form id="registerHRForm">

            <div class="form-grid">

                <label>
                    Full Name
                    <input name="name" required>
                </label>

                <label>
                    Email
                    <input name="email" type="email" required>
                </label>

                <label>
                    Username
                    <input name="username" required>
                </label>

                <label>
                    Password
                    <input name="password" type="password" required>
                </label>

            </div>

            <div class="form-actions">

                <button class="btn primary">
                    Create HR Account
                </button>

            </div>

        </form>

        `

    );


    document.getElementById(
        "registerHRForm"
    ).onsubmit = function(e) {

        e.preventDefault();

        const f =
            new FormData(this);

        const newUser = {

            id:id("u"),

            username:
                f.get("username"),

            password:
                f.get("password"),

            role:"HR",

            name:
                f.get("name"),

            email:
                f.get("email")

        };


        data.users.push(newUser);

        saveData(data);

        closeModal();

        toast(
            "HR account created. You can now login."
        );

    };

}


/* ============================================================
   REGISTER APPLICANT
============================================================ */

function registerApplicant() {

    openModal(

        "Create Applicant Account",

        `

        <form id="registerForm">

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
                    <input
                        name="email"
                        type="email"
                        required>
                </label>

                <label>
                    Username
                    <input name="username" required>
                </label>

                <label>
                    Password
                    <input
                        name="password"
                        type="password"
                        required>
                </label>

            </div>

            <div class="form-actions">

                <button class="btn primary">
                    Create Account
                </button>

            </div>

        </form>

        `

    );


    document.getElementById(
        "registerForm"
    ).onsubmit = function(e) {

        e.preventDefault();

        const f =
            new FormData(this);

        const newUser = {

            id:id("u"),

            username:
                f.get("username"),

            password:
                f.get("password"),

            role:"APPLICANT",

            name:
                f.get("firstName")
                + " "
                + f.get("lastName"),

            email:
                f.get("email")

        };


        data.users.push(newUser);


        data.applicants.push({

            id:id("a"),

            userId:newUser.id,

            firstName:
                f.get("firstName"),

            lastName:
                f.get("lastName"),

            email:
                f.get("email"),

            status:"Draft"

        });


        saveData(data);

        closeModal();

        toast(
            "Account created. You can now login."
        );

    };

}


/* ============================================================
   GUEST
============================================================ */

function guestApplicant() {

    currentUser = {

        id:"guest",

        username:"guest",

        role:"GUEST",

        name:"Guest Applicant",

        email:"guest@email.com"

    };


    document.getElementById(
        "loginPage"
    ).classList.add("hidden");

    document.getElementById(
        "system"
    ).classList.remove("hidden");

    currentPage = "vacancies";

    updateUser();

    buildMenu();

    render();

}


/* ============================================================
   INITIALIZE
============================================================ */

loadData();
