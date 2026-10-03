//Get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect"); 
const greeting = document.getElementById("greeting");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");

//Track Attendance
let count = 0;
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
attendeeCount.textContent = count;
progressBar.style.width = percentage;

//Update Team Counter
const teamCounter = document.getElementById(team + "Count")
console.log(teamCounter)
teamCounter.textContent = parseInt(teamCounter.textContent) + 1;

if (count === maxCount) {
  const waterCount = parseInt(document.getElementById("waterCount").textContent);
  const zeroCount = parseInt(document.getElementById("zeroCount").textContent);
  const powerCount = parseInt(document.getElementById("powerCount").textContent);
  let highestCount = waterCount;
  const winningTeams = [];

  if (zeroCount > highestCount) {
    highestCount = zeroCount;
  }
  if (powerCount > highestCount) {
    highestCount = powerCount;
  }
  if (waterCount === highestCount) {
    winningTeams.push("Team Water Wise");
  }
  if (zeroCount === highestCount) {
    winningTeams.push("Team Net Zero");
  }
  if (powerCount === highestCount) {
    winningTeams.push("Team Renewables");
  }

  const celebration = document.createElement("p");
  celebration.textContent = `🎉 Congratulations to ${winningTeams.join(" and ")} for leading attendance!`;
  document.querySelector(".team-stats").appendChild(celebration);
}

//Show Welcome Message
const message = `🎉 Welcome, ${name} from ${teamName}!`;
console.log(message);

greeting.textContent = message;
greeting.classList.add("success-message");

form.reset();

})