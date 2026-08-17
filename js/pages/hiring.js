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

    ensureAuditFields(app, currentUser);

    const a =

        data.applicants.find(

            x => x.id === app.applicantId

        );

    if (a) {

        a.status = "Hired";

        ensureAuditFields(a, currentUser);

    }


    const vacancy =

        data.vacancies.find(

            x => x.id === app.vacancyId

        );


    const offer = {

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

    };

    ensureAuditFields(offer, currentUser);

    data.offers.push(offer);


    saveData(data);

    toast("Applicant hired. Employment offer created.");

    render();

}
