
class BaseCrudService {
    constructor(model){
        this.model = model;
    }
    async all() {
        try {
            const records = await this.model.find({}).exec();
            return records;
        } catch (error) {
            return false;
        }
    }
    async find(id) {
        try {
            const record = this.model.findById(id);
            return record;
        } catch (error) {
            return false;
        }
    }
    async where(conditions) {
        try {
            const record = await this.model.findOne(conditions);
            if (!record) {
                return null;
            }
            return record;
        } catch (error) {
            return false;
        }
    }
    async create(recordData) {
        try {
            const record = new this.model(recordData);
            return await record.save();
        } catch (error) {
            return false;
        }
    }
    async update(id, recordData) {
        try {
            const record = await this.model.updateOne({ _id: id }, recordData);
            return record;
        } catch (error) {
            return false;
        }
    }
    async delete(id) {
        try {
            await this.model.findByIdAndDelete(id);
            return true;
        } catch (error) {
            return false;
        }
    }
}



module.exports = BaseCrudService;