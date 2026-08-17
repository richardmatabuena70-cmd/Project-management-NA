/* ============================================================
   REPORTS
============================================================ */

function reports() {

    return `

        <div class="cards">

            ${statCard(

                "👥",

                data.applicants.filter(a => !a.archived).length,

                "Total Applicants"

            )}

            ${statCard(

                "🤝",

                data.applicants.filter(

                    a => a.status === "Hired" && !a.archived

                ).length,

                "Hired"

            )}

            ${statCard(

                "❌",

                data.applicants.filter(

                    a => a.status === "Rejected" && !a.archived

                ).length,

                "Rejected"

            )}

            ${statCard(

                "👨‍💼",

                data.employees.length,

                "Employees"

            )}

        </div>


        <div class="panel">

            <h3>HR Reports</h3>

            <p>

                Recruitment, hiring and employee

                information summary.

            </p>

            <table>

                <tr>

                    <th>Category</th>

                    <th>Total</th>

                </tr>

                <tr>

                    <td>Job Vacancies</td>

                    <td>${data.vacancies.filter(v => !v.deleted).length}</td>

                </tr>

                <tr>

                    <td>Applications</td>

                    <td>${data.applications.filter(a => !a.archived).length}</td>

                </tr>

                <tr>

                    <td>Interviews</td>

                    <td>${data.interviews.length}</td>

                </tr>

                <tr>

                    <td>Employment Offers</td>

                    <td>${data.offers.length}</td>

                </tr>

                <tr>

                    <td>Employees</td>

                    <td>${data.employees.length}</td>

                </tr>

            </table>

        </div>

    `;

}
