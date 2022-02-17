import React from 'react';
import { BsArrowUpCircle, BsArrowDownCircle } from 'react-icons/bs';
import { RiRefreshLine, RiPlayLine, RiPauseLine } from 'react-icons/ri';
import styles from './App.module.scss';

class TimerLength extends React.Component {
	render() {
		return (
			<div className={styles.length_wrapper}>
				<p
					id={`${this.props.timerID}-label`}>{`${this.props.timerType} Length`}</p>
				<div className={styles.timer_container}>
					<button
						className={styles.btn_length}
						id={`${this.props.timerID}-decrement`}
						onClick={(e) =>
							this.props.lengthControl(this.props.timerID, false)
						}>
						<BsArrowDownCircle />
					</button>
					<p id={`${this.props.timerID}-length`}>{this.props.timer_length}</p>
					<button
						className={styles.up}
						id={`${this.props.timerID}-increment`}
						onClick={(e) => this.props.lengthControl(this.props.timerID, true)}>
						<BsArrowUpCircle />
					</button>
				</div>
			</div>
		);
	}
}

class Timer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			break_length: 5,
			session_length: 25,
			timer: 1500,
			timerStatus: 'stopped',
			timerConfig: 'Session',
			intervalID: '',
		};
		this.lengthControl = this.lengthControl.bind(this);
		this.decrementTimer = this.decrementTimer.bind(this);
		this.clockMe = this.clockMe.bind(this);
		this.reset = this.reset.bind(this);
		this.startTimer = this.startTimer.bind(this);
		this.timerControl = this.timerControl.bind(this);
		this.needsConfigChange = this.needsConfigChange.bind(this);
		this.switchTimerConfig = this.switchTimerConfig.bind(this);
		this.playTimerEndedSound = this.playTimerEndedSound.bind(this);
		this.stopTimerEndedSound = this.stopTimerEndedSound.bind(this);
	}
	playTimerEndedSound() {
		let sound = document.getElementById('beep');
		sound.play();
	}
	stopTimerEndedSound() {
		let sound = document.getElementById('beep');
		sound.pause();
		sound.currentTime = 0;
	}
	lengthControl(timerType, isIncrement) {
		if (this.state.timerStatus === 'running') {
			return;
		}
		let newTimer;
		if (timerType === 'break') {
			newTimer = this.state.break_length;
		} else {
			newTimer = this.state.session_length;
		}
		if (isIncrement) {
			newTimer += 1;
			if (timerType === 'break') {
				if (newTimer <= 60) {
					this.setState({
						break_length: newTimer,
					});
				}
			} else {
				if (newTimer <= 60) {
					this.setState({
						session_length: newTimer,
						timer: newTimer * 60,
					});
				}
			}
		} else {
			newTimer -= 1;
			if (timerType === 'break') {
				if (newTimer > 0) {
					this.setState({
						break_length: newTimer,
					});
				}
			} else {
				if (newTimer > 0) {
					this.setState({
						session_length: newTimer,
						timer: newTimer * 60,
					});
				}
			}
		}
	}

	decrementTimer() {
		this.setState({
			timer: this.state.timer - 1,
		});
	}
	clockMe() {
		let minutes = Math.floor(this.state.timer / 60);
		let seconds = Math.floor(this.state.timer - minutes * 60);
		minutes = minutes < 10 ? `0${minutes}` : minutes;
		seconds = seconds < 10 ? `0${seconds}` : seconds;
		return (
			<>
				<span className='purple-span'>{minutes}</span>:
				<span className='pink-span'>{seconds}</span>
			</>
		);
	}
	reset() {
		this.stopTimerEndedSound();
		if (this.state.intervalID) {
			clearInterval(this.state.intervalID);
		}
		this.setState({
			break_length: 5,
			session_length: 25,
			timer: 1500,
			timerStatus: 'stopped',
			timerConfig: 'Session',
			intervalID: '',
		});
	}
	needsConfigChange() {
		let timer = this.state.timer;
		if (timer < 0) {
			this.playTimerEndedSound();
			if (this.state.intervalID) {
				clearInterval(this.state.intervalID);
			}

			if (this.state.timerConfig === 'Session') {
				this.switchTimerConfig('Break', this.state.break_length * 60);
				this.startTimer();
			} else {
				this.switchTimerConfig('Session', this.state.session_length * 60);
				this.startTimer();
			}
		}
	}
	switchTimerConfig(newTimerConfigStr, newTimerCountdownVal) {
		this.setState({
			timer: newTimerCountdownVal,
			timerConfig: newTimerConfigStr,
		});
	}
	startTimer() {
		this.setState({
			intervalID: setInterval(() => {
				this.decrementTimer();
				this.needsConfigChange();
			}, 1000),
		});
	}
	timerControl() {
		if (this.state.timerStatus === 'stopped') {
			this.setState({
				timerStatus: 'running',
			});
			this.startTimer();
		} else if (this.state.timerStatus === 'running') {
			this.setState({
				timerStatus: 'stopped',
			});
			if (this.state.intervalID) {
				clearInterval(this.state.intervalID);
			}
		}
	}
	render() {
		return (
			<div>
				<TimerLength
					timerType={'Break'}
					timerID={'break'}
					timer_length={this.state.break_length}
					lengthControl={this.lengthControl}
				/>
				<TimerLength
					timerType={'Session'}
					timerID={'session'}
					timer_length={this.state.session_length}
					lengthControl={this.lengthControl}
				/>
				<div className={styles.timer_wrapper}>
					<h1 className={styles.timer_label} id='timer-label'>
						{this.state.timerConfig}
					</h1>
					<p className={styles.time_left} id='time-left'>
						{this.clockMe()}
					</p>
					<div className={styles.btn_group}>
						<button id='reset' onClick={(e) => this.reset()}>
							<RiRefreshLine />
						</button>
						<button id='start_stop' onClick={(e) => this.timerControl()}>
							<RiPlayLine />
							<RiPauseLine />
						</button>
					</div>
				</div>
				<audio
					id='beep'
					src='https://actions.google.com/sounds/v1/cartoon/pop.ogg'
				/>
			</div>
		);
	}
}

function App() {
	return (
		<div className='container'>
			<Timer />
		</div>
	);
}

export default App;
