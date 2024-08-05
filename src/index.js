import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Roles, encryptData } from "./Helper/Helper";
import { db } from "./Firebase";
import { onValue, ref, set } from "firebase/database";
import { uid } from "uid";
import { Provider } from "react-redux";
import store from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import SettingService from "./Services/SettingService";

const loadSuperAdmin = () => {
  onValue(ref(db, `users/`), (snapshot) => {
    const data = snapshot.val();
    if (data === null) {
      const id = uid();
      set(ref(db, "users/" + id), {
        id,
        name:process.env.REACT_APP_SUPERADMIN_NAME,
        email: process.env.REACT_APP_SUPERADMIN_EMAIL,
        pass: encryptData(process.env.REACT_APP_SUPERADMIN_PASSWORD),
        role: Roles.SUPER_ADMIN,
        time: Date.now(),
      });
      //settings for admin
      SettingService.create({
        user:id,
        mobile_notify:false,
        desktop_notify:false,
        email_notify:true
      })
    }
  });
};
loadSuperAdmin();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate persistor={persistStore(store)} loading={null}>
          <App />
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
