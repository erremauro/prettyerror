'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var colors = require('chalk');
var marked = require('marked');
var SolidText = require('./solidtext');
var TTYRender = require('./ttyrender');

var SolidRender = function () {
  function SolidRender(props) {
    _classCallCheck(this, SolidRender);

    this.marked = marked;
    this.setProps(props);
  }

  _createClass(SolidRender, [{
    key: 'setProps',
    value: function setProps(props) {
      this.props = Object.assign(this.props || this.defaultProps(), props);

      var ttyProps = {
        wordwrap: this.props.wordwrap,
        columns: this.props.columns,
        markdown: this.props.markdown
      };

      this.marked.setOptions({
        renderer: new TTYRender(ttyProps),
        sanitize: true,
        tables: true,
        gfm: true,
        breaks: false
      });
    }
  }, {
    key: 'defaultProps',
    value: function defaultProps() {
      return {
        columns: 80,
        wordwrap: true,
        markdown: true,
        marginRight: 2,
        textColor: 'reset',
        messageColor: 'yellow',
        explainColor: 'reset',
        headerColor: 'cyan',
        hintsColor: 'green',
        footerColor: 'cyan',
        traceColor: 'reset',
        headerTitle: 'ERROR:',
        hintsTitle: 'HINTS:',
        traceTitle: 'STACK TRACE:',
        dividerStyle: '-',
        headerStyle: '=',
        hintsStyle: '-',
        footerStyle: '-',
        traceStyle: '-'
      };
    }
  }, {
    key: 'header',
    value: function header(readableName) {
      var headerTitle = readableName ? this.props.headerTitle + ' ' + readableName : this.props.headerTitle;

      var coloredText = this.applyColor(this.props.headerColor, this.getDivider(headerTitle, this.props.headerStyle));
      return '\n' + coloredText + '\n';
    }
  }, {
    key: 'message',
    value: function message(text) {
      var formattedText = this.formatText(text);
      var color = this.props.messageColor;
      return '\n' + this.applyColor(color, formattedText) + '\n';
    }
  }, {
    key: 'explain',
    value: function explain(text) {
      if (this.props.markdown) {
        return this.marked(text);
      }

      return '\n' + this.applyColor(this.props.explain, text);
    }
  }, {
    key: 'hints',
    value: function hints(text) {
      var hintsText = text;
      var divider = this.getDivider(this.props.hintsTitle, this.props.hintsStyle);
      divider = this.applyColor(this.props.hintsColor, divider);

      if (this.props.markdown) {
        hintsText = this.marked(hintsText);
      } else {
        hintsText = '\n' + hintsText;
      }

      var formattedText = this.formatText(hintsText);
      return '\n' + divider + '\n' + formattedText;
    }
  }, {
    key: 'trace',
    value: function trace(stack) {
      var divider = this.applyColor(this.props.traceColor, this.getDivider(this.props.traceTitle, this.props.traceStyle));
      return '\n' + divider + '\n\n' + stack;
    }
  }, {
    key: 'footer',
    value: function footer(errorCode, errorPath) {
      if (!errorCode && !errorPath) return '';
      var footerDivider = this.getDivider(null, this.props.footerSytle);
      var text = '';

      if (errorCode) {
        text += this.formatText('Code: ' + errorCode);
        text += errorPath ? '\n' : '';
      }

      if (errorPath) {
        text += this.formatText('Path: ' + errorPath);
      }
      text = footerDivider + '\n' + text + '\n' + footerDivider;
      return '\n' + this.applyColor(this.props.footerColor, text) + '\n';
    }
  }, {
    key: 'applyColor',
    value: function applyColor(name, text) {
      name.split('.').forEach(function (style) {
        if (typeof colors[style] === 'function') {
          var colorFn = colors[style];
          text = colorFn(text);
        }
      });
      return text;
    }
  }, {
    key: 'formatText',
    value: function formatText(text) {
      if (this.props.wordwrap) {
        return SolidText.wordwrap(text, this.props.columns, true);
      }
      return text;
    }
  }, {
    key: 'getDivider',
    value: function getDivider(title, style) {
      style = style || this.props.dividerStyle;

      var divider = [1, 2, 3, 4].map(function () {
        return style;
      }).join('');
      divider = title ? divider + ' ' + title + ' ' : '';

      var len = this.props.columns - divider.length - this.props.marginRight;
      for (var i = 0; i <= len; i += style.length) {
        divider += style;
      }

      return divider;
    }
  }]);

  return SolidRender;
}();

module.exports = SolidRender;