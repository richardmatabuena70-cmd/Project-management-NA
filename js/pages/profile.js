/* ============================================================
   PROFILE
============================================================ */

function profile() {

    const employee =

        data.employees.find(

            e =>

                e.id === currentUser.employeeId

        );

    if (!employee)
        return `<div class="panel">

            Profile not available.

        </div>`;


    return `

        <div class="panel">

            <h3>My Profile</h3>

            <p>

                <b>Name:</b>

                ${employeeName(employee.id)}

            </p>

            <p>

                <b>Employee Number:</b>

                ${employee.employeeNumber}

            </p>

            <p>

                <b>Email:</b>

                ${employee.email}

            </p>

        </div>

    `;

}


function employment() {

    const employee =

        data.employees.find(

            e =>

                e.id === currentUser.employeeId

        );

    if (!employee)
        return `<div class="panel">

            Employment information not found.

        </div>`;


    return `

        <div class="panel">

            <h3>My Employment</h3>

            <p>

                <b>Position:</b>

                ${positionName(employee.position)}

            </p>

            <p>

                <b>Department:</b>

                ${departmentName(employee.department)}

            </p>

            <p>

                <b>Salary:</b>

                ₱${Number(

                    employee.salary

                ).toLocaleString()}

            </p>

            <p>

                <b>Hire Date:</b>

                ${employee.hireDate}

            </p>

            <p>

                <b>Status:</b>

                ${badge(employee.status)}

            </p>

        </div>

    `;

}
