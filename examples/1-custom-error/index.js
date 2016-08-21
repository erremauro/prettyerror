/**
 * Shows how to log a custom error with SolidError
 * @author Roberto Mauro <erremauro@icloud.com>
 * @version 0.1.2
 * @since 0.2.0
 */

const solidError = require( '../../dist/index' )
const SolidError = solidError.SolidError
const logError = solidError.logError

// define your extended error properties
const errProps = {
  code: 'ECNF',
  errno: -500,
  name: 'ConfigurationNotFoundError',
  path: '/etc/awesome.cfg',
  readableName: 'Configuration Not Found',
  message: 'Configuration file not found.',
  explain: 'An expected configuration file for this application was not found '
    + 'at path `/etc/awesome.cfg`. This could happen if the file was moved or '
    + 'deleted.\n\nPlease restore the file.',
  hints: 'To restore the file from a previous backup:\n\n'
    + '```bash\n'
    + '$ cp /etc/awesome.bak /etc/awesome.cfg\n'
    + '$ awesome --checkcfg /etc/awesome.cfg\n'
    + '```\n\n'
    + 'To generate a new configuration file:\n\n'
    + '```bash\n'
    + '$ awesome --initConfig'
    + '```'
}

// create a SolidError instance
const err = new SolidError( errProps.message, errProps )

// use the helper method to log the error to the console
logError( err )
