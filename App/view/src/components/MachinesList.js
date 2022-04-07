import { React, Component } from "../dependencies";

class MachinesList extends Component {
	render() {
		return (
			<div>
				<div className="MachinesList">
					<h4>My Machines</h4>
					<div className="col-md-12">
						<div className="row">
							{/*{console.log(this.state.data)}
                        {this.state.services.map((post, index) => */}
							<div className="col-md-4">
								<div className="card text-white bg-dark mt-4">
									<h5 className="card-header text-center text ">
										{/*post.name*/} Machine Name
									</h5>
									<p className="text-center">
										Description {/*post.capacity*/}
									</p>
									<div className="card-footer text-center">
										<button
											className="btn btn-danger button" /*onClick={() => this.show(post.name)}*/
										>
											Modificar
										</button>
									</div>
								</div>
							</div>
							{/*)}*/}
						</div>
						<div className="card-footer text-center">
							<button
								className="btn btn-dark button"
								onClick={() =>
									(window.location = "/students/menu")
								}
							>
								Regresar
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default MachinesList;
