/**
 * Shows how to customize errors appereance.
 * @author Roberto Mauro <erremauro@icloud.com>
 * @version 0.1.0
 * @since 0.2.0
 */
const solidError = require( '../../dist/index' )
const SolidError = solidError.SolidError
const logError = solidError.logError

solidError.setStyles({
  marginRight: 0,        // set margin right to 0 (default: 2)
  columns: 55,           // width reduced to 55 columns
  wordwrap: true,        // enable wordwrap (default)
  headerColor: 'red',    // set header color to red
  headerStyle: '—',      // set header style to em-dash
  headerTitle: 'OOPS',   // change header title prefix
  message: 'cyan',       // set description message to cyan
  hintsColor: 'green',   // set the example color to green
  hintsStyle: '—',       // change example style to em-dash
  hintsTitle: 'HINTS',   // change example title prefix
  footer: 'red',         // set footer color to red
  footerStyle: '—',      // set footer style to em-dash
})

const errProps = {
  code: 'ESTYL',
  errno: -1,
  name: 'ExampleStyleError',
  readableName: 'Example Style Error',
  message: 'Just an example error to show appeareance customization',
  explain: 'This error was custom created to test **SolidError** style '
    + 'customization.\n\nHeader and footer should be **red** '
    + 'while the error description should be **cyan**. Also, section divider\'s'
    + ' styles should look different.',
  example: 'Example section should be called _`HINTS`_ now.'
}

logError( new SolidError( errProps.describe, errProps ) )
