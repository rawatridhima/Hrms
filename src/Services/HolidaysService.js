import AttendanceService from "./AttendanceService";
import Service from "./Service";

export default class HolidaysService extends Service{
    static async create(entity) {
      await AttendanceService.giveHoliday(entity.data)
        return super.create(entity, "holidays");
      }
    
      static async read(id = "") {
        return super.read(id, "holidays");
      }
    
      static async update(id, entity) {
        await AttendanceService.cancelHoliday(entity.prevHolidayDate);
        await AttendanceService.giveHoliday(entity.date);
        return super.update(id, {...entity,prevHolidayDate:null}, "holidays");
      }
    
      static async delete(idArr) {
        for(let id of idArr){
          const holiday = await this.read(id);
          await AttendanceService.cancelHoliday(holiday.date);
        }
        return super.delete(idArr, "holidays");
      }
    
      //Add Extra methods...

      static async getAllIDs(){
        return Object.keys(await super.read('','holidays'));
      }
}