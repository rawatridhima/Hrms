import Service from "./Service"

export default class SettingService extends Service{
   
static async create(entity){
    return super.create(entity,'settings');
}
static async read(id=''){
return super.read(id,'settings')
}
static async update(id, entity) {
    return super.update(id, entity, 'settings')
}

static async delete(idArray) {
    return super.delete(idArray, 'settings')
}
// Extra methodss
 static async getSettingId(userId){
    const data=await super.read('','settings')
    let id = null;
        Object.values(data).forEach(x => {
            console.log(x.user)
            console.log(userId)
            if (x.user === userId) {
              
                id = x.id
            }
        })
        console.log(id)
        return id;
 }
}

