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

	updateState(stateArray, oldName, newName) {
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

	setInitialState(stateArray, stateName) {
		const stateArrayLength = stateArray.length;
		var index = -1;
		var otherIndex = -1
		if (stateArrayLength > 0) {
			for (let i = 0; i < stateArrayLength; i++) {
				if (stateArray[i].name === stateName) {
					stateArray[i].initialState = true;
					index = i;
				}
			}
			for (let i = 0; i < stateArrayLength; i++) {
				if ((stateArray[i].initialState) && stateArray[i].name !== stateName) {
					stateArray[i].initialState = false;
					otherIndex = i;
				}
			}
		}

		if (index < 0) {
			if (otherIndex > 0) {
				stateArray[otherIndex].initialState = true;
			}
			return false;
		}
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

	deleteState(stateArray, stateName) {
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

	createTransition(stateArray, transition) {
		/*
		Transition: {
			readValue
			writeValue
			moveValue
			originState: {
				name
			}
			targetState: {
				name
			}
		} 
		*/
		const stateArrayLength = stateArray.length;
		var originIndex = -1;
		var targetIndex = -1;
		if (stateArrayLength > 0) {
			for (let i = 0; i < stateArrayLength; i++) {
				if (stateArray[i].name === transition.originState.name) {
					originIndex = i;
				}
				if (stateArray[i].name === transition.targetState.name) {
					targetIndex = i;
				}
			}
		}

		if (originIndex < 0 || targetIndex < 0) {
			return false;
		}

		const storedOrigin = stateArray[originIndex];
		const storedTarget = stateArray[targetIndex];

		const exitTransitionsLength = storedOrigin.exitTransitions.length;
		const incomingTransitionsLength = storedTarget.incomingTransitions.length;

		var exitFlag = true;
		var incomingFlag = true;

		if (exitTransitionsLength > 0 && incomingTransitionsLength > 0) {
			for (let i = 0; i < exitTransitionsLength; i++) {
				if (storedOrigin.exitTransitions[i].readValue === transition.readValue && 
					storedOrigin.exitTransitions[i].writeValue === transition.writeValue && 
					storedOrigin.exitTransitions[i].moveValue == transition.moveValue && 
					storedOrigin.exitTransitions[i].targetState.name === transition.targetState.name) {
					//Oh god...
					exitFlag = false;
				}
			}

			for (let i = 0; i < incomingTransitionsLength; i++) {
				if (storedTarget.incomingTransitions[i].readValue === transition.readValue &&
					storedTarget.incomingTransitions[i].writeValue === transition.writeValue &&
					storedTarget.incomingTransitions[i].moveValue == transition.moveValue &&
					storedTarget.incomingTransitions[i].originState.name === transition.originState.name) {
					//Oh no...
					incomingFlag = false;
				}
			}
		}

		if (!exitFlag && !incomingFlag) {
			return false;
		}
		
		storedOrigin.exitTransitions.push({
			readValue: transition.readValue,
			writeValue: transition.writeValue,
			moveValue: transition.moveValue,
			targetState: {
				name: transition.targetState.name
			}
		});

		storedTarget.incomingTransitions.push({
			readValue: transition.readValue,
			writeValue: transition.writeValue,
			moveValue: transition.moveValue,
			originState: {
				name: transition.originState.name
			}
		});

		stateArray[originIndex] = storedOrigin;
		stateArray[targetIndex] = storedTarget;

		return stateArray;
	}

	deleteTransition(stateArray, transition) {
		/*
		Transition: {
			readValue
			writeValue
			moveValue
			originState: {
				name
			}
			targetState: {
				name
			}
		} 
		*/
		const stateArrayLength = stateArray.length;
		var originIndex = -1;
		var targetIndex = -1;
		if (stateArrayLength > 0) {
			for (let i = 0; i < stateArrayLength; i++) {
				if (stateArray[i].name === transition.originState.name) {
					originIndex = i;
				}
				if (stateArray[i].name === transition.targetState.name) {
					targetIndex = i;
				}
			}
		}

		if (originIndex < 0 || targetIndex < 0) {
			return false;
		}

		const storedOrigin = stateArray[originIndex];
		const storedTarget = stateArray[targetIndex];

		const exitTransitionsLength = storedOrigin.exitTransitions.length;
		const incomingTransitionsLength = storedTarget.incomingTransitions.length;

		if (exitTransitionsLength <= 0 || incomingTransitionsLength <= 0) {
			return false;
		}
		
		var exitIndex = -1;
		var incomingIndex = -1;

		for (let i = 0; i < exitTransitionsLength; i++) {
			if (storedOrigin.exitTransitions[i].readValue === transition.readValue &&
				storedOrigin.exitTransitions[i].writeValue === transition.writeValue &&
				storedOrigin.exitTransitions[i].moveValue == transition.moveValue &&
				storedOrigin.exitTransitions[i].targetState.name === transition.targetState.name) {
				exitIndex = i;
			}
		}

		for (let i = 0; i < incomingTransitionsLength; i++) {
			if (storedTarget.incomingTransitions[i].readValue === transition.readValue &&
				storedTarget.incomingTransitions[i].writeValue === transition.writeValue &&
				storedTarget.incomingTransitions[i].moveValue == transition.moveValue &&
				storedTarget.incomingTransitions[i].originState.name === transition.originState.name) {
				incomingIndex = i;
			}
		}

		if (exitIndex == -1 && incomingIndex == -1) {
			return false;
		}

		storedOrigin.exitTransitions.splice(exitIndex, 1);
		storedTarget.incomingTransitions.splice(incomingIndex, 1);

		stateArray[originIndex] = storedOrigin;
		stateArray[targetIndex] = storedTarget;

		return stateArray;
	}
};
