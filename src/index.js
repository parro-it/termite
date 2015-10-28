

const app = require('app');
const argv = require('yargs').argv;
const child_process = require('child_process');
 
if (argv.detach) {
	var child = child_process.spawn(
		'electron', 
		process.argv.slice(1).filter(a => a !== '--detach'), 
		{
			detached: true
		}
	);
	child.unref();
	app.quit();

}

const electronDebug = require('electron-debug');
const termiteApp = require('./api/termite-app');

if (process.env.DEBUG) {
  electronDebug();
}

process.on('uncaughtException', function(err) {
  process.stdout.write('Uncaught exception: \n\n' + err.stack + '\n\n');
});

app.on('ready', () => {
  termiteApp.start();
});

app.on('window-all-closed', function onWindowAllClosed() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

