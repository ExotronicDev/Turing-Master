const counter = require("../../model/counter");
const studentsRouter = require("../../routes/studentsRouter");

module.exports = class CounterDao {
	async find(filter) {
		return await counter.find(filter);
	}

	async save(object) {
		return await object.save();
	}

	async delete(filter) {
		return await counter.deleteOne(filter);
	}

	async update(filter, object) {
		return await counter.updateOne(filter, object);
	}

	async getAll() {
		return await counter.find({});
	}
};
