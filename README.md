[![Stories in Ready](https://badge.waffle.io/erremauro/soliderror.png?label=ready&title=Ready)](https://waffle.io/erremauro/soliderror) [![codecov](https://codecov.io/gh/erremauro/soliderror/branch/master/graph/badge.svg)](https://codecov.io/gh/erremauro/soliderror) [![Build Status](https://travis-ci.org/erremauro/soliderror.svg?branch=master)](https://travis-ci.org/erremauro/soliderror)

# SolidError

A simple javascript class to print meaningful errors, inspired by [elm][1]'s error verbosity.

![SolidError screenshot][2]

[1]: http://elm-lang.org "Open Elm Lang Official Site"
[2]: screenshot/screenshot.png "SolidError Example Screenshot"


## Installation

Add SolidError to your project from github:

```bash
npm install git+https://github.com/erremauro/soliderror.git
```

## What it's useful for

SolidError come in handy whenever you need to present **meaningful**, consistent errors to your users in a javascript console application.

It can be used to log custom errors and to wrap unexpected system errors, giving a coherent, customizable look to your errors throughout your program.

It accept external Error Definition files that will be automatically mapped to your custom errors to help you keep your code organized and it support multiple languages.

## How it works

At its core SolidError is an [Error][3] subclass so you can threat it as normal [Error][3] instance. You can log it, throw it, read its stack trace, the usual. 

However, when converted to a string, SolidError will render an in-depth, formatted, error explanation to the console that follows the convention:

    ==== ERROR: <Human readable error name> ========================

    <The Error's message>

    <SolidError's error explanation>

    ---- EXAMPLE: --------------------------------------------------
    
    <SolidError's example section>

    ----------------------------------------------------------------
    Code: <The Error's code>
    [Path: <The Error's file or directory path>]
    ----------------------------------------------------------------

[3]: https://nodejs.org/api/errors.html#errors_class_error "View Node's Error documentation"

### Basic Error

The most basic error you can create looks like this:

```javascript
import { SolidError, logError }

logError( new SolidError( 'Something got wrong' ) )
```

Which will produce:

### Creating a custom error

To provide your users with more informations regarding your error, create an error definition to describe it.  Supply a short and a long explanation for the cause and help them resolve the issue by giving them some hints. Use markdown syntax to format and highlight your text.

Read [Using exteral Error Definitions](#using-external-error-definitions) to learn how to use external definitions.

```javascript
import { SolidError, logError } from 'soliderror'

// Create an error definition
// that describe the cause of error
const errProps = {
  code: 'ECNF',
  errno: -500,
  name: 'ConfigurationNotFoundError',
  message: 'Configuration Not Found',
  describe: 'Configuration file not found.',
  explain: 'An expected configuration file for this application was not found '
    + 'at path `/etc/awesome.cfg`. This could happen if the file was moved or '
    + 'deleted.\n\nPlease restore the file.',
  example: 'To restore the file from a previous backup:\n\n'
    + '```bash\n'
    + '$ cp /etc/awesome.bak /etc/awesome.cfg\n'
    + '$ awesome --checkcfg /etc/awesome.cfg\n'
    + '```\n\n'
    + 'To generate a new configuration file:\n\n'
    + '```bash\n'
    + '$ awesome --initConfig'
    + '```'
}

let err = new SolidError( errProps.describe, errProps )
logError( err )
```

### Wrapping errors

Sometimes you may need to throw errors that are unknown and unexpected. Wrapping them in a SolidError will automatically format the error for you giving your users a consistent experience.

```javascript
import fs from 'fs'
import { SolidError, logError } from 'soliderror'

fs.readFile( '/non/existent/file', ( err, data ) => {
  if ( err ) {
    let readErr = new SolidError( err )
    logError( readErr )
  }
})
```

### Using external Error Definitions

Defining Error Definitions manually in code can be a tedious task. Besides, you may have custom errors already defined in your code.

```javascript
class ConfigurationNotFoundError extends Error {
  constructor( ...args ) {
    super( ...args )
    this.name = 'ConfigurationNotFoundError'
    this.message = 'Configuration file not found.'
  }
}
```

To keep your code clean and organized you can define **external** error definitions that will map one-to-one with your error's name.

Create a directory to host your error definitions:

  ```bash
  mkdir -p ./errdef/en
  ```

SolidError support multiple languages, so by default all definitions should be at least provided for the english language.

Describe your error in a `ConfigurationNotFoundError.yml` file, and save it under `./errdef/en/`

  ```yaml
  code      : ECNF
  errno     : -500
  name      : ConfigurationNotFoundError
  message   : Configuration Not Found
  explain   : >
    An expected configuration file for this application was not found
    at path `/etc/awesome.cfg`. This could happen if the file was moved or 
    deleted.

    Please restore the file.
  example   : >
    To restore the file from a previous backup:

      $ cp /etc/awesome.bak /etc/awesome.cfg
      $ awesome --checkcfg /etc/awesome.cfg

    To generate a new configuration file:

      $ awesome --initConfig
  ```


### Customizing output appearance

Use `setFormat` to define SolidError's output appearance.

```javascript
import solidErr, { SolidError, logError } from 'soliderror'

solidErr.setFormat({
  wordwrap: true,                      // enable wordwrap (default)
  columns: 55,                         // width reduced to 55 columns
  header: solidErr.colors.red,        // set header color to red
  headerStyle: '—',                    // set header style to em-dash
  headerTitle: 'OOPS',                 // change header title prefix
  describe: solidErr.colors.cyan,     // set description message to cyan
  explain: solidErr.colors.reset      // set explain section to default color
  example: solidErr.colors.green,     // set the example color to green
  exampleStyle: '—',                   // change example style to em-dash
  exampleTitle: 'HINTS',               // change example title prefix
  footer: solidErr.colors.red,        // set footer color to red
  footerStyle: '—',                    // set footer style to em-dash
})

// A dummy error definition
let errProps = {
  code: 'ESTYL',
  errno: -1,
  name: 'ExampleStyleError',
  message: 'Example Style Error',
  describe: 'Just an example error to show appeareance customization',
  explain: 'This error was custom created to test **SolidError** style '
    + 'customization.\n\nHeader and footer should be **red** '
    + 'while the error description should be **cyan**. Also, section divider\'s'
    + ' styles should look different.',
  example: 'Example section should be called _`HINTS`_ now.'
}

logError( new SolidError( errProps.describe, errProps ) )
```

### Using custom languages

You can easly support internazionalization with multiple language translations.
In addition to translate your custom errors, you can override the default error definitions by naming your definition like a [class error][4] or a [syserror code][4].

Read [Using exteral Error Definitions](#using-external-error-definitions) to learn how to setup external definitions.

[4]: https://nodejs.org/api/errors.html "View Node Error Documentation."

To override the default `ENOENT` SystemError definition, for example, create a file named `ENOENT.yml` in your target language directory. To override `ENOENT` for the Italian language, save you file to `./errdef/it/ENOENT.yml`

Define your translated error:

  ```yaml
  code      : ECNF
  errno     : -500
  name      : ConfigurationNotFoundError
  message   : Configurazione Non Trovata
  explain   : >
    Un file di configurazione che doveva trovarsi al percorso 
    `/etc/awesome.cfg` non è stato trovato. Il file potrebbe essere stato
    spostato o cancellato.

    Perfavore, recupera il file.
  example   : >
    Per recuperare il file da un salvataggio precedente:

      $ cp /etc/awesome.bak /etc/awesome.cfg
      $ awesome --checkcfg /etc/awesome.cfg

    Per generare un nuovo file di configurazione:

      $ awesome --initConfig
  ```

Then simply change the language from the options and add your custom error definitions directory to the additional directories:

```javascript
import fs from 'fs'
import path from 'path'
import solidErr, { createError, logError } from 'soliderror'

// Path that contains your Error Definitions files
const customErrPath = path.join( __dirname, './definitions' )

solidErr.setOptions({
  lang: 'it',                   // set the language to 'it'
  includes: [ customErrPath ]
})

try {
  // raise ENOENT (file or directory not found ) error
  fs.readFileSync( '/non/existent/file' )
}
catch( readErr ) {
  // log translated error.
  // you can also use the helper method `createError`
  // to create SolidError instances.
  logError( createError( readErr ) )
}
```

Now, when a `ENOENT` system error gets logged, you will get the transalted version of the error.

## HISTORY

Review the [change log](CHANGELOG.md), it's fun! 🎉 📚

## CREDITS

2016, Roberto Mauro

## LICENSE

Really?
