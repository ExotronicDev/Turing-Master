const course = require("../../model/course");

module.exports = class CourseDao {
    async find(filter) {
        return await course.find(filter);
    }

    async save(object) {
        return await object.save();
    }

    async delete(filter) {
        return await course.deleteOne(filter);
    }

    async update(filter, object) {
        return await course.updateOne(filter, object);
    }

    async getAll() {
        return await course.find({ });
    }
}