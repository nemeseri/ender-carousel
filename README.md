[![build status](https://secure.travis-ci.org/nemeseri/ender-carousel.png)](http://travis-ci.org/nemeseri/ender-carousel)
# ender-carousel
----

Ender-carousel is a really simple carousel plugin for <a href="http://ender.no.de/">Ender</a>. You can easily build your own <strong>gallery</strong> on the top of this plugin. It's just <strong>1.7 KByte</strong> (minified and gzipped).

It requires [Jeesh](https://github.com/ender-js/jeesh) and [Morpheus](https://github.com/ded/morpheus) for animations.
Even though, you can leave Morpheus out if you are fine without animations. Currently it's tested in Chrome, Firefox, Safari, Opera and IE7+. You can report bugs [here](https://github.com/nemeseri/ender-overlay/issues).

If you want to use <strong>CSS3 transitions</strong> instead of JS animations, just set the "css3transition" property to true. Only recent Firefox and Webkit based browsers will use transitions. Older browsers will fall back to JS animations.

It's even compatible with jQuery and Zepto! So if you want to include it in a jQuery/Zepto based project, you can do it without any extra work.

You might be interested in [ender-overlay](https://github.com/nemeseri/ender-overlay), which is a dialog/overlay solution for ender.

I got a lot inspiration from [jQuery Tools](http://flowplayer.org/tools/), thanks for that.

More information, documentation, demos: [http://nemeseri.com/ender-carousel/](http://nemeseri.com/ender-carousel/)