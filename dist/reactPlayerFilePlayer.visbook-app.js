/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkvisbook_motorhome"] = self["webpackChunkvisbook_motorhome"] || []).push([["reactPlayerFilePlayer"],{

/***/ "./node_modules/react-player/lib/players/FilePlayer.js":
/*!*************************************************************!*\
  !*** ./node_modules/react-player/lib/players/FilePlayer.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("var __create = Object.create;\nvar __defProp = Object.defineProperty;\nvar __getOwnPropDesc = Object.getOwnPropertyDescriptor;\nvar __getOwnPropNames = Object.getOwnPropertyNames;\nvar __getProtoOf = Object.getPrototypeOf;\nvar __hasOwnProp = Object.prototype.hasOwnProperty;\nvar __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;\nvar __export = (target, all) => {\n  for (var name in all)\n    __defProp(target, name, { get: all[name], enumerable: true });\n};\nvar __copyProps = (to, from, except, desc) => {\n  if (from && typeof from === \"object\" || typeof from === \"function\") {\n    for (let key of __getOwnPropNames(from))\n      if (!__hasOwnProp.call(to, key) && key !== except)\n        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });\n  }\n  return to;\n};\nvar __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(\n  // If the importer is in node compatibility mode or this is not an ESM\n  // file that has been converted to a CommonJS file using a Babel-\n  // compatible transform (i.e. \"__esModule\" has not been set), then set\n  // \"default\" to the CommonJS \"module.exports\" for node compatibility.\n  isNodeMode || !mod || !mod.__esModule ? __defProp(target, \"default\", { value: mod, enumerable: true }) : target,\n  mod\n));\nvar __toCommonJS = (mod) => __copyProps(__defProp({}, \"__esModule\", { value: true }), mod);\nvar __publicField = (obj, key, value) => {\n  __defNormalProp(obj, typeof key !== \"symbol\" ? key + \"\" : key, value);\n  return value;\n};\nvar FilePlayer_exports = {};\n__export(FilePlayer_exports, {\n  default: () => FilePlayer\n});\nmodule.exports = __toCommonJS(FilePlayer_exports);\nvar import_react = __toESM(__webpack_require__(/*! react */ \"./node_modules/react/index.js\"));\nvar import_utils = __webpack_require__(/*! ../utils */ \"./node_modules/react-player/lib/utils.js\");\nvar import_patterns = __webpack_require__(/*! ../patterns */ \"./node_modules/react-player/lib/patterns.js\");\nconst HAS_NAVIGATOR = typeof navigator !== \"undefined\";\nconst IS_IPAD_PRO = HAS_NAVIGATOR && navigator.platform === \"MacIntel\" && navigator.maxTouchPoints > 1;\nconst IS_IOS = HAS_NAVIGATOR && (/iPad|iPhone|iPod/.test(navigator.userAgent) || IS_IPAD_PRO) && !window.MSStream;\nconst IS_SAFARI = HAS_NAVIGATOR && /^((?!chrome|android).)*safari/i.test(navigator.userAgent) && !window.MSStream;\nconst HLS_SDK_URL = \"https://cdn.jsdelivr.net/npm/hls.js@VERSION/dist/hls.min.js\";\nconst HLS_GLOBAL = \"Hls\";\nconst DASH_SDK_URL = \"https://cdnjs.cloudflare.com/ajax/libs/dashjs/VERSION/dash.all.min.js\";\nconst DASH_GLOBAL = \"dashjs\";\nconst FLV_SDK_URL = \"https://cdn.jsdelivr.net/npm/flv.js@VERSION/dist/flv.min.js\";\nconst FLV_GLOBAL = \"flvjs\";\nconst MATCH_DROPBOX_URL = /www\\.dropbox\\.com\\/.+/;\nconst MATCH_CLOUDFLARE_STREAM = /https:\\/\\/watch\\.cloudflarestream\\.com\\/([a-z0-9]+)/;\nconst REPLACE_CLOUDFLARE_STREAM = \"https://videodelivery.net/{id}/manifest/video.m3u8\";\nclass FilePlayer extends import_react.Component {\n  constructor() {\n    super(...arguments);\n    // Proxy methods to prevent listener leaks\n    __publicField(this, \"onReady\", (...args) => this.props.onReady(...args));\n    __publicField(this, \"onPlay\", (...args) => this.props.onPlay(...args));\n    __publicField(this, \"onBuffer\", (...args) => this.props.onBuffer(...args));\n    __publicField(this, \"onBufferEnd\", (...args) => this.props.onBufferEnd(...args));\n    __publicField(this, \"onPause\", (...args) => this.props.onPause(...args));\n    __publicField(this, \"onEnded\", (...args) => this.props.onEnded(...args));\n    __publicField(this, \"onError\", (...args) => this.props.onError(...args));\n    __publicField(this, \"onPlayBackRateChange\", (event) => this.props.onPlaybackRateChange(event.target.playbackRate));\n    __publicField(this, \"onEnablePIP\", (...args) => this.props.onEnablePIP(...args));\n    __publicField(this, \"onDisablePIP\", (e) => {\n      const { onDisablePIP, playing } = this.props;\n      onDisablePIP(e);\n      if (playing) {\n        this.play();\n      }\n    });\n    __publicField(this, \"onPresentationModeChange\", (e) => {\n      if (this.player && (0, import_utils.supportsWebKitPresentationMode)(this.player)) {\n        const { webkitPresentationMode } = this.player;\n        if (webkitPresentationMode === \"picture-in-picture\") {\n          this.onEnablePIP(e);\n        } else if (webkitPresentationMode === \"inline\") {\n          this.onDisablePIP(e);\n        }\n      }\n    });\n    __publicField(this, \"onSeek\", (e) => {\n      this.props.onSeek(e.target.currentTime);\n    });\n    __publicField(this, \"mute\", () => {\n      this.player.muted = true;\n    });\n    __publicField(this, \"unmute\", () => {\n      this.player.muted = false;\n    });\n    __publicField(this, \"renderSourceElement\", (source, index) => {\n      if (typeof source === \"string\") {\n        return /* @__PURE__ */ import_react.default.createElement(\"source\", { key: index, src: source });\n      }\n      return /* @__PURE__ */ import_react.default.createElement(\"source\", { key: index, ...source });\n    });\n    __publicField(this, \"renderTrack\", (track, index) => {\n      return /* @__PURE__ */ import_react.default.createElement(\"track\", { key: index, ...track });\n    });\n    __publicField(this, \"ref\", (player) => {\n      if (this.player) {\n        this.prevPlayer = this.player;\n      }\n      this.player = player;\n    });\n  }\n  componentDidMount() {\n    this.props.onMount && this.props.onMount(this);\n    this.addListeners(this.player);\n    const src = this.getSource(this.props.url);\n    if (src) {\n      this.player.src = src;\n    }\n    if (IS_IOS || this.props.config.forceDisableHls) {\n      this.player.load();\n    }\n  }\n  componentDidUpdate(prevProps) {\n    if (this.shouldUseAudio(this.props) !== this.shouldUseAudio(prevProps)) {\n      this.removeListeners(this.prevPlayer, prevProps.url);\n      this.addListeners(this.player);\n    }\n    if (this.props.url !== prevProps.url && !(0, import_utils.isMediaStream)(this.props.url) && !(this.props.url instanceof Array)) {\n      this.player.srcObject = null;\n    }\n  }\n  componentWillUnmount() {\n    this.player.removeAttribute(\"src\");\n    this.removeListeners(this.player);\n    if (this.hls) {\n      this.hls.destroy();\n    }\n  }\n  addListeners(player) {\n    const { url, playsinline } = this.props;\n    player.addEventListener(\"play\", this.onPlay);\n    player.addEventListener(\"waiting\", this.onBuffer);\n    player.addEventListener(\"playing\", this.onBufferEnd);\n    player.addEventListener(\"pause\", this.onPause);\n    player.addEventListener(\"seeked\", this.onSeek);\n    player.addEventListener(\"ended\", this.onEnded);\n    player.addEventListener(\"error\", this.onError);\n    player.addEventListener(\"ratechange\", this.onPlayBackRateChange);\n    player.addEventListener(\"enterpictureinpicture\", this.onEnablePIP);\n    player.addEventListener(\"leavepictureinpicture\", this.onDisablePIP);\n    player.addEventListener(\"webkitpresentationmodechanged\", this.onPresentationModeChange);\n    if (!this.shouldUseHLS(url)) {\n      player.addEventListener(\"canplay\", this.onReady);\n    }\n    if (playsinline) {\n      player.setAttribute(\"playsinline\", \"\");\n      player.setAttribute(\"webkit-playsinline\", \"\");\n      player.setAttribute(\"x5-playsinline\", \"\");\n    }\n  }\n  removeListeners(player, url) {\n    player.removeEventListener(\"canplay\", this.onReady);\n    player.removeEventListener(\"play\", this.onPlay);\n    player.removeEventListener(\"waiting\", this.onBuffer);\n    player.removeEventListener(\"playing\", this.onBufferEnd);\n    player.removeEventListener(\"pause\", this.onPause);\n    player.removeEventListener(\"seeked\", this.onSeek);\n    player.removeEventListener(\"ended\", this.onEnded);\n    player.removeEventListener(\"error\", this.onError);\n    player.removeEventListener(\"ratechange\", this.onPlayBackRateChange);\n    player.removeEventListener(\"enterpictureinpicture\", this.onEnablePIP);\n    player.removeEventListener(\"leavepictureinpicture\", this.onDisablePIP);\n    player.removeEventListener(\"webkitpresentationmodechanged\", this.onPresentationModeChange);\n    if (!this.shouldUseHLS(url)) {\n      player.removeEventListener(\"canplay\", this.onReady);\n    }\n  }\n  shouldUseAudio(props) {\n    if (props.config.forceVideo) {\n      return false;\n    }\n    if (props.config.attributes.poster) {\n      return false;\n    }\n    return import_patterns.AUDIO_EXTENSIONS.test(props.url) || props.config.forceAudio;\n  }\n  shouldUseHLS(url) {\n    if (IS_SAFARI && this.props.config.forceSafariHLS || this.props.config.forceHLS) {\n      return true;\n    }\n    if (IS_IOS || this.props.config.forceDisableHls) {\n      return false;\n    }\n    return import_patterns.HLS_EXTENSIONS.test(url) || MATCH_CLOUDFLARE_STREAM.test(url);\n  }\n  shouldUseDASH(url) {\n    return import_patterns.DASH_EXTENSIONS.test(url) || this.props.config.forceDASH;\n  }\n  shouldUseFLV(url) {\n    return import_patterns.FLV_EXTENSIONS.test(url) || this.props.config.forceFLV;\n  }\n  load(url) {\n    const { hlsVersion, hlsOptions, dashVersion, flvVersion } = this.props.config;\n    if (this.hls) {\n      this.hls.destroy();\n    }\n    if (this.dash) {\n      this.dash.reset();\n    }\n    if (this.shouldUseHLS(url)) {\n      (0, import_utils.getSDK)(HLS_SDK_URL.replace(\"VERSION\", hlsVersion), HLS_GLOBAL).then((Hls) => {\n        this.hls = new Hls(hlsOptions);\n        this.hls.on(Hls.Events.MANIFEST_PARSED, () => {\n          this.props.onReady();\n        });\n        this.hls.on(Hls.Events.ERROR, (e, data) => {\n          this.props.onError(e, data, this.hls, Hls);\n        });\n        if (MATCH_CLOUDFLARE_STREAM.test(url)) {\n          const id = url.match(MATCH_CLOUDFLARE_STREAM)[1];\n          this.hls.loadSource(REPLACE_CLOUDFLARE_STREAM.replace(\"{id}\", id));\n        } else {\n          this.hls.loadSource(url);\n        }\n        this.hls.attachMedia(this.player);\n        this.props.onLoaded();\n      });\n    }\n    if (this.shouldUseDASH(url)) {\n      (0, import_utils.getSDK)(DASH_SDK_URL.replace(\"VERSION\", dashVersion), DASH_GLOBAL).then((dashjs) => {\n        this.dash = dashjs.MediaPlayer().create();\n        this.dash.initialize(this.player, url, this.props.playing);\n        this.dash.on(\"error\", this.props.onError);\n        if (parseInt(dashVersion) < 3) {\n          this.dash.getDebug().setLogToBrowserConsole(false);\n        } else {\n          this.dash.updateSettings({ debug: { logLevel: dashjs.Debug.LOG_LEVEL_NONE } });\n        }\n        this.props.onLoaded();\n      });\n    }\n    if (this.shouldUseFLV(url)) {\n      (0, import_utils.getSDK)(FLV_SDK_URL.replace(\"VERSION\", flvVersion), FLV_GLOBAL).then((flvjs) => {\n        this.flv = flvjs.createPlayer({ type: \"flv\", url });\n        this.flv.attachMediaElement(this.player);\n        this.flv.on(flvjs.Events.ERROR, (e, data) => {\n          this.props.onError(e, data, this.flv, flvjs);\n        });\n        this.flv.load();\n        this.props.onLoaded();\n      });\n    }\n    if (url instanceof Array) {\n      this.player.load();\n    } else if ((0, import_utils.isMediaStream)(url)) {\n      try {\n        this.player.srcObject = url;\n      } catch (e) {\n        this.player.src = window.URL.createObjectURL(url);\n      }\n    }\n  }\n  play() {\n    const promise = this.player.play();\n    if (promise) {\n      promise.catch(this.props.onError);\n    }\n  }\n  pause() {\n    this.player.pause();\n  }\n  stop() {\n    this.player.removeAttribute(\"src\");\n    if (this.dash) {\n      this.dash.reset();\n    }\n  }\n  seekTo(seconds, keepPlaying = true) {\n    this.player.currentTime = seconds;\n    if (!keepPlaying) {\n      this.pause();\n    }\n  }\n  setVolume(fraction) {\n    this.player.volume = fraction;\n  }\n  enablePIP() {\n    if (this.player.requestPictureInPicture && document.pictureInPictureElement !== this.player) {\n      this.player.requestPictureInPicture();\n    } else if ((0, import_utils.supportsWebKitPresentationMode)(this.player) && this.player.webkitPresentationMode !== \"picture-in-picture\") {\n      this.player.webkitSetPresentationMode(\"picture-in-picture\");\n    }\n  }\n  disablePIP() {\n    if (document.exitPictureInPicture && document.pictureInPictureElement === this.player) {\n      document.exitPictureInPicture();\n    } else if ((0, import_utils.supportsWebKitPresentationMode)(this.player) && this.player.webkitPresentationMode !== \"inline\") {\n      this.player.webkitSetPresentationMode(\"inline\");\n    }\n  }\n  setPlaybackRate(rate) {\n    try {\n      this.player.playbackRate = rate;\n    } catch (error) {\n      this.props.onError(error);\n    }\n  }\n  getDuration() {\n    if (!this.player)\n      return null;\n    const { duration, seekable } = this.player;\n    if (duration === Infinity && seekable.length > 0) {\n      return seekable.end(seekable.length - 1);\n    }\n    return duration;\n  }\n  getCurrentTime() {\n    if (!this.player)\n      return null;\n    return this.player.currentTime;\n  }\n  getSecondsLoaded() {\n    if (!this.player)\n      return null;\n    const { buffered } = this.player;\n    if (buffered.length === 0) {\n      return 0;\n    }\n    const end = buffered.end(buffered.length - 1);\n    const duration = this.getDuration();\n    if (end > duration) {\n      return duration;\n    }\n    return end;\n  }\n  getSource(url) {\n    const useHLS = this.shouldUseHLS(url);\n    const useDASH = this.shouldUseDASH(url);\n    const useFLV = this.shouldUseFLV(url);\n    if (url instanceof Array || (0, import_utils.isMediaStream)(url) || useHLS || useDASH || useFLV) {\n      return void 0;\n    }\n    if (MATCH_DROPBOX_URL.test(url)) {\n      return url.replace(\"www.dropbox.com\", \"dl.dropboxusercontent.com\");\n    }\n    return url;\n  }\n  render() {\n    const { url, playing, loop, controls, muted, config, width, height } = this.props;\n    const useAudio = this.shouldUseAudio(this.props);\n    const Element = useAudio ? \"audio\" : \"video\";\n    const style = {\n      width: width === \"auto\" ? width : \"100%\",\n      height: height === \"auto\" ? height : \"100%\"\n    };\n    return /* @__PURE__ */ import_react.default.createElement(\n      Element,\n      {\n        ref: this.ref,\n        src: this.getSource(url),\n        style,\n        preload: \"auto\",\n        autoPlay: playing || void 0,\n        controls,\n        muted,\n        loop,\n        ...config.attributes\n      },\n      url instanceof Array && url.map(this.renderSourceElement),\n      config.tracks.map(this.renderTrack)\n    );\n  }\n}\n__publicField(FilePlayer, \"displayName\", \"FilePlayer\");\n__publicField(FilePlayer, \"canPlay\", import_patterns.canPlay.file);\n\n\n//# sourceURL=webpack://visbook-motorhome/./node_modules/react-player/lib/players/FilePlayer.js?");

/***/ })

}]);