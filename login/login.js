import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCyiLtFSarq5KtsfgpbnbFK98rU1SgiBqc",
  authDomain: "world-cup-2030-7f986.firebaseapp.com",
  projectId: "world-cup-2030-7f986",
  storageBucket: "world-cup-2030-7f986.appspot.com",
  messagingSenderId: "442511059546",
  appId: "1:442511059546:web:f46304d9638bab14a6c663",
  measurementId: "G-1LJTMMRVKT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

const userEmail = document.getElementById("userEmail");
const userPassword = document.getElementById("userPassword");
const userName = document.getElementById("userName");

const loginEmail = document.getElementById("userEmailLogin");
const loginPassword = document.getElementById("userPasswordLogin");

const authForm = document.getElementById("signupForm");
const loginForm = document.getElementById("LoginForm");


const loginButton = document.getElementById("loginButton");

const userLogin = async () => {
  const email = loginEmail.value;
  const password = loginPassword.value;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log(userCredential.user.uid);
      Swal.fire({
        icon: "success",
        title: "Bienvenue",
        showConfirmButton: false,
        timer: 1000,
        color: "green",
      }).then(async (result) => {
        window.location.href = "/wcVisiteur.html";
      });
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Échec",
        html: "<b>Email ou mot de passe incrrecte!</b>",
        color: "red",
      });
      const errorCode = error.code;
      const errorMessage = error.message;
      consol.log(errorCode + errorMessage);
    });
};

loginButton.addEventListener("click", function (event) {
  event.preventDefault();
});

loginButton.addEventListener("click", userLogin);


const hi = document.getElementById("hi");
function Hide() {
  var x = document.getElementById("userPasswordLogin");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}
hi.addEventListener("click",Hide)
