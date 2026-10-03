//Get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect"); 
const checkInButton = document.getElementById("checkInBtn");
const greeting = document.getElementById("greeting");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const waterCounter = document.getElementById("waterCount");
const zeroCounter = document.getElementById("zeroCount");
const powerCounter = document.getElementById("powerCount");
const attendeeList = document.getElementById("attendeeList");
const attendees = [];

//Track Attendance
let count = 0;
const maxCount = 10; 

function addAttendeeToList(name, teamName) {
  const attendeeItem = document.createElement("li");
  attendeeItem.textContent = `${name} — ${teamName}`;
  attendeeList.appendChild(attendeeItem);
}

function getSavedCount(key) {
  const savedCount = localStorage.getItem(key);

  if (savedCount === null) {
    return 0;
  }

  const parsedCount = Number(savedCount);
  if (!Number.isInteger(parsedCount) || parsedCount < 0) {
    console.error(`Invalid saved attendance count for ${key}. Starting at 0.`);
    return 0;
  }

  return parsedCount;
}

function showCelebration() {
  if (document.getElementById("celebrationMessage")) {
    return;
  }

  const waterCount = parseInt(waterCounter.textContent);
  const zeroCount = parseInt(zeroCounter.textContent);
  const powerCount = parseInt(powerCounter.textContent);
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
  celebration.id = "celebrationMessage";
  celebration.textContent = `🎉 Congratulations to ${winningTeams.join(" and ")} for leading attendance!`;
  document.querySelector(".team-stats").appendChild(celebration);
}

try {
  count = getSavedCount("intelSummitAttendanceCount");
  waterCounter.textContent = getSavedCount("intelSummitWaterCount");
  zeroCounter.textContent = getSavedCount("intelSummitZeroCount");
  powerCounter.textContent = getSavedCount("intelSummitPowerCount");
  const savedAttendees = localStorage.getItem("intelSummitAttendees");

  if (savedAttendees !== null) {
    const parsedAttendees = JSON.parse(savedAttendees);

    if (Array.isArray(parsedAttendees)) {
      for (let i = 0; i < parsedAttendees.length; i++) {
        const attendee = parsedAttendees[i];

        if (attendee && typeof attendee.name === "string" && typeof attendee.teamName === "string") {
          attendees.push(attendee);
          addAttendeeToList(attendee.name, attendee.teamName);
        } else {
          console.error("Invalid saved attendee entry. Skipping it.");
        }
      }
    } else {
      console.error("Saved attendee list is invalid. Starting with an empty list.");
    }
  }
} catch (error) {
  console.error("Unable to load saved attendance data:", error);
}

attendeeCount.textContent = count;
const savedPercentage = Math.round((count / maxCount) * 100) + "%";
progressBar.style.width = savedPercentage;

if (count >= maxCount) {
  checkInButton.disabled = true;
  showCelebration();
}

//Handle Form Submission
form.addEventListener("submit", function (event){
event.preventDefault();

if (count >= maxCount) {
  return;
}

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

addAttendeeToList(name, teamName);
attendees.push({ name: name, teamName: teamName });

try {
  localStorage.setItem("intelSummitAttendanceCount", count);
  localStorage.setItem("intelSummitWaterCount", waterCounter.textContent);
  localStorage.setItem("intelSummitZeroCount", zeroCounter.textContent);
  localStorage.setItem("intelSummitPowerCount", powerCounter.textContent);
  localStorage.setItem("intelSummitAttendees", JSON.stringify(attendees));
} catch (error) {
  console.error("Unable to save attendance data:", error);
}

if (count >= maxCount) {
 checkInButton.disabled = true;
 showCelebration();
}

//Show Welcome Message
const message = `🎉 Welcome, ${name} from ${teamName}!`;
console.log(message);

greeting.textContent = message;
greeting.classList.add("success-message");

form.reset();

})