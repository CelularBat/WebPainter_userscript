
# **Web Painter userscript**
### Easily draw on any web page!
[![Screenshot-2024-12-26-at-21-51-57-Celular-Bat.png](https://i.postimg.cc/XY1b7TsV/Screenshot-2024-12-26-at-21-51-57-Celular-Bat.png)](https://postimg.cc/mP9qm6xq)

[Preview example page here](https://dainty-lolly-518a15.netlify.app/)

## How to use

You need browser extension which supports userscripts, like:

 - [Tampermonkey](https://www.tampermonkey.net/)
 - [Greasemonkey](https://www.greasespot.net/)
 - or any other
Simply import WebPainter.user.js into extension !

## How it's made?

This is ReactJS Project, with integrated Imba applet ,written for efficiently drawing on the overlay. Imba is a programming language created on top of Javascript.

**Credits:** this project uses component: **TailwindCSS React Color Picker** https://modall.ca/lab/tailwindcss-react-color-picker

Code is compiled and converted into userscript script. Browser extension than inject that code into DOM of any site.

  
## Building from scratch:

### Download the source code and run:

`npm install`

then:

### To build into usercript:

`npm run build`

Userscript file WebPainter.user.js will be inside /dist folder

### To build example preview page ([like this one](https://dainty-lolly-518a15.netlify.app/)) , where WebPainter is inbuilt into page code and doesn't require extension:

`npn run test`

### To test on localhost:

`npm run dev`
