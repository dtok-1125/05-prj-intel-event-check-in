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

function addConfetti(overlay) {
  const confettiContainer = document.createElement("div");
  confettiContainer.className = "confetti-container";
  const colors = [
    "#00aeef",
    "#0071c5",
    "#f2c14e",
    "#ef476f",
    "#06d6a0",
    "#ffffff",
  ];

  for (let i = 0; i < 150; i++) {
    const confetti = document.createElement("span");
    const fromLeft = i % 2 === 0;
    const spreadIndex = (i * 37) % 150;
    const horizontalTarget = Math.max(
      2,
      Math.min(98, 4 + (spreadIndex / 149) * 92 + (Math.random() * 6 - 3)),
    );
    const launchOffset = Math.random() * 7;
    const launchPosition = fromLeft ? launchOffset : 100 - launchOffset;
    const horizontalTravel = horizontalTarget - launchPosition;

    confetti.className = "confetti-piece";
    confetti.style.left = fromLeft ? `${launchOffset}vw` : "auto";
    confetti.style.right = fromLeft ? "auto" : `${launchOffset}vw`;
    confetti.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];
    confetti.style.width = `${5 + Math.random() * 8}px`;
    confetti.style.height = `${8 + Math.random() * 13}px`;
    const peakHeight = 70 + Math.random() * 40;
    const peakOffset = 0.25 + Math.random() * 0.12;
    const peakDrift = horizontalTravel * (0.4 + Math.random() * 0.3);
    const fallDrift = Math.random() * 16 - 8;
    const duration = 6.5 + Math.random();
    const delay = Math.random() * 0.8;

    confetti.animate(
      [
        {
          opacity: 1,
          transform: "translate(0, 0) rotate(0deg)",
          offset: 0,
          easing: "cubic-bezier(0.12, 0.7, 0.25, 0.88)",
        },
        {
          opacity: 1,
          transform: `translate(${peakDrift}vw, -${peakHeight}vh) rotate(${Math.random() * 540}deg)`,
          offset: peakOffset,
          easing: "cubic-bezier(0.25, 0.12, 0.65, 1)",
        },
        {
          opacity: 0,
          transform: `translate(${horizontalTravel + fallDrift}vw, ${90 + Math.random() * 30}vh) rotate(${Math.random() * 1080}deg)`,
          offset: 1,
        },
      ],
      {
        duration: duration * 1000,
        delay: delay * 1000,
        fill: "forwards",
      },
    );

    confettiContainer.appendChild(confetti);
  }

  overlay.appendChild(confettiContainer);
  setTimeout(function () {
    confettiContainer.remove();
  }, 10000);
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

  const overlay = document.createElement("div");
  overlay.id = "celebrationOverlay";
  overlay.className = "celebration-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");

  const modal = document.createElement("div");
  modal.className = "celebration-modal";

  const celebration = document.createElement("p");
  celebration.id = "celebrationMessage";
  celebration.textContent = `🎉 Congratulations to ${winningTeams.join(" and ")} for leading attendance!`;

  addConfetti(overlay);
  modal.appendChild(celebration);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
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

        if (
          attendee &&
          typeof attendee.name === "string" &&
          typeof attendee.teamName === "string"
        ) {
          attendees.push(attendee);
          addAttendeeToList(attendee.name, attendee.teamName);
        } else {
          console.error("Invalid saved attendee entry. Skipping it.");
        }
      }
    } else {
      console.error(
        "Saved attendee list is invalid. Starting with an empty list.",
      );
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
form.addEventListener("submit", function (event) {
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
  count++;
  console.log("Total check-ins:", count);

  //Update Progress Bar
  const percentage = Math.round((count / maxCount) * 100) + "%";
  console.log(`Progress: ${percentage}`);
  attendeeCount.textContent = count;
  progressBar.style.width = percentage;

  //Update Team Counter
  const teamCounter = document.getElementById(team + "Count");
  console.log(teamCounter);
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
});
