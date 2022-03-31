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

	async createState(tMachine, stateName) {
		const daoState = new StateDao();

		const query = await this.stateCounter.find({ name: "state" });
		const counter = query[0];
		let nextId = counter.count;

		const storedTMQuery = await this.dao.find({ id: tMachine.id });
		const storedTM = storedTMQuery[0];
		var tmStates = storedTM.states;

		const newState = new State({
			id: nextId,
			name: stateName,
			tMachine: {
				id: tMachine.id,
				description: tMachine.description,
			},
		});

		tmStates.push(newState);
		storedTM.states = tmStates;
		await daoState.save(newState);

		nextId++;
		counter.count = nextId;
		await this.stateCounter.update({ name: "state" }, counter);

		return await this.dao.update({ id: storedTM.id }, storedTM);
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

	async updateState(tMachine, updatedState) {
		const daoState = new StateDao();

		const storedTMQuery = await this.dao.find({ id: tMachine.id });
		const storedTM = storedTMQuery[0];
		const storedStateQuery = await daoState.find({ id: updatedState.id });
		const storedState = storedStateQuery[0];

		storedState.name = updatedState.name;
		storedState.incomingTransitions = updatedState.incomingTransitions;
		storedState.exitTransitions = updatedState.exitTransitions;

		//Si el estado modificado es el inicial, cambiele el nombre.
		if (storedTM.initialState.id === updatedState.id) {
			storedTM.initialState.name = updatedState.name;
		}

		const stateArray = storedTM.states;

		//Buscar el estado a actualizar en la lista de estados de la TM.
		for (let i = 0; i < stateArray.length; i++) {
			if (stateArray[i].id === updatedState.id) {
				stateArray[i].name = updatedState.name;
			}
		}

		storedTM.states = stateArray;
		await daoState.update({ id: storedState.id }, storedState);
		return await this.dao.update({ id: storedTM.id }, storedTM);
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

	async deleteState(tMachine, stateName) {
		const daoState = new StateDao();

		const storedTMQuery = await this.dao.find({ id: tMachine.id });
		const storedTM = storedTMQuery[0];
		const stateArray = storedTM.states;

		let index = -1;

		for (let i = 0; i < stateArray.length; i++) {
			if (stateArray[i].name === stateName) {
				index = i;
			}
		}

		if (index > -1) {
			stateArray.splice(index, 1);
		}

		storedTM.states = stateArray;
		await this.dao.update({ id: storedTM.id }, storedTM);
		return await daoState.delete({
			name: stateName,
			tMachine: { id: tMachine.id },
		});
	}
};
