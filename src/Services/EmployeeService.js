import { Roles, encryptData, uploadFile, deleteFile } from "../Helper/Helper";
import Service from "./Service";
import DepartmentService from "./DepartmentService";

export default class EmployeeService extends Service {
  static async create(entity) {
    const pass = encryptData(`${entity.user_name}@1234`);
    entity.profile = await uploadFile(entity.profile);
    entity.appointment_letter = await uploadFile(entity.appointment_letter);
    entity.salary_slips = await uploadFile(entity.salary_slips);
    entity.reliving_letter = await uploadFile(entity.reliving_letter);
    entity.experience_letter = await uploadFile(entity.experience_letter);
    return await super.create(
      {
        ...entity,
        pass,
        role: Roles.USER,
        name: `${entity.first_name} ${entity.last_name}`,
      },
      "users",
      true,
      true
    );
  }
  static async read(id = "") {
    return super.read(id, "users");
  }
  static async update(id, entity) {
    // delete older files
    if (entity.original_profile != entity.profile)
      await deleteFile(entity.original_profile);
    if (entity.original_appointment_letter != entity.appointment_letter)
      await deleteFile(entity.original_appointment_letter);
    if (entity.original_salary_slips != entity.salary_slips)
      await deleteFile(entity.original_salary_slips);
    if (entity.original_reliving_letter != entity.reliving_letter)
      await deleteFile(entity.original_reliving_letter);
    if (entity.original_experience_letter != entity.experience_letter)
      await deleteFile(entity.original_experience_letter);
    //Uploading Updated files
    entity.profile = await uploadFile(entity.profile);
    entity.appointment_letter = await uploadFile(entity.appointment_letter);
    entity.salary_slips = await uploadFile(entity.salary_slips);
    entity.reliving_letter = await uploadFile(entity.reliving_letter);
    entity.experience_letter = await uploadFile(entity.experience_letter);
    return super.update(
      id,
      {
        ...entity,
        name: `${entity.first_name} ${entity.last_name}`,
        original_profile: null,
        original_appointment_letter: null,
        original_experience_letter: null,
        original_reliving_letter: null,
        original_salary_slips: null,
      },
      "users"
    );
  }
  static async delete(idArr) {
    for (const id of idArr) {
      //Deleting all the files first
      const emp = await super.read(id, "users");
      await deleteFile(emp.profile);
      await deleteFile(emp.appointment_letter);
      await deleteFile(emp.salary_slips);
      await deleteFile(emp.reliving_letter);
      await deleteFile(emp.experience_letter);

      //Now Delete Settings
      const settings = Object.values(await super.read("", "settings"));
      for (const setting of settings) {
        if (setting.user === id) {
          await super.delete([setting.id], "settings");
        }
      }

      // delete attendance
      const att = Object.values((await super.read("", "attendance")) || []);
      for (let a of att) {
        if (a.user === id) {
          await super.delete([a.id], "attendance");
        }
      }

      // delete leaves
      const leave = Object.values((await super.read("", "leaves")) || []);
      for (let l of leave) {
        if (l.user === id) {
          await super.delete([l.id], "leaves");
        }
      }
    }

    // Now Deleting the users
    return await super.delete(idArr, "users");
  }

  // extra methods

  static async getNewEmpId() {
    const all_users = (await this.getAllEmployees()).sort((a, b) =>
      a.empId.localeCompare(b.empId)
    );
    const length =
      Number(all_users[all_users.length - 1].empId.split("-")[1]) + 1;
    if (length >= 0 && length <= 9) return `00${length}`;
    if (length >= 10 && length <= 99) return `0${length}`;
    return length;
  }
  static async userNameExists(userName) {
    const all_users = await super.read("", "users");
    let userExists = false;
    Object.values(all_users).forEach((x) => {
      if (x.user_name === userName) {
        userExists = true;
        return; //this will exit the foreach loop
      }
    });
    return userExists;
  }
  static async checkEmailExists(email) {
    const all_users = await super.read("", "users");
    let userExists = false;
    Object.values(all_users).forEach((x) => {
      if (x.email === email) {
        userExists = true;
        return; //this will exit the foreach loop
      }
    });
    return userExists;
  }
  static async getAllEmployees() {
    const all_users = await super.read("", "users");
    const users = Object.values(all_users).filter((x) => x.role === Roles.USER);
    const departmentPromise = users.map((user) =>
      DepartmentService.read(user.department).then((dept) => ({
        ...user,
        department: dept?.name,
      }))
    );
    const result = await Promise.all(departmentPromise);
    return result;
  }
  static async filterEmployees({ searchEmpText, empDepArr, empTypeArr }) {
    const all_users = await this.getAllEmployees();
    let returnArray1 = [];
    let returnArray2 = [];
    let returnArray3 = [];
    let data = all_users;
    if (searchEmpText !== "") {
      for (let user of data) {
        if (user.name.toLowercase().includes(searchEmpText.toLowercase()))
          returnArray1.push(user);
      }
      data = returnArray1;
    }
    if (empDepArr && empDepArr.length > 0) {
      for (let user of data) {
        for (let depID of empDepArr) {
          if (
            depID === (await DepartmentService.getDepartmentID(user.department))
          )
            returnArray2.push(user);
        }
      }
      data = returnArray2;
    } else returnArray1 = returnArray2;
    if (empTypeArr && empTypeArr.length > 0) {
      for (let user of data) {
        for (let empType of empTypeArr) {
          if (empType === user.emp_type) returnArray3.push(user);
        }
      }
    } else returnArray3 = returnArray2;
    return returnArray3;
  }
  static async getAllIds() {
    return (await this.getAllEmployees()).map((x) => x.id);
  }
  static async getEmployessByDep() {
    const all_users = Object.values(await super.read("", "users"));
    const all_dep_id = Object.keys(await super.read("", "departments"));
    const userByDep = {};
    all_dep_id.forEach((depId) => {
      const users = [];
      all_users.forEach((user) => {
        if (user.department === depId && user.role === Roles.USER)
          users.push(user);
      });
      userByDep[depId] = users;
    });
    return userByDep;
  }
  static async getEmployessById(id) {
    const all_users = Object.values((await super.read("", "users")) || []);
 const arr=[]
    all_users.forEach((x) => {
      if (x.id === id) {
        arr.push(x)
      }
    });
return arr;
  }
  static async totalEmployees() {
    const res = Object.values((await this.read()) || []);
    const l = res.sort((a, b) => a.timeStamp - b.timeStamp);
    console.log(l)
    const arr = [];
    arr[0] = res.length - 1;
    arr[1] = l[l.length-2].timeStamp;
    console.log(arr)
    return arr;
  }
}
