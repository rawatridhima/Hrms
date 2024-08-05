import { child, get, ref, remove, set, update } from "firebase/database";
import { db } from "../Firebase";
import { uid } from "uid";
import { ATTENDANCE_OPTIONS } from "../Helper/Helper";

export default class Service {
  //create only one record
  static async create(entity, modelName, createSetting = false, createHolidays = false) {
    try {
      const id = uid();
      const data = await set(ref(db, `${modelName}/${id}`), {
        ...entity,
        id,
        timeStamp: Date.now(),
      });
      if(createSetting){
        const settingId=uid();
        await set(ref(db, `${'settings'}/${settingId}`), {
          user: id,
          mobile_notify: false,
          desktop_notify: false,
          email_notify: true,
          id: settingId,
          timeStamp: Date.now(),
        });
      }
      if (createHolidays) {
        const holidays = await get(child(ref(db), `holidays`))
        if (holidays.exists()) {
          for (let holiday of Object.values(holidays.val())) {
            const h_id = uid();
            await set(ref(db, `${'attendance'}/${h_id}`), {
              id: h_id,
              user: id,
              status: ATTENDANCE_OPTIONS.PRESENT,
              date: holiday.date,
              isHoliday: true,
              timeStamp: Date.now(),
            })
          }
        }
      }
      return data;
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }
  //read one or all records
  static async read(id = "", modelName) {
    try {
      const snapshot = await get(child(ref(db), `${modelName}/${id}`));
      if (snapshot.exists()) return snapshot.val();
      return null;
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }
  //update only one record.
  static async update(id, entity, modelName) {
    try {
      const data = await update(ref(db, `${modelName}/${id}`), entity);
      return data;
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }
  //delete one or all records
  static async delete(idArray, modelName) {
    try {
      const returnArray = [];
      await idArray.forEach(async (id) => {
        const data = await remove(ref(db, `${modelName}/${id}`));
        returnArray.push(data);
      });
      return returnArray;
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }
}
