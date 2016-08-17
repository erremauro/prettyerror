/**
 * Shows how to customize errors appereance.
 * @author Roberto Mauro <erremauro@icloud.com>
 * @version 0.1.0
 * @since 0.2.0
 */
import solidErr, { SolidError, logError } from '../../../index'

solidErr.setFormat({
  columns: 55,                         // width reduced to 55 columns
  wordwrap: true,                      // enable wordwrap (default)
  header: solidErr.colors.red,        // set header color to red
  headerStyle: '—',                    // set header style to em-dash
  headerTitle: 'OOPS',                 // change header title prefix
  describe: solidErr.colors.cyan,     // set description message to cyan
  example: solidErr.colors.green,     // set the example color to green
  exampleStyle: '—',                   // change example style to em-dash
  exampleTitle: 'HINTS',               // change example title prefix
  footer: solidErr.colors.red,        // set footer color to red
  footerStyle: '—',                    // set footer style to em-dash
})

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
