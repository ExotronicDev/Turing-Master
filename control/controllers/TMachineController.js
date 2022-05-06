const TMachineDao = require("../daos/TMachineDao");
const CounterDao = require("../daos/CounterDao");

const TapeSymbol = require("../../model/symbol");

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
		//TODO: Borrar los estados.
		return await this.dao.delete({ id: idTMachine });
	}

	//Funcionalidades de estados

	createState(stateArray, stateName) {
		const stateArrayLength = stateArray.length;

		if (stateArrayLength > 0) {
			for (let i = 0; i < stateArrayLength; i++) {
				if (stateArray[i].name === stateName) {
					return false;
				}
			}
		}

		const newState = {
			name: stateName,
			initialState: false,
			incomingTransitions: [],
			exitTransitions: [],
		};

		stateArray.push(newState);
		return stateArray;
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

		if (index < 0) {
			return false;
		}

		stateArray[index].name = newName;
		return stateArray;
	}

	setInitialState(stateArray, stateName) {
		const stateArrayLength = stateArray.length;
		var index = -1;
		if (stateArrayLength > 0) {
			for (let i = 0; i < stateArrayLength; i++) {
				if (stateArray[i].name === stateName) {
					stateArray[i].initialState = true;
					index = i;
				}
			}
			for (let i = 0; i < stateArrayLength; i++) {
				if (
					stateArray[i].initialState &&
					stateArray[i].name !== stateName
				) {
					stateArray[i].initialState = false;
				}
			}
		}

		if (index < 0) {
			if (otherIndex > 0) {
				stateArray[otherIndex].initialState = true;
			}
			return false;
		}

		return stateArray;
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
		const incomingTransitionsLength =
			storedTarget.incomingTransitions.length;

		var exitFlag = true;
		var incomingFlag = true;

		if (exitTransitionsLength > 0 && incomingTransitionsLength > 0) {
			for (let i = 0; i < exitTransitionsLength; i++) {
				if (
					storedOrigin.exitTransitions[i].readValue ===
						transition.readValue &&
					storedOrigin.exitTransitions[i].writeValue ===
						transition.writeValue &&
					storedOrigin.exitTransitions[i].moveValue ==
						transition.moveValue &&
					storedOrigin.exitTransitions[i].targetState.name ===
						transition.targetState.name
				) {
					//Oh god...
					exitFlag = false;
				}
			}

			for (let i = 0; i < incomingTransitionsLength; i++) {
				if (
					storedTarget.incomingTransitions[i].readValue ===
						transition.readValue &&
					storedTarget.incomingTransitions[i].writeValue ===
						transition.writeValue &&
					storedTarget.incomingTransitions[i].moveValue ==
						transition.moveValue &&
					storedTarget.incomingTransitions[i].originState.name ===
						transition.originState.name
				) {
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
				name: transition.targetState.name,
			},
		});

		storedTarget.incomingTransitions.push({
			readValue: transition.readValue,
			writeValue: transition.writeValue,
			moveValue: transition.moveValue,
			originState: {
				name: transition.originState.name,
			},
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
		const incomingTransitionsLength =
			storedTarget.incomingTransitions.length;

		if (exitTransitionsLength <= 0 || incomingTransitionsLength <= 0) {
			return false;
		}

		var exitIndex = -1;
		var incomingIndex = -1;

		for (let i = 0; i < exitTransitionsLength; i++) {
			if (
				storedOrigin.exitTransitions[i].readValue ===
					transition.readValue &&
				storedOrigin.exitTransitions[i].writeValue ===
					transition.writeValue &&
				storedOrigin.exitTransitions[i].moveValue ==
					transition.moveValue &&
				storedOrigin.exitTransitions[i].targetState.name ===
					transition.targetState.name
			) {
				exitIndex = i;
			}
		}

		for (let i = 0; i < incomingTransitionsLength; i++) {
			if (
				storedTarget.incomingTransitions[i].readValue ===
					transition.readValue &&
				storedTarget.incomingTransitions[i].writeValue ===
					transition.writeValue &&
				storedTarget.incomingTransitions[i].moveValue ==
					transition.moveValue &&
				storedTarget.incomingTransitions[i].originState.name ===
					transition.originState.name
			) {
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

	//Aquí abajo están las funciones de simulación.
	//Send dudes

	//Returns:
	//-2: No hay estados que simular.
	//-1: No hay estado inicial.
	//output: {status: "failed"/"finished", finalState: state, output: cinta}
	simulate(tMachine, input, blank) {
		//Este array me servirá para poner el orden de los estados por el cual pasó la simulación.
		//700 IQ move.
		let simulationOrder = [];

		//Primero, revisar si el array de estados tiene algo.
		let stateArray = tMachine.states;
		if (stateArray.length <= 0) {
			//No hay estados, tiro un código de error. El controller.js maneja esto.
			return -2;
		}

		//Segundo, revisar si hay un estado inicial.
		let foundInitialState = false;
		for (let i = 0; i < stateArray.length; i++) {
			if (stateArray[i].initialState == true) {
				foundInitialState = stateArray[i];
			}
		}

		if (!foundInitialState) {
			//No hay estado inicial, tiro código de error. El controller.js maneja esto.
			return -1;
		}

		//Creo que ahora debo cargar la cinta con el input xd. Se me olvidó programar
		//tape es mi cabecera, siempre es el primer elemento de la cinta.
		let tape = new TapeSymbol(input.charAt(0));
		let current = tape;
		for (let i = 1; i < input.length; i++) {
			let newSymbol = new TapeSymbol(input.charAt(i));
			current.setNext(newSymbol);
			newSymbol.setPrevious(current);

			current = newSymbol;
		}
		//Esto es para agregar un blank al final.
		let blankSymbol = new TapeSymbol(blank);
		current.setNext(blankSymbol);
		blankSymbol.setPrevious(current);

		current = blankSymbol;

		//Pongo el current de vuelta al inicio. Esto debería de funcionar, debería.
		let outputTape = tape;
		current = outputTape;

		let currentState = foundInitialState;

		const timeoutFlag = +new Date();
		while (this.hasNextState(currentState, current.getValue())) {
			let copyOutput = outputTape;
			let currentTape = this.getOutputString(copyOutput);
			simulationOrder.push({state: currentState.name, tape: currentTape});
			//Si han pasado 30 segundos, tiro un timeout.
			if (+new Date() > timeoutFlag + 15000) {
				//Ha ocurrido un timeout
				let currentOutput = this.getOutputString(outputTape);
				let finalOutput = {
					status: "timeout",
					output: currentOutput,
					simulationSequence: simulationOrder
				};

				return finalOutput;
			}

			//Hay un estado al cual saltar. Hago las operaciones acá.
			let transition = this.getProperTransition(
				currentState,
				current.getValue()
			);
			let outputChar = transition.writeValue;
			let moveDirection = transition.moveValue;
			let nextStateName = transition.targetState.name;

			current.setValue(outputChar);
			if (moveDirection == 1) {
				//Derecha
				if (current.getNext() == -1) {
					//Tengo que hacer un espacio a la derecha.
					let newSymbol = new TapeSymbol(blank);
					newSymbol.setPrevious(current);
					current.setNext(newSymbol);
				}

				current = current.getNext();
			} else if (moveDirection == -1) {
				//Izquierda
				if (current.getPrevious() == -1) {
					//Tengo que hacer un espacio a la izquierda.
					let newSymbol = new TapeSymbol(blank);
					current.setPrevious(newSymbol);
					newSymbol.setNext(current);
					if (current === outputTape) {
						//Si el espacio vacío se inserta al inicio de la cinta, mueva la referencia a ese.
						outputTape = newSymbol;
					}
				}

				current = current.getPrevious();
			}

			let foundNextState = -1;
			//Ahora tengo que sacar el siguiente estado.
			for (let i = 0; i < stateArray.length; i++) {
				if (stateArray[i].name === nextStateName) {
					foundNextState = stateArray[i];
				}
			}

			//Voy a verificar que el estado encontrado tenga la transición bien.
			if (foundNextState == -1) {
				//Error de lógica.
				let currentOutput = this.getOutputString(outputTape);
				let finalOutput = {
					status: "failed",
					output: currentOutput,
					simulationSequence: simulationOrder
				};
				return finalOutput;
			} else if (
				!this.checkStateLogic(foundNextState, currentState, transition)
			) {
				//Otro error de lógica.
				let currentOutput = this.getOutputString(outputTape);
				let finalOutput = {
					status: "failed",
					output: currentOutput,
					simulationSequence: simulationOrder
				};
				return finalOutput;
			}
			//Aaand, that should be it for this loop. Creo.
			currentState = foundNextState;
		}

		//Ahora tengo que armar el output.
		let outputString = this.getOutputString(outputTape);

		simulationOrder.push({state: currentState.name, tape: outputString});

		let finalOutput = {
			status: "finished",
			output: outputString,
			simulationSequence: simulationOrder
		};
		return finalOutput;
	}

	//Esto nada más convierte la cinta a un string
	getOutputString(tape) {
		let outputString = "";
		while (tape.getNext() != -1) {
			outputString += tape.getValue();
			tape = tape.getNext();
		}

		return outputString;
	}

	//Esto revisa si hay una transición con el símbolo que se lee.
	hasNextState(currentState, symbol) {
		let stateExitTransitions = currentState.exitTransitions;
		if (stateExitTransitions.length <= 0) {
			return false;
		}

		let foundTransition = 0;
		for (let i = 0; i < stateExitTransitions.length; i++) {
			if (stateExitTransitions[i].readValue === symbol) {
				foundTransition = stateExitTransitions[i];
			}
		}

		if (foundTransition == 0) {
			return false;
		} else {
			return true;
		}
	}

	//Esto retorna la transición encontrada.
	getProperTransition(currentState, symbol) {
		let stateExitTransitions = currentState.exitTransitions;
		if (stateExitTransitions.length <= 0) {
			return -1;
		}

		let foundTransition = 0;
		for (let i = 0; i < stateExitTransitions.length; i++) {
			if (stateExitTransitions[i].readValue === symbol) {
				foundTransition = stateExitTransitions[i];
			}
		}

		if (foundTransition == 0) {
			return -1;
		} else {
			return foundTransition;
		}
	}

	//Esto revisa si el siguiente estado tiene la transición de llegada.
	//Para revisar posibles errores que hayan con la lógica de crear la máquina.
	checkStateLogic(nextState, currentState, transition) {
		let incomingStateName = currentState.name;
		const nextStateIncomingTransitions = nextState.incomingTransitions;
		if (nextStateIncomingTransitions.length <= 0) {
			return false;
		}

		let foundIncomingTransition = -1;
		for (let i = 0; i < nextStateIncomingTransitions.length; i++) {
			if (
				nextStateIncomingTransitions[i].readValue ===
					transition.readValue &&
				nextStateIncomingTransitions[i].writeValue ===
					transition.writeValue &&
				nextStateIncomingTransitions[i].moveValue ==
					transition.moveValue &&
				nextStateIncomingTransitions[i].originState.name ===
					incomingStateName
			) {
				foundIncomingTransition = nextStateIncomingTransitions[i];
			}
		}

		if (foundIncomingTransition == -1) {
			return false;
		} else {
			return true;
		}
	}
};
