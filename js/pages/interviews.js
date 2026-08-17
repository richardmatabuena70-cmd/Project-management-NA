/* ============================================================
   INTERVIEWS
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

        const formToken = this.dataset.token;

        if (!formToken || formToken !== sessionStorage.getItem("hrms_form_token")) {

            toast("Invalid form submission.");

            return;

        }

        const f =

            new FormData(this);

        const dateErr = validateRequired(f.get("date"), "Date");

        if (dateErr) { toast(dateErr); return; }

        const timeErr = validateRequired(f.get("time"), "Time");

        if (timeErr) { toast(timeErr); return; }

        const interview = {

            id:id("i"),

            applicationId:

                f.get("applicationId"),

            date:f.get("date"),

            time:f.get("time"),

            location:f.get("location"),

            status:"Scheduled",

            result:"Pending"

        };

        ensureAuditFields(interview, currentUser);

        data.interviews.push(interview);


        const app =

            data.applications.find(

                a => a.id === f.get("applicationId")

            );

        if (app)

            app.status = "Interview Scheduled";

        ensureAuditFields(app, currentUser);

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

    if (!i) return;

    i.status = "Completed";

    i.result = result;

    ensureAuditFields(i, currentUser);

    const app =

        data.applications.find(

            x => x.id === i.applicationId

        );

    if (app) {

        app.status =

            result === "Passed"

            ? "Interview Completed"

            : "Rejected";

        ensureAuditFields(app, currentUser);

    }

    saveData(data);

    closeModal();

    toast("Interview result recorded.");

    render();

}
