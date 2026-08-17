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

                    status:"Pending",

                    submittedAt:"",

                    submittedBy:"",

                    submissionNote:"",

                    file:"",

                    rejectionNote:"",

                    verifiedAt:"",

                    verifiedBy:""

                },

                {

                    name:"Medical Certificate",

                    status:"Pending",

                    submittedAt:"",

                    submittedBy:"",

                    submissionNote:"",

                    file:"",

                    rejectionNote:"",

                    verifiedAt:"",

                    verifiedBy:""

                },

                {

                    name:"Government ID",

                    status:"Pending",

                    submittedAt:"",

                    submittedBy:"",

                    submissionNote:"",

                    file:"",

                    rejectionNote:"",

                    verifiedAt:"",

                    verifiedBy:""

                },

                {

                    name:"Emergency Contact",

                    status:"Pending",

                    submittedAt:"",

                    submittedBy:"",

                    submissionNote:"",

                    file:"",

                    rejectionNote:"",

                    verifiedAt:"",

                    verifiedBy:""

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
                    r.submittedAt ? `<p><b>Submitted:</b> ${r.submittedAt}</p>` : ""
                }

                ${
                    r.file ? `<p><a href="${r.file}" target="_blank" rel="noopener">📎 View Submission</a></p>` : ""
                }

                ${
                    r.status === "Submitted"

                    ?

                    `<div style="margin-top:10px; display:flex; gap:8px; flex-wrap:wrap;">

                        <button

                            class="btn success small"

                            onclick="verifyRequirement('${on.id}',${index},'Verified')">

                            Verify

                        </button>

                        <button

                            class="btn danger small"

                            onclick="verifyRequirement('${on.id}',${index},'Rejected')">

                            Reject

                        </button>

                    </div>`

                    :

                    r.status === "Rejected"

                    ?

                    `<button

                        class="btn light small"

                        onclick="resubmitRequirement('${on.id}',${index})">

                        Allow Resubmit

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


function verifyRequirement(onboardingId,index, action) {

    const on =

        data.onboarding.find(

            x => x.id === onboardingId

        );

    if (!on) return;

    const note = action === "Rejected"

        ?

        prompt("Reason for rejection:")

        :

        null;

    if (action === "Rejected" && note === null) return;

    on.requirements[index].status = action;

    if (action === "Verified") {

        on.requirements[index].verifiedAt =

            new Date().toLocaleDateString();

        on.requirements[index].verifiedBy = currentUser.id;

        on.requirements[index].rejectionNote = "";

    }

    else if (action === "Rejected") {

        on.requirements[index].rejectionNote = note;

        on.requirements[index].verifiedAt = "";

        on.requirements[index].verifiedBy = "";

    }

    ensureAuditFields(on, currentUser);

    saveData(data);

    startOnboarding(on.applicantId);

    toast("Requirement " + action.toLowerCase() + ".");

}


function resubmitRequirement(onboardingId,index) {

    const on =

        data.onboarding.find(

            x => x.id === onboardingId

        );

    if (!on) return;

    on.requirements[index].status = "Pending";

    on.requirements[index].submittedAt = "";

    on.requirements[index].submittedBy = "";

    on.requirements[index].submissionNote = "";

    on.requirements[index].file = "";

    on.requirements[index].rejectionNote = "";

    on.requirements[index].verifiedAt = "";

    on.requirements[index].verifiedBy = "";

    ensureAuditFields(on, currentUser);

    saveData(data);

    startOnboarding(on.applicantId);

    toast("Requirement reopened for resubmission.");

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

            ${on.requirements.map((r,index) => `

                <div class="panel">

                    <b>${escapeHTML(r.name)}</b>

                    <p>

                        ${badge(r.status)}

                    </p>

                    ${r.rejectionNote ? `<p style="color:#f87171; margin-top:6px;"><b>Feedback:</b> ${escapeHTML(r.rejectionNote)}</p>` : ""}

                    ${r.status === "Pending" || r.status === "Rejected" ? `

                        <button

                            class="btn primary small"

                            style="margin-top:10px;"

                            onclick="openSubmitRequirement('${on.id}',${index})">

                            Submit Requirement

                        </button>

                    ` : ""}

                    ${r.status === "Submitted" ? `<p style="margin-top:8px; color:var(--text-muted); font-size:12px;">Waiting for HR verification...</p>` : ""}

                </div>

            `).join("")}

            <p style="margin-top:16px;">

                Overall Status:

                ${badge(on.status)}

            </p>

        </div>

    `;

}


function openSubmitRequirement(onboardingId,index) {

    const on =

        data.onboarding.find(

            x => x.id === onboardingId

        );

    if (!on) return;

    const req = on.requirements[index];

    openModal(

        "Submit: " + req.name,

        `

        <form id="submitRequirementForm">

            <div class="form-grid">

                <label class="full-width">

                    Submission Note

                    <textarea name="note" rows="3" placeholder="Add any notes for HR..."></textarea>

                </label>

                <label class="full-width">

                    Upload File

                    <input name="file" type="file" accept="*/*">

                </label>

            </div>

            <div class="form-actions">

                <button

                    type="button"

                    class="btn light"

                    onclick="closeModal()">

                    Cancel

                </button>

                <button

                    type="submit"

                    class="btn primary">

                    Submit

                </button>

            </div>

        </form>

        `

    );


    document.getElementById(

        "submitRequirementForm"

    ).onsubmit = async function(e) {

        e.preventDefault();

        const f = new FormData(this);

        const note = f.get("note");

        const fileInput = f.get("file");

        let fileDataURL = null;

        if (fileInput && fileInput.size > 0) {

            try {

                fileDataURL = await readFileAsDataURL(fileInput);

            } catch (err) {

                toast("Failed to read file.");

                return;

            }

        }

        req.status = "Submitted";

        req.submittedAt = new Date().toLocaleDateString();

        req.submittedBy = currentUser.id;

        req.submissionNote = note;

        req.file = fileDataURL;

        ensureAuditFields(on, currentUser);

        saveData(data);

        closeModal();

        toast("Requirement submitted.");

        render();

    };

}
