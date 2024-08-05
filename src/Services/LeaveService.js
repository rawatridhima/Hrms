import Service from "./Service";
export default class LeaveService extends Service{
    static async create(entity) {
        return super.create(entity, "leaves");
      }
    
      static async read(id = "") {
        return super.read(id, "leaves");
      }
    
      static async update(id, entity) {
        return super.update(id, entity, "leaves");
      }
    
      static async delete(idArr) {
        return super.delete(idArr, "leaves");
      }
    
      //Add Extra methods...

      static async getAllIDs(){
        return Object.keys(await super.read('','leaves'));
      }
      static async getAllLeavesByEmployee(empID){
        const empLeaves = [];
        const all_leaves = Object.values(await super.read('','leaves') || []);
        for(let leave of all_leaves){
            if(leave.user===empID)empLeaves.push(leave);
        }
        return empLeaves;
      }
}