const TMachine = require("../../model/tmachine");

module.exports = class TMachineDao {
    async find(filter) {
        return await TMachine.find(filter);
    }

    async save(object) {
        return await object.save();
    }

    async delete(filter) {
        return await TMachine.remove(filter);
    }

    async update(filter, object) {
        return await TMachine.updateOne(filter, object);
    }

    async getAll() {
        return await TMachine.find({ });
    }
}