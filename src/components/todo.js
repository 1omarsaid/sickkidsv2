import React, { Component } from 'react'

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import CardContent from '@material-ui/core/CardContent';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { authMiddleWare } from '../util/auth';
import API from "../util/API";
import './todo.css'


const styles = (theme) => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    toolbar: theme.mixins.toolbar,
    title: {
		marginLeft: theme.spacing(2),
		flex: 1
	},
	submitButton: {
		display: 'block',
		color: 'white',
		textAlign: 'center',
		position: 'absolute',
		top: 14,
		right: 10
	},
	floatingButton: {
		position: 'fixed',
		bottom: 0,
		right: 0
	},
	form: {
		width: '98%',
		marginLeft: 13,
		marginTop: theme.spacing(10)
	},
	toolbar: theme.mixins.toolbar,
	root: {
		minWidth: 470
	},
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)'
	},
	pos: {
		marginBottom: 12
	},
	uiProgess: {
		position: 'fixed',
		zIndex: '1000',
		height: '31px',
		width: '31px',
		left: '50%',
		top: '35%'
	},
	dialogeStyle: {
		maxWidth: '50%'
	},
	viewRoot: {
		margin: 0,
		padding: theme.spacing(2)
	},
	closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500]
	}

});

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

class todo extends Component {
	constructor(props) {
		super(props);

		this.state = {
			todos: '',
			case: '',
			nso: '',
			patientName: '',
			hsc:'',
			pedigree: '',
			dob: '',
			doc: '',
			ageAtCollection: '',
			reportDate: '',
			labAnomalies: '',
			screenCondition: '',
			tpn: '',
			prem: '',
			nicu: '',
			gestationalAge: '',
			birthWeight: '',
			irt: '',
			cftr: '',
			category: '',
			nbs: '',
			dateOfFirstContact: '',
			dateOfDiagnostic: '',
			placeOfDiagnostic: '',
			confirmatory: '',
			notes: '',
			dateOfDecision: '',
			cheo: '',
			cfMotherTesting: '',
			cfFatherTesting: '',
			todoId: '',
			errors: [],
			open: false,
			uiLoading: true,
			buttonType: '',
			viewOpen: false
		};

		this.deleteTodoHandler = this.deleteTodoHandler.bind(this);
		this.handleEditClickOpen = this.handleEditClickOpen.bind(this);
		this.handleViewOpen = this.handleViewOpen.bind(this);
	}

	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};

	handleSearch = (event) => {	
		if (event.key !== 'Enter') {
			return
		  }
		authMiddleWare(this.props.history);
		this.setState({
			todos: '',
			uiLoading: true
		})
		API
			.get(`/todo/${event.target.value}`)
			.then((response) => {

				this.setState({
					todos: response.data,
					uiLoading: false
				});
			})
			.catch((err) => {
				this.setState({
					todos: [],
					uiLoading: false,
					errors: {
						search: 'No results found'
					}
				});
			});
	}

	componentWillMount = () => {
		authMiddleWare(this.props.history);
		API
			.get('/todos')
			.then((response) => {
				this.setState({
					todos: response.data,
					uiLoading: false
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};

	deleteTodoHandler(data) {
		authMiddleWare(this.props.history);
		
		let todoId = data.todo.todoId;
		API
			.delete(`todo/${todoId}`)
			.then(() => {
				window.location.reload();
			})
			.catch((err) => {
				console.log(err);
			});
	}

	handleViewAllData = (downloadData) => {
		authMiddleWare(this.props.history);
		API
			.get('/todos')
			.then((response) => {
				this.setState({
					todos: response.data,
					uiLoading: false
				});
			})
			.catch((err) => {
				console.log(err);
			});

		if(downloadData){
			var json = this.state.todos
			var fields = Object.keys(json[0])
			var replacer = function(key, value) { return value === null ? '' : value } 
			var csv = json.map(function(row){
			return fields.map(function(fieldName){
				return JSON.stringify(row[fieldName], replacer)
			}).join(',')
			})
			csv.unshift(fields.join(','))
			csv = csv.join('\r\n');
			var downloadLink = document.createElement("a");
			var blob = new Blob(["\ufeff", csv]);
			var url = URL.createObjectURL(blob);
			downloadLink.href = url;
			downloadLink.download = "data.csv";

			document.body.appendChild(downloadLink);
			downloadLink.click();
			document.body.removeChild(downloadLink);
		}

	}

	handleEditClickOpen(data={}, type="") {
		if(type === "edit"){
			this.setState({
				viewType: 'edit'
			})
		}else if(type === "view"){
			this.setState({
				viewType: 'view'
			})
		}
		this.setState({
			case: data.todo.case,
			nso: data.todo.nso,
			patientName: data.todo.patientName,
			hsc:data.todo.hsc,
			pedigree: data.todo.pedigree,
			dob: data.todo.dob,
			doc: data.todo.doc,
			ageAtCollection: data.todo.ageAtCollection,
			reportDate: data.todo.reportDate,
			labAnomalies: data.todo.labAnomalies,
			screenCondition: data.todo.screenCondition,
			tpn: data.todo.tpn,
			prem: data.todo.prem,
			nicu: data.todo.nicu,
			gestationalAge: data.todo.gestationalAge,
			birthWeight: data.todo.birthWeight,
			irt: data.todo.irt,
			cftr: data.todo.cftr,
			category: data.todo.category,
			nbs: data.todo.nbs,
			dateOfFirstContact: data.todo.dateOfFirstContact,
			dateOfDiagnostic: data.todo.dateOfDiagnostic,
			placeOfDiagnostic: data.todo.placeOfDiagnostic,
			confirmatory: data.todo.confirmatory,
			notes: data.todo.notes,
			dateOfDecision: data.todo.dateOfDecision,
			cheo: data.todo.cheo,
			cfMotherTesting: data.todo.cfMotherTesting,
			cfFatherTesting: data.todo.cfFatherTesting,
			todoId: data.todo.todoId,
			buttonType: 'Edit',
			open: true
		});
	}

	handleViewOpen(data) {
		this.setState({
			case: data.todo.case,
			nso: data.todo.nso,
			patientName: data.todo.patientName,
			hsc:data.todo.hsc,
			pedigree: data.todo.pedigree,
			dob: data.todo.dob,
			doc: data.todo.doc,
			ageAtCollection: data.todo.ageAtCollection,
			reportDate: data.todo.reportDate,
			labAnomalies: data.todo.labAnomalies,
			screenCondition: data.todo.screenCondition,
			tpn: data.todo.tpn,
			prem: data.todo.prem,
			nicu: data.todo.nicu,
			gestationalAge: data.todo.gestationalAge,
			birthWeight: data.todo.birthWeight,
			irt: data.todo.irt,
			cftr: data.todo.cftr,
			category: data.todo.category,
			nbs: data.todo.nbs,
			dateOfFirstContact: data.todo.dateOfFirstContact,
			dateOfDiagnostic: data.todo.dateOfDiagnostic,
			placeOfDiagnostic: data.todo.placeOfDiagnostic,
			confirmatory: data.todo.confirmatory,
			notes: data.todo.notes,
			dateOfDecision: data.todo.dateOfDecision,
			cheo: data.todo.cheo,
			cfMotherTesting: data.todo.cfMotherTesting,
			cfFatherTesting: data.todo.cfFatherTesting,
			viewOpen: true
		});
	}

	render() {

		dayjs.extend(relativeTime);
		const { classes } = this.props;
		const { open, errors } = this.state;

		const handleClickOpen = () => {
			this.setState({
				todoId: '',
				case: '',
				nso: '',
				patientName: '',
				hsc:'',
				pedigree: '',
				dob: '',
				doc: '',
				ageAtCollection: '',
				reportDate: '',
				labAnomalies: '',
				screenCondition: '',
				tpn: '',
				prem: '',
				nicu: '',
				gestationalAge: '',
				birthWeight: '',
				irt: '',
				cftr: '',
				category: '',
				nbs: '',
				dateOfFirstContact: '',
				dateOfDiagnostic: '',
				placeOfDiagnostic: '',
				confirmatory: '',
				notes: '',
				dateOfDecision: '',
				cheo: '',
				cfMotherTesting: '',
				cfFatherTesting: '',
				buttonType: '',
				open: true,
				viewType: ''
			});
		};

		const handleSubmit = (event) => {
			authMiddleWare(this.props.history);
			event.preventDefault();
			const userTodo = {
				case: this.state.case,
				nso: this.state.nso,
				patientName: this.state.patientName,
				hsc:this.state.hsc,
				pedigree: this.state.pedigree,
				dob: this.state.dob,
				doc: this.state.doc,
				ageAtCollection: this.state.ageAtCollection,
				reportDate: this.state.reportDate,
				labAnomalies: this.state.labAnomalies,
				screenCondition: this.state.screenCondition,
				tpn: this.state.tpn,
				prem: this.state.prem,
				nicu: this.state.nicu,
				gestationalAge: this.state.gestationalAge,
				birthWeight: this.state.birthWeight,
				irt: this.state.irt,
				cftr: this.state.cftr,
				category: this.state.category,
				nbs: this.state.nbs,
				dateOfFirstContact: this.state.dateOfFirstContact,
				dateOfDiagnostic: this.state.dateOfDiagnostic,
				placeOfDiagnostic: this.state.placeOfDiagnostic,
				confirmatory: this.state.confirmatory,
				notes: this.state.notes,
				dateOfDecision: this.state.dateOfDecision,
				cheo: this.state.cheo,
				cfMotherTesting: this.state.cfMotherTesting,
				cfFatherTesting: this.state.cfFatherTesting,
			};
			let options = {};
			if (this.state.buttonType === 'Edit') {
				options = {
					url: `/todo/${this.state.todoId}`,
					method: 'put',
					data: userTodo
				};
			} else {
				options = {
					url: '/todo',
					method: 'post',
					data: userTodo
				};
			}
			
			API(options)
				.then(() => {
					this.setState({ open: false });
					window.location.reload();
				})
				.catch((error) => {
					this.setState({ open: true, errors: error.response.data });
					console.log(error);
				});
		};


		const handleClose = (event) => {
			this.setState({ open: false });
		};

		if (this.state.uiLoading === true) {
			return (
				<main className={classes.content}>
					<div className={classes.toolbar} />
					{this.state.uiLoading && <CircularProgress size={150} className={classes.uiProgess} />}
				</main>
			);
		} else {
			return (
				<main className={classes.content}>
					<div className={classes.toolbar} />

					<IconButton
						className={classes.floatingButton}
						color="primary"
						aria-label="Add Todo"
						onClick={handleClickOpen}
					>
						<AddCircleIcon style={{ fontSize: 80 }} />
					</IconButton>
					<Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
						<AppBar className={classes.appBar}>
							<Toolbar>
								<IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
									<CloseIcon />
								</IconButton>
								
								{this.state.viewType !== 'view' && <Typography variant="h6" className={classes.title}>
									{this.state.buttonType === 'Edit' ? 'Edit Patient Record' : 'Add New Patient Record'}
								</Typography>}
								{this.state.viewType !== 'view' &&<Button
									autoFocus
									color="inherit"
									onClick={handleSubmit}
									className={classes.submitButton}
								>
									{this.state.buttonType === 'Edit' ? 'Save' : 'Submit'}
								</Button>}
							</Toolbar>
						</AppBar>

						<form className={classes.form} noValidate>
							<Grid container spacing={2}>
								<Grid item xs={4}>
									<TextField
										variant="outlined"
										fullWidth
										id="case"
										label="Case"
										name="case"
										autoComplete="case"
										helperText={errors?.case}
										value={this.state.case}
										error={errors?.case ? true : false}
										onChange={this.handleChange}
										disabled={this.state.viewType === "view" ? true : false}
										type="number"
									/>
								</Grid>
								<Grid item xs={4}>
									<TextField
										variant="outlined"
										fullWidth
										id="nso"
										label="NSO Episode Number"
										name="nso"
										autoComplete="nso"
										helperText={errors?.nso}
										error={errors?.nso ? true : false}
										onChange={this.handleChange}
										value={this.state.nso}
										disabled={this.state.viewType === "view" ? true : false}
										type="number"
									/>
								</Grid>
								<Grid item xs={4}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="patientName"
										label="Patient Name"
										name="patientName"
										autoComplete="patientName"
										helperText={errors?.patientName}
										error={errors?.patientName ? true : false}
										onChange={this.handleChange}
										value={this.state.patientName}
										disabled={this.state.viewType === "view" ? true : false}
									/>
								</Grid>
								<Grid item xs={4}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="hsc"
										label="HSC Number"
										name="hsc"
										autoComplete="hsc"
										helperText={errors?.hsc}
										error={errors?.hsc ? true : false}
										onChange={this.handleChange}
										value={this.state.hsc}
										disabled={this.state.viewType === "view" ? true : false}
										type="number"
									/>
								</Grid>
								<Grid item xs={4}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="pedigree"
										label="pedigree"
										name="pedigree"
										autoComplete="pedigree"
										helperText={errors?.pedigree}
										error={errors?.pedigree ? true : false}
										onChange={this.handleChange}
										value={this.state.pedigree}
										disabled={this.state.viewType === "view" ? true : false}
										type="number"
									/>
								</Grid>
								<Grid item xs={4}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="dob"
										label="Date of birth"
										name="dob"
										autoComplete="dob"
										helperText={errors?.dob}
										error={errors?.dob ? true : false}
										onChange={this.handleChange}
										value={this.state.dob}
										disabled={this.state.viewType === "view" ? true : false}
									/>
								</Grid>
								<Grid item xs={4}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="doc"
										label="Date of Collection"
										name="doc"
										autoComplete="doc"
										helperText={errors?.doc}
										error={errors?.doc ? true : false}
										onChange={this.handleChange}
										value={this.state.doc}
										disabled={this.state.viewType === "view" ? true : false}
									/>
								</Grid>
								<Grid item xs={4}>
									<TextField
										variant="outlined"
										fullWidth
										id="ageAtCollection"
										label="Age at collection"
										name="ageAtCollection"
										autoComplete="ageAtCollection"
										helperText={errors?.ageAtCollection}
										error={errors?.ageAtCollection ? true : false}
										onChange={this.handleChange}
										value={this.state.ageAtCollection}
										disabled={this.state.viewType === "view" ? true : false}
									/>
								</Grid>
								<Grid item xs={4}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="reportDate"
										label="Report date"
										name="reportDate"
										autoComplete="reportDate"
										helperText={errors?.reportDate}
										error={errors?.reportDate ? true : false}
										onChange={this.handleChange}
										value={this.state.reportDate}
										disabled={this.state.viewType === "view" ? true : false}
									/>
								</Grid>
								<Grid item xs={4}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="labAnomalies"
										label="Reported Lab anomalies"
										name="labAnomalies"
										autoComplete="labAnomalies"
										helperText={errors?.labAnomalies}
										error={errors?.labAnomalies ? true : false}
										onChange={this.handleChange}
										value={this.state.labAnomalies}
										disabled={this.state.viewType === "view" ? true : false}
									/>
								</Grid>
								<Grid item xs={4}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="screenCondition"
										label="Screen +/ve condition"
										name="screenCondition"
										autoComplete="screenCondition"
										helperText={errors?.screenCondition}
										error={errors?.screenCondition ? true : false}
										onChange={this.handleChange}
										value={this.state.screenCondition}
										disabled={this.state.viewType === "view" ? true : false}
									/>
								</Grid>
								<Grid item xs={4}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="tpn"
										label="TPN (Y/N)"
										name="tpn"
										helperText={errors?.tpn}
										error={errors?.tpn ? true : false}
										onChange={this.handleChange}
										value={this.state.tpn}
										disabled={this.state.viewType === "view" ? true : false}
									/>
								</Grid>
								<Grid item xs={4}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="prem"
										label="Prem (Y/N)"
										name="prem"
										autoComplete="prem"
										helperText={errors?.prem}
										error={errors?.prem ? true : false}
										onChange={this.handleChange}
										value={this.state.prem}
										disabled={this.state.viewType === "view" ? true : false}
									/>
								</Grid>
								<Grid item xs={4}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="nicu"
										label="NICU (Y/N)"
										name="nicu"
										autoComplete="nicu"
										helperText={errors?.nicu}
										error={errors?.nicu ? true : false}
										onChange={this.handleChange}
										value={this.state.nicu}
										disabled={this.state.viewType === "view" ? true : false}
									/>
								</Grid>
								<Grid item xs={4}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="gestationalAge"
										label="Gestational Age"
										name="gestationalAge"
										autoComplete="gestationalAge"
										helperText={errors?.gestationalAge}
										error={errors?.gestationalAge ? true : false}
										onChange={this.handleChange}
										value={this.state.gestationalAge}
										disabled={this.state.viewType === "view" ? true : false}
									/>
								</Grid>
								<Grid item xs={4}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="birthWeight"
										label="Birth Weight"
										name="birthWeight"
										autoComplete="birthWeight"
										helperText={errors?.birthWeight}
										error={errors?.birthWeight ? true : false}
										onChange={this.handleChange}
										value={this.state.birthWeight}
										disabled={this.state.viewType === "view" ? true : false}
									/>
								</Grid>
								<Grid item xs={4}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="irt"
										label="IRT (Immunoreactive Trypsinogen)"
										name="irt"
										autoComplete="irt"
										helperText={errors?.irt}
										error={errors?.irt ? true : false}
										onChange={this.handleChange}
										value={this.state.irt}
										disabled={this.state.viewType === "view" ? true : false}
									/>
								</Grid>
								<Grid item xs={4}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="cftr"
										label="CFTR Mutation Analysis"
										name="cftr"
										autoComplete="cftr"
										helperText={errors?.cftr}
										error={errors?.cftr ? true : false}
										onChange={this.handleChange}
										value={this.state.cftr}
										disabled={this.state.viewType === "view" ? true : false}
									/>
								</Grid>
								<Grid item xs={4}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="category"
										label="Category"
										name="category"
										autoComplete="category"
										helperText={errors?.category}
										error={errors?.category ? true : false}
										onChange={this.handleChange}
										value={this.state.category}
										disabled={this.state.viewType === "view" ? true : false}
									/>
								</Grid>
								<Grid item xs={4}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="nbs"
										label="NBS Team"
										name="nbs"
										autoComplete="nbs"
										helperText={errors?.nbs}
										error={errors?.nbs ? true : false}
										onChange={this.handleChange}
										value={this.state.nbs}
										disabled={this.state.viewType === "view" ? true : false}
									/>
								</Grid>
								<Grid item xs={5}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="dateOfFirstContact"
										label="Date of 1st contact w family/MD"
										name="dateOfFirstContact"
										helperText={errors?.dateOfFirstContact}
										error={errors?.dateOfFirstContact ? true : false}
										onChange={this.handleChange}
										value={this.state.dateOfFirstContact}
										disabled={this.state.viewType === "view" ? true : false}
									/>
								</Grid>
								<Grid item xs={5}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="dateOfDiagnostic"
										label="Date of retrieval for diagnostic evaluation"
										name="dateOfDiagnostic"
										helperText={errors?.dateOfDiagnostic}
										error={errors?.dateOfDiagnostic ? true : false}
										onChange={this.handleChange}
										value={this.state.dateOfDiagnostic}
										disabled={this.state.viewType === "view" ? true : false}
									/>
								</Grid>
								<Grid item xs={5}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="placeOfDiagnostic"
										label="Where was diagnostic testing done? (HSC or Other)"
										name="placeOfDiagnostic"
										helperText={errors?.placeOfDiagnostic}
										error={errors?.placeOfDiagnostic ? true : false}
										onChange={this.handleChange}
										value={this.state.placeOfDiagnostic}
										disabled={this.state.viewType === "view" ? true : false}
									/>
								</Grid>
								<Grid item xs={4}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="confirmatory"
										label="Confirmatory result (+/-)"
										name="confirmatory"
										autoComplete="confirmatory"
										helperText={errors?.confirmatory}
										error={errors?.confirmatory ? true : false}
										onChange={this.handleChange}
										value={this.state.confirmatory}
										disabled={this.state.viewType === "view" ? true : false}
									/>
								</Grid>
								<Grid item xs={4}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="dateOfDecision"
										label="Date decision made"
										name="dateOfDecision"
										helperText={errors?.dateOfDecision}
										error={errors?.dateOfDecision ? true : false}
										onChange={this.handleChange}
										value={this.state.dateOfDecision}
										disabled={this.state.viewType === "view" ? true : false}
									/>
								</Grid>
								<Grid item xs={4}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="cheo"
										label="CHEO results sent"
										name="cheo"
										autoComplete="cheo"
										helperText={errors?.cheo}
										error={errors?.cheo ? true : false}
										onChange={this.handleChange}
										value={this.state.cheo}
										disabled={this.state.viewType === "view" ? true : false}
									/>
								</Grid>
								<Grid item xs={4}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="cfMotherTesting"
										label="CF Mother Testing"
										name="cfMotherTesting"
										autoComplete="cfMotherTesting"
										helperText={errors?.cfMotherTesting}
										error={errors?.cfMotherTesting ? true : false}
										onChange={this.handleChange}
										value={this.state.cfMotherTesting}
										disabled={this.state.viewType === "view" ? true : false}
									/>
								</Grid>
								<Grid item xs={4}>
									<TextField
										variant="outlined"
										required
										fullWidth
										id="cfFatherTesting"
										label="CF Father Testing"
										name="cfFatherTesting"
										autoComplete="cfFatherTesting"
										helperText={errors?.cfFatherTesting}
										error={errors?.cfFatherTesting ? true : false}
										onChange={this.handleChange}
										value={this.state.cfFatherTesting}
										disabled={this.state.viewType === "view" ? true : false}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										variant="outlined"
										fullWidth
										id="notes"
										label="Notes"
										name="notes"
										autoComplete="notes"
										helperText={errors?.notes}
										error={errors?.notes ? true : false}
										onChange={this.handleChange}
										value={this.state.notes}
										disabled={this.state.viewType === "view" ? true : false}
										multiline
										rows={5}
										rowsMax={5}
									/>
								</Grid>
							</Grid>
						</form>
					</Dialog>

						<TextField
							variant="outlined"
							fullWidth
							id="cfFatherTesting"
							label="Search by HSC number..."
							name="cfFatherTesting"
							autoComplete="cfFatherTesting"
							helperText={errors?.search}
							error={errors?.search ? true : false}
							onChange={this.handleChange}
							value={this.state.search}
							onKeyDown={this.handleSearch}
							type="number"
							style={{width: '500px', paddingBottom: '20px'}}
						/>
						<Button onClick={() => this.handleViewAllData(false)} size="large" className="viewAll" variant="outlined">View All</Button>
						<Button onClick={() => this.handleViewAllData(true)} size="large" className="viewAll" variant="outlined">Download All Data</Button>
					<Grid container spacing={2}>
						{this.state.todos.map((todo) => (
							<Grid item xs={12} sm={6}>
								<Card className={classes.root} variant="outlined">
									<CardContent>
										<Typography variant="h5" component="h2">
											{`HSC: ${todo.hsc}`}
										</Typography>
										<Typography variant="body2" component="p">
											{`Name: ${todo.patientName}`}
										</Typography>
										<Typography className={classes.pos} color="textSecondary">
											{`Created: ${dayjs(todo.createdAt).fromNow()}`}
										</Typography>
									</CardContent>
									<CardActions>
										<Button size="small" color="primary" onClick={() => this.handleEditClickOpen({ todo }, "view")}>
											{' '}
											View{' '}
										</Button>
										<Button size="small" color="primary" onClick={() => this.handleEditClickOpen({ todo }, "edit")}>
											Edit
										</Button>
										<Button size="small" color="primary" onClick={() => this.deleteTodoHandler({ todo })}>
											Delete
										</Button>
									</CardActions>
								</Card>
							</Grid>
						))}
					</Grid>

					
				</main>
			);
		}
	}
}
export default (withStyles(styles)(todo));