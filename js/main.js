/* ============================================================
   MAIN - ENTRY POINT
============================================================ */

document.getElementById("loginForm").addEventListener("submit", function(e) {

    e.preventDefault();

    const credential =

        document.getElementById("username").value;

    const password =

        document.getElementById("password").value;

    login(credential, password);

});


window.registerFormToken = function(formId) {

    const token = generateToken();

    sessionStorage.setItem("hrms_form_token", token);

    const form = document.getElementById(formId);

    if (form) {

        form.dataset.token = token;

    }

};

(function initTheme() {

    const saved = localStorage.getItem("hrms_theme");

    if (saved === "light") {

        document.documentElement.setAttribute("data-theme", "light");

    }

})();
