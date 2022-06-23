if ('serviceWorker' in navigator)
	navigator.serviceWorker.register('service-worker.js');

const html = document.querySelector('html');
const container = document.querySelector('.container');
const status = container.querySelector('.status');
const instructions = container.querySelector('.instructions');
const instructionsAction = instructions.querySelector('span');
const message = container.querySelector('.message');

let wakeLock = null;

const states = {
	'active': {
		status: 'Active',
		instructionAction: 'deactivate'
	},
	'inactive': {
		status: 'Inactive',
		instructionAction: 'activate'
	},
	'idle': {
		status: 'Idle',
		instructionAction: 'activate'
	}
}

function setState(state, messageText) {
	const stateObject = states[state];

	if (!stateObject)
		throw new Error('Invalid state');

	status.innerText = stateObject.status;
	html.style.background = `var(--${state}-colour)`;
	instructionsAction.innerText = stateObject.instructionAction;
	message.innerText = messageText ?? '';
}

document.addEventListener('click', async () => {
	try {
		if (wakeLock)
			return wakeLock.release();

		wakeLock = await navigator.wakeLock.request('screen');
		setState('active');

		wakeLock.addEventListener('release', () => {
			wakeLock = null;
			setState('inactive');
		});
	} catch (err) {
		wakeLock = null;
		setState('idle', `${err.name}, ${err.message}`);
	}
});

html.click();
