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

        const formToken = this.dataset.token;

        if (!formToken || formToken !== sessionStorage.getItem("hrms_form_token")) {

            toast("Invalid form submission.");

            return;

        }

        const f =

            new FormData(this);

        const startErr = validateRequired(f.get("start"), "Start date");

        if (startErr) { toast(startErr); return; }

        const endErr = validateRequired(f.get("end"), "End date");

        if (endErr) { toast(endErr); return; }

        const leave = {

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

        };

        ensureAuditFields(leave, currentUser);

        data.leaves.push(leave);

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

    if (!l) return;

    l.status = "Approved";

    ensureAuditFields(l, currentUser);

    saveData(data);

    render();

}


function rejectLeave(idValue) {

    const l =

        data.leaves.find(

            x => x.id === idValue

        );

    if (!l) return;

    l.status = "Rejected";

    ensureAuditFields(l, currentUser);

    saveData(data);

    render();

}
