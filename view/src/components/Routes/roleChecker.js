import { Cookies, jwt_decode } from "../../dependencies";

const roleChecker = {};

roleChecker.isStudent = () => {
	const token = Cookies.get("token");
	if (token === undefined) {
		return false;
	}
	const logged = jwt_decode(token);
	if (logged.role === "students") {
		return true;
	} else {
		return false;
	}
};

roleChecker.isProfessor = () => {
	const token = Cookies.get("token");
	if (token === undefined) {
		return false;
	}
	const logged = jwt_decode(token);
	if (logged.role === "professors") {
		return true;
	} else {
		return false;
	}
};

roleChecker.getLoggedId = () => {
	const token = Cookies.get("token");
	if (token === undefined) {
		return undefined;
	}
	const logged = jwt_decode(token);
	return logged.id !== undefined ? logged.id : undefined;
};

export default roleChecker;
