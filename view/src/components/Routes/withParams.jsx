import { useParams } from "react-router-dom";

export function withParams(Component) {
	return (props) => {
		const match = { params: useParams() };
		return <Component {...props} match={match} />;
	};
}
