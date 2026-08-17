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

        const formToken = this.dataset.token;

        if (!formToken || formToken !== sessionStorage.getItem("hrms_form_token")) {

            toast("Invalid form submission.");

            return;

        }

        const f =

            new FormData(this);

        const fileErr = validateRequired(

            document.querySelector('#documentForm input[type="file"]').files[0],

            "File"

        );

        if (fileErr) { toast(fileErr); return; }

        const file =

            document.querySelector(

                '#documentForm input[type="file"]'

            ).files[0];


        const document = {

            id:id("doc"),

            employeeId:

                f.get("employee"),

            name:

                file?.name || "Document",

            date:

                new Date()

                    .toLocaleDateString()

        };

        ensureAuditFields(document, currentUser);

        data.documents.push(document);


        saveData(data);

        closeModal();

        toast("Document uploaded.");

        render();

    };

}
