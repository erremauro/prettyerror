const Options = require( './options' )
const ExtendableError = require( './exterror' )

class SolidError extends ExtendableError {
  constructor( message, props ) {
    super()

    if ( typeof message === 'string' ) {
      props = Object.assign( props || {}, { message } )
    }
    else if ( message instanceof Error ) {
      const innerError = message 
      props = Options.getSysErrors().getSolidErrorProps( innerError )
    }
    else if ( typeof message === 'object' ) {
      props = message
    }
    
    this.setProps( props )
  }

  defaultProps() {
    return {
      code: 'EUNX',
      errno: 1,
      name: 'Error',
      readableName: 'Unexpected',
      message: 'An unexpected error occurred',
    }
  }

  setProps( props ) {
    this.props = Object.assign( this.props || this.defaultProps(), props )
    this.name = this.props.name || this.name
    this.code = this.props.code || this.code
    this.errno = this.props.errno || this.errno
    this.message = this.props.message || this.message
    this.path = this.props.path || this.path
  }
}

module.exports = SolidError
