# Commands object

This module allow you to manage application commands.

Application command are functions registered with the application that can be invoked using their names. They are used to link menu or buttons with function handler.

They could optionally have a label, an icon and a shortcut associaed with them, that are automatically used in menu or buttons.

Command function handler are grnated to be executed in rendere process.

You can access `commands` object in a plugin using `app.commands`.

## Members

### Method `register(command, handler, options)`

Register a new command for the application.

#### Arguments

* command - required string
The name of the command to register.

* handler - required function
The function executed when the command is invoked

* options - optional object
An optional object that contains following properties:

  - label: string that contains label for the command. This will be used to display the command in menu, command palette and buttons.

  - shortcut: an Electron accelerator that will be registered as shortcut for the command.



### Method `all`

Return an array containg all registered command names.

### Method `execute(commandName, arg)`

Execute command identified by `commandName` argument

#### Arguments

* commandName - required string
The name of the command to execute

* arg - optional object
An optional object that is passed to the command as argument.
