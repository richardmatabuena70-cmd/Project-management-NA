/* ============================================================
   DATA & LOCAL STORAGE
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

    const forms = document.getElementById("modalContent").querySelectorAll("form");

    forms.forEach(form => {

        const token = generateToken();

        sessionStorage.setItem("hrms_form_token", token);

        form.dataset.token = token;

    });

}


function closeModal() {

    document.getElementById(
        "modal"
    ).classList.add("hidden");

}


/* ============================================================
   SECURITY HELPERS
============================================================ */

const PASSWORD_SALT = "HRMS_SALT_2026";

function hashPassword(password) {

    return btoa(password + PASSWORD_SALT);

}


function verifyPassword(password, storedHash) {

    if (!storedHash) return false;

    if (storedHash === password) {

        return true;

    }

    return btoa(password + PASSWORD_SALT) === storedHash;

}


function validateEmail(email) {

    if (!email || typeof email !== "string") {

        return "Email is required.";

    }

    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!re.test(email)) {

        return "Please enter a valid email address.";

    }

    return null;

}


function validateRequired(value, field) {

    if (value === null || value === undefined || String(value).trim() === "") {

        return `${field} is required.`;

    }

    return null;

}


function validateMaxLength(value, max, field) {

    if (value && String(value).length > max) {

        return `${field} must be ${max} characters or less.`;

    }

    return null;

}


function generateToken() {

    return Date.now().toString(36) + Math.random().toString(36).substr(2);

}


/* ============================================================
   CONFIRM ACTION MODAL
============================================================ */

function confirmAction(message, callback) {

    const html = `

        <p>${escapeHTML(message)}</p>

        <div class="form-actions">

            <button class="btn light" onclick="closeModal()">

                No

            </button>

            <button class="btn danger" id="confirmActionBtn">

                Yes

            </button>

        </div>

    `;

    openModal("Confirm", html);

    document.getElementById("confirmActionBtn").addEventListener("click", function() {

        closeModal();

        callback();

    });

}


/* ============================================================
   AUDIT HELPERS
============================================================ */

function ensureAuditFields(record, user) {

    const now = new Date().toISOString();

    if (!record.createdAt) {

        record.createdAt = now;

    }

    if (!record.createdBy) {

        record.createdBy = user ? user.id : "system";

    }

    record.updatedAt = now;

}


function softDelete(collection, idValue) {

    const item = collection.find(x => x.id === idValue);

    if (item) {

        item.deleted = true;

        item.updatedAt = new Date().toISOString();

    }

}

function readFileAsDataURL(file) {

    return new Promise(function(resolve, reject) {

        if (!file) {

            resolve(null);

            return;

        }

        var reader = new FileReader();

        reader.onload = function(e) {

            resolve(e.target.result);

        };

        reader.onerror = function() {

            reject(new Error("Failed to read file"));

        };

        reader.readAsDataURL(file);

        setTimeout(function() {

            reader.abort();

            reject(new Error("File read timed out"));

        }, 30000);

    });

}
