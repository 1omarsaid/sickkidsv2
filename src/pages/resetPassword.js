import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import API from "../util/API";

const styles = (theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main
	},
	form: {
		width: '100%',
		marginTop: theme.spacing(1)
	},
	submit: {
		margin: theme.spacing(3, 0, 2)
	},
	customError: {
		color: 'red',
		fontSize: '0.8rem',
		marginTop: 10
	},
	progess: {
		position: 'absolute'
	}
});

class resetPassword extends Component {
	constructor(props) {
		super(props);

		this.state = {
			email: '',
			errors: [],
			loading: false
		};
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.UI?.errors) {
			this.setState({
				errors: nextProps.UI.errors
			});
		}
	}


	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};

	handleSubmit = (event) => {
		event.preventDefault();
        this.setState({ loading: true });
        
        //ToDo: regex check for sickkids email


		const userData = {
			email: this.state.email
		};
		API
			.post('/passwordReset', userData)
			.then((response) => {
                alert(response.data.message)
				this.setState({ 
					loading: false,
				});		
				this.props.history.push('/login');
			})
			.catch((error) => {	
				this.setState({
					errors: {
						email: 'Email doesnt exist'
					},
					loading: false
				});
			});
    };
    
    goBack = (event) => {
        this.props.history.push('/login')
    }

	render() {
		const { classes } = this.props;
		const { errors, loading } = this.state;
		return (
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Password Reset
					</Typography>
					<form className={classes.form} noValidate>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
							autoFocus
							helperText={errors.email}
							error={errors.email ? true : false}
							onChange={this.handleChange}
						/>
						
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
							onClick={this.handleSubmit}
							disabled={loading || !this.state.email }
						>
							Send Recovery Email
							{loading && <CircularProgress size={30} className={classes.progess} />}
						</Button>
                        <Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							onClick={this.goBack}
						>
                            Go Back
							{loading && <CircularProgress size={30} className={classes.progess} />}
						</Button>
						{errors.general && (
							<Typography variant="body2" className={classes.customError}>
								{errors.general}
							</Typography>
						)}
					</form>
				</div>
			</Container>
		);
	}
}

export default withStyles(styles)(resetPassword);