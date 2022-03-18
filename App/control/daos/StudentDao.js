const student = require("../../model/student");

module.exports = class StudentDao {
    async find(filter) {
        return await student.find(filter);
    }

    async save(object) {
        return await object.save();
    }

    async delete(filter) {
        return await student.remove(filter);
    }

    async modify(filter, object) {
        // falta, ya que arrays pueden fallar
    }

    async getAll() {
        return await student.find({ });
    }
}