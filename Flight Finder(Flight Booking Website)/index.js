// FlyZone JavaScript Logic

let isLoggedIn = false;
let isRegistered = false;
let registeredEmail = "";
let registeredPassword = "";

// Set minimum selectable date and default value to today
window.onload = function () {
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById("date");
  if (dateInput) {
    dateInput.setAttribute("min", today);
    dateInput.value = today; // optional: pre-fill today's date
  }
};

// Toggle between Login and Sign Up
function toggleForm() {
  const formTitle = document.getElementById("formTitle");
  const nameField = document.getElementById("nameField");
  const submitBtn = document.getElementById("submitBtn");
  const toggleText = document.getElementById("toggleText");

  if (formTitle.innerText === "Sign Up") {
    formTitle.innerText = "Login";
    nameField.style.display = "none";
    submitBtn.innerText = "Login";
    submitBtn.classList.replace("btn-success", "btn-primary");
    toggleText.innerHTML = `Don't have an account? <span class="form-toggle" onclick="toggleForm()" style="cursor:pointer; color:blue;">Sign Up</span>`;
  } else {
    formTitle.innerText = "Sign Up";
    nameField.style.display = "block";
    submitBtn.innerText = "Create Account";
    submitBtn.classList.replace("btn-primary", "btn-success");
    toggleText.innerHTML = `Already registered? <span class="form-toggle" onclick="toggleForm()" style="cursor:pointer; color:blue;">Login</span>`;
  }
}

// Handle Sign Up & Login
document.getElementById("authForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const mode = document.getElementById("formTitle").innerText;
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (mode === "Sign Up") {
    if (isRegistered) {
      alert("You are already registered. Please login.");
      toggleForm();
    } else if (!name || !email || !password) {
      alert("Please fill all signup fields.");
    } else {
      isRegistered = true;
      registeredEmail = email;
      registeredPassword = password;
      alert("Registered successfully! Please login.");
      toggleForm();
    }
  } else if (mode === "Login") {
    if (!isRegistered) {
      alert("Please sign up first.");
    } else if (email === registeredEmail && password === registeredPassword) {
      isLoggedIn = true;
      alert("Login successful!");
      document.getElementById("loginSection").style.display = "none";
      document.getElementById("availability").style.display = "block";
      document.getElementById("searchBtn").disabled = false;
      document.getElementById("availability").scrollIntoView({ behavior: "smooth" });
    } else {
      alert("Invalid email or password.");
    }
  }
});

// Check login before accessing availability section
const availabilityLink = document.querySelector('a[href="#availability"]');
if (availabilityLink) {
  availabilityLink.addEventListener("click", function (event) {
    if (!isLoggedIn) {
      event.preventDefault();
      alert("You have to login first.");
    }
  });
}

// Dummy flight search function
function showFlightType() {
  const from = document.getElementById("from").value.trim();
  const to = document.getElementById("to").value.trim();
  const date = document.getElementById("date").value;
  const flightType = document.getElementById("flightType").value;
  const dropdown = document.getElementById("flightTypeContainer");

  if (!from || !to || !date) {
    alert("Please enter From, To, and Date.");
    return;
  }

  // ✅ Prevent searching with past date
  const selectedDate = new Date(date);
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // remove time for comparison
  if (selectedDate < currentDate) {
    alert("Flight search is not available for past dates.");
    return;
  }

  if (dropdown.style.display === "none") {
    dropdown.style.display = "block";
    return;
  }

  if (!flightType || flightType === "Choose...") {
    alert("Please select a flight type.");
    return;
  }

  const results = document.getElementById("flightResults");
  const tableBody = document.getElementById("flightTableBody");
  tableBody.innerHTML = "";

  const flights = [
    {
      flightNo: "FZ101",
      from: "Hyderabad",
      to: "Bangalore",
      departure: "08:00 AM",
      arrival: "10:15 AM",
      prices: { economy: 3200, business: 8500 }
    },
    {
      flightNo: "FZ202",
      from: "Bangalore",
      to: "Delhi",
      departure: "11:30 AM",
      arrival: "01:45 PM",
      prices: { economy: 3400, business: 9000 }
    },
    {
      flightNo: "FZ303",
      from: "Bangalore",
      to: "Hyderabad",
      departure: "04:00 PM",
      arrival: "06:20 PM",
      prices: { economy: 3000, business: 8300 }
    }
  ];

  const filteredFlights = flights.filter(flight =>
    flight.from.toLowerCase() === from.toLowerCase() &&
    flight.to.toLowerCase() === to.toLowerCase()
  );

  if (filteredFlights.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" class="text-center">No flights available for this route.</td></tr>`;
  } else {
    filteredFlights.forEach(flight => {
      const price = flight.prices[flightType.toLowerCase()];
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${flight.flightNo}</td>
        <td>${flight.from}</td>
        <td>${flight.to}</td>
        <td>${flight.departure}</td>
        <td>${flight.arrival}</td>
        <td>₹ ${price}</td>
        <td><button class="btn btn-success btn-sm" onclick="bookFlight('${flight.flightNo}')">Book</button></td>
      `;
      tableBody.appendChild(row);
    });
  }

  results.style.display = "block";
}

function bookFlight(flightNo) {
  alert("Booking initiated for " + flightNo);
}
