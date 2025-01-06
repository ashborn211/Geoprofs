/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

// cypress/support/commands.ts


// Initialize Firebase only if it hasn't been initialized already
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
    getAuth,
    setPersistence,
    browserLocalPersistence,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

// Firebase config object
const firebaseConfig = {
    apiKey: "AIzaSyCGPXI9a5y1kYgNmW-bd7kcEXtzPBrDC7M",
    authDomain: "geoprofs-3f4e4.firebaseapp.com",
    databaseURL: "https://geoprofs-3f4e4-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "geoprofs-3f4e4",
    storageBucket: "geoprofs-3f4e4.appspot.com",
    messagingSenderId: "956083793044",
    appId: "1:956083793044:web:f1674b50fae72ccf18d881",
    measurementId: "G-ZFMSVSN97W"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
declare global {
    namespace Cypress {
        interface Chainable {
            login(email: string, password: string): Chainable<any>;
            mockLogin(user: {
                uid: string;
                email: string;
                userName?: string;
                role?: string;
                team?: string;
            }): Chainable<void>;
        }
    }
}

// Add the mockLogin command
Cypress.Commands.add("mockLogin", (user) => {
    cy.window().then((win) => {
        const mockUser = {
            uid: user.uid || "123456",
            email: user.email || "test@example.com",
            userName: user.userName || "Mock User",
            role: user.role || "user",
            team: user.team || "default-team",
        };
        // Store the mock user in localStorage
        win.localStorage.setItem("mockUser", JSON.stringify(mockUser));
    });
});

declare global {
    namespace Cypress {
        interface Chainable {
            login(email: string, password: string): Chainable<any>;
        }
    }
}

// Add the login command
Cypress.Commands.add("login", (email: string, password: string) => {
    cy.window().then((win) => {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                // Store the authenticated user info in localStorage
                win.localStorage.setItem("firebaseAuth", JSON.stringify(user));
            })
            .catch((error) => {
                console.error("Error signing in:", error);
            });
    });
    
});
