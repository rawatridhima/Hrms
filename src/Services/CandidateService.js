import { Candidate_status, uploadFile } from "../Helper/Helper";
import Service from "./Service";

export default class CandidateService extends Service {
  static async create(entity) {
    entity.profile = await uploadFile(entity.profile);
    return await super.create({...entity ,action: Candidate_status.INPROGRESS}, "candidates", true, true);
  }

  static async read(id = "") {
    return super.read(id, "candidates");
  }

  static async update(id, entity) {
    return super.update(id, entity, "candidates");
  }

  static async delete(idArr) {
    return super.delete(idArr, "candidates");
  }
  // extra methods
  static async isApply(id) {
    const all_candidates = Object.values((await CandidateService.read()) || []);
    for (let c of all_candidates) {
      if (c.job_id == id) return true;
      else return false;
    }
  }
  static async totalCandidates(){
    const res=Object.values(await this.read() || [])
    const l=res.sort((a, b) => a.timeStamp - b.timeStamp)
    const arr=[]
   arr[0]=res.length-1
   arr[1]=l[l.length-1].timeStamp
    return arr
  }
}
