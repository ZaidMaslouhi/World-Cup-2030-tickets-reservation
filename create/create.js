import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  setDoc,
  doc,
  getDoc,
  getDocs,  
  query,
  where,
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





const userEmail = document.getElementById("userEmail");
const userPassword = document.getElementById("userPassword");
const userName = document.getElementById("userName");
const userCIN = document.getElementById("userCIN");

const signupButton = document.getElementById("signupButton");

const userSignup = async () => {
  const signupEmail = userEmail.value;
  const signupPassword = userPassword.value;
  const signupName = userName.value;
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore();
  async () => {
    const user = auth.currentUser;
    const docRef = doc(db, "users",user.uid);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    console.log(userCIN);
  }; 

  const q = query(collection(db, "users"), where("cin", "==", userCIN.value));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    
  createUserWithEmailAndPassword(auth, signupEmail, signupPassword)
  .then(async () => {
    return await updateProfile(auth.currentUser, {
      displayName: signupName,
    }).catch((err) =>{ 
      Swal.fire({
      icon: "error",
      title: "Échec",
      color: "red",
      html: "<b>Email déjà utilisé!</b>",
    });
     console.log(err)});
  })
  .then(async () => {
    const user = auth.currentUser;

    try {
      const docRef = await setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        email: user.email,
        cin: userCIN.value,
        tickets: {
          1: null,
          2: null,
          3: null,
          4: null,
          5: null,
          6: null,
          7: null,
          8: null,
          9: null,
          10: null,
        },
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {      Swal.fire({
      icon: "error",
      title: "Échec",
      color: "red",
      html: "<b>Email déjà utilisé!</b>",
    });
        console.error("Error adding document: ", e);
    }

    console.log(user);
    Swal.fire({
      title: "Votre compte a été créé avec succès!",
      icon: "success",
      showConfirmButton: false,
    });

    sendEmailVerification(auth.currentUser).then(() => {
      setTimeout(function () {
        Swal.fire({
          title: "Un lien de vérification a été envoyé à votre Email!",
          icon: "info",
        });
      }, 2000);
    })

  .catch((error) => {
    Swal.fire({
      icon: "error",
      title: "Échec",
      color: "red",
      html: "<b>Email incorrect ou déjà utilisé!</b>",
    });
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode + errorMessage);
  });
  document.getElementById("signupForm").reset();

  }
  )}
  snapshot.forEach((doc) => {
    Swal.fire({
      icon: "error",
      title: "Échec",
      color: "red",
      html: "<b>CIN déjà utilisé!</b>",
    });;
  });

};

signupButton.addEventListener("click", function (event) {
  event.preventDefault();
});
signupButton.addEventListener("click", userSignup);





const passwordInput = document.querySelector("#userPassword");
const passwordStrength = document.getElementById("passwordStrength");
const poor = document.querySelector("#passwordStrength #poor");
const weak = document.querySelector("#passwordStrength #weak");
const strong = document.querySelector("#passwordStrength #strong");
const passwordInfo = document.getElementById("passwordInfo");

const poorRegExp = /(.*[a-z]){3}/;
const weakRegExp = /(?=.*?[0-9]){5}/;
const strongRegExp = /(?=.*?[#?!@$%^&*-]){8}/;
const whitespaceRegExp = /^$|\s+/;
passwordInput.oninput = function () {
  const passwordValue = passwordInput.value;
  if (passwordValue != "") {
    passwordInfo.style.display = "block";
    passwordInfo.style.color = "black";
    passwordStrength.style.display = "flex";
    checkPasswordStrength(passwordValue);
  } else {
    passwordStrength.style.display = "none";
    passwordInfo.style.display = "none";
  }
};

function checkPasswordStrength(password) {
  if (password.match(whitespaceRegExp)) {
    whitespacePassword();
  }
  if (password.match(poorRegExp)) {
    poorPasswordStrength();
  }
  if (password.match(weakRegExp)) {
    weakPasswordStrength();
  }
  if (password.match(strongRegExp)) {
    strongPasswordStrength();
    document.getElementById("signupButton").removeAttribute("disabled");
  }
}

function whitespacePassword() {
  passwordInfo.style.color = "white";
  passwordInfo.textContent = "Les espaces ne sont pas autorisés";
}

function poorPasswordStrength() {
  poor.classList.add("active");
  passwordInfo.style.color = "red";
  passwordInfo.textContent = "Mot de passe faible";
}

function weakPasswordStrength() {
  weak.classList.add("active");
  passwordInfo.style.color = "orange";
  passwordInfo.textContent = "Mot de passe moyen";
}

function strongPasswordStrength() {
  strong.classList.add("active");
  passwordInfo.textContent = "Mot de passe fort";
  passwordInfo.style.color = "green";
}

const hide = document.getElementById("hide");
function Hide() {
  var x = document.getElementById("userPassword");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}
hide.addEventListener("click", Hide);
