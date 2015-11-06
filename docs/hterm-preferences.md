# alt-backspace-is-meta-backspace

If set, undoes the Chrome OS Alt-Backspace->DEL remap, so that alt-backspace indeed is alt-backspace.
Defaults to false.


# alt-is-meta

Set whether the alt key acts as a meta key or as a distinct alt key.
Defaults to false.


# alt-sends-what

Controls how the alt key is handled.
   * escape....... Send an ESC prefix.
   * 8-bit........ Add 128 to the unshifted character as in xterm.
   * browser-key.. Wait for the keypress event and see what the browser says.
   (This won't work well on platforms where the browser performs a default action for some alt sequences.)
Defaults to 'escape'.


# audible-bell-sound

Terminal bell sound.  Empty string for no audible bell.
Defaults to 'lib-resource:hterm/audio/bell'.


# desktop-notification-bell

If true, terminal bells in the background will create a Web Notification. http://www.w3.org/TR/notifications/
Displaying notifications requires permission from the user. When this option is set to true, hterm will attempt to ask the user for permission if necessary. Note browsers may not show this permission request if it did not originate from a user action.
Chrome extensions with the "notfications" permission have permission to display notifications.
Defaults to false.


# background-color

The background color for text with no other color attributes.

Defaults to 'rgb(16, 16, 16)'.


# background-image

The background image.

Defaults to '.


# background-size

The background image size,
Defaults to none.

# background-position

The background image position,
Defaults to none.


# backspace-sends-backspace

If true, the backspace should send BS ('\x08', aka ^H).  Otherwise the backspace key should send '\x7f'.
Defaults to false.


# close-on-exit

Whether or not to close the window when the command exits.
Defaults to true.


# cursor-blink

Whether or not to blink the cursor by default.

Defaults to false.


# cursor-blink-cycle

The cursor blink rate in milliseconds. A two element array, the first of which is how long the cursor should be on, second is how long it should be off.

Defaults to [1000, 500].


# cursor-color

The color of the visible cursor.

Defaults to 'rgba(255, 0, 0, 0.5)'.


# color-palette-overrides

Override colors in the default palette.This can be specified as an array or an object.  If specified as an object it is assumed to be a sparse array, where each property is a numeric index into the color palette. Values can be specified as css almost any css color value.  This includes #RGB, #RRGGBB, rgb(...), rgba(...), and any color names that are also part of the stock X11 rgb.txt file. You can use 'null' to specify that the default value should be not be changed.  This is useful for skipping a small number of indicies when the value is specified as an array.
Defaults to null.


# copy-on-select

Automatically copy mouse selection to the clipboard.

Defaults to true.


# use-default-window-copy

Whether to use the default window copy behaviour.

Defaults to false.


# clear-selection-after-copy

Whether to clear the selection after copying.

Defaults to true.


# ctrl-plus-minus-zero-zoom

If true, Ctrl-Plus/Minus/Zero controls zoom. If false, Ctrl-Shift-Plus/Minus/Zero controls zoom, Ctrl-Minus sends ^_, Ctrl-Plus/Zero do nothing.

Defaults to true.


# ctrl-c-copy

Ctrl+C copies if true, send ^C to host if false. Ctrl+Shift+C sends ^C to host if true, copies if false.

Defaults to false.


# ctrl-v-paste

Ctrl+V pastes if true, send ^V to host if false. Ctrl+Shift+V sends ^V to host if true, pastes if false.

Defaults to false.


# east-asian-ambiguous-as-two-column

Set whether East Asian Ambiguous characters have two column width.

Defaults to false.


# enable-8-bit-control

True to enable 8-bit control characters, false to ignore them. We'll respect the two-byte versions of these control characters regardless of this setting.

Defaults to false.


# enable-bold

True if we should use bold weight font for text with the bold/bright attribute.  False to use the normal weight font.  Null to autodetect.

Defaults to null.


# enable-bold-as-bright

True if we should use bright colors (8-15 on a 16 color palette) for any text with the bold attribute.  False otherwise.

Defaults to true.


# enable-clipboard-notice

Allow the host to write directly to the system clipboard.

Defaults to true.


# enable-clipboard-write

Allow the host to write directly to the system clipboard.

Defaults to true.


# enable-dec12

Respect the host's attempt to change the cursor blink status using DEC Private Mode 12.

Defaults to false.


# environment

The default environment variables.

Defaults to {'TERM':'xterm-256color'}.

# font-family

Default font family for the terminal text.

Defaults to ('"DejaVu Sans Mono", "Everson Mono", ' .
                  'FreeMono, "Menlo", "Terminal", ' +
                  'monospace'),


# font-size

The default font size in pixels.

Defaults to 15.


# font-smoothing

Anti-aliasing.

Defaults to 'antialiased'.


# foreground-color

The foreground color for text with no other color attributes.

Defaults to 'rgb(240, 240, 240)'.


# home-keys-scroll

If true, home/end will control the terminal scrollbar and shift home/end will send the VT keycodes.  If false then home/end sends VT codes and shift home/end scrolls.


# max-string-sequence

Defaults to false.

Max length of a DCS, OSC, PM, or APS sequence before we give up and ignore the code.

Defaults to 100000.


# media-keys-are-fkeys

If true, convert media keys to their Fkey equivalent. If false, let Chrome handle the keys.

Defaults to false.


# meta-sends-escape

Set whether the meta key sends a leading escape or not.

Defaults to true.


# mouse-paste-button

Mouse paste button, or null to autodetect. For autodetect, we'll try to enable middle button paste for non-X11 platforms. On X11 we move it to button 3, but that'll probably be a context menu in the future.

Defaults to null.


# page-keys-scroll

If true, page up/down will control the terminal scrollbar and shift page up/down will send the VT keycodes.  If false then page up/down sends VT codes and shift page up/down scrolls.

Defaults to false.


# pass-alt-number

Set whether we should pass Alt-1..9 to the browser.
This is handy when running hterm in a browser tab, so that you don't lose Chrome's "switch to tab" keyboard accelerators.  When not running in a tab it's better to send these keys to the host so they can be used in vim or emacs. If true, Alt-1..9 will be handled by the browser.  If false, Alt-1..9 will be sent to the host.  If null, autodetect based on browser platform and window type.

Defaults to null.


# pass-ctrl-number

Set whether we should pass Ctrl-1..9 to the browser.This is handy when running hterm in a browser tab, so that you don't lose Chrome's "switch to tab" keyboard accelerators.  When not running in a tab it's better to send these keys to the host so they can be used in vim or emacs. If true, Ctrl-1..9 will be handled by the browser.  If false, Ctrl-1..9 will be sent to the host.  If null, autodetect based on browser platform and window type.

Defaults to null.


# pass-meta-number

Set whether we should pass Meta-1..9 to the browser.This is handy when running hterm in a browser tab, so that you don't lose Chrome's "switch to tab" keyboard accelerators.  When not running in a tab it's better to send these keys to the host so they can be used in vim or emacs.If true, Meta-1..9 will be handled by the browser.  If false, Meta-1..9 will be sent to the host.  If null, autodetect based on browser platform and window type.

Defaults to null.


# pass-meta-v

Set whether meta-V gets passed to host.

Defaults to true.


# receive-encoding

Set the expected encoding for data received from the host.Valid values are 'utf-8' and 'raw'.

Defaults to 'utf-8'.


# scroll-on-keystroke

If true, scroll to the bottom on any keystroke.

Defaults to true.


# scroll-on-output

If true, scroll to the bottom on terminal output.

Defaults to false.


# scrollbar-visible

The vertical scrollbar mode.

Defaults to true.


# send-encoding

Set the encoding for data sent to host.Valid values are 'utf-8' and 'raw'.

Defaults to 'utf-8'.


# shift-insert-paste

Shift + Insert pastes if true, sent to host if false.

Defaults to true.


# user-css

User stylesheet to include in the terminal document.

Defaults to ''.
