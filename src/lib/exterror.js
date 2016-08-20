function ExtError( message ) {
  Error.captureStackTrace( this, this.constructor )

  this.name = 'Error'
  this.message = message

  if (typeof Error.captureStackTrace === 'function') {
    Error.captureStackTrace(this, this.constructor)
  }
  else { 
    this.stack = ( new Error( message ) ).stack
  }
}
ExtError.prototype = Object.create( Error.prototype, ExtError.prototype )
ExtError.prototype.constructor = ExtError

module.exports = ExtError