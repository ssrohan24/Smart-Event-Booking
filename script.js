class Event {
  constructor(id, name, category, date, totalSeats, price) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.date = date;
    this.totalSeats = totalSeats;
    this.availableSeats = totalSeats;
    this.price = price;
  }
  bookSeats(seats) {
    if (this.availableSeats >= seats) {
      this.availableSeats = this.availableSeats - seats;
      return true;
    } else {
      return false;
    }
  }
  cancelSeats(seats) {
    this.availableSeats = this.availableSeats + seats;
  }
}

Event.prototype.isAvailable = function () {
  if (this.availableSeats > 0) {
    return true;
  } else {
    return false;
  }
};

function Booking(id, user, eventName, seats, cost) {
  this.id = id;
  this.user = user;
  this.eventName = eventName;
  this.seats = seats;
  this.cost = cost;
}

var eventData = [
  new Event(1, "Music Night", "Music", "2026-04-15", 100, 45),
  new Event(2, "Tech Conference", "Technology", "2026-04-20", 200, 120),
  new Event(3, "Food Festival", "Food", "2026-05-01", 150, 25),
  new Event(4, "Startup Meetup", "Technology", "2026-05-10", 80, 35)
];

function fetchEvents() {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(eventData);
    }, 1000);
  });
}

var events = [];
var bookings = [];

async function init() {
  try {
    events = await fetchEvents();
    renderEvents(events);
    updateDashboard();
  } catch (e) {
    alert("Error loading data");
  }
}
init();

function renderEvents(list) {
  var container = document.getElementById("eventList");
  container.innerHTML = "";
  for (var i = 0; i < list.length; i++) {
    var e = list[i];
    var div = document.createElement("div");
    div.className = "event-card";
    div.innerHTML =
      "<h3>" + e.name + "</h3>" +
      "<p>" + e.category + "</p>" +
      "<p>" + e.date + "</p>" +
      "<p>" + e.availableSeats + " / " + e.totalSeats + " seats</p>" +
      "<p>₹" + e.price + "</p>" +
      "<button onclick='bookTicket(" + e.id + ")'>Book Now</button>";
    container.appendChild(div);
  }
}

function bookTicket(eventId) {
  var name = prompt("Enter your name:");
  var seats = parseInt(prompt("Enter seats:"));

  if (!name) {
    alert("Enter name");
    return;
  }

  if (seats <= 0) {
    alert("Invalid seats");
    return;
  }

  var event = null;

  for (var i = 0; i < events.length; i++) {
    if (events[i].id == eventId) {
      event = events[i];
    }
  }

  if (event == null) {
    alert("Event not found");
    return;
  }

  if (!event.bookSeats(seats)) {
    alert("Not enough seats");
    return;
  }

  var booking = new Booking(
    "BK-" + new Date().getTime(),
    name,
    event.name,
    seats,
    seats * event.price
  );

  bookings.push(booking);

  renderEvents(events);
  renderBookings();
  updateDashboard();
}

function renderBookings() {
  var container = document.getElementById("bookingList");
  container.innerHTML = "";
  for (var i = 0; i < bookings.length; i++) {
    var b = bookings[i];
    var div = document.createElement("div");
    div.innerHTML =
      "<p><b>" + b.id + "</b> - " + b.user + "</p>" +
      "<p>" + b.eventName + " - " + b.seats + " seats - ₹" + b.cost + "</p>" +
      "<button onclick=\"cancelBooking('" + b.id + "')\">Cancel</button>" +
      "<hr>";
    container.appendChild(div);
  }
}

function cancelBooking(id) {
  var index = -1;
  for (var i = 0; i < bookings.length; i++) {
    if (bookings[i].id == id) {
      index = i;
    }
  }
  if (index == -1) {
    alert("Booking not found");
    return;
  }
  var booking = bookings[index];
  for (var i = 0; i < events.length; i++) {
    if (events[i].name == booking.eventName) {
      events[i].cancelSeats(booking.seats);
    }
  }
  bookings.splice(index, 1);
  renderEvents(events);
  renderBookings();
  updateDashboard();
}

function updateDashboard() {
  document.getElementById("totalEvents").innerText = events.length;
  document.getElementById("totalBookings").innerText = bookings.length;

  var totalSeats = 0;
  var revenue = 0;
  var count = {};

  for (var i = 0; i < bookings.length; i++) {
    totalSeats = totalSeats + bookings[i].seats;
    revenue = revenue + bookings[i].cost;

    var name = bookings[i].eventName;

    if (count[name]) {
      count[name] = count[name] + bookings[i].seats;
    } else {
      count[name] = bookings[i].seats;
    }
  }

  document.getElementById("totalSeats").innerText = totalSeats;
  document.getElementById("revenue").innerText = revenue;

  var top = "-";
  var max = 0;

  for (var key in count) {
    if (count[key] > max) {
      max = count[key];
      top = key;
    }
  }

  document.getElementById("topEvent").innerText = top;
}

function filterEvents() {
  var text = document.getElementById("search").value.toLowerCase();
  var category = document.getElementById("categoryFilter").value;
  var availableOnly = document.getElementById("availableOnly").checked;

  var filtered = [];

  for (var i = 0; i < events.length; i++) {
    var e = events[i];

    if (e.name.toLowerCase().includes(text)) {

      if (category != "All") {
        if (e.category != category) {
          continue;
        }
      }

      if (availableOnly) {
        if (e.availableSeats <= 0) {
          continue;
        }
      }

      filtered.push(e);
    }
  }

  renderEvents(filtered);
}

function searchEvents() {
  filterEvents();
}