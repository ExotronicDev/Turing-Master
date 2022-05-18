const solution = require("../../model/solution");

module.exports = class SolutionDao {
    async find(filter) {
        return await solution.find(filter);
    }

    async save(object) {
        return await object.save();
    }

    async delete(filter) {
        return await solution.deleteOne(filter);
    }

    async update(filter, object) {
        return await solution.updateOne(filter, object);
    }

    async getAll() {
        return await solution.find({ });
    }
}