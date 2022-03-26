const transition = require("../../model/transition");

module.exports = class TransitionDao {
	async find(filter) {
		return await transition.find(filter);
	}

	async save(object) {
		return await object.save();
	}

	async delete(filter) {
		return await transition.deleteOne(filter);
	}

	async update(filter, object) {
		return await transition.updateOne(filter, object);
	}

	async getAll() {
		return await transition.find({});
	}
};
