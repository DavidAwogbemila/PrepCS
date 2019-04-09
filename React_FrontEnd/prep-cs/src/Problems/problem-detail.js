import React from 'react';
import AceEditor from 'react-ace';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { AuthUserContext, withAuthorization } from '../Session';

import "react-tabs/style/react-tabs.css";

class ProblemDetailBase extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			problemId: null,
			problemName: null,
			problemSummary: null,
			code: null,
			codeSubmissionEndpoint:
				"https://9ypm29b2j3.execute-api.us-east-1.amazonaws.com/prod/submit-code",
			defaultOutputText: "Your code's output.",
			problemTestFilepath: null,
			problemTestFile: null,
			problemStarterCodeFilepath: null,
			problemStarterCode: ''
		};

		this.infoBoxRef = React.createRef();
	}

	/**
	 * Sends an http request to AWS API Gateway for execution of the users's code.
	 */
	submitCode = () => {
		if (!this.state.code) {
			// TODO(awogbemila): maybe develop and use a custom alert system.
			alert("can't submit. no value");
		} else {
			let xhr = new XMLHttpRequest();
			xhr.open("POST", this.state.codeSubmissionEndpoint, true);

			xhr.onerror = (err) => {
				// TODO(awogbemila): Deal with errors related to network.
			}

			xhr.onload = (res) => {
				const response = JSON.parse(xhr.response);
				const responseJson = JSON.parse(response["body"]);
				this.infoBoxRef.current.updateOutput(responseJson);
				this.evaluateSubmission(responseJson);
			}

			const json_submission = {
				code: this.state.code,
				test: this.state.problemTestFile
			};
			xhr.send(JSON.stringify(json_submission));
		}
	}

	/**
	 * @param {!Object} resultJson (should have "result", "error" and 
	 * "error-status" fields)
	 * TODO (awogbemila): Develop custom Result object in place of JSON.
	 */
	evaluateSubmission = (resultJson) => {
		if (resultJson["error-status"]) {
			// Nothing to do here really except alert the user that there is an error
			// in their code.
		} else {
			this.props.firebase.fs_user(this.props.firebase.getUid()).get()
				.then((doc) => {
					// Record attempt at problem.
					let usersCurrentProblemIdsAttempted = doc.data().problems_attempted;
					if (usersCurrentProblemIdsAttempted.includes(this.state.problemId)) {
						// Nothing to do here really.
					} else {
						usersCurrentProblemIdsAttempted.push(this.state.problemId);
						this.props.firebase.fs_user(this.props.firebase.getUid()).update(
							{
								problems_attempted: usersCurrentProblemIdsAttempted
							}
						)
							.catch((error) => {/** TODO (awogbemila): Deal with errors, sigh.*/ });
					}

					let parsedResult = JSON.parse(resultJson["result"]);

					const num_run = parsedResult["num_run"];
					const num_passed = parsedResult["num_passed"];

					// Record successful attempt at problem.
					if (num_run === num_passed) {
						let problemsUserHasSolved = doc.data().problems_attempted_successfully;
						if (problemsUserHasSolved.includes(this.state.problemId)) {
							// Nothing to do here really.
						} else {
							problemsUserHasSolved.push(this.state.problemId);
							this.props.firebase.fs_user(this.props.firebase.getUid()).update(
								{
									problems_attempted_successfully: problemsUserHasSolved
								})
								.then()
								.catch();
						}
					}
				})
				.catch((error) => {/** TODO (awogbemila): Deal with errors, sigh.*/
				});
		}
	}

	/**
	 * Updates the stored value of the user's code (a string).
	 */
	onTextEditorChange = (newValue) => {
		// this.state.code = newValue;
		this.setState({
			code: 'newValue'
		})
	}

	componentDidMount = () => {
		const { problem_id } = this.props.match.params;
		// Fetch problem information from firebase database.
		this.props.firebase.fs_problems().doc(problem_id).get()
			.then((doc) => {
				const docData = doc.data();

				this.setState({
					problemName: docData.shortName,
					problemSummary: docData.summary,
					problemId: problem_id,
					problemTestFilepath: docData.testFilePath,
					problemStarterCodeFilepath: docData.starterCodeFilePath

				});

				// Fetch test file.
				let testFileData = null;
				this.props.firebase.storage_file(this.state.problemTestFilepath)
					.getDownloadURL()
					.then((resourceUrl) => {
						let xhr = new XMLHttpRequest();
						xhr.responseType = 'blob';
						xhr.onload = (event) => {
							let blob = xhr.response;
							let reader = new FileReader();

							reader.onload = () => {
								testFileData = reader.result;
								this.setState({
									problemTestFile: testFileData
								});
							}

							reader.readAsText(blob);
						}
						xhr.open('GET', resourceUrl);
						xhr.send();
					})
					.catch();

				// Fetch starter code file.
				let problemStarterCode = null;
				this.props.firebase.storage_file(this.state.problemStarterCodeFilepath)
					.getDownloadURL()
					.then((resourceUrl) => {
						let xhr = new XMLHttpRequest();
						xhr.responseType = 'blob';
						xhr.onload = (event) => {
							let blob = xhr.response;
							let reader = new FileReader();

							reader.onload = () => {
								problemStarterCode = reader.result;
								this.setState({
									problemStarterCode: problemStarterCode,
									code: problemStarterCode
								});
							}

							reader.readAsText(blob);
						}
						xhr.open('GET', resourceUrl);
						xhr.send();
					})
					.catch();
			})
			.catch();
	}

	render() {
		return (
			<AuthUserContext.Consumer>
				{authUser =>
					<span className="demoProblem">
						<span className="problem-desc-container">
							<h1>{this.state.problemName}</h1>
							<h3>{this.state.problemSummary}</h3>
							<InfoBox
								ref={this.infoBoxRef}
								text={this.state.defaultOutputText} />
						</span>
						<div className="ide-container">
							<AceEditor
								mode="python"
								theme="solarized_dark"
								// height="100%"
								// width="100%"
								width="100%"
								height="600px"
								onChange={this.onTextEditorChange}
								value={this.state.problemStarterCode}
								name="ide-container"
							//editorProps={{$blockScrolling: true}}
							/>
							<div className="submit-button" onClick={() => this.submitCode()}>Submit</div>
						</div>
					</span>
				}
			</AuthUserContext.Consumer>
		);
	}
}

class InfoBox extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			text: this.props.text
		};
	}
	/**
	 * @param {!Object} resultJson (should have "result", "error" and 
	 * "error-status" fields)
	 */
	updateOutput = (resultJson) => {
		if (resultJson["error-status"]) {
			this.setState({
				// resultJson["result"] will itself needed to be parsed as JSON
				// so we have more information about the result of the submission.
				text: resultJson["result"] + "\nError:\n" + resultJson["error"]
			});
		} else {
			let parsedResult = JSON.parse(resultJson["result"]);
			parsedResult = JSON.parse(JSON.stringify(parsedResult));
			const numTestsRun = parsedResult["num_run"]
			const numTestsPassed = parsedResult["num_passed"]
			const inputs = parsedResult["inputs"]
			const outputs = parsedResult["outputs"]
			const passFailByIndex = parsedResult["pass_fail_by_index"]

			let scoreMessage = "Passed " + numTestsPassed + "/" + numTestsRun +
				" Cases.\n";



			if (numTestsRun > numTestsPassed) {
				const indexOfFirstFailure = passFailByIndex.indexOf("FAIL");
				const inp = inputs[indexOfFirstFailure];
				scoreMessage += "Failed test case:\n" +
					"Input: " + JSON.stringify(inp) + "\n" +
					"Your Output:" + JSON.stringify(outputs[indexOfFirstFailure])
			} else if (numTestsRun === numTestsPassed) {
				scoreMessage += "Congratulations you have solved this problem.";
			}

			this.setState({
				text: scoreMessage
			});
		}

	}

	render() {
		return (
			<div className="info-box">
				<Tabs>
					<TabList>
						<Tab>Output</Tab>
						<Tab>Information</Tab>
					</TabList>

					<TabPanel>
						<h2>{this.state.text}</h2>
					</TabPanel>
					<TabPanel>
						<h2>Further information about this problem.</h2>
					</TabPanel>
				</Tabs>
			</div>
		);
	}
}

const ProblemDetail = compose(
	withRouter,
	withFirebase
)(ProblemDetailBase);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(ProblemDetail);
