var MAX_CHARS = 80
var colors = require( 'chalk' )
var wordwrap = require( 'wordwrap')( MAX_CHARS )

module.exports = {
  PrettyError: PrettyError,
  create: create,
}

function create( message, props ) {
  return new PrettyError( message, props )
}

function PrettyError( message, props ) {
  Error.captureStackTrace( this, this.constructor )
  this.message = message
  this.name = props.name + 'Error'
  this.errname = props.name
  this.code = props.code || 0
  this.describe = props.describe
  this.explain = props.explain || ''
  this.example = props.example || ''
  this.filepath = props.filepath || ''
}
PrettyError.prototype = Object.create( Error.prototype, PrettyError.prototype )
PrettyError.prototype.constructor = PrettyError

PrettyError.prototype.toString = function() {
  var message = fmtHeader( this.message )
  message += fmtDescribe( this.describe )

  if ( this.explain ) {
    message += fmtExplain( this.explain )
  }

  if ( this.example ) {
    message += fmtExample( this.example )
  }

  message += fmtInfo( this.code, this.file )

  return message
}

function fmtHeader( message ) {
  var message = truncate( message, ( MAX_CHARS - 17 ) )
  return colors.cyan( '\n==== ERROR: ' + message + ' ====\n' )
}

function fmtDescribe( description ) {
  return colors.yellow( '\n' + wordwrap( description ) + '\n' )
}

function fmtExplain( explanation ) {
  return '\n' + wordwrap( explanation ) + '\n'
}

function fmtExample( example ) {
  var fmt = getDivider( 'EXAMPLE' ) + '\n'
  fmt += wordwrap( example )
  return fmt + '\n'
}

function fmtInfo( code, filepath ) {
  if ( !code && !filepath )  { return '' }

  var fmt = '\n' + getDivider()
  if ( code ) {
    fmt += 'Code:\t' + code + '\n'
  }
  if ( filepath ) {
    fmt += 'Path:\t' + filepath + '\n'
  }
  return colors.blue( fmt + getDivider() )
}

/**
 * Return a divider with an optional title
 * @param  {string} [title] A title for the divider.
 * @return {string}       A divider with an optional title.
 */
function getDivider( title ) {
  var divider = title ? '\n---- ' + title + ' ' : ''
  var len = MAX_CHARS - divider.length
  for ( var i = 0; i < len; i++ ) {
    divider += '-'
  }
  return divider + '\n'
}

function truncate( string, maxlen ) {
  var maxlen = maxlen || MAX_CHARS
  var msglen = maxlen - 3
  if ( string.length > maxlen ){
    return string.substring( 0, msglen ) + '...';
  }
  else {
    return string;
  }
}
