/* ============================================================
   OFFERS
============================================================ */

function offers() {

    return `

        <div class="panel">

            <h3>Employment Offers</h3>

            <div class="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>Applicant</th>

                            <th>Position</th>

                            <th>Department</th>

                            <th>Salary</th>

                            <th>Status</th>

                        </tr>

                    </thead>

                    <tbody>

                        ${data.offers.map(o => `

                            <tr>

                                <td>

                                    ${applicantName(o.applicantId)}

                                </td>

                                <td>${escapeHTML(o.position)}</td>

                                <td>${escapeHTML(o.department)}</td>

                                <td>

                                    ₱${Number(o.salary).toLocaleString()}

                                </td>

                                <td>

                                    ${badge(o.status)}

                                </td>

                            </tr>

                        `).join("")}

                    </tbody>

                </table>

            </div>

        </div>

    `;

}


function myOffer() {

    const a =

        data.applicants.find(

            x => x.userId === currentUser.id

        );

    const offer =

        data.offers.find(

            x => x.applicantId === a?.id

        );

    if (!offer)
        return `<div class="panel empty">

            No employment offer yet.

        </div>`;


    return `

        <div class="panel">

            <h3>Employment Offer</h3>

            <p>

                <b>Position:</b>

                ${escapeHTML(offer.position)}

            </p>

            <p>

                <b>Department:</b>

                ${escapeHTML(offer.department)}

            </p>

            <p>

                <b>Salary:</b>

                ₱${Number(

                    offer.salary

                ).toLocaleString()}

            </p>

            <p>

                <b>Start Date:</b>

                ${offer.startDate}

            </p>

            <p>

                <b>Status:</b>

                ${badge(offer.status)}

            </p>

            ${

                offer.status === "Pending"

                ?

                `

                <button

                    class="btn success"

                    onclick="acceptOffer('${offer.id}')">

                    Accept Offer

                </button>

                <button

                    class="btn danger"

                    onclick="declineOffer('${offer.id}')">

                    Decline Offer

                </button>

                `

                :

                ""

            }

        </div>

    `;

}


function acceptOffer(idValue) {

    const offer =

        data.offers.find(

            x => x.id === idValue

        );

    if (!offer) return;

    offer.status = "Accepted";

    ensureAuditFields(offer, currentUser);

    saveData(data);

    toast("Offer accepted.");

    render();

}


function declineOffer(idValue) {

    const offer =

        data.offers.find(

            x => x.id === idValue

        );

    if (!offer) return;

    offer.status = "Declined";

    ensureAuditFields(offer, currentUser);

    saveData(data);

    toast("Offer declined.");

    render();

}
