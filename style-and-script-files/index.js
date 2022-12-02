// These first lines assign JavaScript (JS) variables to certain parts of the HTML file so that it is easier to modify the HTML in JS.
const subtaskMenu = document.getElementById("subtask");
const taskMenu = document.getElementById("task");
const subTaskMenu = document.getElementById("subtask");
const execSummaryHeading = document.getElementById("exec-summary-heading");
const executiveSummary = document.getElementById("summary");
const definitionBin = document.getElementById("definitions-content");
const resourceBin = document.getElementById("resource-bin");
const resourceBinHeading = document.getElementById("resources-heading")
const toolWarehouse = document.getElementById("tool-warehouse");


//Creates the search type variable by reading the HTML default radio option
let searchTypeRadio = document.querySelector('input[name="search-type"]:checked').value;
// Modifies the filter options when the radio button is changed
function updateSearchType() {
    searchTypeRadio = document.querySelector('input[name="search-type"]:checked').value;

    const timingFilter = document.getElementById("timing-filter");
    const taskFilter = document.getElementById("task-filter");
    
    if (searchTypeRadio == "stage") {
        timingFilter.style.display = "block";
        taskFilter.style.display = "none";
        let subTaskValue = "";
    } else {
        taskFilter.style.display = "block";
        timingFilter.style.display = "none";
    }
}

// Initiates the updateSubtasks function when someone chooses a new "Type of Support" from the drop-down menu
taskMenu.onchange = function() {
    updateSubtasks();
};

// Updates the list of TA support subtasks to match the selected TA support category
function updateSubtasks() {
    subtaskMenu.innerHTML = "";
    var taskValue = taskMenu.options[taskMenu.selectedIndex].value;
    relatedSubtasks = tasks[taskValue];

    for (i in relatedSubtasks) {
        let subtask = document.createElement("option");
        subtask.innerHTML = relatedSubtasks[i];
        subtask.value = relatedSubtasks[i];
        subtaskMenu.appendChild(subtask);
    }
}

//This function is called when the "filter resources" button is clicked. It calls all of the subfunctions that update various parts of the content.
function updateResources() {
    var subTaskValue = subTaskMenu.options[subTaskMenu.selectedIndex].value;
    if (searchTypeRadio == "stage") {
        var searchTerm = "Functionality not yet built. Ln52 JS"
    } else {
        var searchTerm = subTaskValue;
    }

    updateExecutiveSummary(searchTerm);
    updateToolWarehouse(searchTerm);
}
//This function updates all of the information under the executive summary heading.
function updateExecutiveSummary(searchTerm) {
    executiveSummary.style.display = "block";
    execSummaryHeading.innerHTML = `Summary of ${searchTerm}`
    // Update motivation content to reflect filter settings
    motivationContent = document.getElementById("motivation-content");
    motivationContent.innerHTML = motivation[searchTerm];
    
    // Update JPAL role content to reflect filter settings
    jpalRoleContent = document.getElementById("jpals-role-content");
    jpalRoleContent.innerHTML = JPALRole[searchTerm];

    // Update other stakeholders content to reflect filter settings
    stakeholdersContent = document.getElementById("stakeholders-content");
    stakeholdersContent.innerHTML = "";
    for (i in otherStakeholders[searchTerm]) {
        let oneStakeholder = document.createElement("div");
        oneStakeholder.innerHTML = otherStakeholders[searchTerm][i].type + ": " + otherStakeholders[searchTerm][i].content;
        oneStakeholder.id = otherStakeholders[searchTerm][i].type;
        oneStakeholder.className = "stakeholder";

        stakeholdersContent.appendChild(oneStakeholder);
    }

    // Update key definitions content to reflect filter settings
    definitionContent = document.getElementById("definitions-content");
    definitionContent.innerHTML = "";
    var filteredDefinitions = getDefinitionsBySearchTerm(definitions, searchTerm);

    if (filteredDefinitions.length != 0) {
        for (i in filteredDefinitions) {
            let filteredDefinition = document.createElement("div");
            filteredDefinition.classList = "definition-container";
            filteredDefinition.id = `definition-${i}`;
            filteredDefinition.dataset.index = i;
            filteredDefinition.innerHTML = filteredDefinitions[i].word;
            filteredDefinition.onclick = function() {definitionExpand(filteredDefinitions, filteredDefinition.dataset.index);};
    
            let definitionDetailBin = document.createElement("div");
            definitionDetailBin.classList = "definitionDetailBin"
            filteredDefinition.appendChild(definitionDetailBin);
            definitionBin.appendChild(filteredDefinition);
        }
    } else {
        definitionContent.innerHTML = "No matches for this filter.";
    }
}

//This function updates all of the information under the tool warehouse heading.
function updateToolWarehouse(searchTerm) {
    resourceBin.innerHTML = "";
    toolWarehouse.style.display = "block";
    resourceBinHeading.innerHTML = `RE resources for ${searchTerm}`;
    // Filtering all resources for the given search term
    var filteredResources = getResourcesBySearchTerm(resources, searchTerm);
    
    //update "resources" with filtered results
    if (filteredResources.length != 0) {
        for (i in filteredResources) {
            let filteredResource = document.createElement("div");
            filteredResource.classList = "resource-container";
            filteredResource.id = `resource-${i}`
            filteredResource.dataset.index = i;
            filteredResource.innerHTML = `"${filteredResources[i].title}" by ${filteredResources[i].author}`;
            filteredResource.onclick = function() {resourceExpand(filteredResources, filteredResource.dataset.index);};
    
            let resourceDetailBin = document.createElement("div");
            resourceDetailBin.classList = "resourceDetailBin"
            filteredResource.appendChild(resourceDetailBin);
            resourceBin.appendChild(filteredResource);
        }
    } else {
        resourceBin.innerHTML = "We have not yet linked any specific resources to this part of the research process. Contact the RE team for additional support."
    }
    

}

//Filters the definitions by search term
function getDefinitionsBySearchTerm(arr, searchTerm) {
    return arr.filter(
        function(arr) {  return arr.tags == searchTerm  }
    );
}

// Filters the resources by search term
function getResourcesBySearchTerm(arr, searchTerm) {
    return arr.filter(
        function(arr) {  return arr.tasks == searchTerm  }
    );
}

//Used for definition expand function
var previousDefinitionIndex = 0;
//Expands a definition in the executive summary when it is clicked
function definitionExpand(arr, definitionIndex) {
    const definitionDetailBins = document.getElementsByClassName("definitionDetailBin");
    // Closing the previously opened definition
    definitionDetailBins[previousDefinitionIndex].innerHTML = "";
    // Opening the clicked on definition
    expandedDefinition = document.getElementById(`definition-${definitionIndex}`).lastChild;

    expandedDefinitionContent = document.createElement("div");
    expandedDefinitionContent.innerHTML = arr[definitionIndex].definition;
    expandedDefinition.appendChild(expandedDefinitionContent);

    previousDefinitionIndex = definitionIndex;
    return previousDefinitionIndex;
}


//Used for resource expand function
var previousResourceIndex = 0;
//Expands a resource in the tool warehouse when it is clicked
function resourceExpand(arr, resourceIndex) {
    const resourceDetailBins = document.getElementsByClassName("resourceDetailBin");
    // Closing the previously opened resource
    resourceDetailBins[previousResourceIndex].innerHTML = "";
    // Opening the clicked on resource
    expandedResource = document.getElementById(`resource-${resourceIndex}`).lastChild;

    expandedResourceDescription = document.createElement("li");
    linkBullet = document.createElement("li");
    expandedResourceLink = document.createElement("a");
    var link = document.createTextNode("Go to resource");
    expandedResourceLink.appendChild(link);
    expandedResourceLink.href = arr[resourceIndex].link;
    expandedResourceLink.target = "_blank";
    expandedResourceLink.rel = "noopener noreferrer";

    expandedResourceDescription.innerHTML = arr[resourceIndex].description;
    linkBullet.appendChild(expandedResourceLink);

    expandedResource.appendChild(expandedResourceDescription);
    expandedResource.appendChild(linkBullet);

    previousResourceIndex = resourceIndex;
    return previousResourceIndex;
}
