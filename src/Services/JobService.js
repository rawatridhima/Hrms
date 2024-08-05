import CandidateService from "./CandidateService";
import DepartmentService from "./DepartmentService";
import Service from "./Service";

export default class JobService extends Service {
  static async create(entity) {
    return super.create(entity, "jobs");
  }

  static async read(id = "") {
    return super.read(id, "jobs");
  }

  static async update(id, entity) {
    return super.update(id, entity, "jobs");
  }

  static async delete(idArr) {
    return super.delete(idArr, "jobs");
  }
  // extra methods
  static async getActiveJobs() {
    const all_jobs = Object.values((await this.read()) || []);
    console.log(all_jobs);
    const curr = new Date(Date.now()).toISOString().slice(0,10);
    const arr = [];
    for (let job of all_jobs) {
      const date = new Date(job.deadline).toISOString().slice(0,10);
      if (date > curr || date == curr) {
        arr.push({
          ...job,
          department: await DepartmentService.getDepartmentName(job.department),
        });
      }
    }
    return arr;
  }
  static async getIncompletedJobs() {
    const all_jobs = Object.values((await this.read()) || []);
    console.log(all_jobs);
    const curr = new Date(Date.now()).toISOString().slice(0,10)
    const arr = [];
    for (let job of all_jobs) {
      const date = new Date(job.deadline).toISOString().slice(0,10);
      if (date < curr) {
        const val = await CandidateService.isApply(job.id);
        if(!val){
          arr.push({
            ...job,
            department: await DepartmentService.getDepartmentName(job.department),
          });
        }
      }
    }
    return arr;
  }
  static async getCompletedJobs() {
    const all_jobs = Object.values((await this.read()) || []);
    console.log(all_jobs);
    const curr = new Date(Date.now()).toISOString().slice(0,10);
    const arr = [];
    for (let job of all_jobs) {
      const date = new Date(job.deadline).toISOString().slice(0,10);
      if (date < curr) {
        const val = await CandidateService.isApply(job.id);
        if(val){
          arr.push({
            ...job,
            department: await DepartmentService.getDepartmentName(job.department),
          });
        }
      }
    }
    return arr;
  }
  static async getJobTitle(Id) {
    const all_jobs = Object.values((await this.read()) || []);
    for (let job of all_jobs) {
      if (job.id === Id) return job.job_title;
    }
    return null;
  }
}
