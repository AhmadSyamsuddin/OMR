import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import programsReducer from "./programsSlice";
import classesReducer from "./classesSlice";
import userClassesReducer from "./userClassesSlice";
import paymentReducer from "./paymentSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    programs: programsReducer,
    classes: classesReducer,
    userClasses: userClassesReducer,
    payment: paymentReducer,
  },
});

export default store;