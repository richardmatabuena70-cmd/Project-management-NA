/* ============================================================
   UI / RENDER
============================================================ */

function render() {

    const content =
        document.getElementById("content");

    const titles = {

        dashboard:"Dashboard",
        vacancies:"Job Vacancies",
        applicants:"Applicants",
        applications:"Applications",
        archived:"Archive",
        interviews:"Interviews",
        hiring:"Hiring Decisions",
        offers:"Employment Offers",
        onboarding:"Onboarding",
        myOnboarding:"My Onboarding",
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
        employment:"My Employment"

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
        content.innerHTML = archived();

    else if (currentPage === "interviews")
        content.innerHTML = interviews();

    else if (currentPage === "hiring")
        content.innerHTML = hiring();

    else if (currentPage === "offers")
        content.innerHTML = offers();

    else if (currentPage === "onboarding")
        content.innerHTML = onboarding();

    else if (currentPage === "myOnboarding")
        content.innerHTML = myOnboarding();

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

                data.vacancies.filter(v => v.status === "Open" && !v.deleted).length,

                "Open Vacancies"

            )}

            ${statCard(

                "👥",

                data.applicants.filter(a => !a.archived).length,

                "Applicants"

            )}

            ${statCard(

                "📄",

                data.applications.length,

                "Applications"

            )}

            ${statCard(

                "🤝",

                data.applicants.filter(a => a.status === "Hired" && !a.archived).length,

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


function applicantTable(actions, filterText) {

    if (data.applicants.filter(a => !a.archived).length === 0)
        return `<div class="empty">No applicants.</div>`;

    let list = data.applicants.filter(a => !a.archived);

    if (filterText && filterText.trim()) {

        const q = filterText.toLowerCase();

        list = list.filter(a =>

            applicantName(a.id).toLowerCase().includes(q) ||

            (a.email && a.email.toLowerCase().includes(q))

        );

    }

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

                    ${list.map(a => `

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


function archived() {

    const archivedApps =
        data.applications.filter(
            a => a.archived === true
        );

    const archivedApplicants =
        data.applicants.filter(
            a => a.archived === true
        );

    const archivedAppIds =
        new Set(
            archivedApps.map(
                a => a.applicantId
            )
        );

    const orphanedApplicants =
        archivedApplicants.filter(
            a => !archivedAppIds.has(a.id)
        );

    const combined = [

        ...archivedApps.map(a => ({

            type:"application",

            id:a.id,

            applicantName:
                applicantName(a.applicantId),

            email:
                (data.applicants.find(
                    x => x.id === a.applicantId
                ) || {}).email || "",

            position:
                vacancyName(a.vacancyId),

            date:a.date || "",

            status:a.status

        })),

        ...orphanedApplicants.map(a => ({

            type:"applicant",

            id:a.id,

            applicantName:
                applicantName(a.id),

            email:a.email || "",

            position:
                vacancyName(a.vacancyId),

            date:"",

            status:a.status

        }))

    ];

    return `

        <div class="section-header">

            <h3>Archive</h3>

        </div>

        ${combined.length > 0 ? `

            <div class="panel">

                <div class="table-container">

                    <table>

                        <thead>

                            <tr>

                                <th>Applicant</th>

                                <th>Email</th>

                                <th>Position</th>

                                <th>Date</th>

                                <th>Status</th>

                                <th>Actions</th>

                            </tr>

                        </thead>

                        <tbody>

                            ${combined.map(item => `

                                <tr>

                                    <td>${escapeHTML(item.applicantName)}</td>

                                    <td>${escapeHTML(item.email)}</td>

                                    <td>${escapeHTML(item.position)}</td>

                                    <td>${escapeHTML(item.date)}</td>

                                    <td>${badge(item.status)}</td>

                                    <td class="actions">

                                        <button

                                            class="btn success small"

                                            onclick="restoreArchive('${item.type}','${item.id}')">

                                            Restore

                                        </button>

                                    </td>

                                </tr>

                            `).join("")}

                        </tbody>

                    </table>

                </div>

            </div>

        ` : `

            <div class="empty">No archived items.</div>

        `}

    `;

}


function restoreArchive(type, idValue) {

    if (type === "application") {

        const app =

            data.applications.find(

                x => x.id === idValue

            );

        if (!app) return;

        app.archived = false;

        app.status = "Submitted";

        ensureAuditFields(app, currentUser);

        const a =

            data.applicants.find(

                x => x.id === app.applicantId

            );

        if (a) {

            a.archived = false;

            ensureAuditFields(a, currentUser);

        }

        saveData(data);

        toast("Application restored.");

    }

    else if (type === "applicant") {

        const a =

            data.applicants.find(

                x => x.id === idValue

            );

        if (!a) return;

        a.archived = false;

        ensureAuditFields(a, currentUser);

        saveData(data);

        toast("Applicant restored.");

    }

    render();

}


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

                    v => v.status === "Open" && !v.deleted

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
