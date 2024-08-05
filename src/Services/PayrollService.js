import Service from "./Service";

export default class PayrollService extends Service{
    static async create(entity) {
        return super.create(entity, "payroll");
      }
    
      static async read(id = "") {
        return super.read(id, "payroll");
      }
    
      static async update(id, entity) {
        return super.update(id, entity, "payroll");
      }
    
      static async delete(idArr) {
        return super.delete(idArr, "payroll");
      }
    
      //Add Extra methods...
}