import { adminGet } from "./adminClient.js";

export const getDashboard = (days) => adminGet("/dashboard", { range: days });