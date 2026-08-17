/* ============================================================
   ONBOARDING
============================================================ */

function onboarding() {

    return `

        <div class="panel">

            <h3>Onboarding Management</h3>

            <div class="job-grid">

                ${data.offers

                    .filter(o => o.status === "Accepted")

                    .map(o => {

                        const existing =

                            data.onboarding.find(

                                x =>

                                    x.applicantId ===

                                    o.applicantId

                            );

                        return `

                        <div class="job-card">

                            <h3>

                                ${applicantName(

                                    o.applicantId

                                )}

                            </h3>

                            <p>

                                ${escapeHTML(o.position)}

                            </p>

                            <p>

                                ${badge(

                                    existing

                                    ? existing.status

                                    : "Not Started"

                                )}

                            </p>

                            <button

                                class="btn primary"

                                onclick="startOnboarding('${o.applicantId}')">

                                Manage Onboarding

                            </button>

                        </div>

                        `;

                    }).join("")}

            </div>

        </div>

    `;

}


function startOnboarding(applicantId) {

    let on =

        data.onboarding.find(

            x => x.applicantId === applicantId

        );

    if (!on) {

        on = {

            id:id("on"),

            applicantId:applicantId,

            status:"In Progress",

            requirements:[

                {

                    name:"Employment Contract",

                    status:"Pending"

                },

                {

                    name:"Medical Certificate",

                    status:"Pending"

                },

                {

                    name:"Government ID",

                    status:"Pending"

                },

                {

                    name:"Emergency Contact",

                    status:"Pending"

                }

            ]

        };

        ensureAuditFields(on, currentUser);

        data.onboarding.push(on);

    }


    openModal(

        "Onboarding Requirements",

        `

        ${on.requirements.map((r,index) => `

            <div class="panel">

                <b>${escapeHTML(r.name)}</b>

                <p>

                    Status:

                    ${badge(r.status)}

                </p>

                ${

                    r.status === "Pending"

                    ?

                    `<button

                        class="btn success small"

                        onclick="verifyRequirement('${on.id}',${index})">

                        Verify

                    </button>`

                    :

                    ""

                }

            </div>

        `).join("")}

        <button

            class="btn primary"

            onclick="completeOnboarding('${on.id}')">

            Complete Onboarding

        </button>

        `

    );

}


function verifyRequirement(onboardingId,index) {

    const on =

        data.onboarding.find(

            x => x.id === onboardingId

        );

    if (!on) return;

    on.requirements[index].status =

        "Verified";

    ensureAuditFields(on, currentUser);

    saveData(data);

    closeModal();

    toast("Requirement verified.");

    render();

}


function completeOnboarding(idValue) {

    const on =

        data.onboarding.find(

            x => x.id === idValue

        );

    if (!on) return;

    const allVerified =

        on.requirements.every(

            r => r.status === "Verified"

        );

    if (!allVerified) {

        toast(

            "Verify all requirements first."

        );

        return;

    }

    on.status = "Completed";

    ensureAuditFields(on, currentUser);

    saveData(data);

    toast("Onboarding completed.");

    render();

}


function myOnboarding() {

    const a =

        data.applicants.find(

            x => x.userId === currentUser.id

        );

    const on =

        data.onboarding.find(

            x =>

                x.applicantId === a?.id

        );

    if (!on)
        return `<div class="panel empty">

            Your onboarding process has not started yet.

        </div>`;


    return `

        <div class="panel">

            <h3>My Onboarding</h3>

            ${on.requirements.map(r => `

                <div class="panel">

                    <b>${escapeHTML(r.name)}</b>

                    <p>

                        ${badge(r.status)}

                    </p>

                </div>

            `).join("")}

            <p>

                Overall Status:

                ${badge(on.status)}

            </p>

        </div>

    `;

}
