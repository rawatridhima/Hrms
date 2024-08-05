import {
  ATTENDANCE_OPTIONS,
  convertToDoubleDigit,
  getDaysInMonth,
  isPaidLeave,
  normalizeNum,
} from "../Helper/Helper";
import EmployeeService from "./EmployeeService";
import Service from "./Service";

export default class AttendanceService extends Service {
  static async create(entity) {
    return super.create(entity, "attendance");
  }

  static async read(id = "") {
    return super.read(id, "attendance");
  }

  static async update(id, entity) {
    return super.update(id, entity, "attendance");
  }

  static async delete(idArr) {
    return super.delete(idArr, "attendance");
  }

  //Add Extra methods

  static async attendanceExist(userId, date) {
    const all_attendance = Object.values(
      (await super.read("", "attendance")) || []
    );
    for (let x of all_attendance) {
      if (x.user === userId && x.date === date) return x;
    }
    return null;
  }
  static async giveHoliday(date) {
    const all_users = await EmployeeService.getAllIds();
    for (let user of all_users) {
      const att = await this.attendanceExist(user, date);
      if (att) {
        await this.update(att.id, {
          user,
          status: ATTENDANCE_OPTIONS.PRESENT,
          date,
          isHoliday: true,
        });
      } else {
        await this.create({
          user,
          status: ATTENDANCE_OPTIONS.PRESENT,
          date,
          isHoliday: true,
        });
      }
    }
  }

  static async cancelHoliday(date) {
    const all_users = await EmployeeService.getAllIds();
    for (let user of all_users) {
      const attendance = await this.attendanceExist(user, date);
      if (attendance) {
        await this.delete([attendance.id]);
      }
    }
  }
  static getDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dateArray = [];
    let currentDate = start;

    while (currentDate <= end) {
      const dt = new Date(currentDate);
      dateArray.push(
        `${dt.getFullYear()}-${convertToDoubleDigit(
          dt.getMonth() + 1
        )}-${convertToDoubleDigit(dt.getUTCDate())}`
      );
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
  }
  static async cancelLeave(userId, fromDate, toDate) {
    const dateRange = this.getDateRange(fromDate, toDate);
    for (let date of dateRange) {
      const attendance = await this.attendanceExist(userId, date);
      if (attendance) {
        await this.delete([attendance.id]);
      }
    }
  }
  static async giveLeave(userId, fromDate, toDate) {
    const dateRange = this.getDateRange(fromDate, toDate);
    for (let date of dateRange) {
      const attendance = await this.attendanceExist(userId, date);
      if (attendance) {
        await this.update(attendance.id, {
          user: userId,
          status: isPaidLeave
            ? ATTENDANCE_OPTIONS.PRESENT
            : ATTENDANCE_OPTIONS.ABSENT,
          date,
          isLeave: true,
        });
      } else {
        await this.create({
          user: userId,
          status: ATTENDANCE_OPTIONS.PRESENT,
          date,
          isLeave: true,
        });
      }
    }
  }
  static async giveParameters(month, yr, userId, ctc) {
    const all_users = Object.values((await this.read()) || []);
    let total_present = 0;
    let total_absent = 0;
    for (let x of all_users) {
      const d = new Date(x.date);
      if (d.getMonth() == month && d.getFullYear() == yr && x.user == userId) {
        if (x.status === ATTENDANCE_OPTIONS.PRESENT) {
          total_present++;
        } else {
          total_absent++;
        }
      }
    }
    //  salary calculations
    const gross_salary = ctc / 12;
    const gross_salary_per_day = gross_salary / getDaysInMonth(month, yr);
    const hra = 0.2 * gross_salary;
    const da = 0.1 * gross_salary;
    const basic_salary = gross_salary - hra - da;
    const pf = 0.12 * basic_salary;
    const esi = 0.0175 * gross_salary;
    const deductions =
       pf + esi + total_absent * gross_salary_per_day;
    const net_salary = gross_salary - deductions;
    return {
      total_present,
      total_absent,
      total_attendance_marked: total_present + total_absent,
      gross_salary: normalizeNum(gross_salary),
      gross_salary_per_day: normalizeNum(gross_salary_per_day),
      hra: normalizeNum(hra),
      da: normalizeNum(da),
      basic_salary: normalizeNum(basic_salary),
      pf: normalizeNum(pf),
      esi: normalizeNum(esi),
      deductions: normalizeNum(deductions),
      net_salary: normalizeNum(net_salary),
    };
  }
  static async noOfAttendance() {
    const curr = new Date(Date.now()).toISOString().slice(0,10)
    const res = Object.values((await this.read()) || []);
    const l = res.sort((a, b) => a.timeStamp - b.timeStamp);
    let count = 0;
    for (let r of res) {
      const d=new Date(r.date).toISOString().slice(0,10)
      if (d == curr) {
        count = count + 1;
      }
    }

    const arr = [];
    arr[0] = count;
    arr[1] = l[l.length - 1].timeStamp;
    return arr;
  }
}
