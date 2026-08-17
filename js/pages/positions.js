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

                                <td>${escapeHTML(p.name)}</td>

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

                    ${data.departments.filter(d => !d.deleted).map(d => `

                        <option value="${d.id}">

                            ${escapeHTML(d.name)}

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

        const formToken = this.dataset.token;

        if (!formToken || formToken !== sessionStorage.getItem("hrms_form_token")) {

            toast("Invalid form submission.");

            return;

        }

        const f =

            new FormData(this);

        const nameErr = validateRequired(f.get("name"), "Position name");

        if (nameErr) { toast(nameErr); return; }

        const position = {

            id:id("p"),

            name:f.get("name"),

            department:

                f.get("department")

        };

        ensureAuditFields(position, currentUser);

        data.positions.push(position);

        saveData(data);

        closeModal();

        render();

    };

}
