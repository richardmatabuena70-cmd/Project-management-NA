/* ============================================================
   HRMS BASIC TESTS
============================================================ */

const results = [];
const resultsDiv = document.getElementById("results");
const summaryDiv = document.getElementById("summary");

function assert(condition, testName) {

    const passed = !!condition;

    results.push({ name: testName, passed });

    const div = document.createElement("div");

    div.className = "test-result " + (passed ? "pass" : "fail");

    div.textContent = (passed ? "✓ PASS" : "✗ FAIL") + ": " + testName;

    resultsDiv.appendChild(div);

}


/* ID */

assert(typeof id === "function", "id() is a function");

assert(id("test").startsWith("test"), "id() returns correct prefix");

assert(id("a") !== id("a"), "id() generates unique values");


/* ESCAPE HTML */

assert(escapeHTML("<script>") === "&lt;script&gt;", "escapeHTML escapes angle brackets");

assert(escapeHTML('a"b') === "a&quot;b", "escapeHTML escapes quotes");

assert(escapeHTML("a&b") === "a&amp;b", "escapeHTML escapes ampersands");

assert(escapeHTML(null) === "", "escapeHTML handles null");

assert(escapeHTML(undefined) === "", "escapeHTML handles undefined");


/* BADGE */

assert(badge("Hired").includes("green"), "badge() returns green for Hired");

assert(badge("Pending").includes("orange"), "badge() returns orange for Pending");

assert(badge("Rejected").includes("red"), "badge() returns red for Rejected");

assert(badge("Unknown").includes("blue"), "badge() returns blue for unknown status");


/* VALIDATORS */

assert(validateEmail("test@example.com") === null, "validateEmail accepts valid email");

assert(validateEmail("invalid") !== null, "validateEmail rejects invalid email");

assert(validateEmail("") !== null, "validateEmail rejects empty email");

assert(validateEmail(null) !== null, "validateEmail rejects null email");

assert(validateRequired("value", "Field") === null, "validateRequired accepts non-empty value");

assert(validateRequired("", "Field") !== null, "validateRequired rejects empty string");

assert(validateRequired(null, "Field") !== null, "validateRequired rejects null");

assert(validateMaxLength("short", 10, "Field") === null, "validateMaxLength accepts short value");

assert(validateMaxLength("this is a very long string indeed", 10, "Field") !== null, "validateMaxLength rejects long value");


/* PASSWORD HASHING */

const hashed = hashPassword("secret123");

assert(hashed !== "secret123", "hashPassword does not store plaintext");

assert(verifyPassword("secret123", hashed) === true, "verifyPassword accepts correct password");

assert(verifyPassword("wrong", hashed) === false, "verifyPassword rejects wrong password");

assert(verifyPassword("secret123", null) === false, "verifyPassword rejects null hash");


/* LOCAL STORAGE */

const testKey = "HRMS_TEST_KEY";

const testData = { foo: "bar", num: 42 };

localStorage.setItem(testKey, JSON.stringify(testData));

const loaded = JSON.parse(localStorage.getItem(testKey));

assert(loaded.foo === "bar", "localStorage save/load works for objects");

assert(loaded.num === 42, "localStorage preserves numbers");

localStorage.removeItem(testKey);


/* CONFIRM ACTION */

assert(typeof confirmAction === "function", "confirmAction() is a function");


/* TOKEN GENERATION */

const token1 = generateToken();

const token2 = generateToken();

assert(typeof token1 === "string" && token1.length > 0, "generateToken returns non-empty string");

assert(token1 !== token2, "generateToken returns unique tokens");


/* SUMMARY */

const passed = results.filter(r => r.passed).length;

const failed = results.filter(r => !r.passed).length;

summaryDiv.innerHTML = `Tests: ${results.length} | Passed: ${passed} | Failed: ${failed}`;

if (failed > 0) {

    summaryDiv.className = "fail";

} else {

    summaryDiv.className = "pass";

}
