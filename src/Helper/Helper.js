import bcrypt from "bcryptjs";
import emailjs from "@emailjs/browser";
import { storage } from "../Firebase";
import {
  ref,
  deleteObject,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";

export const Constants = {
  LOGIN: "LOGIN",
  FORGOT: "FORGOT",
  OTP: "OTP",
  UPDATE_PASSWORD: "UPDATE_PASSWORD",
};
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const Roles = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  USER: "USER",
};
export const encryptData = (word) => {
  return bcrypt.hashSync(word, 5);
};

export const compareEncryptedData = (userData, HashData) => {
  return bcrypt.compareSync(userData, HashData);
};
export const sendEmail = async (email, message) => {
  let obj = {};
  try {
    const resp = await emailjs.send(
      process.env.REACT_APP_SERVICE_ID,
      process.env.REACT_APP_TEMPLATE_ID,
      { email, message },
      process.env.REACT_APP_PUBLIC_KEY
    );
    obj = { success: true, data: resp };
  } catch (error) {
    obj = { success: false, data: error };
  }
  console.log(obj);
  return obj;
};
export const generateOTP = (length) => {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};
export const MODES = {
  LIGHT: "LIGHT",
  DARK: "DARK",
};

export const COLORS = {
  LIGHT: {
    "--bgColor-1": "#fff",
    "--textColor-1": "#16151C",
    "--textColor-2": "#A2A1A8",
    "--pannelColor": "#FAFAFB",
    "--pannelHoverColor": "#F3F2FB",
    "--borderColor-1": "#ECECEE",
  },
  DARK: {
    "--bgColor-1": "#16151C",
    "--textColor-1": "#FFFFFF",
    "--textColor-2": "#9F9EA5",
    "--pannelColor": "#1D1C23",
    "--pannelHoverColor": "#211F2D",
    "--borderColor-1": "#323138",
  },
};

export const Greetings = () => {
  const greets = ["Good Morning", "Good Afternoon", "Good Evening"];
  var day = new Date();
  var hrs = day.getHours();
  if (hrs >= 0 && hrs <= 12) {
    return greets[0];
  }
  if (hrs >= 12 && hrs <= 16) {
    return greets[1];
  }
  return greets[2];
};

export const EMPLOYEE_TYPES = {
  FULL_TIME_EMPLOYEES: "Full-Time Employees",
  PART_TIME_EMPLOYEES: "Part-Time Employees",
  CONTRACT_EMPLOYEES: "Contract Employees",
  TEMPORARY_EMPLOYEES: "Temporary Employees",
  INTERNS: "Interns",
  FREELANCERS_CONSULTANTS: "Freelancers/Consultants",
  REMOTE_EMPLOYEES: "Remote Employees",
  SEASONAL_EMPLOYEES: "Seasonal Employees",
  GIG_WORKERS: "Gig Workers",
  VOLUNTEERS: "Volunteers",
};
export const OFFICE_LOCATIONS = {
  BANGALORE: "Bangalore",
  HYDERABAD: "Hyderabad",
  NEW_DELHI: "New Delhi",
  GURUGRAM: "Gurugram",
  PUNE: "Pune",
};
export const validateForm = (...formInputs) => {
  let isValid = true;
  formInputs.forEach((x) => {
    let flag = true;
    if (x == -1 || x === " " || x === null || x === undefined) flag = false;
    isValid &&= flag;
  });
  return isValid;
};
export const uploadFile = async (file) => {
  if (typeof file == "string") return file;
  if (file) {
    try {
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      const uploadTaskSnapshot = await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
              default:
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            resolve(uploadTask.snapshot);
          }
        );
      });

      const downloadURL = await getDownloadURL(uploadTaskSnapshot.ref);
      console.log("file uploaded");
      return downloadURL;
    } catch (error) {
      console.log(error.message);
    }
  }
  return null;
};
export const deleteFile = async (file_url) => {
  if (file_url) {
    try {
      const baseUrl =
        "https://firebasestorage.googleapis.com/v0/b/hrms-9a64d.appspot.com/o/";
      const startIndex = baseUrl.length;
      const endIndex = baseUrl.indexOf("?");
      const path = file_url
        .substring(startIndex, endIndex)
        .replace(/%2F/g, "/");
      const delRef = ref(storage, path);
      await deleteObject(delRef);
    } catch (error) {
      console.log(error.message);
    }
  }
};
export const userAlreadyExistInData = (data, userID) => {
  for (let user of data) {
    if (user.id === userID) return true;
  }
  return false;
};

export const checkIsSingleDataExist = (arr, parameter) => {
  for (let x of arr) {
    if (x[parameter]) return true;
  }
  return false;
};
export function formatDate(inputDate) {
  var date = new Date(inputDate);
  var monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  var monthName = monthNames[date.getMonth()];
  var day = date.getDate();
  var year = date.getFullYear();
  return monthName + " " + day + ", " + year;
}
export const getDay = (inputDate) => {
  var date = new Date(inputDate);
  var dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return dayNames[date.getDay()];
};

export const LEAVE_TYPES = {
  PAID_LEAVES: [
    "Sick Leave",
    "Casual Leave",
    "Annual Leave (or Paid Time Off)",
    "Maternity/Paternity Leave",
    "Parental Leave",
    "Bereavement Leave",
    "Compensatory Leave",
    "Public Holidays",
  ],
  UNPAID_LEAVES: ["Unpaid Leave", "Study Leave", "Sabbatical Leave"],
};

export const LEAVE_STATUS = {
  ACCEPT: "Accept",
  REJECT: "Reject",
  PENDING: "Pending",
};

export const calculateDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const differenceInMilliseconds = end - start;
  const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
  return differenceInDays + 1;
};

export const ATTENDANCE_OPTIONS = {
  PRESENT: "Present",
  ABSENT: "Absent",
};

export const convertToDoubleDigit = (num) => {
  if (num >= 0 && num <= 9) return `0${num}`;
  return `${num}`;
};

export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

export const Candidate_status={
  INPROGRESS :'Inprogress',
  SELECTED:'Selected',
  REJECTED:'Rejected'
}

export const isPaidLeave=(leaveType)=>{
  return LEAVE_TYPES.PAID_LEAVES.includes(leaveType)
}

export const normalizeNum = (num)=>{
  return `₹${Number((Number(num)).toFixed(0)).toLocaleString("en-IN")}`;
}

export const getDaysInMonth = (month, year) =>{
  const nextMonth = new Date(year, month + 1, 0);
  return nextMonth.getDate();
}
