const StudentDao = require("../daos/StudentDao");
const TMachineDao = require("../daos/TMachineDao");
const StateDao = require("../daos/StateDao");
const CounterDao = require("../daos/CounterDao");
const State = require("../../model/state");

module.exports = class TMachineController {
	constructor() {
		this.dao = new TMachineDao();
		this.stateCounter = new CounterDao();
	}

	// Funcionalidades de Turing Machines

	async getTMachines() {
		return await this.dao.getAll();
	}

	async getTMachine(idTMachine) {
		return await this.dao.find({ id: idTMachine });
	}

	//Create TMachine esta implementado en StudentController

	async updateTMachine(idTMachine, updatesTMachine) {
		return await this.dao.update({ id: idTMachine }, updatesTMachine);
	}

	//Delete TMachine esta implementado en StudentController (pero aca hay otro)
	async deleteTMachine(idTMachine) {
		const daoState = new StateDao();

		await daoState.deleteMany({ tMachine: { id: idTMachine } });

		//TODO: Borrar los estados.
		return await this.dao.delete({ id: idTMachine });
	}

	//Funcionalidades de estados

	createState(stateArray, stateName) {
		// const query = await this.stateCounter.find({ name: "state" });
		// const counter = query[0];
		// let nextId = counter.count;

		const stateArrayLength = stateArray.length;

		if (stateArrayLength > 0) {
			for (let i = 0; i < stateArrayLength; i++) {
				if (stateArray[i].name === stateName) {
					return false;
				}
			}
		}

		const newState = {
			// id: nextId,
			name: stateName,
			initialState: false,
			incomingTransitions: [],
			exitTransitions: [],
		};

		stateArray.push(newState);

		// nextId++;
		// counter.count = nextId;
		// await this.stateCounter.update({ name: "state" }, counter);

		return stateArray;
	}

	async setStartState(tMachine, idState) {
		const daoState = new StateDao();

		const storedTMQuery = await this.dao.find({ id: tMachine.id });
		const storedTM = storedTMQuery[0];
		const storedStateQuery = await daoState.find({ id: idState });
		const storedState = storedStateQuery[0];

		storedTM.initialState.id = storedState.id;
		storedTM.initialState.name = storedState.name;

		return await this.dao.update({ id: storedTM.id }, storedTM);
	}

	async updateState(stateArray, oldName, newName) {
		const stateArrayLength = stateArray.length;
		var index = -1;
		if (stateArrayLength > 0) {
			for (let i = 0; i < stateArrayLength; i++) {
				if (stateArray[i].name === oldName) {
					index = i;
				}
				if (stateArray[i].name === newName) {
					return false;
				}
			}
		}

		if (index > -1) {
			return false;
		}

		stateArray[index].name = newName;
		return stateArray;
	}

	async getState(tMachine, stateName) {
		const daoState = new StateDao();

		return await daoState.find({
			name: stateName,
			tMachine: { id: tMachine.id },
		});
	}

	async getStates(tMachine) {
		const daoState = new StateDao();

		return await daoState.find({ tMachine: { id: tMachine.id } });
	}

	async deleteState(stateArray, stateName) {
		const stateArrayLength = stateArray.length;
		var index = -1;
		
		if (stateArrayLength > 0) {
			for (let i = 0; i < stateArrayLength; i++) {
				if (stateArray[i].name === stateName) {
					index = i;
				}
			}
		}

		if (index < 0) {
			return false;
		}

		stateArray.splice(index, 1);
		return stateArray;
	}
};
