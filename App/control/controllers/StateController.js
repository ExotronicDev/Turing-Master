const StateDao = require("../daos/StateDao");
const TransitionDao = require("../daos/TransitionDao");
const CounterDao = require("../daos/CounterDao");

const Transition = require("../../model/transition");

module.exports = class StateController {
    constructor() {
        this.dao = new StateDao();
        this.transitionCounter = new CounterDao();
    }

    async createTransition(idOriginState, tReadValue, tWriteValue, tMoveValue, idTargetState) {
        const daoTransition = new TransitionDao();
        const query = this.transitionCounter.find({ name: "transition" });
        const counter = query[0];
        let nextId = counter.count;
        
        //Esos parametros los recibe del controlador grande. Estos deberían pasar directo del respectivo router.
        //Hay que cambiar el MoveValue a un número
        //Propuesta: -1 es izquierda, 1 es derecha, 0 es nada.
        var storedOriginQuery = await this.dao.find({ id: idOriginState });
        var storedOrigin = storedOriginQuery[0];
        var storedTargetQuery = await this.dao.find({ id: idTargetState });
        var storedTarget = storedTargetQuery[0];

        const newTransition = new Transition({
            id: nextId,
            readValue: tReadValue,
            writeValue: tWriteValue,
            moveValue: tMoveValue,
            targetState: {
                id: storedTarget.id,
                name: storedTarget.name
            },
            originState: {
                id: storedOrigin.id,
                name: storedOrigin.name
            }
        });

        //Ahora hay que actualizar el Origin State. Agregar el transition a sus exitTransitions.
        var storedExitTransitions = storedOrigin.exitTransitions;
        storedExitTransitions.push({
            id: newTransition.id,
            readValue: newTransition.readValue,
            writeValue: newTransition.writeValue,
            moveValue: newTransition.moveValue,
            targetState: {
                id: newTransition.targetState.id,
                name: newTransition.targetState.name
            }
        });
        storedOrigin.exitTransitions = storedExitTransitions;
        await this.dao.update({ id: storedOrigin.id }, storedOrigin);

        //Ahora lo mismo para el Target State. Agregar el transition a sus incomingTransitions.
        var storedIncomingTransitions = storedTarget.incomingTransitions;
        storedIncomingTransitions.push({
            id: newTransition.id,
            readValue: newTransition.readValue,
            writeValue: newTransition.writeValue,
            moveValue: newTransition.moveValue,
            originState: {
                id: newTransition.originState.id,
                name: newTransition.originState.name
            }
        });
        storedTarget.incomingTransitions = storedIncomingTransitions;
        await this.dao.update({ id: storedTarget.id }, storedTarget);

        //Aumentar el counter.
        nextId++;
        counter.count = nextId;
        await this.transitionCounter.update({ name: "transition" }, counter);

        return await daoTransition.save(newTransition);
    }

    async updateIncomingTransition(idState, newTransition) {
        const daoTransition = new TransitionDao();

        var storedStateQuery = await this.dao.find({ id: idState });
        var storedState = storedStateQuery[0];
        var storedIncomingTransitions = storedState.incomingTransitions;

        for (let i = 0; i < storedIncomingTransitions.length; i++) {
            if (storedIncomingTransitions[i].id === newTransition.id) {
                storedIncomingTransitions[i].readValue = newTransition.readValue;
                storedIncomingTransitions[i].writeValue = newTransition.writeValue;
                storedIncomingTransitions[i].moveValue = newTransition.moveValue;
                storedIncomingTransitions[i].originState.id = newTransition.originState.id;
                storedIncomingTransitions[i].originState.name = newTransition.originState.name;
            }
        }

        await this.dao.update({ id: storedState.id }, storedState);
        return await daoTransition.update({ id: newTransition.id }, newTransition);
    }

    async updateExitTransition(idState, newTransition) {
        const daoTransition = new TransitionDao();

        var storedStateQuery = await this.dao.find({ id: idState });
        var storedState = storedStateQuery[0];
        var storedExitTransitions = storedState.exitTransitions;

        for (let i = 0; i < storedExitTransitions.length; i++) {
            if (storedExitTransitions[i].id === newTransition.id) {
                storedExitTransitions[i].readValue = newTransition.readValue;
                storedExitTransitions[i].writeValue = newTransition.writeValue;
                storedExitTransitions[i].moveValue = newTransition.moveValue;
                storedExitTransitions[i].originState.id = newTransition.originState.id;
                storedExitTransitions[i].originState.name = newTransition.originState.name;
            }
        }

        await this.dao.update({ id: storedState.id }, storedState);
        return await daoTransition.update({ id: newTransition.id }, newTransition);
    }

    async getTransition(idTransition) {
        const daoTransition = new TransitionDao();

        return await daoTransition.find({ id: idTransition });
    }

    async getIncomingTransitions(idState) {
        const daoTransition = new TransitionDao();

        return await daoTransition.find({ targetState: { id: idState } });
    }

    async getExitTransitions(idState) {
        const daoTransition = new TransitionDao();

        return await daoTransition.find({ originState: { id: idState } });
    }

    async deleteTransition(idOriginState, idTargetState, idTransition) {
        const daoTransition = new TransitionDao();

        var storedOriginQuery = await this.dao.find({ id: idOriginState });
        var storedOrigin = storedOriginQuery[0];
        var storedTargetQuery = await this.dao.find({ id: idTargetState });
        var storedTarget = storedTargetQuery[0];

        //Quitar la transition del storedOrigin.
        var storedExitTransitions = storedOrigin.exitTransitions;
        var index = -1;
        for (let i = 0; i < storedExitTransitions.length; i++) {
            if (storedExitTransitions[i].id === idTransition) {
                index = i;
            }
        }

        if (index > -1) {
            storedExitTransitions.splice(index, 1);
        }

        storedOrigin.exitTransitions = storedExitTransitions;
        await this.dao.update({ id: storedOrigin.id }, storedOrigin);

        //Quitar la transition del storedTarget.
        var storedIncomingTransitions = storedTarget.incomingTransitions;
        index = -1;
        for (let i = 0; i < storedIncomingTransitions.length; i++) {
            if (storedIncomingTransitions[i].id === idTransition) {
                index = i;
            }
        }

        if (index > -1) {
            storedIncomingTransitions.splice(index, 1);
        }
        
        storedTarget.incomingTransitions = storedIncomingTransitions;
        await this.dao.update({ id: storedTarget }, storedTarget);

        return daoTransition.delete({ id: idTransition });
    }
}