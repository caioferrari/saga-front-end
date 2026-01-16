/* CLOSING FORM CARD */
const getFormTemplate = (data) => {
  const configData = window.appConfigData;
  
  if(!configData) {
    // return `Loading topics. Please wait...`;
    console.log("Loading topics. Please wait...")
  }

  const teamTasks = configData.team.sme.tasks; 
  const teamCMS = configData.team.sme.CMS;
  const problemCats = configData.topics.problemCategory;
  const statusCats = configData.topics.statusCategory;
  
  return `
    <div class="form-container" style="display: none;">
      <form action="#" class="close-ticket" id="queueFormClose">
        <input type="hidden" name="ticketProgram" value="${data.program}" />
        <input type="hidden" name="ticketOnCall" value="${data.onCall}" />
        <input type="hidden" name="ticketDecription" value="${data.description}" />
        <input type="hidden" name="ticketCaseWebsite" value="${data.website}" />
        <input type="hidden" name="ticketCaseCMS" value="${data.cms}" />
        <input type="hidden" name="ticketCaseCID" value="${data.cid}" />
        <input type="hidden" name="ticketCaseGA4" value="${data.ga4}" />
        <input type="hidden" name="ticketCaseGTM" value="${data.gtm}" />
        <input type="hidden" name="ticketCaseID" value="${data.caseId}" />
        <input type="hidden" name="ticketLDAP" value="${data.ldap}" />
        <input type="hidden" name="ticketRole" value="${data.role}" />
        <input type="hidden" name="ticketAgentName" value="${data.agentName}" />
        <input type="hidden" name="ticketWaitingTime" value="${data.waitingTime}" />
  
        <textarea id="answerBase" name="problemDescription" placeholder="Technical Description" aria-required="true" aria-errormessage="It is important to know what solution you came up for this case."></textarea>
        
        <div class="custom-select-container multi-select">
          <input type="hidden" name="tasks_data" class="hidden-tasks-input" aria-required="true" aria-errormessage="Let us know what tasks the agent has asked for help with.">
          <div class="select-trigger">
            <div class="selected-tags">
              <input type="text" class="task-input" name="taskInput" placeholder="What tasks did you help with?" autocomplete="off" />
            </div>
          </div>
          <ul class="select-options">${generateOptions(teamTasks)}</ul>
        </div>
  
        <input type="text" id="snippetInput" name="snippetInput" placeholder="Did you share codes?" />
        <input type="text" id="docInput" name="docInput" placeholder="Did you share documentation?" />
  
        <div class="custom-select-container multi-select">
          <input type="hidden" name="cms_data" class="hidden-tasks-input" aria-required="true" aria-errormessage="Please, inform the website CMS (if you did not identify one, use 'Other' option)." />
          <div class="select-trigger">
            <div class="selected-tags">
              <input type="text" class="task-input" name="cmsInput" placeholder="Website CMS?" autocomplete="off" />
            </div>
          </div>
          <ul class="select-options">${generateOptions(teamCMS)}</ul>
        </div>
  
        <div class="last-options">
          <div class="custom-select-container single-select">
            <input type="hidden" name="problem_data" class="hidden-tasks-input" aria-required="true" aria-errormessage="It is important to inform the problem this ticket was consisted." />
            <div class="select-trigger">
              <div class="selected-tags">
                <input type="text" class="task-input" name="problemInput" placeholder="Problem Category" />
              </div>
            </div>
            <ul class="select-options">${generateOptions(problemCats)}</ul>
          </div>
  
          <div class="custom-select-container single-select">
            <input type="hidden" name="status_data" class="hidden-tasks-input" aria-required="true" aria-errormessage="What status will you end this case?" />
            <div class="select-trigger">
              <div class="selected-tags">
                <input type="text" class="task-input" name="statusInput" placeholder="Status Category" />
              </div>
            </div>
            <ul class="select-options">${generateOptions(statusCats)}</ul>
          </div>
        </div>
        <button type="submit" class="btn btn-primary" title="OK">Submit Content</button>
      </form>
    </div>`;
};

//Stock card's data
const getCardData = (card) => {
  return {
    program: card.getAttribute("data-program") || "",
    onCall: card.getAttribute("data-oncall") === "true" ? "On Call" : "Not On Call",
    description: card.querySelector(".text-content p")?.innerText || "",
    website: card.querySelector(".case-website span")?.innerText || "",
    cms: card.querySelector(".case-cms span")?.innerText || "",
    cid: card.querySelector(".case-cid span")?.innerText || "",
    ga4: card.querySelector(".case-ga4 span")?.innerText || "",
    gtm: card.querySelector(".case-gtm span")?.innerText || "",
    caseId: card.querySelector(".case-id h3")?.innerText || card.querySelector(".card-header h3")?.innerText || "",
    ldap: card.querySelector(".profile-info .ldap")?.innerText || "",
    role: card.querySelector(".profile-info .role")?.innerText || "",
    agentName: card.querySelector(".profile-info h2")?.innerText || "",
    waitingTime: card.querySelector(".program-badge .waiting-time")?.innerText || ""
  };
};

//Loading functions and events
const initExistingTakeCards = () => {
  document.querySelectorAll(".take-card").forEach(card => {
    const actionsArea = card.querySelector(".profile-actions");
    if(actionsArea && !actionsArea.querySelector(".form-container")) {
      const data = getCardData(card);
      actionsArea.insertAdjacentHTML("beforeend", getFormTemplate(data));

      if(typeof customSelect === "function") customSelect();
    }
  });

  if(typeof initializeReadMore === "function") initializeReadMore();
};

document.addEventListener("click", (e) => {
  const target = e.target;
  
  // TAKE CARD
  if(target && target.getAttribute("title") === "Take") {
    const card = target.closest(".queue-card");
    const container = card.parentNode;
    const actionsArea = card.querySelector(".profile-actions");
    
    if(typeof loadingBox === "function") loadingBox();
    
    card.classList.add("take-card");
    card.dataset.status = "In Progress";
    container.appendChild(card);
    
    const data = getCardData(card);
    
    target.outerHTML = `
        <div class="action-buttons">
          <button class="take close toggle-form" title="Close" type="button">Close</button>
          <button class="return-btn" title="Return to queue" type="button">Return to queue</button>
        </div>
      `;
    
    actionsArea.insertAdjacentHTML("beforeend", getFormTemplate(data));
    if(typeof customSelect === "function") customSelect();
    if(typeof initializeReadMore === "function") initializeReadMore();

    const alertContainer = document.querySelector("#alert");
    if(alertContainer) {
      alertContainer.querySelector(".loading")?.remove();
      alertContainer.classList.remove("alert-container");
    }
  }
  
  // TOGGLE FORM
  if(target && target.classList.contains("toggle-form")) {
    const card = target.closest(".queue-card");
    const formContainer = card.querySelector(".form-container");
    const isHidden = formContainer.style.display === "none";
    
    formContainer.style.display = isHidden ? "block" : "none";
    target.innerText = isHidden ? "Hide Form" : "Close";
  }
  
  // Return to queue
  if(target && target.classList.contains("return-btn")) {
    const cardToReturn = target.closest(".queue-card");
    cardToReturn.setAttribute("data-status-temp", "returning");
    
    if(typeof promptBox === "function") {
      promptBox("⚠️", "Important", "The case will be returned to the SME queue. Do you want to proceed?");
    }
  }
  
  //Return confirmed
  if(target && target.getAttribute("title") === "Yes") {
    const targetCard = document.querySelector('[data-status-temp="returning"]');
    
    if(targetCard) {
      const container = targetCard.parentNode;
      const actionsArea = targetCard.querySelector(".profile-actions");
      
      actionsArea.querySelector(".action-buttons")?.remove();
      actionsArea.querySelector(".form-container")?.remove();
      
      actionsArea.insertAdjacentHTML("beforeend", `<button class="take" title="Take">Take</button>`);

      targetCard.classList.remove("take-card");
      targetCard.removeAttribute("data-status-temp");
      targetCard.dataset.status = "On Queue";

      container.insertBefore(targetCard, container.firstChild);

      if(typeof initializeReadMore === "function") initializeReadMore();
    }
    closePrompt();
  }
  
  //Return canceled
  if(target && target.getAttribute("title") === "Cancel") {
    document.querySelector('[data-status-temp="returning"]')?.removeAttribute("data-status-temp");
    closePrompt();
  }
});