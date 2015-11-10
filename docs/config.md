# Config object

This module manage application configuration.

It take care of loading default preference of external plugins
and to load user specified preference.

Use preference are loaded for a file contained in `$HOME/.termite/preferences.json5`.


You can access `config` object in a plugin using `app.config`.


## Commands list

This module register following commands:

### default-preferences
Open a new tab that show default app preferences.

### default-preferences
Open a new tab that show user defined app preferences. Preference file is automatic update when you edit file content in the tab component.


## Members

### Method `readPackageDefaultsPreferences(pkg)`

Read default preferences for specified package.

#### Arguments

* pkg - required object
Package object for which to read default preferences. It must contain a `path`
property that is used to compose preferences file name, using it as basedir.

### Method `loadPreferences(configFile)`

Read and parse the content of a preferences from specified file.
Return the content of the `json5` file as an object. It does not overwrite
any of the object properties. If the file does not exists, it return an empty object.

#### Arguments

* configFile - required string
Path of the file to read.


### Property configFolder

The path of application config folder. Contains the resolved path of `$HOME/.termite`.

### Property configFile
The path of application config file. Contains the resolved path of `$HOME/.termite/preferences.json5`.

### Property defaultPreferences
An object that contains default application preferences

### Property userPreferences
An object that contains custom user preferences
