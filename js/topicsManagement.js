//JSON topics
let configData;
const loadConfig = async () => {
  try {
    const response = await fetch('/js/topics.json');
    configData = await response.json();
    initExistingTakeCards();
    addTicketData(); 
  }catch(error) {
    console.error("Error loading JSON of topics:", error);
  }
};
loadConfig();

//Form Template
const generateOptions = (list) => {
  if(!list) {
    return '';
  }
  let finalHTML = "";
  
  list.forEach((item) => {
    finalHTML = finalHTML + `<li>${item}</li>`;
  });
  return finalHTML;
};