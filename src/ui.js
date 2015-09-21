const ShellComponent = require('./shell-component');
const PreferenceComponent = require('./preference-component');
const app = require('./termite-app');

app.tabs.init();
app.tabs.add(new ShellComponent());
app.tabs.add(new PreferenceComponent());
app.tabs.add(new ShellComponent());

// ipc.on('new-tab', startShell);
