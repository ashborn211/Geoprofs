import { defineConfig } from "cypress";
import admin from "firebase-admin";
import * as path from "path";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Initialize Firebase Admin SDK
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(
            path.resolve(__dirname, "./serviceAccountKey.json")
          ),
        });
      }

      // Define custom task for Firebase authentication
      on("task", {
        loginWithEmailAndPassword({ email, password }) {
          return admin
            .auth()
            .getUserByEmail(email)
            .then((userRecord) => {
              return admin.auth().createCustomToken(userRecord.uid);
            })
            .then((customToken) => {
              return customToken;
            })
            .catch((error) => {
              throw new Error(`Failed to log in: ${error.message}`);
            });
        },
      });

      return config;
    },
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
