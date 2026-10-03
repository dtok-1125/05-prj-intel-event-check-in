//Get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect"); 

//Track Attendance
let = count = 0;
const maxCount = 50; 
//Handle Form Submission
form.addEventListener("submit", function (event){
event.preventDefault();

//Get Form Values
const name = nameInput.value;
const team = teamSelect.value;
const teamName = teamSelect.selectedOptions[0].text;

console.log(name, teamName);

//Increment Count
count++
console.log("Total check-ins:", count);

//Update Progress Bar
const percentage = Math.round((count/maxCount) * 100) + "%";
console.log(`Progress: ${percentage}`);

//Update Team Counter
const teamCounter = document.getElementById(team + "Count")
console.log(TeamCounter)
const current = parseInt(teamCounter.textContent);
console.log("Previous team count: ", current);

const newTotal = current + 1;
teamCounter.textContent = newTotal;
console.log("New team count: ", newTotal);

})