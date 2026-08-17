/* ============================================================
   AUTHENTICATION
============================================================ */

function login(credential, password) {

    const trimmed =
        (credential || "").trim().toLowerCase();

    let user = data.users.find(
        u =>
            (u.email || "").toLowerCase() === trimmed
    );

    if (!user) {

        user = data.users.find(
            u =>
                (u.username || "").toLowerCase() === trimmed
        );

    }

    if (!user) {

        toast("Invalid email or password.");

        return false;

    }

    if (!verifyPassword(password, user.password)) {

        toast("Invalid email or password.");

        return false;

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

    return true;

}


function logout() {

    currentUser = null;

    document.getElementById(
        "system"
    ).classList.add("hidden");

    document.getElementById(
        "loginPage"
    ).classList.remove("hidden");

}


function toggleTheme() {

    const html =
        document.documentElement;

    const current =
        html.getAttribute("data-theme");

    if (current === "light") {

        html.removeAttribute("data-theme");

        localStorage.setItem(
            "hrms_theme",
            "dark"
        );

    }

    else {

        html.setAttribute(
            "data-theme",
            "light"
        );

        localStorage.setItem(
            "hrms_theme",
            "light"
        );

    }

}


function updateUser() {

    document.getElementById(
        "userName"
    ).textContent = currentUser.name;

    document.getElementById(
        "userRole"
    ).textContent = currentUser.role;

    const avatarImg = document.getElementById("avatarImg");

    const avatarLetter = document.getElementById("avatarLetter");

    if (currentUser.avatar) {

        avatarImg.src = currentUser.avatar;

        avatarImg.style.display = "block";

        avatarLetter.style.display = "none";

    } else {

        avatarImg.src = "";

        avatarImg.style.display = "none";

        avatarLetter.style.display = "flex";

        avatarLetter.textContent = currentUser.name.charAt(0);

    }

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
            ["archived","🗄️","Archive"],
            ["interviews","📅","Interviews"],
            ["hiring","🤝","Hiring Decisions"],
            ["offers","✉️","Employment Offers"],
            ["onboarding","✅","Onboarding"],
            ["employees","👨‍💼","Employees"],
            ["departments","🏢","Departments"],
            ["positions","📌","Positions"],
            ["records","🗂️","Employee Records"],
            ["documents","📁","Documents"],
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
            ["myOnboarding","✅","My Onboarding"]
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
            ["records","🗂️","My Records"]
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
   REGISTRATION
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

                    Display Name

                    <input name="username" required>

                </label>

                <label>

                    Profile Picture

                    <input name="avatar" type="file" accept="image/*">

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

    ).onsubmit = async function(e) {

        e.preventDefault();

        const f =

            new FormData(this);

        const emailErr = validateEmail(f.get("email"));

        if (emailErr) {

            toast(emailErr);

            return;

        }

        const nameErr = validateRequired(f.get("name"), "Full name");

        if (nameErr) {

            toast(nameErr);

            return;

        }

        const userErr = validateRequired(f.get("username"), "Display name");

        if (userErr) {

            toast(userErr);

            return;

        }

        const passErr = validateMaxLength(f.get("password"), 72, "Password");

        if (passErr) {

            toast(passErr);

            return;

        }

        let avatarDataURL = null;

        const avatarFile = f.get("avatar");

        if (avatarFile && avatarFile.size > 0) {

            try {

                avatarDataURL = await readFileAsDataURL(avatarFile);

            } catch (err) {

                toast("Failed to read profile picture.");

                return;

            }

        }

        const newUser = {

            id:id("u"),

            username:
                f.get("username"),

            password:
                hashPassword(f.get("password")),

            role:"HR",

            name:
                f.get("name"),

            email:
                f.get("email"),

            avatar: avatarDataURL

        };


        data.users.push(newUser);

        saveData(data);

        closeModal();

        toast(

            "HR account created. You can now login."

        );

    };

}


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

                    Display Name

                    <input name="username" required>

                </label>

                <label>

                    Profile Picture

                    <input name="avatar" type="file" accept="image/*">

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

    ).onsubmit = async function(e) {

        e.preventDefault();

        const f =

            new FormData(this);

        const emailErr = validateEmail(f.get("email"));

        if (emailErr) {

            toast(emailErr);

            return;

        }

        const firstErr = validateRequired(f.get("firstName"), "First name");

        if (firstErr) {

            toast(firstErr);

            return;

        }

        const lastErr = validateRequired(f.get("lastName"), "Last name");

        if (lastErr) {

            toast(lastErr);

            return;

        }

        const userErr = validateRequired(f.get("username"), "Display name");

        if (userErr) {

            toast(userErr);

            return;

        }

        let avatarDataURL = null;

        const avatarFile = f.get("avatar");

        if (avatarFile && avatarFile.size > 0) {

            try {

                avatarDataURL = await readFileAsDataURL(avatarFile);

            } catch (err) {

                toast("Failed to read profile picture.");

                return;

            }

        }

        const newUser = {

            id:id("u"),

            username:
                f.get("username"),

            password:
                hashPassword(f.get("password")),

            role:"APPLICANT",

            name:
                f.get("firstName")
                + " "
                + f.get("lastName"),

            email:
                f.get("email"),

            avatar: avatarDataURL

        };


        data.users.push(newUser);


        const applicant = {

            id:id("a"),

            userId:newUser.id,

            firstName:
                f.get("firstName"),

            lastName:
                f.get("lastName"),

            email:
                f.get("email"),

            status:"Draft"

        };

        ensureAuditFields(applicant, currentUser);

        data.applicants.push(applicant);


        saveData(data);

        closeModal();

        toast(

            "Account created. You can now login."

        );

    };

}


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
