'use strict';

const htermAll = require('hterm-umd');
const twemoji = require('twemoji');
const lib = htermAll.lib;
const hterm = htermAll.hterm;

hterm.TextAttributes.prototype.createContainer = function(optTextContent) {
  const isEmoji = twemoji.parse(optTextContent).indexOf('<img') !== -1;
  if (!isEmoji && this.isDefault()) {
    return this.document_.createTextNode(optTextContent);
  }

  const span = this.document_.createElement('span');
  const style = span.style;


  if (this.foreground !== this.DEFAULT_COLOR) {
    style.color = this.foreground;
  }

  if (this.background !== this.DEFAULT_COLOR) {
    style.backgroundColor = this.background;
  }

  if (this.enableBold && this.bold) {
    style.fontWeight = 'bold';
  }

  if (this.faint) {
    span.faint = true;
  }

  if (this.italic) {
    style.fontStyle = 'italic';
  }

  if (this.blink) {
    style.fontStyle = 'italic';
  }

  let textDecoration = '';
  if (this.underline) {
    textDecoration += ' underline';
    span.underline = true;
  }
  if (this.strikethrough) {
    textDecoration += ' line-through';
    span.strikethrough = true;
  }
  if (textDecoration) {
    style.textDecoration = textDecoration;
  }

  if (this.wcNode) {
    span.className = 'wc-node';
    span.wcNode = true;
  }

  if (this.tileData !== null) {
    // This could be a wcNode too, so we add to the className here.
    span.className += ' tile tile_' + this.tileData;
    span.tileNode = true;
  }


  if (optTextContent) {
    if (isEmoji) {
      span.innerHTML = twemoji.parse(optTextContent, {
        ext: '.svg',
        size: 'svg',
        attributes: function attributesCallback() {
          return {
            style: 'height: 100%;vertical-align:top;'
          };
        }
      });
      span.tileNode = true;
    } else {
      span.textContent = optTextContent;
    }
  }

  return span;
};

hterm.Screen.prototype.insertString = function(_str) {
  'use  strict';
  let str = _str;
  const cursorNode = this.cursorNode_;
  let cursorNodeText = cursorNode.textContent;

  this.cursorRowNode_.removeAttribute('line-overflow');

  // We may alter the width of the string by prepending some missing
  // whitespaces, so we need to record the string width ahead of time.
  const strWidth = lib.wc.strWidth(str);

  // No matter what, before this function exits the cursor column will have
  // moved this much.
  this.cursorPosition.column += strWidth;

  // Local cache of the cursor offset.
  const offset = this.cursorOffset_;

  // Reverse offset is the offset measured from the end of the string.
  // Zero implies that the cursor is at the end of the cursor node.
  let reverseOffset = hterm.TextAttributes.nodeWidth(cursorNode) - offset;

  if (reverseOffset < 0) {
    // A negative reverse offset means the cursor is positioned past the end
    // of the characters on this line.  We'll need to insert the missing
    // whitespace.
    const ws = lib.f.getWhitespace(-reverseOffset);

    // This whitespace should be completely unstyled.  Underline, background
    // color, and strikethrough would be visible on whitespace, so we can't use
    // one of those spans to hold the text.
    if (!(this.textAttributes.underline ||
          this.textAttributes.strikethrough ||
          this.textAttributes.background ||
          this.textAttributes.wcNode ||
          this.textAttributes.tileData !== null)) {
      // Best case scenario, we can just pretend the spaces were part of the
      // original string.
      str = ws + str;
    } else if (cursorNode.nodeType === 3 ||
               !(cursorNode.wcNode ||
                 cursorNode.tileNode ||
                 cursorNode.style.textDecoration ||
                 cursorNode.style.backgroundColor)) {
      // Second best case, the current node is able to hold the whitespace.
      cursorNode.textContent = (cursorNodeText += ws);
    } else {
      // Worst case, we have to create a new node to hold the whitespace.
      const wsNode = cursorNode.ownerDocument.createTextNode(ws);
      this.cursorRowNode_.insertBefore(wsNode, cursorNode.nextSibling);
      this.cursorNode_ = cursorNode = wsNode;
      this.cursorOffset_ = offset = -reverseOffset;
      cursorNodeText = ws;
    }

    // We now know for sure that we're at the last character of the cursor node.
    reverseOffset = 0;
  }
  const isEmoji = twemoji.parse(str).indexOf('<img') !== -1;

  if (!isEmoji && this.textAttributes.matchesContainer(cursorNode)) {
    // The new text can be placed directly in the cursor node.
    if (reverseOffset === 0) {
      cursorNode.textContent = cursorNodeText + str;
    } else if (offset === 0) {
      cursorNode.textContent = str + cursorNodeText;
    } else {
      cursorNode.textContent =
          hterm.TextAttributes.nodeSubstr(cursorNode, 0, offset) +
          str + hterm.TextAttributes.nodeSubstr(cursorNode, offset);
    }

    this.cursorOffset_ += strWidth;
    return;
  }

  // The cursor node is the wrong style for the new text.  If we're at the
  // beginning or end of the cursor node, then the adjacent node is also a
  // potential candidate.

  if (offset === 0) {
    // At the beginning of the cursor node, the check the previous sibling.
    const previousSibling = cursorNode.previousSibling;
    if (previousSibling &&
        this.textAttributes.matchesContainer(previousSibling)) {
      previousSibling.textContent += str;
      this.cursorNode_ = previousSibling;
      this.cursorOffset_ = lib.wc.strWidth(previousSibling.textContent);
      return;
    }

    const newNode = this.textAttributes.createContainer(str);
    this.cursorRowNode_.insertBefore(newNode, cursorNode);
    this.cursorNode_ = newNode;
    this.cursorOffset_ = strWidth;
    return;
  }

  if (reverseOffset === 0) {
    // At the end of the cursor node, the check the next sibling.
    const nextSibling = cursorNode.nextSibling;
    if (nextSibling &&
        this.textAttributes.matchesContainer(nextSibling)) {
      nextSibling.textContent = str + nextSibling.textContent;
      this.cursorNode_ = nextSibling;
      this.cursorOffset_ = lib.wc.strWidth(str);
      return;
    }

    const newNode = this.textAttributes.createContainer(str);
    this.cursorRowNode_.insertBefore(newNode, nextSibling);
    this.cursorNode_ = newNode;
    // We specifically need to include any missing whitespace here, since it's
    // going in a new node.
    this.cursorOffset_ = hterm.TextAttributes.nodeWidth(newNode);
    return;
  }

  // Worst case, we're somewhere in the middle of the cursor node.  We'll
  // have to split it into two nodes and insert our new container in between.
  this.splitNode_(cursorNode, offset);
  const newNode2 = this.textAttributes.createContainer(str);
  this.cursorRowNode_.insertBefore(newNode2, cursorNode.nextSibling);
  this.cursorNode_ = newNode2;
  this.cursorOffset_ = strWidth;
};
