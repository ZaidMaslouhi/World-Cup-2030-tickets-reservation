import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCyiLtFSarq5KtsfgpbnbFK98rU1SgiBqc",
  authDomain: "world-cup-2030-7f986.firebaseapp.com",
  projectId: "world-cup-2030-7f986",
  storageBucket: "world-cup-2030-7f986.appspot.com",
  messagingSenderId: "442511059546",
  appId: "1:442511059546:web:f46304d9638bab14a6c663",
  measurementId: "G-1LJTMMRVKT",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const tick = document.getElementById("tick");
const res = document.getElementById("res");

var compteur = 0;
let nonNullTicketCount = 0;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is signed in
    const uid = user.uid;

    // Reference to the "users" collection
    const usersCollection = collection(db, "users");

    // Reference to the current user's document
    const userDocRef = doc(usersCollection, uid);

    // Retrieve the current user's document
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      // Get data from the user's document
      const userData = userDoc.data();

      // Check the "tickets" field in the user's data
      if (userData.tickets) {
        // If "tickets" is present, iterate through each ticket and count non-null ones
        Object.values(userData.tickets).forEach((ticket, index) => {
          if (ticket !== null) {
            nonNullTicketCount++;
            var det = document.getElementById("det");
            var li = document.createElement("li");
            li.appendChild(document.createTextNode(ticket));
            li.classList.add("li");
            var button = document.createElement("button");

            button.classList.add("button-82-pushable");
            // var span0 = document.createElement("span");
            // var date = new Date();
            var span1 = document.createElement("span");
            span1.classList.add("button-82-shadow");
            var span2 = document.createElement("span");
            span2.classList.add("button-82-edge");
            var span3 = document.createElement("span");
            span3.classList.add("button-82-front");
            span3.classList.add("text");
            span3.textContent = "Annuler";
            button.appendChild(span1);
            button.appendChild(span2);
            button.appendChild(span3);
            const dateSpan = document.createElement("span");
            li.appendChild(button);
            det.appendChild(li);
            button.addEventListener("click", async () => {
              // Set the corresponding ticket value to null in Firestore
              const ticketKey = "tickets." + (index + 1);
              const updateData = {};
              updateData[ticketKey] = null;

              await updateDoc(userDocRef, updateData);
              Swal.fire({
                title: "Ticket Annulé!",
                icon: "success",
                showConfirmButton: false,
                timer: 1500, // Adjust the timer as needed
              });

              // Update the UI or perform any other actions as needed
              li.remove(); // Remove the list item from the UI
              nonNullTicketCount--;
              tick.innerHTML = nonNullTicketCount;
              res.value = nonNullTicketCount;
            });
          }
          tick.innerHTML = nonNullTicketCount;
          res.value = nonNullTicketCount;
        });
      }
      var nombreInput = document.getElementById("nombre");

      // Output the result
      console.log("Total non-null tickets for user:", nonNullTicketCount);
    }

    localStorage.setItem("user", JSON.stringify(user));
    await autoFill(user.uid);

    // const upd = document.getElementById("upd");
    const match = document.getElementById("match");

    match.addEventListener("click", async (e) => {
      e.preventDefault();

      var nombreInput = document.getElementById("nombre");
      var nombre = nombreInput.value;
      var matchName;
      const uid = user.uid;
      const userDocRef = doc(usersCollection, uid);

      try {
        // Retrieve the current user's document
        const userDoc = await getDoc(userDocRef);
        var option = document.getElementById("multiselect");
        var text = option.options[option.selectedIndex].text;

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const matchNameToCount = text;

          // Count the occurrences of matchNameToCount in Tickets
          const ticketCountForMatch = Object.values(userData.tickets).filter(
            (ticket) => ticket === matchNameToCount
          ).length;
          if (
            ((userData.tickets && ticketCountForMatch) || 0) +
              parseInt(nombre, 10) <=
            3
          ) {
            if (
              ((userData.tickets && nonNullTicketCount) || 0) +
                parseInt(nombre, 10) <=
              10
            ) {
              console.log("nombreInput.max:", nombreInput.max);

              var i = 1;

              while (i <= nombre && compteur <= 10) {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                const data = docSnap.data();

                var option = document.getElementById("multiselect");
                var text = option.options[option.selectedIndex].text;

                // Find the first available ticket and update it
                for (let j = 1; j <= 10; j++) {
                  const ticketKey = "tickets." + j;
                  if (data.tickets[Object.keys(data.tickets)[j - 1]] === null) {
                    const updateData = {};
                    updateData[ticketKey] = text;

                    updateDoc(docRef, updateData).then(() => {
                      console.log("ok");
                    });

                    break; // Exit the loop after updating the first available ticket
                  }
                }
                i++;
                compteur++;
              }

              const tickets = userData.tickets || {};
              for (let i = 1; i <= parseInt(nombre, 10); i++) {
                const ticketKey = i.toString();
                tickets[ticketKey] = matchName;
              }

              const updateData = { tickets: tickets };

              Swal.fire({
                title: "Votre achat a été effectué avec succès!",
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
              });

              console.log("compteur:", compteur);
              setTimeout(function () {
                window.location.reload();
              }, 1500);
            } else {
              // Show Swal alert for reaching the maximum ticket count
              // Show Swal alert for reaching the overall maximum ticket count
              Swal.fire({
                title: "Maximum de 10 tickets atteint!",
                icon: "warning",
                showConfirmButton: true,
              });
            }
          } else {
            // Show Swal alert for reaching the maximum ticket count for the selected match
            var option = document.getElementById("multiselect");
            var text = option.options[option.selectedIndex].text;
            Swal.fire({
              title: `<h1>Maximum de 3 tickets par match <br> "${text}" </br> atteint!</h1>`,
              icon: "warning",
              showConfirmButton: true,
            });
          }
        } else {
          console.log("User document not found");
        }
      } catch (error) {
        console.error("Error retrieving user document:", error);
      }
    });
  }
});

async function autoFill(userId) {
  //   const user = JSON.parse(localStorage.getItem("user"));
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  const np = document.getElementById("nom");
  np.value = data.name;
  const em = document.getElementById("em");
  em.value = data.email;
  const carte = document.getElementById("carte");
  carte.value = data.cin;
  const addname = document.getElementById("addname");
  addname.innerHTML = data.name + " !";
  const ch = document.getElementById("cardholder");
  ch.value = data.name;

  console.log(data);
}






       