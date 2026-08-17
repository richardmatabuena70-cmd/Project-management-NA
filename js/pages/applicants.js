/* ============================================================
   APPLICANTS
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

            <input

                type="search"

                id="applicantSearch"

                placeholder="Search by name or email..."

                class="search-input"

                oninput="filterApplicants(this.value)"

            >

            <div id="applicantsTable">

                ${applicantTable(true)}

            </div>

        </div>

    `;

}


function filterApplicants(value) {

    document.getElementById("applicantsTable").innerHTML = applicantTable(true, value);

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

        const applicant = {

            id:id("a"),

            firstName:f.get("firstName"),

            lastName:f.get("lastName"),

            email:f.get("email"),

            phone:f.get("phone"),

            status:"Draft"

        };

        ensureAuditFields(applicant, currentUser);

        data.applicants.push(applicant);

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

    if (!a) return;

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
