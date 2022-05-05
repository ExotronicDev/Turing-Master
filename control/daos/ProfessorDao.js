const professor = require("../../model/professor");
const Student = require("../../model/student");

module.exports = class ProfessorDao {
    async find(filter) {
        return await professor.find(filter);
    }

    async findWithPassword(filter) {
        return await professor.findOne(filter).select("+password");
    }

    async save(object) {
        return await object.save();
    }

    async delete(filter) {
        return await professor.deleteOne(filter);
    }

    async update(filter, object) {
        return await professor.updateOne(filter, object);
    }

    async getAll() {
        return await professor.find({ });
    }
}