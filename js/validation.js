/* VALIDATION.JS - Validação específica para formulário de ticket */

document.addEventListener("submit", function (e) {
  const form = e.target;

  if (!form.id || form.id !== "ticketForm") return;

  let hasError = false;

  const caseIdField = document.getElementById("caseId");
  if (caseIdField) {
    const caseValue = caseIdField.value.trim();
    if (caseValue === "") {
      e.preventDefault();
      hasError = true;
      const errorMsg = caseIdField.getAttribute("aria-errormessage") || "Case ID is required";
      alertBox("⚠️", "", errorMsg);
      caseIdField.focus();
      return;
    }
  }

  const caseTypeField = document.querySelector('[name="caseType"].hidden-tasks-input');
  if (caseTypeField) {
    const caseTypeValue = caseTypeField.value.trim();
    if (caseTypeValue === "" || caseTypeValue === "[]") {
      e.preventDefault();
      hasError = true;
      const errorMsg = caseTypeField.getAttribute("aria-errormessage") || "Case Type is required";
      alertBox("⚠️", "", errorMsg);
      return;
    }
  }

  const programLevelField = document.querySelector('[name="programLevel"].hidden-tasks-input');
  if (programLevelField) {
    const programLevelValue = programLevelField.value.trim();
    if (programLevelValue === "" || programLevelValue === "[]") {
      e.preventDefault();
      hasError = true;
      const errorMsg = programLevelField.getAttribute("aria-errormessage") || "Program Level is required";
      alertBox("⚠️", "", errorMsg);
      return;
    }
  }

  const teamField = document.querySelector('[name="team"].hidden-tasks-input');
  if (teamField) {
    const teamValue = teamField.value.trim();
    if (teamValue === "") {
      e.preventDefault();
      hasError = true;
      const errorMsg = teamField.getAttribute("aria-errormessage") || "Team is required";
      alertBox("⚠️", "", errorMsg);
      return;
    }
  }

  const onCallRadios = form.querySelectorAll('[name="onCall"]');
  let onCallSelected = false;
  onCallRadios.forEach(radio => {
    if (radio.checked) onCallSelected = true;
  });

  if (!onCallSelected) {
    e.preventDefault();
    hasError = true;
    const errorMsg = onCallRadios[0]?.getAttribute("aria-errormessage") || "Please select if you are on call";
    alertBox("⚠️", "", errorMsg);
    return;
  }

  const descriptionField = document.getElementById("problemDescription");
  if (descriptionField) {
    const descValue = descriptionField.value.trim();
    if (descValue === "") {
      e.preventDefault();
      hasError = true;
      const errorMsg = descriptionField.getAttribute("aria-errormessage") || "Problem description is required";
      alertBox("⚠️", "", errorMsg);
      descriptionField.focus();
      return;
    }
  }
}, true);

document.addEventListener("submit", function (e) {
  const form = e.target;

  if (!form.id || form.id !== "ticketForm") return;

  if (e.defaultPrevented) return;

  const caseIdField = document.getElementById("caseId");
  if (caseIdField) {
    const caseValue = caseIdField.value.trim();
    if (caseValue !== "") {
      const caseIdRegex = /^\d-\d{10,}$/;
      if (!caseIdRegex.test(caseValue)) {
        e.preventDefault();
        caseIdField.setAttribute("aria-invalid", "true");
        alertBox("⚠️", "", "Case ID format is not valid. Expected format: 1-1234567890");
        caseIdField.focus();
        return;
      }
    }
  }

  const siteField = form.querySelector('[name="site"]');
  if (siteField) {
    const siteValue = siteField.value.trim();
    if (siteValue !== "") {
      const urlRegex = /^(https?:\/\/)?([\w\d-]+\.)+[\w-]+(\/[\w\d-._~:/?#[\]@!$&'()*+,;=]*)?$/i;
      if (!urlRegex.test(siteValue)) {
        e.preventDefault();
        siteField.setAttribute("aria-invalid", "true");
        const errorMsg = siteField.getAttribute("aria-errormessage") || "Site URL is not valid";
        alertBox("⚠️", "", errorMsg);
        siteField.focus();
        return;
      }
    }
  }

  const ga4Field = form.querySelector('[name="ga4"]');
  if (ga4Field) {
    const ga4Value = ga4Field.value.trim();
    if (ga4Value !== "") {
      const ga4Regex = /^G-[A-Z0-9]{4,20}$/i;
      if (!ga4Regex.test(ga4Value)) {
        e.preventDefault();
        ga4Field.setAttribute("aria-invalid", "true");
        const errorMsg = ga4Field.getAttribute("aria-errormessage") || "GA4 ID must start with G- followed by alphanumeric characters";
        alertBox("⚠️", "", errorMsg);
        ga4Field.focus();
        return;
      }
    }
  }

  const gtmField = form.querySelector('[name="gtm"]');
  if (gtmField) {
    const gtmValue = gtmField.value.trim();
    if (gtmValue !== "") {
      const gtmRegex = /^GTM-[A-Z0-9]{4,20}$/i;
      if (!gtmRegex.test(gtmValue)) {
        e.preventDefault();
        gtmField.setAttribute("aria-invalid", "true");
        const errorMsg = gtmField.getAttribute("aria-errormessage") || "GTM ID must start with GTM- followed by alphanumeric characters";
        alertBox("⚠️", "", errorMsg);
        gtmField.focus();
        return;
      }
    }
  }
});
