// Layout
export * from "./layout/actions";

// Authentication module
export * from "./auth/register/actions";
export * from "./auth/login/actions";
export * from "./auth/forgetpwd/actions";
export * from "./auth/profile/actions";

// Ecommerce
export * from "./e-commerce/actions";

// Calendar
export * from "./calendar/actions";

// Chat
export * from "./chat/actions";

// Crypto
export * from "./crypto/actions";

// Invoices
export * from "./invoices/actions";

// Jobs
export * from "./jobs/actions";

// Projects
export * from "./projects/actions";

// Tasks
export * from "./tasks/actions";

// Contacts
export * from "./contacts/actions";

// Mails
export * from "./mails/actions";

// Dashboards
export * from "./dashboard/actions";
export * from "./dashboard-crypto/actions";
export * from "./dashboard-saas/actions";
export * from "./dashboard-blog/actions";
export * from "./dashboard-jobs/actions";

// USERS
export const GET_USERS = "GET_USERS";
export const GET_USERS_SUCCESS = "GET_USERS_SUCCESS";
export const GET_USERS_FAIL = "GET_USERS_FAIL";
