import { combineReducers } from "redux";

// Front
import Layout from "./layout/reducer";

// Authentication
import Login from "./auth/login/reducer";
import Account from "./auth/register/reducer";
import ForgetPassword from "./auth/forgetpwd/reducer";
import Profile from "./auth/profile/reducer";

// E-commerce
import ecommerce from "./e-commerce/reducer";

// Calendar
import calendar from "./calendar/reducer";

// Chat
import chat from "./chat/reducer";

// Crypto
import crypto from "./crypto/reducer";

// Invoices
import invoices from "./invoices/reducer";

// Jobs
import JobReducer from "./jobs/reducer";

// Projects
import projects from "./projects/reducer";

// Tasks
import tasks from "./tasks/reducer";

// Contacts
import contacts from "./contacts/reducer";

// Mails
import mails from "./mails/reducer";

// Dashboards
import Dashboard from "./dashboard/reducer";
import DashboardSaas from "./dashboard-saas/reducer";
import DashboardCrypto from "./dashboard-crypto/reducer";
import DashboardBlog from "./dashboard-blog/reducer";
import DashboardJob from "./dashboard-jobs/reducer";

// Users
import users from "./users/reducer"; // ✅ à ne pas dupliquer

const rootReducer = combineReducers({
  Layout,
  Login,
  Account,
  ForgetPassword,
  Profile,
  ecommerce,
  calendar,
  chat,
  mails,
  crypto,
  invoices,
  JobReducer,
  projects,
  tasks,
  contacts,
  Dashboard,
  DashboardSaas,
  DashboardCrypto,
  DashboardBlog,
  DashboardJob,
  users, // ✅ une seule fois ici
});

export default rootReducer;
