'use strict';

/**
 * Text utility functions to format an manipulate text.
 * @module lib/solidtext
 * @author Roberto Mauro <erremauro@icloud.com>
 * @since 0.3.0
 * @version 0.1.1
 *
 * @requires {@link https://github.com/chjj/marked|marked}
 * @requires {@link https://github.com/chalk/chalk|chalk}
 * @requires {@link https://github.com/omnidan/node-emoji|node-emoji}
 */

var chalk = require('chalk');
var marked = require('marked');
var emoji = require('node-emoji');

/**
 * @memberOf module:lib/solidtext
 * @const {string}
 * @since 0.1.0
 * @version 0.1.0
 */
var HARD_RETURN = '\r';

/**
 * @memberOf module:lib/
 * @const {RegEx}
 * @since 0.1.0
 * @version 0.1.0
 */
var HARD_RETURN_RE = new RegExp(HARD_RETURN);

/**
 * @memberOf module:lib/solidtext
 * @const {RegEx}
 * @since 0.1.0
 * @version 0.1.0
 */
var HARD_RETURN_GFM_RE = new RegExp(HARD_RETURN + '|<br />');

/**
 * @name module:lib/solidtext~SolidText
 * @memberOf module:lib/solidtext
 * @since 0.1.0
 * @version 0.1.0
 */
var SolidText = {

  /**
   * Wordwrap `text` at max `width` with support for GitHub flavored markdown
   * @param  {string} text   Text to wordwrap
   * @param  {string} width  Columns width
   * @param  {boolean} gfm   Support GitHub flavored markdown
   * @return {string}        Wordwrapped text
   * @version 0.1.0
   * @since 0.1.0
   */
  wordwrap: function wordwrap(text, width, gfm) {
    var splitRe = gfm ? HARD_RETURN_GFM_RE : HARD_RETURN_RE;
    var sections = text.split(splitRe);
    var wordrapped = [];

    sections.forEach(function (section) {
      var words = section.split(/[ \t\n]+/);
      var column = 0;
      var nextText = '';

      words.forEach(function (word) {
        var addOne = column !== 0;
        if (column + SolidText.textLength(word) + addOne > width) {
          nextText += '\n';
          column = 0;
        } else if (addOne) {
          nextText += ' ';
          column += 1;
        }
        nextText += word;
        column += SolidText.textLength(word);
      });

      wordrapped.push(nextText);
    });

    return wordrapped.join('\n');
  },

  /**
   * Calculate the `text`'s length escaping terminal entities.
   * @param  {string} text Text to calculate for length
   * @return {number}      Text only length
   * @version 0.1.0
   * @since 0.1.0
   */
  textLength: function textLength(text) {
    var ttyEntities = /\u001b\[(?:\d{1,3})(?:;\d{1,3})*m/g;
    return text.replace(ttyEntities, '').length;
  },

  /**
   * Truncate the give `string` to `maxlen` and add ellipsis at th end.
   * @param  {string} string String to be truncated
   * @param  {number} maxlen Truncate at length
   * @return {string}        Truncated text
   * @version 0.1.0
   * @since 0.1.0
   */
  truncate: function truncate(string, maxlen) {
    var msglen = maxlen - 3;

    if (string.length > maxlen) {
      return string.substring(0, msglen) + '...';
    }

    return string;
  },

  /**
   * Capitalize the first letter of the given `text`
   * @param  {string} text Text where the first letter should be capitalized
   * @return {string}      Text with first letter capitalized
   * @version 0.1.0
   * @since 0.1.0
   */
  capitalizeFirstLetter: function capitalizeFirstLetter(text) {
    var firstUp = text.charAt(0).toUpperCase();
    var remainingText = text.slice(1);
    return firstUp + remainingText;
  },

  /**
   * Escape RegExp from the give `text`
   * @version 0.1.0
   * @since 0.1.0
   */
  escapeRegExp: function escapeRegExp(text) {
    var regExpPattern = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;
    return text.replace(regExpPattern, '\\$&');
  },

  /**
   * Render emoji from emoji tag (i.e. :heart: ) found in given `text`.
   * @param  {string} text Text with emojis.
   * @return {string}      Text with rendered emoji tags
   * @version 0.1.0
   * @since 0.1.0
   */
  emojis: function emojis(text) {
    return text.replace(/:([A-Za-z0-9_\-\+]+?):/g, function (emojiString) {
      var emojiSign = emoji.get(emojiString);
      if (!emojiSign) {
        return emojiString;
      }

      return emojiSign + ' ';
    });
  },

  /**
   * Render markdown syntax to terminal syntax
   * @param {string} text markdown formatted text.
   * @returns {string} terminal rendered text
   * @since 0.1.2
   * @version 0.1.0
   */
  markdown2tty: function markdown2tty(text) {
    return marked(text);
  },

  /**
   * Set marked options.
   * @param {object} props Marked options object.
   * @since 0.1.2
   * @version 0.1.0
   */
  setMarkedOptions: function setMarkedOptions(props) {
    return marked.setOptions(props);
  },

  /**
   * Colorize text for terminal output using
   * {@link https://github.com/chalk/chalk|chalk}
   * @type {Chalk}
   * @version 0.1.0
   * @since 0.1.1
   */
  color: chalk
};

module.exports = SolidText;