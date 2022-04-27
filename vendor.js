var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import { Matrix4, Vector3, Object3D, PlaneGeometry, Mesh, MeshBasicMaterial, DoubleSide, VideoTexture, CanvasTexture, TextureLoader, ClampToEdgeWrapping, LinearFilter, MeshDepthMaterial, RGBADepthPacking, RGBAFormat, RGBA_ASTC_4x4_Format, RGBA_BPTC_Format, RGBA_ETC2_EAC_Format, RGBA_PVRTC_4BPPV1_Format, RGBA_S3TC_DXT5_Format, RGB_ETC1_Format, RGB_ETC2_Format, RGB_PVRTC_4BPPV1_Format, RGB_S3TC_DXT1_Format, Loader, FileLoader, CompressedTexture, UnsignedByteType, LinearMipmapLinearFilter, sRGBEncoding, LinearEncoding } from "three";
function traverseChildElements(element, each, bind, level = 0) {
  var _a2;
  level++;
  element = element.shadowRoot || element;
  for (let child = element.firstElementChild; child; child = child.nextElementSibling) {
    if (child.assignedSlot)
      continue;
    const assignedElements = (_a2 = child.assignedElements) == null ? void 0 : _a2.call(child, { flatten: true });
    if (assignedElements)
      for (const assigned of assignedElements) {
        if (each.call(bind, assigned, level)) {
          traverseChildElements(child, each, bind, level);
        }
      }
    if (each.call(bind, child, level)) {
      traverseChildElements(child, each, bind, level);
    }
  }
}
class Bounds {
  constructor() {
    __publicField(this, "left", 0);
    __publicField(this, "top", 0);
    __publicField(this, "width", 0);
    __publicField(this, "height", 0);
  }
  copy(rect) {
    this.top = rect.top;
    this.left = rect.left;
    this.width = rect.width;
    this.height = rect.height;
    return this;
  }
}
class Edges {
  constructor() {
    __publicField(this, "left", 0);
    __publicField(this, "top", 0);
    __publicField(this, "right", 0);
    __publicField(this, "bottom", 0);
  }
  copy(rect) {
    this.top = rect.top;
    this.left = rect.left;
    this.right = rect.right;
    this.bottom = rect.bottom;
    return this;
  }
}
const viewportTester = document.createElement("div");
viewportTester.id = "VIEWPORT";
viewportTester.style.position = "fixed";
viewportTester.style.width = "100vw";
viewportTester.style.height = "100vh";
viewportTester.style.visibility = "hidden";
viewportTester.style.pointerEvents = "none";
class WebLayer {
  constructor(manager, element, eventCallback) {
    __publicField(this, "manager");
    __publicField(this, "element");
    __publicField(this, "eventCallback");
    __publicField(this, "isMediaElement", false);
    __publicField(this, "isVideoElement", false);
    __publicField(this, "isCanvasElement", false);
    __publicField(this, "desiredPseudoState", {
      hover: false,
      active: false,
      focus: false,
      target: false
    });
    __publicField(this, "needsRefresh", true);
    __publicField(this, "needsRemoval", false);
    __publicField(this, "parentLayer");
    __publicField(this, "childLayers", []);
    __publicField(this, "pixelRatio");
    __publicField(this, "allStateHashes", /* @__PURE__ */ new Set());
    __publicField(this, "previousDOMStateKey");
    __publicField(this, "desiredDOMStateKey");
    __publicField(this, "currentDOMStateKey");
    __publicField(this, "domMetrics", {
      bounds: new Bounds(),
      padding: new Edges(),
      margin: new Edges(),
      border: new Edges()
    });
    this.manager = manager;
    this.element = element;
    this.eventCallback = eventCallback;
    if (!manager)
      throw new Error("WebLayerManager must be initialized");
    WebRenderer.layers.set(element, this);
    element.setAttribute(WebRenderer.LAYER_ATTRIBUTE, "");
    this.parentLayer = WebRenderer.getClosestLayer(this.element, false);
    this.isVideoElement = element.nodeName === "VIDEO";
    this.isMediaElement = this.isVideoElement || element.nodeName === "IMG" || element.nodeName === "CANVAS";
    this.eventCallback("layercreated", { target: element });
  }
  setNeedsRefresh(recurse = false) {
    this.needsRefresh = true;
    if (recurse)
      for (const c of this.childLayers)
        c.setNeedsRefresh(recurse);
  }
  get previousDOMState() {
    return this.previousDOMStateKey ? this.manager.getLayerState(this.previousDOMStateKey) : void 0;
  }
  get desiredDOMState() {
    return this.desiredDOMStateKey ? this.manager.getLayerState(this.desiredDOMStateKey) : void 0;
  }
  get currentDOMState() {
    return this.currentDOMStateKey ? this.manager.getLayerState(this.currentDOMStateKey) : void 0;
  }
  get depth() {
    let depth = 0;
    let layer = this;
    while (layer.parentLayer) {
      layer = layer.parentLayer;
      depth++;
    }
    return depth;
  }
  get rootLayer() {
    let rootLayer = this;
    while (rootLayer.parentLayer)
      rootLayer = rootLayer.parentLayer;
    return rootLayer;
  }
  traverseParentLayers(each) {
    const parentLayer = this.parentLayer;
    if (parentLayer) {
      parentLayer.traverseParentLayers(each);
      each(parentLayer);
    }
  }
  traverseLayers(each) {
    each(this);
    this.traverseChildLayers(each);
  }
  traverseChildLayers(each) {
    for (const child of this.childLayers) {
      child.traverseLayers(each);
    }
  }
  update() {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
    if (this.desiredDOMStateKey !== this.currentDOMStateKey) {
      const desired = this.desiredDOMState;
      if (desired && (this.isMediaElement || ((_a2 = desired.texture) == null ? void 0 : _a2.ktx2Url) || ((_b = desired.texture) == null ? void 0 : _b.canvas) || desired.fullWidth * desired.fullHeight === 0)) {
        this.currentDOMStateKey = this.desiredDOMStateKey;
      }
    }
    const prev = (_g = (_d = (_c = this.previousDOMState) == null ? void 0 : _c.texture) == null ? void 0 : _d.ktx2Url) != null ? _g : (_f = (_e = this.previousDOMState) == null ? void 0 : _e.texture) == null ? void 0 : _f.canvas;
    const current = (_l = (_i = (_h = this.currentDOMState) == null ? void 0 : _h.texture) == null ? void 0 : _i.ktx2Url) != null ? _l : (_k = (_j = this.previousDOMState) == null ? void 0 : _j.texture) == null ? void 0 : _k.canvas;
    if (current && prev !== current) {
      this.eventCallback("layerpainted", { target: this.element });
    }
    this.previousDOMStateKey = this.currentDOMStateKey;
  }
  async refresh() {
    this.needsRefresh = false;
    this._updateParentAndChildLayers();
    const result = await this.manager.addToSerializeQueue(this);
    if (result.needsRasterize && typeof result.stateKey === "string" && result.svgUrl)
      await this.manager.addToRasterizeQueue(result.stateKey, result.svgUrl);
  }
  _updateParentAndChildLayers() {
    const element = this.element;
    const childLayers = this.childLayers;
    const oldChildLayers = childLayers.slice();
    const previousParentLayer = this.parentLayer;
    this.parentLayer = WebRenderer.getClosestLayer(this.element, false);
    if (previousParentLayer !== this.parentLayer) {
      this.parentLayer && this.parentLayer.childLayers.push(this);
      this.eventCallback("layermoved", { target: element });
    }
    childLayers.length = 0;
    traverseChildElements(element, this._tryConvertElementToWebLayer, this);
    for (const child of oldChildLayers) {
      const parentLayer = WebRenderer.getClosestLayer(child.element, false);
      if (!parentLayer) {
        child.needsRemoval = true;
        childLayers.push(child);
      }
    }
  }
  _tryConvertElementToWebLayer(n) {
    if (this.needsRemoval)
      return false;
    const el = n;
    const styles = getComputedStyle(el);
    const isLayer = el.hasAttribute(WebRenderer.LAYER_ATTRIBUTE);
    if (isLayer || el.nodeName === "VIDEO" || styles.transform !== "none") {
      let child = WebRenderer.layers.get(el);
      if (!child) {
        child = new WebLayer(this.manager, el, this.eventCallback);
      }
      this.childLayers.push(child);
      return false;
    }
    return true;
  }
}
var resizeObservers = [];
var hasActiveObservations = function() {
  return resizeObservers.some(function(ro) {
    return ro.activeTargets.length > 0;
  });
};
var hasSkippedObservations = function() {
  return resizeObservers.some(function(ro) {
    return ro.skippedTargets.length > 0;
  });
};
var msg = "ResizeObserver loop completed with undelivered notifications.";
var deliverResizeLoopError = function() {
  var event;
  if (typeof ErrorEvent === "function") {
    event = new ErrorEvent("error", {
      message: msg
    });
  } else {
    event = document.createEvent("Event");
    event.initEvent("error", false, false);
    event.message = msg;
  }
  window.dispatchEvent(event);
};
var ResizeObserverBoxOptions;
(function(ResizeObserverBoxOptions2) {
  ResizeObserverBoxOptions2["BORDER_BOX"] = "border-box";
  ResizeObserverBoxOptions2["CONTENT_BOX"] = "content-box";
  ResizeObserverBoxOptions2["DEVICE_PIXEL_CONTENT_BOX"] = "device-pixel-content-box";
})(ResizeObserverBoxOptions || (ResizeObserverBoxOptions = {}));
var freeze = function(obj) {
  return Object.freeze(obj);
};
var ResizeObserverSize = function() {
  function ResizeObserverSize2(inlineSize, blockSize) {
    this.inlineSize = inlineSize;
    this.blockSize = blockSize;
    freeze(this);
  }
  return ResizeObserverSize2;
}();
var DOMRectReadOnly = function() {
  function DOMRectReadOnly2(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.top = this.y;
    this.left = this.x;
    this.bottom = this.top + this.height;
    this.right = this.left + this.width;
    return freeze(this);
  }
  DOMRectReadOnly2.prototype.toJSON = function() {
    var _a2 = this, x = _a2.x, y = _a2.y, top = _a2.top, right = _a2.right, bottom = _a2.bottom, left = _a2.left, width = _a2.width, height = _a2.height;
    return { x, y, top, right, bottom, left, width, height };
  };
  DOMRectReadOnly2.fromRect = function(rectangle) {
    return new DOMRectReadOnly2(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
  };
  return DOMRectReadOnly2;
}();
var isSVG = function(target2) {
  return target2 instanceof SVGElement && "getBBox" in target2;
};
var isHidden = function(target2) {
  if (isSVG(target2)) {
    var _a2 = target2.getBBox(), width = _a2.width, height = _a2.height;
    return !width && !height;
  }
  var _b = target2, offsetWidth = _b.offsetWidth, offsetHeight = _b.offsetHeight;
  return !(offsetWidth || offsetHeight || target2.getClientRects().length);
};
var isElement = function(obj) {
  var _a2, _b;
  if (obj instanceof Element) {
    return true;
  }
  var scope = (_b = (_a2 = obj) === null || _a2 === void 0 ? void 0 : _a2.ownerDocument) === null || _b === void 0 ? void 0 : _b.defaultView;
  return !!(scope && obj instanceof scope.Element);
};
var isReplacedElement = function(target2) {
  switch (target2.tagName) {
    case "INPUT":
      if (target2.type !== "image") {
        break;
      }
    case "VIDEO":
    case "AUDIO":
    case "EMBED":
    case "OBJECT":
    case "CANVAS":
    case "IFRAME":
    case "IMG":
      return true;
  }
  return false;
};
var global$1 = typeof window !== "undefined" ? window : {};
var cache = /* @__PURE__ */ new WeakMap();
var scrollRegexp = /auto|scroll/;
var verticalRegexp = /^tb|vertical/;
var IE = /msie|trident/i.test(global$1.navigator && global$1.navigator.userAgent);
var parseDimension = function(pixel) {
  return parseFloat(pixel || "0");
};
var size = function(inlineSize, blockSize, switchSizes) {
  if (inlineSize === void 0) {
    inlineSize = 0;
  }
  if (blockSize === void 0) {
    blockSize = 0;
  }
  if (switchSizes === void 0) {
    switchSizes = false;
  }
  return new ResizeObserverSize((switchSizes ? blockSize : inlineSize) || 0, (switchSizes ? inlineSize : blockSize) || 0);
};
var zeroBoxes = freeze({
  devicePixelContentBoxSize: size(),
  borderBoxSize: size(),
  contentBoxSize: size(),
  contentRect: new DOMRectReadOnly(0, 0, 0, 0)
});
var calculateBoxSizes = function(target2, forceRecalculation) {
  if (forceRecalculation === void 0) {
    forceRecalculation = false;
  }
  if (cache.has(target2) && !forceRecalculation) {
    return cache.get(target2);
  }
  if (isHidden(target2)) {
    cache.set(target2, zeroBoxes);
    return zeroBoxes;
  }
  var cs = getComputedStyle(target2);
  var svg = isSVG(target2) && target2.ownerSVGElement && target2.getBBox();
  var removePadding = !IE && cs.boxSizing === "border-box";
  var switchSizes = verticalRegexp.test(cs.writingMode || "");
  var canScrollVertically = !svg && scrollRegexp.test(cs.overflowY || "");
  var canScrollHorizontally = !svg && scrollRegexp.test(cs.overflowX || "");
  var paddingTop = svg ? 0 : parseDimension(cs.paddingTop);
  var paddingRight = svg ? 0 : parseDimension(cs.paddingRight);
  var paddingBottom = svg ? 0 : parseDimension(cs.paddingBottom);
  var paddingLeft = svg ? 0 : parseDimension(cs.paddingLeft);
  var borderTop = svg ? 0 : parseDimension(cs.borderTopWidth);
  var borderRight = svg ? 0 : parseDimension(cs.borderRightWidth);
  var borderBottom = svg ? 0 : parseDimension(cs.borderBottomWidth);
  var borderLeft = svg ? 0 : parseDimension(cs.borderLeftWidth);
  var horizontalPadding = paddingLeft + paddingRight;
  var verticalPadding = paddingTop + paddingBottom;
  var horizontalBorderArea = borderLeft + borderRight;
  var verticalBorderArea = borderTop + borderBottom;
  var horizontalScrollbarThickness = !canScrollHorizontally ? 0 : target2.offsetHeight - verticalBorderArea - target2.clientHeight;
  var verticalScrollbarThickness = !canScrollVertically ? 0 : target2.offsetWidth - horizontalBorderArea - target2.clientWidth;
  var widthReduction = removePadding ? horizontalPadding + horizontalBorderArea : 0;
  var heightReduction = removePadding ? verticalPadding + verticalBorderArea : 0;
  var contentWidth = svg ? svg.width : parseDimension(cs.width) - widthReduction - verticalScrollbarThickness;
  var contentHeight = svg ? svg.height : parseDimension(cs.height) - heightReduction - horizontalScrollbarThickness;
  var borderBoxWidth = contentWidth + horizontalPadding + verticalScrollbarThickness + horizontalBorderArea;
  var borderBoxHeight = contentHeight + verticalPadding + horizontalScrollbarThickness + verticalBorderArea;
  var boxes = freeze({
    devicePixelContentBoxSize: size(Math.round(contentWidth * devicePixelRatio), Math.round(contentHeight * devicePixelRatio), switchSizes),
    borderBoxSize: size(borderBoxWidth, borderBoxHeight, switchSizes),
    contentBoxSize: size(contentWidth, contentHeight, switchSizes),
    contentRect: new DOMRectReadOnly(paddingLeft, paddingTop, contentWidth, contentHeight)
  });
  cache.set(target2, boxes);
  return boxes;
};
var calculateBoxSize = function(target2, observedBox, forceRecalculation) {
  var _a2 = calculateBoxSizes(target2, forceRecalculation), borderBoxSize = _a2.borderBoxSize, contentBoxSize = _a2.contentBoxSize, devicePixelContentBoxSize = _a2.devicePixelContentBoxSize;
  switch (observedBox) {
    case ResizeObserverBoxOptions.DEVICE_PIXEL_CONTENT_BOX:
      return devicePixelContentBoxSize;
    case ResizeObserverBoxOptions.BORDER_BOX:
      return borderBoxSize;
    default:
      return contentBoxSize;
  }
};
var ResizeObserverEntry = function() {
  function ResizeObserverEntry2(target2) {
    var boxes = calculateBoxSizes(target2);
    this.target = target2;
    this.contentRect = boxes.contentRect;
    this.borderBoxSize = freeze([boxes.borderBoxSize]);
    this.contentBoxSize = freeze([boxes.contentBoxSize]);
    this.devicePixelContentBoxSize = freeze([boxes.devicePixelContentBoxSize]);
  }
  return ResizeObserverEntry2;
}();
var calculateDepthForNode = function(node) {
  if (isHidden(node)) {
    return Infinity;
  }
  var depth = 0;
  var parent = node.parentNode;
  while (parent) {
    depth += 1;
    parent = parent.parentNode;
  }
  return depth;
};
var broadcastActiveObservations = function() {
  var shallowestDepth = Infinity;
  var callbacks2 = [];
  resizeObservers.forEach(function processObserver(ro) {
    if (ro.activeTargets.length === 0) {
      return;
    }
    var entries = [];
    ro.activeTargets.forEach(function processTarget(ot) {
      var entry = new ResizeObserverEntry(ot.target);
      var targetDepth = calculateDepthForNode(ot.target);
      entries.push(entry);
      ot.lastReportedSize = calculateBoxSize(ot.target, ot.observedBox);
      if (targetDepth < shallowestDepth) {
        shallowestDepth = targetDepth;
      }
    });
    callbacks2.push(function resizeObserverCallback() {
      ro.callback.call(ro.observer, entries, ro.observer);
    });
    ro.activeTargets.splice(0, ro.activeTargets.length);
  });
  for (var _i = 0, callbacks_1 = callbacks2; _i < callbacks_1.length; _i++) {
    var callback = callbacks_1[_i];
    callback();
  }
  return shallowestDepth;
};
var gatherActiveObservationsAtDepth = function(depth) {
  resizeObservers.forEach(function processObserver(ro) {
    ro.activeTargets.splice(0, ro.activeTargets.length);
    ro.skippedTargets.splice(0, ro.skippedTargets.length);
    ro.observationTargets.forEach(function processTarget(ot) {
      if (ot.isActive()) {
        if (calculateDepthForNode(ot.target) > depth) {
          ro.activeTargets.push(ot);
        } else {
          ro.skippedTargets.push(ot);
        }
      }
    });
  });
};
var process = function() {
  var depth = 0;
  gatherActiveObservationsAtDepth(depth);
  while (hasActiveObservations()) {
    depth = broadcastActiveObservations();
    gatherActiveObservationsAtDepth(depth);
  }
  if (hasSkippedObservations()) {
    deliverResizeLoopError();
  }
  return depth > 0;
};
var trigger;
var callbacks = [];
var notify = function() {
  return callbacks.splice(0).forEach(function(cb) {
    return cb();
  });
};
var queueMicroTask = function(callback) {
  if (!trigger) {
    var toggle_1 = 0;
    var el_1 = document.createTextNode("");
    var config = { characterData: true };
    new MutationObserver(function() {
      return notify();
    }).observe(el_1, config);
    trigger = function() {
      el_1.textContent = "" + (toggle_1 ? toggle_1-- : toggle_1++);
    };
  }
  callbacks.push(callback);
  trigger();
};
var queueResizeObserver = function(cb) {
  queueMicroTask(function ResizeObserver2() {
    requestAnimationFrame(cb);
  });
};
var watching = 0;
var isWatching = function() {
  return !!watching;
};
var CATCH_PERIOD = 250;
var observerConfig = { attributes: true, characterData: true, childList: true, subtree: true };
var events = [
  "resize",
  "load",
  "transitionend",
  "animationend",
  "animationstart",
  "animationiteration",
  "keyup",
  "keydown",
  "mouseup",
  "mousedown",
  "mouseover",
  "mouseout",
  "blur",
  "focus"
];
var time = function(timeout) {
  if (timeout === void 0) {
    timeout = 0;
  }
  return Date.now() + timeout;
};
var scheduled = false;
var Scheduler = function() {
  function Scheduler2() {
    var _this = this;
    this.stopped = true;
    this.listener = function() {
      return _this.schedule();
    };
  }
  Scheduler2.prototype.run = function(timeout) {
    var _this = this;
    if (timeout === void 0) {
      timeout = CATCH_PERIOD;
    }
    if (scheduled) {
      return;
    }
    scheduled = true;
    var until = time(timeout);
    queueResizeObserver(function() {
      var elementsHaveResized = false;
      try {
        elementsHaveResized = process();
      } finally {
        scheduled = false;
        timeout = until - time();
        if (!isWatching()) {
          return;
        }
        if (elementsHaveResized) {
          _this.run(1e3);
        } else if (timeout > 0) {
          _this.run(timeout);
        } else {
          _this.start();
        }
      }
    });
  };
  Scheduler2.prototype.schedule = function() {
    this.stop();
    this.run();
  };
  Scheduler2.prototype.observe = function() {
    var _this = this;
    var cb = function() {
      return _this.observer && _this.observer.observe(document.body, observerConfig);
    };
    document.body ? cb() : global$1.addEventListener("DOMContentLoaded", cb);
  };
  Scheduler2.prototype.start = function() {
    var _this = this;
    if (this.stopped) {
      this.stopped = false;
      this.observer = new MutationObserver(this.listener);
      this.observe();
      events.forEach(function(name) {
        return global$1.addEventListener(name, _this.listener, true);
      });
    }
  };
  Scheduler2.prototype.stop = function() {
    var _this = this;
    if (!this.stopped) {
      this.observer && this.observer.disconnect();
      events.forEach(function(name) {
        return global$1.removeEventListener(name, _this.listener, true);
      });
      this.stopped = true;
    }
  };
  return Scheduler2;
}();
var scheduler = new Scheduler();
var updateCount = function(n) {
  !watching && n > 0 && scheduler.start();
  watching += n;
  !watching && scheduler.stop();
};
var skipNotifyOnElement = function(target2) {
  return !isSVG(target2) && !isReplacedElement(target2) && getComputedStyle(target2).display === "inline";
};
var ResizeObservation = function() {
  function ResizeObservation2(target2, observedBox) {
    this.target = target2;
    this.observedBox = observedBox || ResizeObserverBoxOptions.CONTENT_BOX;
    this.lastReportedSize = {
      inlineSize: 0,
      blockSize: 0
    };
  }
  ResizeObservation2.prototype.isActive = function() {
    var size2 = calculateBoxSize(this.target, this.observedBox, true);
    if (skipNotifyOnElement(this.target)) {
      this.lastReportedSize = size2;
    }
    if (this.lastReportedSize.inlineSize !== size2.inlineSize || this.lastReportedSize.blockSize !== size2.blockSize) {
      return true;
    }
    return false;
  };
  return ResizeObservation2;
}();
var ResizeObserverDetail = function() {
  function ResizeObserverDetail2(resizeObserver, callback) {
    this.activeTargets = [];
    this.skippedTargets = [];
    this.observationTargets = [];
    this.observer = resizeObserver;
    this.callback = callback;
  }
  return ResizeObserverDetail2;
}();
var observerMap = /* @__PURE__ */ new WeakMap();
var getObservationIndex = function(observationTargets, target2) {
  for (var i = 0; i < observationTargets.length; i += 1) {
    if (observationTargets[i].target === target2) {
      return i;
    }
  }
  return -1;
};
var ResizeObserverController = function() {
  function ResizeObserverController2() {
  }
  ResizeObserverController2.connect = function(resizeObserver, callback) {
    var detail = new ResizeObserverDetail(resizeObserver, callback);
    observerMap.set(resizeObserver, detail);
  };
  ResizeObserverController2.observe = function(resizeObserver, target2, options) {
    var detail = observerMap.get(resizeObserver);
    var firstObservation = detail.observationTargets.length === 0;
    if (getObservationIndex(detail.observationTargets, target2) < 0) {
      firstObservation && resizeObservers.push(detail);
      detail.observationTargets.push(new ResizeObservation(target2, options && options.box));
      updateCount(1);
      scheduler.schedule();
    }
  };
  ResizeObserverController2.unobserve = function(resizeObserver, target2) {
    var detail = observerMap.get(resizeObserver);
    var index = getObservationIndex(detail.observationTargets, target2);
    var lastObservation = detail.observationTargets.length === 1;
    if (index >= 0) {
      lastObservation && resizeObservers.splice(resizeObservers.indexOf(detail), 1);
      detail.observationTargets.splice(index, 1);
      updateCount(-1);
    }
  };
  ResizeObserverController2.disconnect = function(resizeObserver) {
    var _this = this;
    var detail = observerMap.get(resizeObserver);
    detail.observationTargets.slice().forEach(function(ot) {
      return _this.unobserve(resizeObserver, ot.target);
    });
    detail.activeTargets.splice(0, detail.activeTargets.length);
  };
  return ResizeObserverController2;
}();
var ResizeObserver$1 = function() {
  function ResizeObserver2(callback) {
    if (arguments.length === 0) {
      throw new TypeError("Failed to construct 'ResizeObserver': 1 argument required, but only 0 present.");
    }
    if (typeof callback !== "function") {
      throw new TypeError("Failed to construct 'ResizeObserver': The callback provided as parameter 1 is not a function.");
    }
    ResizeObserverController.connect(this, callback);
  }
  ResizeObserver2.prototype.observe = function(target2, options) {
    if (arguments.length === 0) {
      throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': 1 argument required, but only 0 present.");
    }
    if (!isElement(target2)) {
      throw new TypeError("Failed to execute 'observe' on 'ResizeObserver': parameter 1 is not of type 'Element");
    }
    ResizeObserverController.observe(this, target2, options);
  };
  ResizeObserver2.prototype.unobserve = function(target2) {
    if (arguments.length === 0) {
      throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': 1 argument required, but only 0 present.");
    }
    if (!isElement(target2)) {
      throw new TypeError("Failed to execute 'unobserve' on 'ResizeObserver': parameter 1 is not of type 'Element");
    }
    ResizeObserverController.unobserve(this, target2);
  };
  ResizeObserver2.prototype.disconnect = function() {
    ResizeObserverController.disconnect(this);
  };
  ResizeObserver2.toString = function() {
    return "function ResizeObserver () { [polyfill code] }";
  };
  return ResizeObserver2;
}();
const ResizeObserver = self.ResizeObserver || ResizeObserver$1;
function ensureElementIsInDocument(element, options) {
  if (document.contains(element)) {
    return element;
  }
  const container = document.createElement("div");
  container.id = element.id ? "container-" + element.id : "";
  container.setAttribute(WebRenderer.RENDERING_CONTAINER_ATTRIBUTE, "");
  container.style.visibility = "hidden";
  container.style.pointerEvents = "none";
  container.style.touchAction = "none";
  const containerShadow = container.attachShadow({ mode: "open" });
  containerShadow.appendChild(element);
  document.documentElement.appendChild(container);
  return container;
}
const scratchMat1 = new Matrix4();
const scratchMat2 = new Matrix4();
const _WebRenderer = class {
  static get HOVER_ATTRIBUTE() {
    return this.ATTRIBUTE_PREFIX + "-hover";
  }
  static get ACTIVE_ATTRIBUTE() {
    return this.ATTRIBUTE_PREFIX + "-active";
  }
  static get FOCUS_ATTRIBUTE() {
    return this.ATTRIBUTE_PREFIX + "-focus";
  }
  static get TARGET_ATTRIBUTE() {
    return this.ATTRIBUTE_PREFIX + "-target";
  }
  static get LAYER_ATTRIBUTE() {
    return this.ATTRIBUTE_PREFIX + "-layer";
  }
  static get PIXEL_RATIO_ATTRIBUTE() {
    return this.ATTRIBUTE_PREFIX + "-pixel-ratio";
  }
  static get RENDERING_ATTRIBUTE() {
    return this.ATTRIBUTE_PREFIX + "-rendering";
  }
  static get RENDERING_PARENT_ATTRIBUTE() {
    return this.ATTRIBUTE_PREFIX + "-rendering-parent";
  }
  static get RENDERING_CONTAINER_ATTRIBUTE() {
    return this.ATTRIBUTE_PREFIX + "-rendering-container";
  }
  static get RENDERING_INLINE_ATTRIBUTE() {
    return this.ATTRIBUTE_PREFIX + "-rendering-inline";
  }
  static get RENDERING_DOCUMENT_ATTRIBUTE() {
    return this.ATTRIBUTE_PREFIX + "-rendering-document";
  }
  static getPsuedoAttributes(states) {
    return `${states.hover ? `${this.HOVER_ATTRIBUTE}="" ` : " "}${states.focus ? `${this.FOCUS_ATTRIBUTE}="" ` : " "}${states.active ? `${this.ACTIVE_ATTRIBUTE}="" ` : " "}${states.target ? `${this.TARGET_ATTRIBUTE}="" ` : " "}`;
  }
  static initRootNodeObservation(element) {
    const document2 = element.ownerDocument;
    const rootNode = element.getRootNode();
    const styleRoot = "head" in rootNode ? rootNode.head : rootNode;
    if (this.rootNodeObservers.get(rootNode))
      return;
    if (!this.containerStyleElement) {
      const containerStyle = this.containerStyleElement = document2.createElement("style");
      document2.head.appendChild(containerStyle);
      containerStyle.innerHTML = `
        [${_WebRenderer.RENDERING_CONTAINER_ATTRIBUTE}] {
          all: initial;
          position: fixed;
          width: 100%;
          height: 100%;
          top: 0px;
        }
      `;
    }
    const renderingStyles = `
    :host > [${_WebRenderer.LAYER_ATTRIBUTE}] {
      display: flow-root;
    }

    [${_WebRenderer.RENDERING_DOCUMENT_ATTRIBUTE}] * {
      transform: none !important;
    }

    [${_WebRenderer.RENDERING_ATTRIBUTE}], [${_WebRenderer.RENDERING_ATTRIBUTE}] * {
      visibility: visible !important;
      /* the following is a hack for Safari; 
      without some kind of css filter active, 
      any box-shadow effect will fail to rasterize properly */
      filter: opacity(1);
    }
    
    [${_WebRenderer.RENDERING_ATTRIBUTE}] [${_WebRenderer.LAYER_ATTRIBUTE}], [${_WebRenderer.RENDERING_ATTRIBUTE}] [${_WebRenderer.LAYER_ATTRIBUTE}] * {
      visibility: hidden !important;
    }

    [${_WebRenderer.RENDERING_ATTRIBUTE}] {
      position: relative !important;
      top: 0 !important;
      left: 0 !important;
      float: left !important; /* prevent margin-collapse in SVG foreign-element for Webkit */
      box-sizing:border-box;
      min-width:var(--x-width);
      min-height:var(--x-height);
    }
    
    [${_WebRenderer.RENDERING_INLINE_ATTRIBUTE}] {
      width:auto !important;
    }

    [${_WebRenderer.RENDERING_PARENT_ATTRIBUTE}] {
      transform: none !important;
      left: 0 !important;
      top: 0 !important;
      margin: 0 !important;
      border:0 !important;
      border-radius:0 !important;
      width: 100% !important;
      height:100% !important;
      padding:0 !important;
      visibility:hidden !important;
      filter:none !important;
    }
    
    [${_WebRenderer.RENDERING_PARENT_ATTRIBUTE}]::before, [${_WebRenderer.RENDERING_PARENT_ATTRIBUTE}]::after {
      content:none !important;
      box-shadow:none !important;
    }
    `;
    const style = document2.createElement("style");
    style.textContent = renderingStyles;
    styleRoot.append(style);
    if (rootNode === document2) {
      let previousHash = "";
      const onHashChange = () => {
        if (previousHash != window.location.hash) {
          if (window.location.hash) {
            try {
              this.targetElement = rootNode.querySelector(window.location.hash);
            } catch {
            }
          }
        }
        previousHash = window.location.hash;
      };
      window.addEventListener("hashchange", onHashChange, false);
      onHashChange();
      window.addEventListener("focusin", (evt) => {
        this.focusElement = evt.target;
      }, false);
      window.addEventListener("focusout", (evt) => {
        this.focusElement = null;
      }, false);
      window.addEventListener("load", (event) => {
        setNeedsRefreshOnAllLayers();
      });
    }
    const setNeedsRefreshOnAllLayers = () => {
      for (const [e, l] of this.layers)
        l.needsRefresh = true;
    };
    const setNeedsRefreshOnStyleLoad = (node) => {
      var nodeName = node.nodeName.toUpperCase();
      if (STYLE_NODES.indexOf(nodeName) !== -1)
        node.addEventListener("load", setNeedsRefreshOnAllLayers);
    };
    const STYLE_NODES = ["STYLE", "LINK"];
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (STYLE_NODES.indexOf(m.target.nodeName.toUpperCase()) !== -1) {
          setNeedsRefreshOnAllLayers();
        }
        for (const node of m.addedNodes)
          setNeedsRefreshOnStyleLoad(node);
      }
    });
    observer.observe(document2, {
      childList: true,
      attributes: true,
      characterData: true,
      subtree: true,
      attributeOldValue: true,
      characterDataOldValue: true
    });
    this.rootNodeObservers.set(rootNode, observer);
  }
  static setLayerNeedsRefresh(layer) {
    layer.needsRefresh = true;
  }
  static createLayerTree(element, options, eventCallback) {
    if (_WebRenderer.getClosestLayer(element))
      throw new Error("A root WebLayer for the given element already exists");
    const containerElement = ensureElementIsInDocument(element);
    _WebRenderer.initRootNodeObservation(element);
    const observer = new MutationObserver(_WebRenderer._handleMutations);
    this.mutationObservers.set(element, observer);
    this.startMutationObserver(element);
    const resizeObserver = new ResizeObserver((records) => {
      for (const record of records) {
        const layer2 = this.getClosestLayer(record.target);
        layer2.traverseLayers(_WebRenderer.setLayerNeedsRefresh);
        layer2.traverseParentLayers(_WebRenderer.setLayerNeedsRefresh);
      }
    });
    resizeObserver.observe(element);
    this.resizeObservers.set(element, resizeObserver);
    element.addEventListener("input", this._triggerRefresh, { capture: true });
    element.addEventListener("keydown", this._triggerRefresh, { capture: true });
    element.addEventListener("submit", this._triggerRefresh, { capture: true });
    element.addEventListener("change", this._triggerRefresh, { capture: true });
    element.addEventListener("focus", this._triggerRefresh, { capture: true });
    element.addEventListener("blur", this._triggerRefresh, { capture: true });
    element.addEventListener("transitionend", this._triggerRefresh, { capture: true });
    const layer = new WebLayer(options.manager, element, eventCallback);
    this.rootLayers.set(element, layer);
    return containerElement;
  }
  static disposeLayer(layer) {
    if (this.rootLayers.has(layer.element)) {
      this.rootLayers.delete(layer.element);
      const observer = this.mutationObservers.get(layer.element);
      observer.disconnect();
      this.mutationObservers.delete(layer.element);
      const resizeObserver = this.resizeObservers.get(layer.element);
      resizeObserver.disconnect();
      this.resizeObservers.delete(layer.element);
      layer.element.removeEventListener("input", this._triggerRefresh, { capture: true });
      layer.element.removeEventListener("keydown", this._triggerRefresh, { capture: true });
      layer.element.removeEventListener("submit", this._triggerRefresh, { capture: true });
      layer.element.removeEventListener("change", this._triggerRefresh, { capture: true });
      layer.element.removeEventListener("focus", this._triggerRefresh, { capture: true });
      layer.element.removeEventListener("blur", this._triggerRefresh, { capture: true });
      layer.element.removeEventListener("transitionend", this._triggerRefresh, { capture: true });
    }
  }
  static getClosestLayer(element, inclusive = true) {
    let targetElement = inclusive ? element : element.parentElement;
    const closestLayerElement = targetElement == null ? void 0 : targetElement.closest(`[${_WebRenderer.LAYER_ATTRIBUTE}]`);
    if (!closestLayerElement) {
      const host = element == null ? void 0 : element.getRootNode().host;
      if (host) {
        return this.getClosestLayer(host, inclusive);
      }
    }
    return this.layers.get(closestLayerElement);
  }
  static parseCSSTransform(computedStyle, width, height, pixelSize, out = new Matrix4()) {
    const transform = computedStyle.transform;
    const transformOrigin = computedStyle.transformOrigin;
    if (transform.indexOf("matrix(") == 0) {
      out.identity();
      var mat = transform.substring(7, transform.length - 1).split(", ").map(parseFloat);
      out.elements[0] = mat[0];
      out.elements[1] = mat[1];
      out.elements[4] = mat[2];
      out.elements[5] = mat[3];
      out.elements[12] = mat[4];
      out.elements[13] = mat[5];
    } else if (transform.indexOf("matrix3d(") == 0) {
      var mat = transform.substring(9, transform.length - 1).split(", ").map(parseFloat);
      out.fromArray(mat);
    } else {
      return null;
    }
    if (out.elements[0] === 0)
      out.elements[0] = 1e-15;
    if (out.elements[5] === 0)
      out.elements[5] = 1e-15;
    if (out.elements[10] === 0)
      out.elements[10] = 1e-15;
    out.elements[12] *= pixelSize;
    out.elements[13] *= pixelSize * -1;
    var origin = transformOrigin.split(" ").map(parseFloat);
    var ox = (origin[0] - width / 2) * pixelSize;
    var oy = (origin[1] - height / 2) * pixelSize * -1;
    var oz = origin[2] || 0;
    var T1 = scratchMat1.identity().makeTranslation(-ox, -oy, -oz);
    var T2 = scratchMat2.identity().makeTranslation(ox, oy, oz);
    for (const e of out.elements) {
      if (isNaN(e))
        return null;
    }
    return out.premultiply(T2).multiply(T1);
  }
  static pauseMutationObservers() {
    const mutationObservers = _WebRenderer.mutationObservers.values();
    for (const m of mutationObservers) {
      _WebRenderer._handleMutations(m.takeRecords());
      m.disconnect();
    }
  }
  static resumeMutationObservers() {
    for (const [e] of _WebRenderer.mutationObservers) {
      this.startMutationObserver(e);
    }
  }
  static startMutationObserver(element) {
    const observer = _WebRenderer.mutationObservers.get(element);
    observer.observe(element, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true,
      characterDataOldValue: true,
      attributeOldValue: true
    });
  }
  static arrayBufferToBase64(bytes) {
    var binary = "";
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
  static attributeCSS(name, value) {
    return value ? `[${name}]=${value}` : `[${name}]`;
  }
  static attributeHTML(name, value) {
    return value ? `${name}="${value}"` : `${name}=""`;
  }
  static async generateEmbeddedCSS(url, css) {
    let found;
    const promises = [];
    css = css.replace(new RegExp(":hover", "g"), this.attributeCSS(this.HOVER_ATTRIBUTE));
    css = css.replace(new RegExp(":active", "g"), this.attributeCSS(this.ACTIVE_ATTRIBUTE));
    css = css.replace(new RegExp(":focus", "g"), this.attributeCSS(this.FOCUS_ATTRIBUTE));
    css = css.replace(new RegExp(":target", "g"), this.attributeCSS(this.TARGET_ATTRIBUTE));
    const regEx = RegExp(/(@import.*?["']([^"']+)["'].*?|url\((?!['"]?(?:data):)['"]?([^'"\)]*)['"]?\))/gi);
    while (found = regEx.exec(css)) {
      const isCSSImport = !!found[2];
      const accept = isCSSImport ? "type/css" : void 0;
      const resourceURL = found[2] || found[3];
      promises.push(this.getDataURL(new URL(resourceURL, url).href, accept).then((dataURL) => {
        css = css.replace(resourceURL, dataURL);
      }));
    }
    await Promise.all(promises);
    return css;
  }
  static async getAllEmbeddedStyles(el) {
    const rootNode = el.getRootNode();
    const embedded = this.embeddedStyles.get(rootNode) || /* @__PURE__ */ new Map();
    this.embeddedStyles.set(rootNode, embedded);
    const styleElements = Array.from(rootNode.querySelectorAll("style, link[type='text/css'], link[rel='stylesheet']"));
    const inShadow = el.getRootNode() instanceof ShadowRoot;
    for (const element of styleElements) {
      if (!embedded.has(element)) {
        embedded.set(element, new Promise((resolve) => {
          if (element.tagName.toLowerCase() === "style") {
            resolve(element.textContent || "");
          } else {
            const link = element;
            resolve(this.getEmbeddedCSS(link.href));
          }
        }).then((cssText) => {
          const regEx = RegExp(/@font-face[^{]*{([^{}]|{[^{}]*})*}/gi);
          const fontRules = cssText.match(regEx);
          if (inShadow && fontRules) {
            for (const rule of fontRules) {
              if (this.fontStyles.has(rule))
                continue;
              const fontStyle = document.createElement("style");
              fontStyle.innerHTML = fontRules.reduce((r, s) => s + "\n\n" + r, "");
              document.head.appendChild(fontStyle);
              this.fontStyles.set(rule, fontStyle);
              embedded.set(fontStyle, Promise.resolve(""));
            }
          }
          return this.generateEmbeddedCSS(window.location.href, cssText);
        }));
      }
    }
    return Promise.all(embedded.values());
  }
  static deleteEmbeddedStyle(style) {
    const rootNode = style.getRootNode();
    const embedded = this.embeddedStyles.get(rootNode);
    embedded == null ? void 0 : embedded.delete(style);
  }
  static async getDataURL(url, accept) {
    if (url.startsWith("data"))
      return url;
    if (this.dataURLMap.has(url))
      return this.dataURLMap.get(url);
    const dataURLPromise = new Promise(async (resolveDataURL) => {
      const res = await fetch(url, accept ? { headers: { accept } } : void 0);
      const contentType = res.headers.get("content-type");
      if (contentType == "text/css") {
        const css = await this.generateEmbeddedCSS(url, await res.text());
        this.embeddedCSSMap.set(url, css);
        resolveDataURL("data:" + contentType + ";base64," + window.btoa(css));
      } else {
        const buffer = new Uint8Array(await res.arrayBuffer());
        resolveDataURL("data:" + contentType + ";base64," + this.arrayBufferToBase64(buffer));
      }
    });
    this.dataURLMap.set(url, dataURLPromise);
    return dataURLPromise;
  }
  static async getEmbeddedCSS(url) {
    if (this.embeddedCSSMap.has(url))
      return this.embeddedCSSMap.get(url);
    const res = await fetch(url, { headers: { "accept": "text/css" } });
    const css = await this.generateEmbeddedCSS(url, await res.text());
    this.embeddedCSSMap.set(url, css);
    return this.embeddedCSSMap.get(url);
  }
  static updateInputAttributes(element) {
    if (element.matches("input"))
      this._updateInputAttribute(element);
    for (const e of element.getElementsByTagName("input"))
      this._updateInputAttribute(e);
  }
  static _updateInputAttribute(inputElement) {
    if (inputElement.hasAttribute("checked")) {
      if (!inputElement.checked)
        inputElement.removeAttribute("checked");
    } else {
      if (inputElement.checked)
        inputElement.setAttribute("checked", "");
    }
    if (inputElement.getAttribute("value") !== inputElement.value) {
      inputElement.setAttribute("value", inputElement.value);
    }
  }
  static isBlankImage(imageData) {
    const pixelBuffer = new Uint32Array(imageData.buffer);
    return !pixelBuffer.some((color) => color !== 0);
  }
};
let WebRenderer = _WebRenderer;
__publicField(WebRenderer, "ATTRIBUTE_PREFIX", "xr");
__publicField(WebRenderer, "serializer", new XMLSerializer());
__publicField(WebRenderer, "rootLayers", /* @__PURE__ */ new Map());
__publicField(WebRenderer, "layers", /* @__PURE__ */ new Map());
__publicField(WebRenderer, "focusElement", null);
__publicField(WebRenderer, "activeElement", null);
__publicField(WebRenderer, "targetElement", null);
__publicField(WebRenderer, "mutationObservers", /* @__PURE__ */ new Map());
__publicField(WebRenderer, "resizeObservers", /* @__PURE__ */ new Map());
__publicField(WebRenderer, "rootNodeObservers", /* @__PURE__ */ new Map());
__publicField(WebRenderer, "containerStyleElement");
__publicField(WebRenderer, "_handleMutations", (records) => {
  var _a2, _b;
  for (const record of records) {
    if (record.type === "attributes") {
      const target3 = record.target;
      if (target3.getAttribute(record.attributeName) === record.oldValue) {
        continue;
      }
    }
    if (record.type === "characterData") {
      const target3 = record.target;
      if (target3.data === record.oldValue) {
        continue;
      }
      if (((_a2 = target3.parentElement) == null ? void 0 : _a2.tagName.toLowerCase()) === "style") {
        const style = target3.parentElement;
        const rootNode = style.getRootNode();
        (_b = _WebRenderer.embeddedStyles.get(rootNode)) == null ? void 0 : _b.delete(style);
      }
    }
    const target2 = record.target.nodeType === Node.ELEMENT_NODE ? record.target : record.target.parentElement;
    if (!target2)
      continue;
    const layer = _WebRenderer.getClosestLayer(target2);
    if (!layer)
      continue;
    if (record.type === "attributes" && record.attributeName === "class") {
      const oldClasses = record.oldValue ? record.oldValue : "";
      const currentClasses = record.target.className;
      if (oldClasses === currentClasses)
        continue;
    }
    layer.parentLayer ? layer.parentLayer.traverseChildLayers(_WebRenderer.setLayerNeedsRefresh) : layer.traverseLayers(_WebRenderer.setLayerNeedsRefresh);
  }
});
__publicField(WebRenderer, "_triggerRefresh", async (e) => {
  const layer = _WebRenderer.getClosestLayer(e.target);
  if (layer) {
    layer.parentLayer ? layer.parentLayer.traverseChildLayers(_WebRenderer.setLayerNeedsRefresh) : layer.traverseLayers(_WebRenderer.setLayerNeedsRefresh);
  }
});
__publicField(WebRenderer, "embeddedStyles", /* @__PURE__ */ new Map());
__publicField(WebRenderer, "fontStyles", /* @__PURE__ */ new Map());
__publicField(WebRenderer, "dataURLMap", /* @__PURE__ */ new Map());
__publicField(WebRenderer, "embeddedCSSMap", /* @__PURE__ */ new Map());
const ON_BEFORE_UPDATE = Symbol("ON_BEFORE_UPDATE");
const scratchVector = new Vector3();
const scratchMatrix = new Matrix4();
function flipY(geometry) {
  const uv = geometry.attributes.uv;
  for (let i = 0; i < uv.count; i++) {
    uv.setY(i, 1 - uv.getY(i));
  }
  return geometry;
}
const _WebLayer3D = class extends Object3D {
  constructor(element, container) {
    super();
    __publicField(this, "element");
    __publicField(this, "container");
    __publicField(this, "_camera");
    __publicField(this, "_webLayer");
    __publicField(this, "_localZ", 0);
    __publicField(this, "_viewZ", 0);
    __publicField(this, "_renderZ", 0);
    __publicField(this, "_mediaSrc");
    __publicField(this, "_mediaTexture");
    __publicField(this, "textures", /* @__PURE__ */ new Set());
    __publicField(this, "_previousTexture");
    __publicField(this, "_textureMap", /* @__PURE__ */ new Map());
    __publicField(this, "contentMesh");
    __publicField(this, "_boundsMesh");
    __publicField(this, "cursor", new Object3D());
    __publicField(this, "depthMaterial", new MeshDepthMaterial({
      depthPacking: RGBADepthPacking,
      alphaTest: 1e-3
    }));
    __publicField(this, "domLayout", new Object3D());
    __publicField(this, "domSize", new Vector3(1, 1, 1));
    __publicField(this, "bounds", new Bounds());
    __publicField(this, "margin", new Edges());
    __publicField(this, "childWebLayers", []);
    __publicField(this, "shouldApplyDOMLayout", "auto");
    this.element = element;
    this.container = container;
    this.name = element.id;
    this._webLayer = WebRenderer.getClosestLayer(element);
    element.layer = this;
    const geometry = this._webLayer.isMediaElement ? _WebLayer3D.GEOMETRY : _WebLayer3D.FLIPPED_GEOMETRY;
    this.contentMesh = new Mesh(geometry, new MeshBasicMaterial({
      side: DoubleSide,
      depthWrite: false,
      transparent: true,
      alphaTest: 1e-3,
      opacity: 1,
      toneMapped: false
    }));
    this._boundsMesh = new Mesh(geometry, new MeshBasicMaterial({
      visible: false
    }));
    this.add(this.contentMesh);
    this.add(this._boundsMesh);
    this.cursor.visible = false;
    this.matrixAutoUpdate = true;
    this.contentMesh.matrixAutoUpdate = true;
    this.contentMesh.visible = false;
    this.contentMesh["customDepthMaterial"] = this.depthMaterial;
    this.contentMesh.onBeforeRender = (renderer, scene, camera) => {
      this._camera = camera;
    };
    this._boundsMesh.matrixAutoUpdate = true;
    this.container.options.manager.layersByElement.set(this.element, this);
    this.container.options.manager.layersByMesh.set(this.contentMesh, this);
  }
  static shouldApplyDOMLayout(layer) {
    const should = layer.shouldApplyDOMLayout;
    if (should === "always" || should === true)
      return true;
    if (should === "never" || should === false)
      return false;
    if (should === "auto" && layer.parentWebLayer && layer.parent === layer.parentWebLayer)
      return true;
    return false;
  }
  get allStateHashes() {
    return this._webLayer.allStateHashes;
  }
  get domState() {
    return this._webLayer.currentDOMState;
  }
  get texture() {
    var _a2, _b, _c, _d;
    const manager = this.container.manager;
    const _layer = this._webLayer;
    if (_layer.isMediaElement) {
      const media = this.element;
      let t = this._mediaTexture;
      if (!t || t.image && media.src !== t.image.src) {
        if (t)
          t.dispose();
        t = _layer.isVideoElement ? new VideoTexture(media) : _layer.isCanvasElement ? new CanvasTexture(media) : new TextureLoader().load(media.src);
        t.wrapS = ClampToEdgeWrapping;
        t.wrapT = ClampToEdgeWrapping;
        t.minFilter = LinearFilter;
        if (manager.textureEncoding)
          t.encoding = manager.textureEncoding;
        this._mediaTexture = t;
      }
      return t;
    }
    const textureHash = (_b = (_a2 = this._webLayer.currentDOMState) == null ? void 0 : _a2.texture) == null ? void 0 : _b.hash;
    if (textureHash) {
      if (!this._textureMap.has(textureHash))
        this._textureMap.set(textureHash, {});
      const textures = manager.getTexture(textureHash);
      const clonedTextures = this._textureMap.get(textureHash);
      if (textures.compressedTexture && !clonedTextures.compressedTexture) {
        (_c = clonedTextures.canvasTexture) == null ? void 0 : _c.dispose();
        clonedTextures.canvasTexture = void 0;
        clonedTextures.compressedTexture = textures.compressedTexture.clone();
        clonedTextures.compressedTexture.needsUpdate = true;
      }
      if (textures.canvasTexture && !clonedTextures.canvasTexture) {
        clonedTextures.canvasTexture = textures.canvasTexture.clone();
        clonedTextures.canvasTexture.needsUpdate = true;
      }
      return (_d = clonedTextures.compressedTexture) != null ? _d : clonedTextures.canvasTexture;
    }
    return void 0;
  }
  get desiredPseudoStates() {
    return this._webLayer.desiredPseudoState;
  }
  get pseudoStates() {
    var _a2;
    return (_a2 = this._webLayer.currentDOMState) == null ? void 0 : _a2.pseudo;
  }
  get depth() {
    return this._webLayer.depth;
  }
  get index() {
    return this.parentWebLayer ? this.parentWebLayer.childWebLayers.indexOf(this) : 0;
  }
  get needsRefresh() {
    return this._webLayer.needsRefresh;
  }
  setNeedsRefresh(recurse = true) {
    this._webLayer.setNeedsRefresh(recurse);
  }
  get needsRemoval() {
    return this._webLayer.needsRemoval;
  }
  get parentWebLayer() {
    return this._webLayer.parentLayer && this.container.manager.layersByElement.get(this._webLayer.parentLayer.element);
  }
  async refresh(recurse = false) {
    var _a2;
    const refreshing = [];
    refreshing.push(this._webLayer.refresh());
    this.childWebLayers.length = 0;
    for (const c of this._webLayer.childLayers) {
      const child = this.container.manager.layersByElement.get((_a2 = WebRenderer.getClosestLayer(c.element)) == null ? void 0 : _a2.element);
      if (!child)
        continue;
      this.childWebLayers.push(child);
      if (recurse)
        refreshing.push(child.refresh(recurse));
    }
    return Promise.all(refreshing).then(() => {
    });
  }
  updateLayout() {
    this._updateDOMLayout();
    if (this._camera) {
      this._localZ = Math.abs(scratchVector.setFromMatrixPosition(this.matrix).z + scratchVector.setFromMatrixPosition(this.contentMesh.matrix).z);
      this._viewZ = Math.abs(this.contentMesh.getWorldPosition(scratchVector).applyMatrix4(this._camera.matrixWorldInverse).z);
      let parentRenderZ = this.parentWebLayer ? this.parentWebLayer._renderZ : this._viewZ;
      if (this._localZ < 1e-3) {
        this._renderZ = parentRenderZ;
      } else {
        this._renderZ = this._viewZ;
      }
      this.contentMesh.renderOrder = (this.container.options.renderOrderOffset || 0) + (1 - Math.log(this._renderZ + 1) / Math.log(this._camera.far + 1)) + (this.depth + this.index * 1e-3) * 1e-7;
    }
  }
  updateContent() {
    if (this.parentWebLayer && !this.parentWebLayer.domLayout)
      return;
    const mesh = this.contentMesh;
    const texture = this.texture;
    const material = mesh.material;
    if (texture && material.map !== texture) {
      const contentScale = this.contentMesh.scale;
      const aspect = Math.abs(contentScale.x * this.scale.x / contentScale.y * this.scale.y);
      const targetAspect = this.domSize.x / this.domSize.y;
      if (Math.abs(targetAspect - aspect) < 1e3) {
        material.map = texture;
        this.depthMaterial["map"] = texture;
        material.needsUpdate = true;
        this.depthMaterial.needsUpdate = true;
      }
    }
    material.transparent = true;
    const mat = mesh.material;
    const isHidden2 = mat.opacity < 5e-3;
    if (isHidden2)
      mesh.visible = false;
    else if (mat.map)
      mesh.visible = true;
    if (this.needsRemoval && isHidden2) {
      if (this.parent)
        this.parent.remove(this);
      this.dispose();
    }
    this._refreshMediaBounds();
  }
  [ON_BEFORE_UPDATE]() {
  }
  _doUpdate() {
    var _a2, _b;
    this[ON_BEFORE_UPDATE]();
    this.updateContent();
    this.updateLayout();
    if (_WebLayer3D.shouldApplyDOMLayout(this)) {
      this.position.copy(this.domLayout.position);
      this.quaternion.copy(this.domLayout.quaternion);
      this.scale.copy(this.domLayout.scale);
    }
    this.contentMesh.position.set(0, 0, 0);
    this.contentMesh.scale.copy(this.domSize);
    this.contentMesh.quaternion.set(0, 0, 0, 1);
    this._boundsMesh.position.set(0, 0, 0);
    this._boundsMesh.scale.copy(this.domSize);
    this._boundsMesh.quaternion.set(0, 0, 0, 1);
    if (this.needsRefresh && this.container.options.autoRefresh !== false)
      this.refresh();
    if (this._previousTexture !== this.texture) {
      if (this.texture)
        this.container.manager.renderer.initTexture(this.texture);
      this._previousTexture = this.texture;
      (_b = (_a2 = this.container.options).onLayerPaint) == null ? void 0 : _b.call(_a2, this);
    }
    this._webLayer.update();
    this.container.manager.scheduleTasksIfNeeded();
  }
  update(recurse = false) {
    if (recurse)
      this.traverseLayersPreOrder(this._doUpdate);
    else
      this._doUpdate();
  }
  querySelector(selector) {
    var _a2;
    const element = this.element.querySelector(selector) || ((_a2 = this.element.shadowRoot) == null ? void 0 : _a2.querySelector(selector));
    if (element) {
      return this.container.manager.layersByElement.get(element);
    }
    return void 0;
  }
  querySelectorAll(selector) {
    var _a2;
    const elements = this.element.querySelectorAll(selector) || ((_a2 = this.element.shadowRoot) == null ? void 0 : _a2.querySelectorAll(selector));
    return Array.from(elements).map((e) => this.container.manager.layersByElement.get(e)).filter((l) => l);
  }
  traverseLayerAncestors(each) {
    const parentLayer = this.parentWebLayer;
    if (parentLayer) {
      parentLayer.traverseLayerAncestors(each);
      each.call(this, parentLayer);
    }
  }
  traverseLayersPreOrder(each) {
    if (each.call(this, this) === false)
      return false;
    for (const child of this.childWebLayers) {
      if (child.traverseLayersPreOrder(each) === false)
        return false;
    }
    return true;
  }
  traverseLayersPostOrder(each) {
    for (const child of this.childWebLayers) {
      if (child.traverseLayersPostOrder(each) === false)
        return false;
    }
    return each.call(this, this) || true;
  }
  dispose() {
    WebRenderer.disposeLayer(this._webLayer);
    for (const t of this.textures) {
      t.dispose();
    }
    for (const child of this.childWebLayers)
      child.dispose();
  }
  _refreshMediaBounds() {
    if (this._webLayer.isMediaElement) {
      const isVideo = this._webLayer.isVideoElement;
      const domState = this.domState;
      if (!domState)
        return;
      const media = this.element;
      const texture = this.texture;
      const computedStyle = getComputedStyle(this.element);
      const { objectFit } = computedStyle;
      const { width: viewWidth, height: viewHeight } = this.bounds.copy(domState.bounds);
      const naturalWidth = isVideo ? media.videoWidth : media.naturalWidth;
      const naturalHeight = isVideo ? media.videoHeight : media.naturalHeight;
      const mediaRatio = naturalWidth / naturalHeight;
      const viewRatio = viewWidth / viewHeight;
      texture.center.set(0.5, 0.5);
      switch (objectFit) {
        case "none":
          texture.repeat.set(viewWidth / naturalWidth, viewHeight / naturalHeight).clampScalar(0, 1);
          break;
        case "contain":
        case "scale-down":
          texture.repeat.set(1, 1);
          if (viewRatio > mediaRatio) {
            const width = this.bounds.height * mediaRatio || 0;
            this.bounds.left += (this.bounds.width - width) / 2;
            this.bounds.width = width;
          } else {
            const height = this.bounds.width / mediaRatio || 0;
            this.bounds.top += (this.bounds.height - height) / 2;
            this.bounds.height = height;
          }
          break;
        case "cover":
          texture.repeat.set(viewWidth / naturalWidth, viewHeight / naturalHeight);
          if (viewRatio < mediaRatio) {
            const width = this.bounds.height * mediaRatio || 0;
            this.bounds.left += (this.bounds.width - width) / 2;
            this.bounds.width = width;
          } else {
            const height = this.bounds.width / mediaRatio || 0;
            this.bounds.top += (this.bounds.height - height) / 2;
            this.bounds.height = height;
          }
          break;
        default:
        case "fill":
          texture.repeat.set(1, 1);
          break;
      }
      domState.bounds.copy(this.bounds);
    }
  }
  _updateDOMLayout() {
    if (this.needsRemoval) {
      return;
    }
    const currentState = this._webLayer.currentDOMState;
    if (!currentState)
      return;
    const { bounds: currentBounds, margin: currentMargin } = currentState;
    const isMedia = this._webLayer.isMediaElement;
    this.domLayout.position.set(0, 0, 0);
    this.domLayout.scale.set(1, 1, 1);
    this.domLayout.quaternion.set(0, 0, 0, 1);
    const bounds = this.bounds.copy(currentBounds);
    const margin = this.margin.copy(currentMargin);
    const width = bounds.width;
    const height = bounds.height;
    const marginLeft = isMedia ? 0 : margin.left;
    const marginRight = isMedia ? 0 : margin.right;
    const marginTop = isMedia ? 0 : margin.top;
    const marginBottom = isMedia ? 0 : margin.bottom;
    const fullWidth = width + marginLeft + marginRight;
    const fullHeight = height + marginTop + marginBottom;
    const pixelSize = 1 / this.container.manager.pixelsPerMeter;
    this.domSize.set(Math.max(pixelSize * fullWidth, 1e-5), Math.max(pixelSize * fullHeight, 1e-5), 1);
    const parentLayer = this.parentWebLayer;
    if (!parentLayer)
      return;
    const parentBounds = parentLayer.bounds;
    const parentMargin = parentLayer.margin;
    const parentFullWidth = parentBounds.width + parentMargin.left + parentMargin.right;
    const parentFullHeight = parentBounds.height + parentMargin.bottom + parentMargin.top;
    const parentLeftEdge = -parentFullWidth / 2 + parentMargin.left;
    const parentTopEdge = parentFullHeight / 2 - parentMargin.top;
    this.domLayout.position.set(pixelSize * (parentLeftEdge + fullWidth / 2 + bounds.left - marginLeft), pixelSize * (parentTopEdge - fullHeight / 2 - bounds.top + marginTop), 0);
    const computedStyle = getComputedStyle(this.element);
    const transform = computedStyle.transform;
    if (transform && transform !== "none") {
      const cssTransform = WebRenderer.parseCSSTransform(computedStyle, bounds.width, bounds.height, pixelSize, scratchMatrix);
      if (cssTransform) {
        this.domLayout.updateMatrix();
        this.domLayout.matrix.multiply(cssTransform);
        this.domLayout.matrix.decompose(this.domLayout.position, this.domLayout.quaternion, this.domLayout.scale);
      }
    }
  }
};
let WebLayer3D = _WebLayer3D;
__publicField(WebLayer3D, "GEOMETRY", new PlaneGeometry(1, 1, 2, 2));
__publicField(WebLayer3D, "FLIPPED_GEOMETRY", flipY(new PlaneGeometry(1, 1, 2, 2)));
class WorkerPool {
  constructor(pool = 4) {
    this.pool = pool;
    this.queue = [];
    this.workers = [];
    this.workersResolve = [];
    this.workerStatus = 0;
  }
  _initWorker(workerId) {
    if (!this.workers[workerId]) {
      const worker = this.workerCreator();
      worker.addEventListener("message", this._onMessage.bind(this, workerId));
      this.workers[workerId] = worker;
    }
  }
  _getIdleWorker() {
    for (let i = 0; i < this.pool; i++)
      if (!(this.workerStatus & 1 << i))
        return i;
    return -1;
  }
  _onMessage(workerId, msg2) {
    const resolve = this.workersResolve[workerId];
    resolve && resolve(msg2);
    if (this.queue.length) {
      const { resolve: resolve2, msg: msg3, transfer } = this.queue.shift();
      this.workersResolve[workerId] = resolve2;
      this.workers[workerId].postMessage(msg3, transfer);
    } else {
      this.workerStatus ^= 1 << workerId;
    }
  }
  setWorkerCreator(workerCreator) {
    this.workerCreator = workerCreator;
  }
  setWorkerLimit(pool) {
    this.pool = pool;
  }
  postMessage(msg2, transfer) {
    return new Promise((resolve) => {
      const workerId = this._getIdleWorker();
      if (workerId !== -1) {
        this._initWorker(workerId);
        this.workerStatus |= 1 << workerId;
        this.workersResolve[workerId] = resolve;
        this.workers[workerId].postMessage(msg2, transfer);
      } else {
        this.queue.push({ resolve, msg: msg2, transfer });
      }
    });
  }
  dispose() {
    this.workers.forEach((worker) => worker.terminate());
    this.workersResolve.length = 0;
    this.workers.length = 0;
    this.queue.length = 0;
    this.workerStatus = 0;
  }
}
const KTX2TransferSRGB = 2;
const KTX2_ALPHA_PREMULTIPLIED = 1;
const _taskCache = /* @__PURE__ */ new WeakMap();
let _activeLoaders = 0;
class KTX2Loader extends Loader {
  constructor(manager) {
    super(manager);
    this.transcoderPath = "";
    this.transcoderBinary = null;
    this.transcoderPending = null;
    this.workerPool = new WorkerPool();
    this.workerSourceURL = "";
    this.workerConfig = null;
    if (typeof MSC_TRANSCODER !== "undefined") {
      console.warn('THREE.KTX2Loader: Please update to latest "basis_transcoder". "msc_basis_transcoder" is no longer supported in three.js r125+.');
    }
  }
  setTranscoderPath(path) {
    this.transcoderPath = path;
    return this;
  }
  setWorkerLimit(num) {
    this.workerPool.setWorkerLimit(num);
    return this;
  }
  detectSupport(renderer) {
    this.workerConfig = {
      astcSupported: renderer.extensions.has("WEBGL_compressed_texture_astc"),
      etc1Supported: renderer.extensions.has("WEBGL_compressed_texture_etc1"),
      etc2Supported: renderer.extensions.has("WEBGL_compressed_texture_etc"),
      dxtSupported: renderer.extensions.has("WEBGL_compressed_texture_s3tc"),
      bptcSupported: renderer.extensions.has("EXT_texture_compression_bptc"),
      pvrtcSupported: renderer.extensions.has("WEBGL_compressed_texture_pvrtc") || renderer.extensions.has("WEBKIT_WEBGL_compressed_texture_pvrtc")
    };
    if (renderer.capabilities.isWebGL2) {
      this.workerConfig.etc1Supported = false;
    }
    return this;
  }
  dispose() {
    this.workerPool.dispose();
    if (this.workerSourceURL)
      URL.revokeObjectURL(this.workerSourceURL);
    return this;
  }
  init() {
    if (!this.transcoderPending) {
      const jsLoader = new FileLoader(this.manager);
      jsLoader.setPath(this.transcoderPath);
      jsLoader.setWithCredentials(this.withCredentials);
      const jsContent = jsLoader.loadAsync("basis_transcoder.js");
      const binaryLoader = new FileLoader(this.manager);
      binaryLoader.setPath(this.transcoderPath);
      binaryLoader.setResponseType("arraybuffer");
      binaryLoader.setWithCredentials(this.withCredentials);
      const binaryContent = binaryLoader.loadAsync("basis_transcoder.wasm");
      this.transcoderPending = Promise.all([jsContent, binaryContent]).then(([jsContent2, binaryContent2]) => {
        const fn = KTX2Loader.BasisWorker.toString();
        const body = [
          "/* constants */",
          "let _EngineFormat = " + JSON.stringify(KTX2Loader.EngineFormat),
          "let _TranscoderFormat = " + JSON.stringify(KTX2Loader.TranscoderFormat),
          "let _BasisFormat = " + JSON.stringify(KTX2Loader.BasisFormat),
          "/* basis_transcoder.js */",
          jsContent2,
          "/* worker */",
          fn.substring(fn.indexOf("{") + 1, fn.lastIndexOf("}"))
        ].join("\n");
        this.workerSourceURL = URL.createObjectURL(new Blob([body]));
        this.transcoderBinary = binaryContent2;
        this.workerPool.setWorkerCreator(() => {
          const worker = new Worker(this.workerSourceURL);
          const transcoderBinary = this.transcoderBinary.slice(0);
          worker.postMessage({ type: "init", config: this.workerConfig, transcoderBinary }, [transcoderBinary]);
          return worker;
        });
      });
      if (_activeLoaders > 0) {
        console.warn("THREE.KTX2Loader: Multiple active KTX2 loaders may cause performance issues. Use a single KTX2Loader instance, or call .dispose() on old instances.");
      }
      _activeLoaders++;
    }
    return this.transcoderPending;
  }
  load(url, onLoad, onProgress, onError) {
    if (this.workerConfig === null) {
      throw new Error("THREE.KTX2Loader: Missing initialization with `.detectSupport( renderer )`.");
    }
    const loader = new FileLoader(this.manager);
    loader.setResponseType("arraybuffer");
    loader.setWithCredentials(this.withCredentials);
    const texture = new CompressedTexture();
    loader.load(url, (buffer) => {
      if (_taskCache.has(buffer)) {
        const cachedTask = _taskCache.get(buffer);
        return cachedTask.promise.then(onLoad).catch(onError);
      }
      this._createTexture([buffer]).then(function(_texture) {
        texture.copy(_texture);
        texture.needsUpdate = true;
        if (onLoad)
          onLoad(texture);
      }).catch(onError);
    }, onProgress, onError);
    return texture;
  }
  _createTextureFrom(transcodeResult) {
    const { mipmaps, width, height, format, type: type2, error, dfdTransferFn, dfdFlags } = transcodeResult;
    if (type2 === "error")
      return Promise.reject(error);
    const texture = new CompressedTexture(mipmaps, width, height, format, UnsignedByteType);
    texture.minFilter = mipmaps.length === 1 ? LinearFilter : LinearMipmapLinearFilter;
    texture.magFilter = LinearFilter;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;
    texture.encoding = dfdTransferFn === KTX2TransferSRGB ? sRGBEncoding : LinearEncoding;
    texture.premultiplyAlpha = !!(dfdFlags & KTX2_ALPHA_PREMULTIPLIED);
    return texture;
  }
  _createTexture(buffers, config = {}) {
    const taskConfig = config;
    const texturePending = this.init().then(() => {
      return this.workerPool.postMessage({ type: "transcode", buffers, taskConfig }, buffers);
    }).then((e) => this._createTextureFrom(e.data));
    _taskCache.set(buffers[0], { promise: texturePending });
    return texturePending;
  }
  dispose() {
    URL.revokeObjectURL(this.workerSourceURL);
    this.workerPool.dispose();
    _activeLoaders--;
    return this;
  }
}
KTX2Loader.BasisFormat = {
  ETC1S: 0,
  UASTC_4x4: 1
};
KTX2Loader.TranscoderFormat = {
  ETC1: 0,
  ETC2: 1,
  BC1: 2,
  BC3: 3,
  BC4: 4,
  BC5: 5,
  BC7_M6_OPAQUE_ONLY: 6,
  BC7_M5: 7,
  PVRTC1_4_RGB: 8,
  PVRTC1_4_RGBA: 9,
  ASTC_4x4: 10,
  ATC_RGB: 11,
  ATC_RGBA_INTERPOLATED_ALPHA: 12,
  RGBA32: 13,
  RGB565: 14,
  BGR565: 15,
  RGBA4444: 16
};
KTX2Loader.EngineFormat = {
  RGBAFormat,
  RGBA_ASTC_4x4_Format,
  RGBA_BPTC_Format,
  RGBA_ETC2_EAC_Format,
  RGBA_PVRTC_4BPPV1_Format,
  RGBA_S3TC_DXT5_Format,
  RGB_ETC1_Format,
  RGB_ETC2_Format,
  RGB_PVRTC_4BPPV1_Format,
  RGB_S3TC_DXT1_Format
};
KTX2Loader.BasisWorker = function() {
  let config;
  let transcoderPending;
  let BasisModule;
  const EngineFormat = _EngineFormat;
  const TranscoderFormat = _TranscoderFormat;
  const BasisFormat = _BasisFormat;
  self.addEventListener("message", function(e) {
    const message = e.data;
    switch (message.type) {
      case "init":
        config = message.config;
        init(message.transcoderBinary);
        break;
      case "transcode":
        transcoderPending.then(() => {
          try {
            const { width, height, hasAlpha, mipmaps, format, dfdTransferFn, dfdFlags } = transcode(message.buffers[0]);
            const buffers = [];
            for (let i = 0; i < mipmaps.length; ++i) {
              buffers.push(mipmaps[i].data.buffer);
            }
            self.postMessage({ type: "transcode", id: message.id, width, height, hasAlpha, mipmaps, format, dfdTransferFn, dfdFlags }, buffers);
          } catch (error) {
            console.error(error);
            self.postMessage({ type: "error", id: message.id, error: error.message });
          }
        });
        break;
    }
  });
  function init(wasmBinary) {
    transcoderPending = new Promise((resolve) => {
      BasisModule = { wasmBinary, onRuntimeInitialized: resolve };
      BASIS(BasisModule);
    }).then(() => {
      BasisModule.initializeBasis();
      if (BasisModule.KTX2File === void 0) {
        console.warn("THREE.KTX2Loader: Please update Basis Universal transcoder.");
      }
    });
  }
  function transcode(buffer) {
    const ktx2File = new BasisModule.KTX2File(new Uint8Array(buffer));
    function cleanup() {
      ktx2File.close();
      ktx2File.delete();
    }
    if (!ktx2File.isValid()) {
      cleanup();
      throw new Error("THREE.KTX2Loader:	Invalid or unsupported .ktx2 file");
    }
    const basisFormat = ktx2File.isUASTC() ? BasisFormat.UASTC_4x4 : BasisFormat.ETC1S;
    const width = ktx2File.getWidth();
    const height = ktx2File.getHeight();
    const levels = ktx2File.getLevels();
    const hasAlpha = ktx2File.getHasAlpha();
    const dfdTransferFn = ktx2File.getDFDTransferFunc();
    const dfdFlags = ktx2File.getDFDFlags();
    const { transcoderFormat, engineFormat } = getTranscoderFormat(basisFormat, width, height, hasAlpha);
    if (!width || !height || !levels) {
      cleanup();
      throw new Error("THREE.KTX2Loader:	Invalid texture");
    }
    if (!ktx2File.startTranscoding()) {
      cleanup();
      throw new Error("THREE.KTX2Loader: .startTranscoding failed");
    }
    const mipmaps = [];
    for (let mip = 0; mip < levels; mip++) {
      const levelInfo = ktx2File.getImageLevelInfo(mip, 0, 0);
      const mipWidth = levelInfo.origWidth;
      const mipHeight = levelInfo.origHeight;
      const dst = new Uint8Array(ktx2File.getImageTranscodedSizeInBytes(mip, 0, 0, transcoderFormat));
      const status = ktx2File.transcodeImage(dst, mip, 0, 0, transcoderFormat, 0, -1, -1);
      if (!status) {
        cleanup();
        throw new Error("THREE.KTX2Loader: .transcodeImage failed.");
      }
      mipmaps.push({ data: dst, width: mipWidth, height: mipHeight });
    }
    cleanup();
    return { width, height, hasAlpha, mipmaps, format: engineFormat, dfdTransferFn, dfdFlags };
  }
  const FORMAT_OPTIONS = [
    {
      if: "astcSupported",
      basisFormat: [BasisFormat.UASTC_4x4],
      transcoderFormat: [TranscoderFormat.ASTC_4x4, TranscoderFormat.ASTC_4x4],
      engineFormat: [EngineFormat.RGBA_ASTC_4x4_Format, EngineFormat.RGBA_ASTC_4x4_Format],
      priorityETC1S: Infinity,
      priorityUASTC: 1,
      needsPowerOfTwo: false
    },
    {
      if: "bptcSupported",
      basisFormat: [BasisFormat.ETC1S, BasisFormat.UASTC_4x4],
      transcoderFormat: [TranscoderFormat.BC7_M5, TranscoderFormat.BC7_M5],
      engineFormat: [EngineFormat.RGBA_BPTC_Format, EngineFormat.RGBA_BPTC_Format],
      priorityETC1S: 3,
      priorityUASTC: 2,
      needsPowerOfTwo: false
    },
    {
      if: "dxtSupported",
      basisFormat: [BasisFormat.ETC1S, BasisFormat.UASTC_4x4],
      transcoderFormat: [TranscoderFormat.BC1, TranscoderFormat.BC3],
      engineFormat: [EngineFormat.RGB_S3TC_DXT1_Format, EngineFormat.RGBA_S3TC_DXT5_Format],
      priorityETC1S: 4,
      priorityUASTC: 5,
      needsPowerOfTwo: false
    },
    {
      if: "etc2Supported",
      basisFormat: [BasisFormat.ETC1S, BasisFormat.UASTC_4x4],
      transcoderFormat: [TranscoderFormat.ETC1, TranscoderFormat.ETC2],
      engineFormat: [EngineFormat.RGB_ETC2_Format, EngineFormat.RGBA_ETC2_EAC_Format],
      priorityETC1S: 1,
      priorityUASTC: 3,
      needsPowerOfTwo: false
    },
    {
      if: "etc1Supported",
      basisFormat: [BasisFormat.ETC1S, BasisFormat.UASTC_4x4],
      transcoderFormat: [TranscoderFormat.ETC1],
      engineFormat: [EngineFormat.RGB_ETC1_Format],
      priorityETC1S: 2,
      priorityUASTC: 4,
      needsPowerOfTwo: false
    },
    {
      if: "pvrtcSupported",
      basisFormat: [BasisFormat.ETC1S, BasisFormat.UASTC_4x4],
      transcoderFormat: [TranscoderFormat.PVRTC1_4_RGB, TranscoderFormat.PVRTC1_4_RGBA],
      engineFormat: [EngineFormat.RGB_PVRTC_4BPPV1_Format, EngineFormat.RGBA_PVRTC_4BPPV1_Format],
      priorityETC1S: 5,
      priorityUASTC: 6,
      needsPowerOfTwo: true
    }
  ];
  const ETC1S_OPTIONS = FORMAT_OPTIONS.sort(function(a, b) {
    return a.priorityETC1S - b.priorityETC1S;
  });
  const UASTC_OPTIONS = FORMAT_OPTIONS.sort(function(a, b) {
    return a.priorityUASTC - b.priorityUASTC;
  });
  function getTranscoderFormat(basisFormat, width, height, hasAlpha) {
    let transcoderFormat;
    let engineFormat;
    const options = basisFormat === BasisFormat.ETC1S ? ETC1S_OPTIONS : UASTC_OPTIONS;
    for (let i = 0; i < options.length; i++) {
      const opt = options[i];
      if (!config[opt.if])
        continue;
      if (!opt.basisFormat.includes(basisFormat))
        continue;
      if (hasAlpha && opt.transcoderFormat.length < 2)
        continue;
      if (opt.needsPowerOfTwo && !(isPowerOfTwo(width) && isPowerOfTwo(height)))
        continue;
      transcoderFormat = opt.transcoderFormat[hasAlpha ? 1 : 0];
      engineFormat = opt.engineFormat[hasAlpha ? 1 : 0];
      return { transcoderFormat, engineFormat };
    }
    console.warn("THREE.KTX2Loader: No suitable compressed texture format found. Decoding to RGBA32.");
    transcoderFormat = TranscoderFormat.RGBA32;
    engineFormat = EngineFormat.RGBAFormat;
    return { transcoderFormat, engineFormat };
  }
  function isPowerOfTwo(value) {
    if (value <= 2)
      return true;
    return (value & value - 1) === 0 && value !== 0;
  }
};
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.
Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.
THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var __assign = function() {
  __assign = Object.assign || function __assign2(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2)
    for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar)
          ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
  return to.concat(ar || Array.prototype.slice.call(from));
}
var _global = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
var keys = Object.keys;
var isArray = Array.isArray;
if (typeof Promise !== "undefined" && !_global.Promise) {
  _global.Promise = Promise;
}
function extend(obj, extension) {
  if (typeof extension !== "object")
    return obj;
  keys(extension).forEach(function(key) {
    obj[key] = extension[key];
  });
  return obj;
}
var getProto = Object.getPrototypeOf;
var _hasOwn = {}.hasOwnProperty;
function hasOwn(obj, prop) {
  return _hasOwn.call(obj, prop);
}
function props(proto, extension) {
  if (typeof extension === "function")
    extension = extension(getProto(proto));
  (typeof Reflect === "undefined" ? keys : Reflect.ownKeys)(extension).forEach(function(key) {
    setProp(proto, key, extension[key]);
  });
}
var defineProperty = Object.defineProperty;
function setProp(obj, prop, functionOrGetSet, options) {
  defineProperty(obj, prop, extend(functionOrGetSet && hasOwn(functionOrGetSet, "get") && typeof functionOrGetSet.get === "function" ? { get: functionOrGetSet.get, set: functionOrGetSet.set, configurable: true } : { value: functionOrGetSet, configurable: true, writable: true }, options));
}
function derive(Child) {
  return {
    from: function(Parent) {
      Child.prototype = Object.create(Parent.prototype);
      setProp(Child.prototype, "constructor", Child);
      return {
        extend: props.bind(null, Child.prototype)
      };
    }
  };
}
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
function getPropertyDescriptor(obj, prop) {
  var pd = getOwnPropertyDescriptor(obj, prop);
  var proto;
  return pd || (proto = getProto(obj)) && getPropertyDescriptor(proto, prop);
}
var _slice = [].slice;
function slice(args, start, end) {
  return _slice.call(args, start, end);
}
function override(origFunc, overridedFactory) {
  return overridedFactory(origFunc);
}
function assert(b) {
  if (!b)
    throw new Error("Assertion Failed");
}
function asap$1(fn) {
  if (_global.setImmediate)
    setImmediate(fn);
  else
    setTimeout(fn, 0);
}
function arrayToObject(array, extractor) {
  return array.reduce(function(result, item, i) {
    var nameAndValue = extractor(item, i);
    if (nameAndValue)
      result[nameAndValue[0]] = nameAndValue[1];
    return result;
  }, {});
}
function tryCatch(fn, onerror, args) {
  try {
    fn.apply(null, args);
  } catch (ex) {
    onerror && onerror(ex);
  }
}
function getByKeyPath(obj, keyPath) {
  if (hasOwn(obj, keyPath))
    return obj[keyPath];
  if (!keyPath)
    return obj;
  if (typeof keyPath !== "string") {
    var rv = [];
    for (var i = 0, l = keyPath.length; i < l; ++i) {
      var val = getByKeyPath(obj, keyPath[i]);
      rv.push(val);
    }
    return rv;
  }
  var period = keyPath.indexOf(".");
  if (period !== -1) {
    var innerObj = obj[keyPath.substr(0, period)];
    return innerObj === void 0 ? void 0 : getByKeyPath(innerObj, keyPath.substr(period + 1));
  }
  return void 0;
}
function setByKeyPath(obj, keyPath, value) {
  if (!obj || keyPath === void 0)
    return;
  if ("isFrozen" in Object && Object.isFrozen(obj))
    return;
  if (typeof keyPath !== "string" && "length" in keyPath) {
    assert(typeof value !== "string" && "length" in value);
    for (var i = 0, l = keyPath.length; i < l; ++i) {
      setByKeyPath(obj, keyPath[i], value[i]);
    }
  } else {
    var period = keyPath.indexOf(".");
    if (period !== -1) {
      var currentKeyPath = keyPath.substr(0, period);
      var remainingKeyPath = keyPath.substr(period + 1);
      if (remainingKeyPath === "")
        if (value === void 0) {
          if (isArray(obj) && !isNaN(parseInt(currentKeyPath)))
            obj.splice(currentKeyPath, 1);
          else
            delete obj[currentKeyPath];
        } else
          obj[currentKeyPath] = value;
      else {
        var innerObj = obj[currentKeyPath];
        if (!innerObj)
          innerObj = obj[currentKeyPath] = {};
        setByKeyPath(innerObj, remainingKeyPath, value);
      }
    } else {
      if (value === void 0) {
        if (isArray(obj) && !isNaN(parseInt(keyPath)))
          obj.splice(keyPath, 1);
        else
          delete obj[keyPath];
      } else
        obj[keyPath] = value;
    }
  }
}
function delByKeyPath(obj, keyPath) {
  if (typeof keyPath === "string")
    setByKeyPath(obj, keyPath, void 0);
  else if ("length" in keyPath)
    [].map.call(keyPath, function(kp) {
      setByKeyPath(obj, kp, void 0);
    });
}
function shallowClone(obj) {
  var rv = {};
  for (var m in obj) {
    if (hasOwn(obj, m))
      rv[m] = obj[m];
  }
  return rv;
}
var concat = [].concat;
function flatten(a) {
  return concat.apply([], a);
}
var intrinsicTypeNames = "Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey".split(",").concat(flatten([8, 16, 32, 64].map(function(num) {
  return ["Int", "Uint", "Float"].map(function(t) {
    return t + num + "Array";
  });
}))).filter(function(t) {
  return _global[t];
});
var intrinsicTypes = intrinsicTypeNames.map(function(t) {
  return _global[t];
});
arrayToObject(intrinsicTypeNames, function(x) {
  return [x, true];
});
var circularRefs = null;
function deepClone(any) {
  circularRefs = typeof WeakMap !== "undefined" && /* @__PURE__ */ new WeakMap();
  var rv = innerDeepClone(any);
  circularRefs = null;
  return rv;
}
function innerDeepClone(any) {
  if (!any || typeof any !== "object")
    return any;
  var rv = circularRefs && circularRefs.get(any);
  if (rv)
    return rv;
  if (isArray(any)) {
    rv = [];
    circularRefs && circularRefs.set(any, rv);
    for (var i = 0, l = any.length; i < l; ++i) {
      rv.push(innerDeepClone(any[i]));
    }
  } else if (intrinsicTypes.indexOf(any.constructor) >= 0) {
    rv = any;
  } else {
    var proto = getProto(any);
    rv = proto === Object.prototype ? {} : Object.create(proto);
    circularRefs && circularRefs.set(any, rv);
    for (var prop in any) {
      if (hasOwn(any, prop)) {
        rv[prop] = innerDeepClone(any[prop]);
      }
    }
  }
  return rv;
}
var toString = {}.toString;
function toStringTag(o) {
  return toString.call(o).slice(8, -1);
}
var iteratorSymbol = typeof Symbol !== "undefined" ? Symbol.iterator : "@@iterator";
var getIteratorOf = typeof iteratorSymbol === "symbol" ? function(x) {
  var i;
  return x != null && (i = x[iteratorSymbol]) && i.apply(x);
} : function() {
  return null;
};
var NO_CHAR_ARRAY = {};
function getArrayOf(arrayLike) {
  var i, a, x, it;
  if (arguments.length === 1) {
    if (isArray(arrayLike))
      return arrayLike.slice();
    if (this === NO_CHAR_ARRAY && typeof arrayLike === "string")
      return [arrayLike];
    if (it = getIteratorOf(arrayLike)) {
      a = [];
      while (x = it.next(), !x.done)
        a.push(x.value);
      return a;
    }
    if (arrayLike == null)
      return [arrayLike];
    i = arrayLike.length;
    if (typeof i === "number") {
      a = new Array(i);
      while (i--)
        a[i] = arrayLike[i];
      return a;
    }
    return [arrayLike];
  }
  i = arguments.length;
  a = new Array(i);
  while (i--)
    a[i] = arguments[i];
  return a;
}
var isAsyncFunction = typeof Symbol !== "undefined" ? function(fn) {
  return fn[Symbol.toStringTag] === "AsyncFunction";
} : function() {
  return false;
};
var debug = typeof location !== "undefined" && /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
function setDebug(value, filter) {
  debug = value;
  libraryFilter = filter;
}
var libraryFilter = function() {
  return true;
};
var NEEDS_THROW_FOR_STACK = !new Error("").stack;
function getErrorWithStack() {
  if (NEEDS_THROW_FOR_STACK)
    try {
      getErrorWithStack.arguments;
      throw new Error();
    } catch (e) {
      return e;
    }
  return new Error();
}
function prettyStack(exception, numIgnoredFrames) {
  var stack = exception.stack;
  if (!stack)
    return "";
  numIgnoredFrames = numIgnoredFrames || 0;
  if (stack.indexOf(exception.name) === 0)
    numIgnoredFrames += (exception.name + exception.message).split("\n").length;
  return stack.split("\n").slice(numIgnoredFrames).filter(libraryFilter).map(function(frame) {
    return "\n" + frame;
  }).join("");
}
var dexieErrorNames = [
  "Modify",
  "Bulk",
  "OpenFailed",
  "VersionChange",
  "Schema",
  "Upgrade",
  "InvalidTable",
  "MissingAPI",
  "NoSuchDatabase",
  "InvalidArgument",
  "SubTransaction",
  "Unsupported",
  "Internal",
  "DatabaseClosed",
  "PrematureCommit",
  "ForeignAwait"
];
var idbDomErrorNames = [
  "Unknown",
  "Constraint",
  "Data",
  "TransactionInactive",
  "ReadOnly",
  "Version",
  "NotFound",
  "InvalidState",
  "InvalidAccess",
  "Abort",
  "Timeout",
  "QuotaExceeded",
  "Syntax",
  "DataClone"
];
var errorList = dexieErrorNames.concat(idbDomErrorNames);
var defaultTexts = {
  VersionChanged: "Database version changed by other database connection",
  DatabaseClosed: "Database has been closed",
  Abort: "Transaction aborted",
  TransactionInactive: "Transaction has already completed or failed",
  MissingAPI: "IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb"
};
function DexieError(name, msg2) {
  this._e = getErrorWithStack();
  this.name = name;
  this.message = msg2;
}
derive(DexieError).from(Error).extend({
  stack: {
    get: function() {
      return this._stack || (this._stack = this.name + ": " + this.message + prettyStack(this._e, 2));
    }
  },
  toString: function() {
    return this.name + ": " + this.message;
  }
});
function getMultiErrorMessage(msg2, failures) {
  return msg2 + ". Errors: " + Object.keys(failures).map(function(key) {
    return failures[key].toString();
  }).filter(function(v, i, s) {
    return s.indexOf(v) === i;
  }).join("\n");
}
function ModifyError(msg2, failures, successCount, failedKeys) {
  this._e = getErrorWithStack();
  this.failures = failures;
  this.failedKeys = failedKeys;
  this.successCount = successCount;
  this.message = getMultiErrorMessage(msg2, failures);
}
derive(ModifyError).from(DexieError);
function BulkError(msg2, failures) {
  this._e = getErrorWithStack();
  this.name = "BulkError";
  this.failures = Object.keys(failures).map(function(pos) {
    return failures[pos];
  });
  this.failuresByPos = failures;
  this.message = getMultiErrorMessage(msg2, failures);
}
derive(BulkError).from(DexieError);
var errnames = errorList.reduce(function(obj, name) {
  return obj[name] = name + "Error", obj;
}, {});
var BaseException = DexieError;
var exceptions = errorList.reduce(function(obj, name) {
  var fullName = name + "Error";
  function DexieError2(msgOrInner, inner) {
    this._e = getErrorWithStack();
    this.name = fullName;
    if (!msgOrInner) {
      this.message = defaultTexts[name] || fullName;
      this.inner = null;
    } else if (typeof msgOrInner === "string") {
      this.message = "" + msgOrInner + (!inner ? "" : "\n " + inner);
      this.inner = inner || null;
    } else if (typeof msgOrInner === "object") {
      this.message = msgOrInner.name + " " + msgOrInner.message;
      this.inner = msgOrInner;
    }
  }
  derive(DexieError2).from(BaseException);
  obj[name] = DexieError2;
  return obj;
}, {});
exceptions.Syntax = SyntaxError;
exceptions.Type = TypeError;
exceptions.Range = RangeError;
var exceptionMap = idbDomErrorNames.reduce(function(obj, name) {
  obj[name + "Error"] = exceptions[name];
  return obj;
}, {});
function mapError(domError, message) {
  if (!domError || domError instanceof DexieError || domError instanceof TypeError || domError instanceof SyntaxError || !domError.name || !exceptionMap[domError.name])
    return domError;
  var rv = new exceptionMap[domError.name](message || domError.message, domError);
  if ("stack" in domError) {
    setProp(rv, "stack", { get: function() {
      return this.inner.stack;
    } });
  }
  return rv;
}
var fullNameExceptions = errorList.reduce(function(obj, name) {
  if (["Syntax", "Type", "Range"].indexOf(name) === -1)
    obj[name + "Error"] = exceptions[name];
  return obj;
}, {});
fullNameExceptions.ModifyError = ModifyError;
fullNameExceptions.DexieError = DexieError;
fullNameExceptions.BulkError = BulkError;
function nop() {
}
function mirror(val) {
  return val;
}
function pureFunctionChain(f1, f2) {
  if (f1 == null || f1 === mirror)
    return f2;
  return function(val) {
    return f2(f1(val));
  };
}
function callBoth(on1, on2) {
  return function() {
    on1.apply(this, arguments);
    on2.apply(this, arguments);
  };
}
function hookCreatingChain(f1, f2) {
  if (f1 === nop)
    return f2;
  return function() {
    var res = f1.apply(this, arguments);
    if (res !== void 0)
      arguments[0] = res;
    var onsuccess = this.onsuccess, onerror = this.onerror;
    this.onsuccess = null;
    this.onerror = null;
    var res2 = f2.apply(this, arguments);
    if (onsuccess)
      this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
    if (onerror)
      this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
    return res2 !== void 0 ? res2 : res;
  };
}
function hookDeletingChain(f1, f2) {
  if (f1 === nop)
    return f2;
  return function() {
    f1.apply(this, arguments);
    var onsuccess = this.onsuccess, onerror = this.onerror;
    this.onsuccess = this.onerror = null;
    f2.apply(this, arguments);
    if (onsuccess)
      this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
    if (onerror)
      this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
  };
}
function hookUpdatingChain(f1, f2) {
  if (f1 === nop)
    return f2;
  return function(modifications) {
    var res = f1.apply(this, arguments);
    extend(modifications, res);
    var onsuccess = this.onsuccess, onerror = this.onerror;
    this.onsuccess = null;
    this.onerror = null;
    var res2 = f2.apply(this, arguments);
    if (onsuccess)
      this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
    if (onerror)
      this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
    return res === void 0 ? res2 === void 0 ? void 0 : res2 : extend(res, res2);
  };
}
function reverseStoppableEventChain(f1, f2) {
  if (f1 === nop)
    return f2;
  return function() {
    if (f2.apply(this, arguments) === false)
      return false;
    return f1.apply(this, arguments);
  };
}
function promisableChain(f1, f2) {
  if (f1 === nop)
    return f2;
  return function() {
    var res = f1.apply(this, arguments);
    if (res && typeof res.then === "function") {
      var thiz = this, i = arguments.length, args = new Array(i);
      while (i--)
        args[i] = arguments[i];
      return res.then(function() {
        return f2.apply(thiz, args);
      });
    }
    return f2.apply(this, arguments);
  };
}
var INTERNAL = {};
var LONG_STACKS_CLIP_LIMIT = 100, MAX_LONG_STACKS = 20, ZONE_ECHO_LIMIT = 100, _a$1 = typeof Promise === "undefined" ? [] : function() {
  var globalP = Promise.resolve();
  if (typeof crypto === "undefined" || !crypto.subtle)
    return [globalP, getProto(globalP), globalP];
  var nativeP = crypto.subtle.digest("SHA-512", new Uint8Array([0]));
  return [
    nativeP,
    getProto(nativeP),
    globalP
  ];
}(), resolvedNativePromise = _a$1[0], nativePromiseProto = _a$1[1], resolvedGlobalPromise = _a$1[2], nativePromiseThen = nativePromiseProto && nativePromiseProto.then;
var NativePromise = resolvedNativePromise && resolvedNativePromise.constructor;
var patchGlobalPromise = !!resolvedGlobalPromise;
var stack_being_generated = false;
var schedulePhysicalTick = resolvedGlobalPromise ? function() {
  resolvedGlobalPromise.then(physicalTick);
} : _global.setImmediate ? setImmediate.bind(null, physicalTick) : _global.MutationObserver ? function() {
  var hiddenDiv = document.createElement("div");
  new MutationObserver(function() {
    physicalTick();
    hiddenDiv = null;
  }).observe(hiddenDiv, { attributes: true });
  hiddenDiv.setAttribute("i", "1");
} : function() {
  setTimeout(physicalTick, 0);
};
var asap = function(callback, args) {
  microtickQueue.push([callback, args]);
  if (needsNewPhysicalTick) {
    schedulePhysicalTick();
    needsNewPhysicalTick = false;
  }
};
var isOutsideMicroTick = true, needsNewPhysicalTick = true, unhandledErrors = [], rejectingErrors = [], currentFulfiller = null, rejectionMapper = mirror;
var globalPSD = {
  id: "global",
  global: true,
  ref: 0,
  unhandleds: [],
  onunhandled: globalError,
  pgp: false,
  env: {},
  finalize: function() {
    this.unhandleds.forEach(function(uh) {
      try {
        globalError(uh[0], uh[1]);
      } catch (e) {
      }
    });
  }
};
var PSD = globalPSD;
var microtickQueue = [];
var numScheduledCalls = 0;
var tickFinalizers = [];
function DexiePromise(fn) {
  if (typeof this !== "object")
    throw new TypeError("Promises must be constructed via new");
  this._listeners = [];
  this.onuncatched = nop;
  this._lib = false;
  var psd = this._PSD = PSD;
  if (debug) {
    this._stackHolder = getErrorWithStack();
    this._prev = null;
    this._numPrev = 0;
  }
  if (typeof fn !== "function") {
    if (fn !== INTERNAL)
      throw new TypeError("Not a function");
    this._state = arguments[1];
    this._value = arguments[2];
    if (this._state === false)
      handleRejection(this, this._value);
    return;
  }
  this._state = null;
  this._value = null;
  ++psd.ref;
  executePromiseTask(this, fn);
}
var thenProp = {
  get: function() {
    var psd = PSD, microTaskId = totalEchoes;
    function then(onFulfilled, onRejected) {
      var _this = this;
      var possibleAwait = !psd.global && (psd !== PSD || microTaskId !== totalEchoes);
      var cleanup = possibleAwait && !decrementExpectedAwaits();
      var rv = new DexiePromise(function(resolve, reject) {
        propagateToListener(_this, new Listener(nativeAwaitCompatibleWrap(onFulfilled, psd, possibleAwait, cleanup), nativeAwaitCompatibleWrap(onRejected, psd, possibleAwait, cleanup), resolve, reject, psd));
      });
      debug && linkToPreviousPromise(rv, this);
      return rv;
    }
    then.prototype = INTERNAL;
    return then;
  },
  set: function(value) {
    setProp(this, "then", value && value.prototype === INTERNAL ? thenProp : {
      get: function() {
        return value;
      },
      set: thenProp.set
    });
  }
};
props(DexiePromise.prototype, {
  then: thenProp,
  _then: function(onFulfilled, onRejected) {
    propagateToListener(this, new Listener(null, null, onFulfilled, onRejected, PSD));
  },
  catch: function(onRejected) {
    if (arguments.length === 1)
      return this.then(null, onRejected);
    var type2 = arguments[0], handler = arguments[1];
    return typeof type2 === "function" ? this.then(null, function(err) {
      return err instanceof type2 ? handler(err) : PromiseReject(err);
    }) : this.then(null, function(err) {
      return err && err.name === type2 ? handler(err) : PromiseReject(err);
    });
  },
  finally: function(onFinally) {
    return this.then(function(value) {
      onFinally();
      return value;
    }, function(err) {
      onFinally();
      return PromiseReject(err);
    });
  },
  stack: {
    get: function() {
      if (this._stack)
        return this._stack;
      try {
        stack_being_generated = true;
        var stacks = getStack(this, [], MAX_LONG_STACKS);
        var stack = stacks.join("\nFrom previous: ");
        if (this._state !== null)
          this._stack = stack;
        return stack;
      } finally {
        stack_being_generated = false;
      }
    }
  },
  timeout: function(ms, msg2) {
    var _this = this;
    return ms < Infinity ? new DexiePromise(function(resolve, reject) {
      var handle = setTimeout(function() {
        return reject(new exceptions.Timeout(msg2));
      }, ms);
      _this.then(resolve, reject).finally(clearTimeout.bind(null, handle));
    }) : this;
  }
});
if (typeof Symbol !== "undefined" && Symbol.toStringTag)
  setProp(DexiePromise.prototype, Symbol.toStringTag, "Dexie.Promise");
globalPSD.env = snapShot();
function Listener(onFulfilled, onRejected, resolve, reject, zone) {
  this.onFulfilled = typeof onFulfilled === "function" ? onFulfilled : null;
  this.onRejected = typeof onRejected === "function" ? onRejected : null;
  this.resolve = resolve;
  this.reject = reject;
  this.psd = zone;
}
props(DexiePromise, {
  all: function() {
    var values = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
    return new DexiePromise(function(resolve, reject) {
      if (values.length === 0)
        resolve([]);
      var remaining = values.length;
      values.forEach(function(a, i) {
        return DexiePromise.resolve(a).then(function(x) {
          values[i] = x;
          if (!--remaining)
            resolve(values);
        }, reject);
      });
    });
  },
  resolve: function(value) {
    if (value instanceof DexiePromise)
      return value;
    if (value && typeof value.then === "function")
      return new DexiePromise(function(resolve, reject) {
        value.then(resolve, reject);
      });
    var rv = new DexiePromise(INTERNAL, true, value);
    linkToPreviousPromise(rv, currentFulfiller);
    return rv;
  },
  reject: PromiseReject,
  race: function() {
    var values = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
    return new DexiePromise(function(resolve, reject) {
      values.map(function(value) {
        return DexiePromise.resolve(value).then(resolve, reject);
      });
    });
  },
  PSD: {
    get: function() {
      return PSD;
    },
    set: function(value) {
      return PSD = value;
    }
  },
  totalEchoes: { get: function() {
    return totalEchoes;
  } },
  newPSD: newScope,
  usePSD,
  scheduler: {
    get: function() {
      return asap;
    },
    set: function(value) {
      asap = value;
    }
  },
  rejectionMapper: {
    get: function() {
      return rejectionMapper;
    },
    set: function(value) {
      rejectionMapper = value;
    }
  },
  follow: function(fn, zoneProps) {
    return new DexiePromise(function(resolve, reject) {
      return newScope(function(resolve2, reject2) {
        var psd = PSD;
        psd.unhandleds = [];
        psd.onunhandled = reject2;
        psd.finalize = callBoth(function() {
          var _this = this;
          run_at_end_of_this_or_next_physical_tick(function() {
            _this.unhandleds.length === 0 ? resolve2() : reject2(_this.unhandleds[0]);
          });
        }, psd.finalize);
        fn();
      }, zoneProps, resolve, reject);
    });
  }
});
if (NativePromise) {
  if (NativePromise.allSettled)
    setProp(DexiePromise, "allSettled", function() {
      var possiblePromises = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
      return new DexiePromise(function(resolve) {
        if (possiblePromises.length === 0)
          resolve([]);
        var remaining = possiblePromises.length;
        var results = new Array(remaining);
        possiblePromises.forEach(function(p, i) {
          return DexiePromise.resolve(p).then(function(value) {
            return results[i] = { status: "fulfilled", value };
          }, function(reason) {
            return results[i] = { status: "rejected", reason };
          }).then(function() {
            return --remaining || resolve(results);
          });
        });
      });
    });
  if (NativePromise.any && typeof AggregateError !== "undefined")
    setProp(DexiePromise, "any", function() {
      var possiblePromises = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
      return new DexiePromise(function(resolve, reject) {
        if (possiblePromises.length === 0)
          reject(new AggregateError([]));
        var remaining = possiblePromises.length;
        var failures = new Array(remaining);
        possiblePromises.forEach(function(p, i) {
          return DexiePromise.resolve(p).then(function(value) {
            return resolve(value);
          }, function(failure) {
            failures[i] = failure;
            if (!--remaining)
              reject(new AggregateError(failures));
          });
        });
      });
    });
}
function executePromiseTask(promise, fn) {
  try {
    fn(function(value) {
      if (promise._state !== null)
        return;
      if (value === promise)
        throw new TypeError("A promise cannot be resolved with itself.");
      var shouldExecuteTick = promise._lib && beginMicroTickScope();
      if (value && typeof value.then === "function") {
        executePromiseTask(promise, function(resolve, reject) {
          value instanceof DexiePromise ? value._then(resolve, reject) : value.then(resolve, reject);
        });
      } else {
        promise._state = true;
        promise._value = value;
        propagateAllListeners(promise);
      }
      if (shouldExecuteTick)
        endMicroTickScope();
    }, handleRejection.bind(null, promise));
  } catch (ex) {
    handleRejection(promise, ex);
  }
}
function handleRejection(promise, reason) {
  rejectingErrors.push(reason);
  if (promise._state !== null)
    return;
  var shouldExecuteTick = promise._lib && beginMicroTickScope();
  reason = rejectionMapper(reason);
  promise._state = false;
  promise._value = reason;
  debug && reason !== null && typeof reason === "object" && !reason._promise && tryCatch(function() {
    var origProp = getPropertyDescriptor(reason, "stack");
    reason._promise = promise;
    setProp(reason, "stack", {
      get: function() {
        return stack_being_generated ? origProp && (origProp.get ? origProp.get.apply(reason) : origProp.value) : promise.stack;
      }
    });
  });
  addPossiblyUnhandledError(promise);
  propagateAllListeners(promise);
  if (shouldExecuteTick)
    endMicroTickScope();
}
function propagateAllListeners(promise) {
  var listeners = promise._listeners;
  promise._listeners = [];
  for (var i = 0, len = listeners.length; i < len; ++i) {
    propagateToListener(promise, listeners[i]);
  }
  var psd = promise._PSD;
  --psd.ref || psd.finalize();
  if (numScheduledCalls === 0) {
    ++numScheduledCalls;
    asap(function() {
      if (--numScheduledCalls === 0)
        finalizePhysicalTick();
    }, []);
  }
}
function propagateToListener(promise, listener) {
  if (promise._state === null) {
    promise._listeners.push(listener);
    return;
  }
  var cb = promise._state ? listener.onFulfilled : listener.onRejected;
  if (cb === null) {
    return (promise._state ? listener.resolve : listener.reject)(promise._value);
  }
  ++listener.psd.ref;
  ++numScheduledCalls;
  asap(callListener, [cb, promise, listener]);
}
function callListener(cb, promise, listener) {
  try {
    currentFulfiller = promise;
    var ret, value = promise._value;
    if (promise._state) {
      ret = cb(value);
    } else {
      if (rejectingErrors.length)
        rejectingErrors = [];
      ret = cb(value);
      if (rejectingErrors.indexOf(value) === -1)
        markErrorAsHandled(promise);
    }
    listener.resolve(ret);
  } catch (e) {
    listener.reject(e);
  } finally {
    currentFulfiller = null;
    if (--numScheduledCalls === 0)
      finalizePhysicalTick();
    --listener.psd.ref || listener.psd.finalize();
  }
}
function getStack(promise, stacks, limit) {
  if (stacks.length === limit)
    return stacks;
  var stack = "";
  if (promise._state === false) {
    var failure = promise._value, errorName, message;
    if (failure != null) {
      errorName = failure.name || "Error";
      message = failure.message || failure;
      stack = prettyStack(failure, 0);
    } else {
      errorName = failure;
      message = "";
    }
    stacks.push(errorName + (message ? ": " + message : "") + stack);
  }
  if (debug) {
    stack = prettyStack(promise._stackHolder, 2);
    if (stack && stacks.indexOf(stack) === -1)
      stacks.push(stack);
    if (promise._prev)
      getStack(promise._prev, stacks, limit);
  }
  return stacks;
}
function linkToPreviousPromise(promise, prev) {
  var numPrev = prev ? prev._numPrev + 1 : 0;
  if (numPrev < LONG_STACKS_CLIP_LIMIT) {
    promise._prev = prev;
    promise._numPrev = numPrev;
  }
}
function physicalTick() {
  beginMicroTickScope() && endMicroTickScope();
}
function beginMicroTickScope() {
  var wasRootExec = isOutsideMicroTick;
  isOutsideMicroTick = false;
  needsNewPhysicalTick = false;
  return wasRootExec;
}
function endMicroTickScope() {
  var callbacks2, i, l;
  do {
    while (microtickQueue.length > 0) {
      callbacks2 = microtickQueue;
      microtickQueue = [];
      l = callbacks2.length;
      for (i = 0; i < l; ++i) {
        var item = callbacks2[i];
        item[0].apply(null, item[1]);
      }
    }
  } while (microtickQueue.length > 0);
  isOutsideMicroTick = true;
  needsNewPhysicalTick = true;
}
function finalizePhysicalTick() {
  var unhandledErrs = unhandledErrors;
  unhandledErrors = [];
  unhandledErrs.forEach(function(p) {
    p._PSD.onunhandled.call(null, p._value, p);
  });
  var finalizers = tickFinalizers.slice(0);
  var i = finalizers.length;
  while (i)
    finalizers[--i]();
}
function run_at_end_of_this_or_next_physical_tick(fn) {
  function finalizer() {
    fn();
    tickFinalizers.splice(tickFinalizers.indexOf(finalizer), 1);
  }
  tickFinalizers.push(finalizer);
  ++numScheduledCalls;
  asap(function() {
    if (--numScheduledCalls === 0)
      finalizePhysicalTick();
  }, []);
}
function addPossiblyUnhandledError(promise) {
  if (!unhandledErrors.some(function(p) {
    return p._value === promise._value;
  }))
    unhandledErrors.push(promise);
}
function markErrorAsHandled(promise) {
  var i = unhandledErrors.length;
  while (i)
    if (unhandledErrors[--i]._value === promise._value) {
      unhandledErrors.splice(i, 1);
      return;
    }
}
function PromiseReject(reason) {
  return new DexiePromise(INTERNAL, false, reason);
}
function wrap(fn, errorCatcher) {
  var psd = PSD;
  return function() {
    var wasRootExec = beginMicroTickScope(), outerScope = PSD;
    try {
      switchToZone(psd, true);
      return fn.apply(this, arguments);
    } catch (e) {
      errorCatcher && errorCatcher(e);
    } finally {
      switchToZone(outerScope, false);
      if (wasRootExec)
        endMicroTickScope();
    }
  };
}
var task = { awaits: 0, echoes: 0, id: 0 };
var taskCounter = 0;
var zoneStack = [];
var zoneEchoes = 0;
var totalEchoes = 0;
var zone_id_counter = 0;
function newScope(fn, props2, a1, a2) {
  var parent = PSD, psd = Object.create(parent);
  psd.parent = parent;
  psd.ref = 0;
  psd.global = false;
  psd.id = ++zone_id_counter;
  var globalEnv = globalPSD.env;
  psd.env = patchGlobalPromise ? {
    Promise: DexiePromise,
    PromiseProp: { value: DexiePromise, configurable: true, writable: true },
    all: DexiePromise.all,
    race: DexiePromise.race,
    allSettled: DexiePromise.allSettled,
    any: DexiePromise.any,
    resolve: DexiePromise.resolve,
    reject: DexiePromise.reject,
    nthen: getPatchedPromiseThen(globalEnv.nthen, psd),
    gthen: getPatchedPromiseThen(globalEnv.gthen, psd)
  } : {};
  if (props2)
    extend(psd, props2);
  ++parent.ref;
  psd.finalize = function() {
    --this.parent.ref || this.parent.finalize();
  };
  var rv = usePSD(psd, fn, a1, a2);
  if (psd.ref === 0)
    psd.finalize();
  return rv;
}
function incrementExpectedAwaits() {
  if (!task.id)
    task.id = ++taskCounter;
  ++task.awaits;
  task.echoes += ZONE_ECHO_LIMIT;
  return task.id;
}
function decrementExpectedAwaits() {
  if (!task.awaits)
    return false;
  if (--task.awaits === 0)
    task.id = 0;
  task.echoes = task.awaits * ZONE_ECHO_LIMIT;
  return true;
}
if (("" + nativePromiseThen).indexOf("[native code]") === -1) {
  incrementExpectedAwaits = decrementExpectedAwaits = nop;
}
function onPossibleParallellAsync(possiblePromise) {
  if (task.echoes && possiblePromise && possiblePromise.constructor === NativePromise) {
    incrementExpectedAwaits();
    return possiblePromise.then(function(x) {
      decrementExpectedAwaits();
      return x;
    }, function(e) {
      decrementExpectedAwaits();
      return rejection(e);
    });
  }
  return possiblePromise;
}
function zoneEnterEcho(targetZone) {
  ++totalEchoes;
  if (!task.echoes || --task.echoes === 0) {
    task.echoes = task.id = 0;
  }
  zoneStack.push(PSD);
  switchToZone(targetZone, true);
}
function zoneLeaveEcho() {
  var zone = zoneStack[zoneStack.length - 1];
  zoneStack.pop();
  switchToZone(zone, false);
}
function switchToZone(targetZone, bEnteringZone) {
  var currentZone = PSD;
  if (bEnteringZone ? task.echoes && (!zoneEchoes++ || targetZone !== PSD) : zoneEchoes && (!--zoneEchoes || targetZone !== PSD)) {
    enqueueNativeMicroTask(bEnteringZone ? zoneEnterEcho.bind(null, targetZone) : zoneLeaveEcho);
  }
  if (targetZone === PSD)
    return;
  PSD = targetZone;
  if (currentZone === globalPSD)
    globalPSD.env = snapShot();
  if (patchGlobalPromise) {
    var GlobalPromise_1 = globalPSD.env.Promise;
    var targetEnv = targetZone.env;
    nativePromiseProto.then = targetEnv.nthen;
    GlobalPromise_1.prototype.then = targetEnv.gthen;
    if (currentZone.global || targetZone.global) {
      Object.defineProperty(_global, "Promise", targetEnv.PromiseProp);
      GlobalPromise_1.all = targetEnv.all;
      GlobalPromise_1.race = targetEnv.race;
      GlobalPromise_1.resolve = targetEnv.resolve;
      GlobalPromise_1.reject = targetEnv.reject;
      if (targetEnv.allSettled)
        GlobalPromise_1.allSettled = targetEnv.allSettled;
      if (targetEnv.any)
        GlobalPromise_1.any = targetEnv.any;
    }
  }
}
function snapShot() {
  var GlobalPromise = _global.Promise;
  return patchGlobalPromise ? {
    Promise: GlobalPromise,
    PromiseProp: Object.getOwnPropertyDescriptor(_global, "Promise"),
    all: GlobalPromise.all,
    race: GlobalPromise.race,
    allSettled: GlobalPromise.allSettled,
    any: GlobalPromise.any,
    resolve: GlobalPromise.resolve,
    reject: GlobalPromise.reject,
    nthen: nativePromiseProto.then,
    gthen: GlobalPromise.prototype.then
  } : {};
}
function usePSD(psd, fn, a1, a2, a3) {
  var outerScope = PSD;
  try {
    switchToZone(psd, true);
    return fn(a1, a2, a3);
  } finally {
    switchToZone(outerScope, false);
  }
}
function enqueueNativeMicroTask(job) {
  nativePromiseThen.call(resolvedNativePromise, job);
}
function nativeAwaitCompatibleWrap(fn, zone, possibleAwait, cleanup) {
  return typeof fn !== "function" ? fn : function() {
    var outerZone = PSD;
    if (possibleAwait)
      incrementExpectedAwaits();
    switchToZone(zone, true);
    try {
      return fn.apply(this, arguments);
    } finally {
      switchToZone(outerZone, false);
      if (cleanup)
        enqueueNativeMicroTask(decrementExpectedAwaits);
    }
  };
}
function getPatchedPromiseThen(origThen, zone) {
  return function(onResolved, onRejected) {
    return origThen.call(this, nativeAwaitCompatibleWrap(onResolved, zone), nativeAwaitCompatibleWrap(onRejected, zone));
  };
}
var UNHANDLEDREJECTION = "unhandledrejection";
function globalError(err, promise) {
  var rv;
  try {
    rv = promise.onuncatched(err);
  } catch (e) {
  }
  if (rv !== false)
    try {
      var event, eventData = { promise, reason: err };
      if (_global.document && document.createEvent) {
        event = document.createEvent("Event");
        event.initEvent(UNHANDLEDREJECTION, true, true);
        extend(event, eventData);
      } else if (_global.CustomEvent) {
        event = new CustomEvent(UNHANDLEDREJECTION, { detail: eventData });
        extend(event, eventData);
      }
      if (event && _global.dispatchEvent) {
        dispatchEvent(event);
        if (!_global.PromiseRejectionEvent && _global.onunhandledrejection)
          try {
            _global.onunhandledrejection(event);
          } catch (_) {
          }
      }
      if (debug && event && !event.defaultPrevented) {
        console.warn("Unhandled rejection: " + (err.stack || err));
      }
    } catch (e) {
    }
}
var rejection = DexiePromise.reject;
function tempTransaction(db, mode, storeNames, fn) {
  if (!db.idbdb || !db._state.openComplete && (!PSD.letThrough && !db._vip)) {
    if (db._state.openComplete) {
      return rejection(new exceptions.DatabaseClosed(db._state.dbOpenError));
    }
    if (!db._state.isBeingOpened) {
      if (!db._options.autoOpen)
        return rejection(new exceptions.DatabaseClosed());
      db.open().catch(nop);
    }
    return db._state.dbReadyPromise.then(function() {
      return tempTransaction(db, mode, storeNames, fn);
    });
  } else {
    var trans = db._createTransaction(mode, storeNames, db._dbSchema);
    try {
      trans.create();
      db._state.PR1398_maxLoop = 3;
    } catch (ex) {
      if (ex.name === errnames.InvalidState && db.isOpen() && --db._state.PR1398_maxLoop > 0) {
        console.warn("Dexie: Need to reopen db");
        db._close();
        return db.open().then(function() {
          return tempTransaction(db, mode, storeNames, fn);
        });
      }
      return rejection(ex);
    }
    return trans._promise(mode, function(resolve, reject) {
      return newScope(function() {
        PSD.trans = trans;
        return fn(resolve, reject, trans);
      });
    }).then(function(result) {
      return trans._completion.then(function() {
        return result;
      });
    });
  }
}
var DEXIE_VERSION = "3.2.1";
var maxString = String.fromCharCode(65535);
var minKey = -Infinity;
var INVALID_KEY_ARGUMENT = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.";
var STRING_EXPECTED = "String expected.";
var connections = [];
var isIEOrEdge = typeof navigator !== "undefined" && /(MSIE|Trident|Edge)/.test(navigator.userAgent);
var hasIEDeleteObjectStoreBug = isIEOrEdge;
var hangsOnDeleteLargeKeyRange = isIEOrEdge;
var dexieStackFrameFilter = function(frame) {
  return !/(dexie\.js|dexie\.min\.js)/.test(frame);
};
var DBNAMES_DB = "__dbnames";
var READONLY = "readonly";
var READWRITE = "readwrite";
function combine(filter1, filter2) {
  return filter1 ? filter2 ? function() {
    return filter1.apply(this, arguments) && filter2.apply(this, arguments);
  } : filter1 : filter2;
}
var AnyRange = {
  type: 3,
  lower: -Infinity,
  lowerOpen: false,
  upper: [[]],
  upperOpen: false
};
function workaroundForUndefinedPrimKey(keyPath) {
  return typeof keyPath === "string" && !/\./.test(keyPath) ? function(obj) {
    if (obj[keyPath] === void 0 && keyPath in obj) {
      obj = deepClone(obj);
      delete obj[keyPath];
    }
    return obj;
  } : function(obj) {
    return obj;
  };
}
var Table = function() {
  function Table2() {
  }
  Table2.prototype._trans = function(mode, fn, writeLocked) {
    var trans = this._tx || PSD.trans;
    var tableName = this.name;
    function checkTableInTransaction(resolve, reject, trans2) {
      if (!trans2.schema[tableName])
        throw new exceptions.NotFound("Table " + tableName + " not part of transaction");
      return fn(trans2.idbtrans, trans2);
    }
    var wasRootExec = beginMicroTickScope();
    try {
      return trans && trans.db === this.db ? trans === PSD.trans ? trans._promise(mode, checkTableInTransaction, writeLocked) : newScope(function() {
        return trans._promise(mode, checkTableInTransaction, writeLocked);
      }, { trans, transless: PSD.transless || PSD }) : tempTransaction(this.db, mode, [this.name], checkTableInTransaction);
    } finally {
      if (wasRootExec)
        endMicroTickScope();
    }
  };
  Table2.prototype.get = function(keyOrCrit, cb) {
    var _this = this;
    if (keyOrCrit && keyOrCrit.constructor === Object)
      return this.where(keyOrCrit).first(cb);
    return this._trans("readonly", function(trans) {
      return _this.core.get({ trans, key: keyOrCrit }).then(function(res) {
        return _this.hook.reading.fire(res);
      });
    }).then(cb);
  };
  Table2.prototype.where = function(indexOrCrit) {
    if (typeof indexOrCrit === "string")
      return new this.db.WhereClause(this, indexOrCrit);
    if (isArray(indexOrCrit))
      return new this.db.WhereClause(this, "[" + indexOrCrit.join("+") + "]");
    var keyPaths = keys(indexOrCrit);
    if (keyPaths.length === 1)
      return this.where(keyPaths[0]).equals(indexOrCrit[keyPaths[0]]);
    var compoundIndex = this.schema.indexes.concat(this.schema.primKey).filter(function(ix) {
      return ix.compound && keyPaths.every(function(keyPath) {
        return ix.keyPath.indexOf(keyPath) >= 0;
      }) && ix.keyPath.every(function(keyPath) {
        return keyPaths.indexOf(keyPath) >= 0;
      });
    })[0];
    if (compoundIndex && this.db._maxKey !== maxString)
      return this.where(compoundIndex.name).equals(compoundIndex.keyPath.map(function(kp) {
        return indexOrCrit[kp];
      }));
    if (!compoundIndex && debug)
      console.warn("The query " + JSON.stringify(indexOrCrit) + " on " + this.name + " would benefit of a " + ("compound index [" + keyPaths.join("+") + "]"));
    var idxByName = this.schema.idxByName;
    var idb = this.db._deps.indexedDB;
    function equals(a, b) {
      try {
        return idb.cmp(a, b) === 0;
      } catch (e) {
        return false;
      }
    }
    var _a2 = keyPaths.reduce(function(_a3, keyPath) {
      var prevIndex = _a3[0], prevFilterFn = _a3[1];
      var index = idxByName[keyPath];
      var value = indexOrCrit[keyPath];
      return [
        prevIndex || index,
        prevIndex || !index ? combine(prevFilterFn, index && index.multi ? function(x) {
          var prop = getByKeyPath(x, keyPath);
          return isArray(prop) && prop.some(function(item) {
            return equals(value, item);
          });
        } : function(x) {
          return equals(value, getByKeyPath(x, keyPath));
        }) : prevFilterFn
      ];
    }, [null, null]), idx = _a2[0], filterFunction = _a2[1];
    return idx ? this.where(idx.name).equals(indexOrCrit[idx.keyPath]).filter(filterFunction) : compoundIndex ? this.filter(filterFunction) : this.where(keyPaths).equals("");
  };
  Table2.prototype.filter = function(filterFunction) {
    return this.toCollection().and(filterFunction);
  };
  Table2.prototype.count = function(thenShortcut) {
    return this.toCollection().count(thenShortcut);
  };
  Table2.prototype.offset = function(offset) {
    return this.toCollection().offset(offset);
  };
  Table2.prototype.limit = function(numRows) {
    return this.toCollection().limit(numRows);
  };
  Table2.prototype.each = function(callback) {
    return this.toCollection().each(callback);
  };
  Table2.prototype.toArray = function(thenShortcut) {
    return this.toCollection().toArray(thenShortcut);
  };
  Table2.prototype.toCollection = function() {
    return new this.db.Collection(new this.db.WhereClause(this));
  };
  Table2.prototype.orderBy = function(index) {
    return new this.db.Collection(new this.db.WhereClause(this, isArray(index) ? "[" + index.join("+") + "]" : index));
  };
  Table2.prototype.reverse = function() {
    return this.toCollection().reverse();
  };
  Table2.prototype.mapToClass = function(constructor) {
    this.schema.mappedClass = constructor;
    var readHook = function(obj) {
      if (!obj)
        return obj;
      var res = Object.create(constructor.prototype);
      for (var m in obj)
        if (hasOwn(obj, m))
          try {
            res[m] = obj[m];
          } catch (_) {
          }
      return res;
    };
    if (this.schema.readHook) {
      this.hook.reading.unsubscribe(this.schema.readHook);
    }
    this.schema.readHook = readHook;
    this.hook("reading", readHook);
    return constructor;
  };
  Table2.prototype.defineClass = function() {
    function Class(content) {
      extend(this, content);
    }
    return this.mapToClass(Class);
  };
  Table2.prototype.add = function(obj, key) {
    var _this = this;
    var _a2 = this.schema.primKey, auto = _a2.auto, keyPath = _a2.keyPath;
    var objToAdd = obj;
    if (keyPath && auto) {
      objToAdd = workaroundForUndefinedPrimKey(keyPath)(obj);
    }
    return this._trans("readwrite", function(trans) {
      return _this.core.mutate({ trans, type: "add", keys: key != null ? [key] : null, values: [objToAdd] });
    }).then(function(res) {
      return res.numFailures ? DexiePromise.reject(res.failures[0]) : res.lastResult;
    }).then(function(lastResult) {
      if (keyPath) {
        try {
          setByKeyPath(obj, keyPath, lastResult);
        } catch (_) {
        }
      }
      return lastResult;
    });
  };
  Table2.prototype.update = function(keyOrObject, modifications) {
    if (typeof keyOrObject === "object" && !isArray(keyOrObject)) {
      var key = getByKeyPath(keyOrObject, this.schema.primKey.keyPath);
      if (key === void 0)
        return rejection(new exceptions.InvalidArgument("Given object does not contain its primary key"));
      try {
        if (typeof modifications !== "function") {
          keys(modifications).forEach(function(keyPath) {
            setByKeyPath(keyOrObject, keyPath, modifications[keyPath]);
          });
        } else {
          modifications(keyOrObject, { value: keyOrObject, primKey: key });
        }
      } catch (_a2) {
      }
      return this.where(":id").equals(key).modify(modifications);
    } else {
      return this.where(":id").equals(keyOrObject).modify(modifications);
    }
  };
  Table2.prototype.put = function(obj, key) {
    var _this = this;
    var _a2 = this.schema.primKey, auto = _a2.auto, keyPath = _a2.keyPath;
    var objToAdd = obj;
    if (keyPath && auto) {
      objToAdd = workaroundForUndefinedPrimKey(keyPath)(obj);
    }
    return this._trans("readwrite", function(trans) {
      return _this.core.mutate({ trans, type: "put", values: [objToAdd], keys: key != null ? [key] : null });
    }).then(function(res) {
      return res.numFailures ? DexiePromise.reject(res.failures[0]) : res.lastResult;
    }).then(function(lastResult) {
      if (keyPath) {
        try {
          setByKeyPath(obj, keyPath, lastResult);
        } catch (_) {
        }
      }
      return lastResult;
    });
  };
  Table2.prototype.delete = function(key) {
    var _this = this;
    return this._trans("readwrite", function(trans) {
      return _this.core.mutate({ trans, type: "delete", keys: [key] });
    }).then(function(res) {
      return res.numFailures ? DexiePromise.reject(res.failures[0]) : void 0;
    });
  };
  Table2.prototype.clear = function() {
    var _this = this;
    return this._trans("readwrite", function(trans) {
      return _this.core.mutate({ trans, type: "deleteRange", range: AnyRange });
    }).then(function(res) {
      return res.numFailures ? DexiePromise.reject(res.failures[0]) : void 0;
    });
  };
  Table2.prototype.bulkGet = function(keys2) {
    var _this = this;
    return this._trans("readonly", function(trans) {
      return _this.core.getMany({
        keys: keys2,
        trans
      }).then(function(result) {
        return result.map(function(res) {
          return _this.hook.reading.fire(res);
        });
      });
    });
  };
  Table2.prototype.bulkAdd = function(objects, keysOrOptions, options) {
    var _this = this;
    var keys2 = Array.isArray(keysOrOptions) ? keysOrOptions : void 0;
    options = options || (keys2 ? void 0 : keysOrOptions);
    var wantResults = options ? options.allKeys : void 0;
    return this._trans("readwrite", function(trans) {
      var _a2 = _this.schema.primKey, auto = _a2.auto, keyPath = _a2.keyPath;
      if (keyPath && keys2)
        throw new exceptions.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
      if (keys2 && keys2.length !== objects.length)
        throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
      var numObjects = objects.length;
      var objectsToAdd = keyPath && auto ? objects.map(workaroundForUndefinedPrimKey(keyPath)) : objects;
      return _this.core.mutate({ trans, type: "add", keys: keys2, values: objectsToAdd, wantResults }).then(function(_a3) {
        var numFailures = _a3.numFailures, results = _a3.results, lastResult = _a3.lastResult, failures = _a3.failures;
        var result = wantResults ? results : lastResult;
        if (numFailures === 0)
          return result;
        throw new BulkError(_this.name + ".bulkAdd(): " + numFailures + " of " + numObjects + " operations failed", failures);
      });
    });
  };
  Table2.prototype.bulkPut = function(objects, keysOrOptions, options) {
    var _this = this;
    var keys2 = Array.isArray(keysOrOptions) ? keysOrOptions : void 0;
    options = options || (keys2 ? void 0 : keysOrOptions);
    var wantResults = options ? options.allKeys : void 0;
    return this._trans("readwrite", function(trans) {
      var _a2 = _this.schema.primKey, auto = _a2.auto, keyPath = _a2.keyPath;
      if (keyPath && keys2)
        throw new exceptions.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
      if (keys2 && keys2.length !== objects.length)
        throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
      var numObjects = objects.length;
      var objectsToPut = keyPath && auto ? objects.map(workaroundForUndefinedPrimKey(keyPath)) : objects;
      return _this.core.mutate({ trans, type: "put", keys: keys2, values: objectsToPut, wantResults }).then(function(_a3) {
        var numFailures = _a3.numFailures, results = _a3.results, lastResult = _a3.lastResult, failures = _a3.failures;
        var result = wantResults ? results : lastResult;
        if (numFailures === 0)
          return result;
        throw new BulkError(_this.name + ".bulkPut(): " + numFailures + " of " + numObjects + " operations failed", failures);
      });
    });
  };
  Table2.prototype.bulkDelete = function(keys2) {
    var _this = this;
    var numKeys = keys2.length;
    return this._trans("readwrite", function(trans) {
      return _this.core.mutate({ trans, type: "delete", keys: keys2 });
    }).then(function(_a2) {
      var numFailures = _a2.numFailures, lastResult = _a2.lastResult, failures = _a2.failures;
      if (numFailures === 0)
        return lastResult;
      throw new BulkError(_this.name + ".bulkDelete(): " + numFailures + " of " + numKeys + " operations failed", failures);
    });
  };
  return Table2;
}();
function Events(ctx) {
  var evs = {};
  var rv = function(eventName, subscriber) {
    if (subscriber) {
      var i2 = arguments.length, args = new Array(i2 - 1);
      while (--i2)
        args[i2 - 1] = arguments[i2];
      evs[eventName].subscribe.apply(null, args);
      return ctx;
    } else if (typeof eventName === "string") {
      return evs[eventName];
    }
  };
  rv.addEventType = add;
  for (var i = 1, l = arguments.length; i < l; ++i) {
    add(arguments[i]);
  }
  return rv;
  function add(eventName, chainFunction, defaultFunction) {
    if (typeof eventName === "object")
      return addConfiguredEvents(eventName);
    if (!chainFunction)
      chainFunction = reverseStoppableEventChain;
    if (!defaultFunction)
      defaultFunction = nop;
    var context = {
      subscribers: [],
      fire: defaultFunction,
      subscribe: function(cb) {
        if (context.subscribers.indexOf(cb) === -1) {
          context.subscribers.push(cb);
          context.fire = chainFunction(context.fire, cb);
        }
      },
      unsubscribe: function(cb) {
        context.subscribers = context.subscribers.filter(function(fn) {
          return fn !== cb;
        });
        context.fire = context.subscribers.reduce(chainFunction, defaultFunction);
      }
    };
    evs[eventName] = rv[eventName] = context;
    return context;
  }
  function addConfiguredEvents(cfg) {
    keys(cfg).forEach(function(eventName) {
      var args = cfg[eventName];
      if (isArray(args)) {
        add(eventName, cfg[eventName][0], cfg[eventName][1]);
      } else if (args === "asap") {
        var context = add(eventName, mirror, function fire() {
          var i2 = arguments.length, args2 = new Array(i2);
          while (i2--)
            args2[i2] = arguments[i2];
          context.subscribers.forEach(function(fn) {
            asap$1(function fireEvent() {
              fn.apply(null, args2);
            });
          });
        });
      } else
        throw new exceptions.InvalidArgument("Invalid event config");
    });
  }
}
function makeClassConstructor(prototype, constructor) {
  derive(constructor).from({ prototype });
  return constructor;
}
function createTableConstructor(db) {
  return makeClassConstructor(Table.prototype, function Table2(name, tableSchema, trans) {
    this.db = db;
    this._tx = trans;
    this.name = name;
    this.schema = tableSchema;
    this.hook = db._allTables[name] ? db._allTables[name].hook : Events(null, {
      "creating": [hookCreatingChain, nop],
      "reading": [pureFunctionChain, mirror],
      "updating": [hookUpdatingChain, nop],
      "deleting": [hookDeletingChain, nop]
    });
  });
}
function isPlainKeyRange(ctx, ignoreLimitFilter) {
  return !(ctx.filter || ctx.algorithm || ctx.or) && (ignoreLimitFilter ? ctx.justLimit : !ctx.replayFilter);
}
function addFilter(ctx, fn) {
  ctx.filter = combine(ctx.filter, fn);
}
function addReplayFilter(ctx, factory, isLimitFilter) {
  var curr = ctx.replayFilter;
  ctx.replayFilter = curr ? function() {
    return combine(curr(), factory());
  } : factory;
  ctx.justLimit = isLimitFilter && !curr;
}
function addMatchFilter(ctx, fn) {
  ctx.isMatch = combine(ctx.isMatch, fn);
}
function getIndexOrStore(ctx, coreSchema) {
  if (ctx.isPrimKey)
    return coreSchema.primaryKey;
  var index = coreSchema.getIndexByKeyPath(ctx.index);
  if (!index)
    throw new exceptions.Schema("KeyPath " + ctx.index + " on object store " + coreSchema.name + " is not indexed");
  return index;
}
function openCursor(ctx, coreTable, trans) {
  var index = getIndexOrStore(ctx, coreTable.schema);
  return coreTable.openCursor({
    trans,
    values: !ctx.keysOnly,
    reverse: ctx.dir === "prev",
    unique: !!ctx.unique,
    query: {
      index,
      range: ctx.range
    }
  });
}
function iter(ctx, fn, coreTrans, coreTable) {
  var filter = ctx.replayFilter ? combine(ctx.filter, ctx.replayFilter()) : ctx.filter;
  if (!ctx.or) {
    return iterate(openCursor(ctx, coreTable, coreTrans), combine(ctx.algorithm, filter), fn, !ctx.keysOnly && ctx.valueMapper);
  } else {
    var set_1 = {};
    var union = function(item, cursor, advance) {
      if (!filter || filter(cursor, advance, function(result) {
        return cursor.stop(result);
      }, function(err) {
        return cursor.fail(err);
      })) {
        var primaryKey = cursor.primaryKey;
        var key = "" + primaryKey;
        if (key === "[object ArrayBuffer]")
          key = "" + new Uint8Array(primaryKey);
        if (!hasOwn(set_1, key)) {
          set_1[key] = true;
          fn(item, cursor, advance);
        }
      }
    };
    return Promise.all([
      ctx.or._iterate(union, coreTrans),
      iterate(openCursor(ctx, coreTable, coreTrans), ctx.algorithm, union, !ctx.keysOnly && ctx.valueMapper)
    ]);
  }
}
function iterate(cursorPromise, filter, fn, valueMapper) {
  var mappedFn = valueMapper ? function(x, c, a) {
    return fn(valueMapper(x), c, a);
  } : fn;
  var wrappedFn = wrap(mappedFn);
  return cursorPromise.then(function(cursor) {
    if (cursor) {
      return cursor.start(function() {
        var c = function() {
          return cursor.continue();
        };
        if (!filter || filter(cursor, function(advancer) {
          return c = advancer;
        }, function(val) {
          cursor.stop(val);
          c = nop;
        }, function(e) {
          cursor.fail(e);
          c = nop;
        }))
          wrappedFn(cursor.value, cursor, function(advancer) {
            return c = advancer;
          });
        c();
      });
    }
  });
}
function cmp(a, b) {
  try {
    var ta = type(a);
    var tb = type(b);
    if (ta !== tb) {
      if (ta === "Array")
        return 1;
      if (tb === "Array")
        return -1;
      if (ta === "binary")
        return 1;
      if (tb === "binary")
        return -1;
      if (ta === "string")
        return 1;
      if (tb === "string")
        return -1;
      if (ta === "Date")
        return 1;
      if (tb !== "Date")
        return NaN;
      return -1;
    }
    switch (ta) {
      case "number":
      case "Date":
      case "string":
        return a > b ? 1 : a < b ? -1 : 0;
      case "binary": {
        return compareUint8Arrays(getUint8Array(a), getUint8Array(b));
      }
      case "Array":
        return compareArrays(a, b);
    }
  } catch (_a2) {
  }
  return NaN;
}
function compareArrays(a, b) {
  var al = a.length;
  var bl = b.length;
  var l = al < bl ? al : bl;
  for (var i = 0; i < l; ++i) {
    var res = cmp(a[i], b[i]);
    if (res !== 0)
      return res;
  }
  return al === bl ? 0 : al < bl ? -1 : 1;
}
function compareUint8Arrays(a, b) {
  var al = a.length;
  var bl = b.length;
  var l = al < bl ? al : bl;
  for (var i = 0; i < l; ++i) {
    if (a[i] !== b[i])
      return a[i] < b[i] ? -1 : 1;
  }
  return al === bl ? 0 : al < bl ? -1 : 1;
}
function type(x) {
  var t = typeof x;
  if (t !== "object")
    return t;
  if (ArrayBuffer.isView(x))
    return "binary";
  var tsTag = toStringTag(x);
  return tsTag === "ArrayBuffer" ? "binary" : tsTag;
}
function getUint8Array(a) {
  if (a instanceof Uint8Array)
    return a;
  if (ArrayBuffer.isView(a))
    return new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
  return new Uint8Array(a);
}
var Collection = function() {
  function Collection2() {
  }
  Collection2.prototype._read = function(fn, cb) {
    var ctx = this._ctx;
    return ctx.error ? ctx.table._trans(null, rejection.bind(null, ctx.error)) : ctx.table._trans("readonly", fn).then(cb);
  };
  Collection2.prototype._write = function(fn) {
    var ctx = this._ctx;
    return ctx.error ? ctx.table._trans(null, rejection.bind(null, ctx.error)) : ctx.table._trans("readwrite", fn, "locked");
  };
  Collection2.prototype._addAlgorithm = function(fn) {
    var ctx = this._ctx;
    ctx.algorithm = combine(ctx.algorithm, fn);
  };
  Collection2.prototype._iterate = function(fn, coreTrans) {
    return iter(this._ctx, fn, coreTrans, this._ctx.table.core);
  };
  Collection2.prototype.clone = function(props2) {
    var rv = Object.create(this.constructor.prototype), ctx = Object.create(this._ctx);
    if (props2)
      extend(ctx, props2);
    rv._ctx = ctx;
    return rv;
  };
  Collection2.prototype.raw = function() {
    this._ctx.valueMapper = null;
    return this;
  };
  Collection2.prototype.each = function(fn) {
    var ctx = this._ctx;
    return this._read(function(trans) {
      return iter(ctx, fn, trans, ctx.table.core);
    });
  };
  Collection2.prototype.count = function(cb) {
    var _this = this;
    return this._read(function(trans) {
      var ctx = _this._ctx;
      var coreTable = ctx.table.core;
      if (isPlainKeyRange(ctx, true)) {
        return coreTable.count({
          trans,
          query: {
            index: getIndexOrStore(ctx, coreTable.schema),
            range: ctx.range
          }
        }).then(function(count2) {
          return Math.min(count2, ctx.limit);
        });
      } else {
        var count = 0;
        return iter(ctx, function() {
          ++count;
          return false;
        }, trans, coreTable).then(function() {
          return count;
        });
      }
    }).then(cb);
  };
  Collection2.prototype.sortBy = function(keyPath, cb) {
    var parts = keyPath.split(".").reverse(), lastPart = parts[0], lastIndex = parts.length - 1;
    function getval(obj, i) {
      if (i)
        return getval(obj[parts[i]], i - 1);
      return obj[lastPart];
    }
    var order = this._ctx.dir === "next" ? 1 : -1;
    function sorter(a, b) {
      var aVal = getval(a, lastIndex), bVal = getval(b, lastIndex);
      return aVal < bVal ? -order : aVal > bVal ? order : 0;
    }
    return this.toArray(function(a) {
      return a.sort(sorter);
    }).then(cb);
  };
  Collection2.prototype.toArray = function(cb) {
    var _this = this;
    return this._read(function(trans) {
      var ctx = _this._ctx;
      if (ctx.dir === "next" && isPlainKeyRange(ctx, true) && ctx.limit > 0) {
        var valueMapper_1 = ctx.valueMapper;
        var index = getIndexOrStore(ctx, ctx.table.core.schema);
        return ctx.table.core.query({
          trans,
          limit: ctx.limit,
          values: true,
          query: {
            index,
            range: ctx.range
          }
        }).then(function(_a2) {
          var result = _a2.result;
          return valueMapper_1 ? result.map(valueMapper_1) : result;
        });
      } else {
        var a_1 = [];
        return iter(ctx, function(item) {
          return a_1.push(item);
        }, trans, ctx.table.core).then(function() {
          return a_1;
        });
      }
    }, cb);
  };
  Collection2.prototype.offset = function(offset) {
    var ctx = this._ctx;
    if (offset <= 0)
      return this;
    ctx.offset += offset;
    if (isPlainKeyRange(ctx)) {
      addReplayFilter(ctx, function() {
        var offsetLeft = offset;
        return function(cursor, advance) {
          if (offsetLeft === 0)
            return true;
          if (offsetLeft === 1) {
            --offsetLeft;
            return false;
          }
          advance(function() {
            cursor.advance(offsetLeft);
            offsetLeft = 0;
          });
          return false;
        };
      });
    } else {
      addReplayFilter(ctx, function() {
        var offsetLeft = offset;
        return function() {
          return --offsetLeft < 0;
        };
      });
    }
    return this;
  };
  Collection2.prototype.limit = function(numRows) {
    this._ctx.limit = Math.min(this._ctx.limit, numRows);
    addReplayFilter(this._ctx, function() {
      var rowsLeft = numRows;
      return function(cursor, advance, resolve) {
        if (--rowsLeft <= 0)
          advance(resolve);
        return rowsLeft >= 0;
      };
    }, true);
    return this;
  };
  Collection2.prototype.until = function(filterFunction, bIncludeStopEntry) {
    addFilter(this._ctx, function(cursor, advance, resolve) {
      if (filterFunction(cursor.value)) {
        advance(resolve);
        return bIncludeStopEntry;
      } else {
        return true;
      }
    });
    return this;
  };
  Collection2.prototype.first = function(cb) {
    return this.limit(1).toArray(function(a) {
      return a[0];
    }).then(cb);
  };
  Collection2.prototype.last = function(cb) {
    return this.reverse().first(cb);
  };
  Collection2.prototype.filter = function(filterFunction) {
    addFilter(this._ctx, function(cursor) {
      return filterFunction(cursor.value);
    });
    addMatchFilter(this._ctx, filterFunction);
    return this;
  };
  Collection2.prototype.and = function(filter) {
    return this.filter(filter);
  };
  Collection2.prototype.or = function(indexName) {
    return new this.db.WhereClause(this._ctx.table, indexName, this);
  };
  Collection2.prototype.reverse = function() {
    this._ctx.dir = this._ctx.dir === "prev" ? "next" : "prev";
    if (this._ondirectionchange)
      this._ondirectionchange(this._ctx.dir);
    return this;
  };
  Collection2.prototype.desc = function() {
    return this.reverse();
  };
  Collection2.prototype.eachKey = function(cb) {
    var ctx = this._ctx;
    ctx.keysOnly = !ctx.isMatch;
    return this.each(function(val, cursor) {
      cb(cursor.key, cursor);
    });
  };
  Collection2.prototype.eachUniqueKey = function(cb) {
    this._ctx.unique = "unique";
    return this.eachKey(cb);
  };
  Collection2.prototype.eachPrimaryKey = function(cb) {
    var ctx = this._ctx;
    ctx.keysOnly = !ctx.isMatch;
    return this.each(function(val, cursor) {
      cb(cursor.primaryKey, cursor);
    });
  };
  Collection2.prototype.keys = function(cb) {
    var ctx = this._ctx;
    ctx.keysOnly = !ctx.isMatch;
    var a = [];
    return this.each(function(item, cursor) {
      a.push(cursor.key);
    }).then(function() {
      return a;
    }).then(cb);
  };
  Collection2.prototype.primaryKeys = function(cb) {
    var ctx = this._ctx;
    if (ctx.dir === "next" && isPlainKeyRange(ctx, true) && ctx.limit > 0) {
      return this._read(function(trans) {
        var index = getIndexOrStore(ctx, ctx.table.core.schema);
        return ctx.table.core.query({
          trans,
          values: false,
          limit: ctx.limit,
          query: {
            index,
            range: ctx.range
          }
        });
      }).then(function(_a2) {
        var result = _a2.result;
        return result;
      }).then(cb);
    }
    ctx.keysOnly = !ctx.isMatch;
    var a = [];
    return this.each(function(item, cursor) {
      a.push(cursor.primaryKey);
    }).then(function() {
      return a;
    }).then(cb);
  };
  Collection2.prototype.uniqueKeys = function(cb) {
    this._ctx.unique = "unique";
    return this.keys(cb);
  };
  Collection2.prototype.firstKey = function(cb) {
    return this.limit(1).keys(function(a) {
      return a[0];
    }).then(cb);
  };
  Collection2.prototype.lastKey = function(cb) {
    return this.reverse().firstKey(cb);
  };
  Collection2.prototype.distinct = function() {
    var ctx = this._ctx, idx = ctx.index && ctx.table.schema.idxByName[ctx.index];
    if (!idx || !idx.multi)
      return this;
    var set = {};
    addFilter(this._ctx, function(cursor) {
      var strKey = cursor.primaryKey.toString();
      var found = hasOwn(set, strKey);
      set[strKey] = true;
      return !found;
    });
    return this;
  };
  Collection2.prototype.modify = function(changes) {
    var _this = this;
    var ctx = this._ctx;
    return this._write(function(trans) {
      var modifyer;
      if (typeof changes === "function") {
        modifyer = changes;
      } else {
        var keyPaths = keys(changes);
        var numKeys = keyPaths.length;
        modifyer = function(item) {
          var anythingModified = false;
          for (var i = 0; i < numKeys; ++i) {
            var keyPath = keyPaths[i], val = changes[keyPath];
            if (getByKeyPath(item, keyPath) !== val) {
              setByKeyPath(item, keyPath, val);
              anythingModified = true;
            }
          }
          return anythingModified;
        };
      }
      var coreTable = ctx.table.core;
      var _a2 = coreTable.schema.primaryKey, outbound = _a2.outbound, extractKey = _a2.extractKey;
      var limit = _this.db._options.modifyChunkSize || 200;
      var totalFailures = [];
      var successCount = 0;
      var failedKeys = [];
      var applyMutateResult = function(expectedCount, res) {
        var failures = res.failures, numFailures = res.numFailures;
        successCount += expectedCount - numFailures;
        for (var _i = 0, _a3 = keys(failures); _i < _a3.length; _i++) {
          var pos = _a3[_i];
          totalFailures.push(failures[pos]);
        }
      };
      return _this.clone().primaryKeys().then(function(keys2) {
        var nextChunk = function(offset) {
          var count = Math.min(limit, keys2.length - offset);
          return coreTable.getMany({
            trans,
            keys: keys2.slice(offset, offset + count),
            cache: "immutable"
          }).then(function(values) {
            var addValues = [];
            var putValues = [];
            var putKeys = outbound ? [] : null;
            var deleteKeys = [];
            for (var i = 0; i < count; ++i) {
              var origValue = values[i];
              var ctx_1 = {
                value: deepClone(origValue),
                primKey: keys2[offset + i]
              };
              if (modifyer.call(ctx_1, ctx_1.value, ctx_1) !== false) {
                if (ctx_1.value == null) {
                  deleteKeys.push(keys2[offset + i]);
                } else if (!outbound && cmp(extractKey(origValue), extractKey(ctx_1.value)) !== 0) {
                  deleteKeys.push(keys2[offset + i]);
                  addValues.push(ctx_1.value);
                } else {
                  putValues.push(ctx_1.value);
                  if (outbound)
                    putKeys.push(keys2[offset + i]);
                }
              }
            }
            var criteria = isPlainKeyRange(ctx) && ctx.limit === Infinity && (typeof changes !== "function" || changes === deleteCallback) && {
              index: ctx.index,
              range: ctx.range
            };
            return Promise.resolve(addValues.length > 0 && coreTable.mutate({ trans, type: "add", values: addValues }).then(function(res) {
              for (var pos in res.failures) {
                deleteKeys.splice(parseInt(pos), 1);
              }
              applyMutateResult(addValues.length, res);
            })).then(function() {
              return (putValues.length > 0 || criteria && typeof changes === "object") && coreTable.mutate({
                trans,
                type: "put",
                keys: putKeys,
                values: putValues,
                criteria,
                changeSpec: typeof changes !== "function" && changes
              }).then(function(res) {
                return applyMutateResult(putValues.length, res);
              });
            }).then(function() {
              return (deleteKeys.length > 0 || criteria && changes === deleteCallback) && coreTable.mutate({
                trans,
                type: "delete",
                keys: deleteKeys,
                criteria
              }).then(function(res) {
                return applyMutateResult(deleteKeys.length, res);
              });
            }).then(function() {
              return keys2.length > offset + count && nextChunk(offset + limit);
            });
          });
        };
        return nextChunk(0).then(function() {
          if (totalFailures.length > 0)
            throw new ModifyError("Error modifying one or more objects", totalFailures, successCount, failedKeys);
          return keys2.length;
        });
      });
    });
  };
  Collection2.prototype.delete = function() {
    var ctx = this._ctx, range = ctx.range;
    if (isPlainKeyRange(ctx) && (ctx.isPrimKey && !hangsOnDeleteLargeKeyRange || range.type === 3)) {
      return this._write(function(trans) {
        var primaryKey = ctx.table.core.schema.primaryKey;
        var coreRange = range;
        return ctx.table.core.count({ trans, query: { index: primaryKey, range: coreRange } }).then(function(count) {
          return ctx.table.core.mutate({ trans, type: "deleteRange", range: coreRange }).then(function(_a2) {
            var failures = _a2.failures;
            _a2.lastResult;
            _a2.results;
            var numFailures = _a2.numFailures;
            if (numFailures)
              throw new ModifyError("Could not delete some values", Object.keys(failures).map(function(pos) {
                return failures[pos];
              }), count - numFailures);
            return count - numFailures;
          });
        });
      });
    }
    return this.modify(deleteCallback);
  };
  return Collection2;
}();
var deleteCallback = function(value, ctx) {
  return ctx.value = null;
};
function createCollectionConstructor(db) {
  return makeClassConstructor(Collection.prototype, function Collection2(whereClause, keyRangeGenerator) {
    this.db = db;
    var keyRange = AnyRange, error = null;
    if (keyRangeGenerator)
      try {
        keyRange = keyRangeGenerator();
      } catch (ex) {
        error = ex;
      }
    var whereCtx = whereClause._ctx;
    var table = whereCtx.table;
    var readingHook = table.hook.reading.fire;
    this._ctx = {
      table,
      index: whereCtx.index,
      isPrimKey: !whereCtx.index || table.schema.primKey.keyPath && whereCtx.index === table.schema.primKey.name,
      range: keyRange,
      keysOnly: false,
      dir: "next",
      unique: "",
      algorithm: null,
      filter: null,
      replayFilter: null,
      justLimit: true,
      isMatch: null,
      offset: 0,
      limit: Infinity,
      error,
      or: whereCtx.or,
      valueMapper: readingHook !== mirror ? readingHook : null
    };
  });
}
function simpleCompare(a, b) {
  return a < b ? -1 : a === b ? 0 : 1;
}
function simpleCompareReverse(a, b) {
  return a > b ? -1 : a === b ? 0 : 1;
}
function fail(collectionOrWhereClause, err, T) {
  var collection = collectionOrWhereClause instanceof WhereClause ? new collectionOrWhereClause.Collection(collectionOrWhereClause) : collectionOrWhereClause;
  collection._ctx.error = T ? new T(err) : new TypeError(err);
  return collection;
}
function emptyCollection(whereClause) {
  return new whereClause.Collection(whereClause, function() {
    return rangeEqual("");
  }).limit(0);
}
function upperFactory(dir) {
  return dir === "next" ? function(s) {
    return s.toUpperCase();
  } : function(s) {
    return s.toLowerCase();
  };
}
function lowerFactory(dir) {
  return dir === "next" ? function(s) {
    return s.toLowerCase();
  } : function(s) {
    return s.toUpperCase();
  };
}
function nextCasing(key, lowerKey, upperNeedle, lowerNeedle, cmp2, dir) {
  var length = Math.min(key.length, lowerNeedle.length);
  var llp = -1;
  for (var i = 0; i < length; ++i) {
    var lwrKeyChar = lowerKey[i];
    if (lwrKeyChar !== lowerNeedle[i]) {
      if (cmp2(key[i], upperNeedle[i]) < 0)
        return key.substr(0, i) + upperNeedle[i] + upperNeedle.substr(i + 1);
      if (cmp2(key[i], lowerNeedle[i]) < 0)
        return key.substr(0, i) + lowerNeedle[i] + upperNeedle.substr(i + 1);
      if (llp >= 0)
        return key.substr(0, llp) + lowerKey[llp] + upperNeedle.substr(llp + 1);
      return null;
    }
    if (cmp2(key[i], lwrKeyChar) < 0)
      llp = i;
  }
  if (length < lowerNeedle.length && dir === "next")
    return key + upperNeedle.substr(key.length);
  if (length < key.length && dir === "prev")
    return key.substr(0, upperNeedle.length);
  return llp < 0 ? null : key.substr(0, llp) + lowerNeedle[llp] + upperNeedle.substr(llp + 1);
}
function addIgnoreCaseAlgorithm(whereClause, match, needles, suffix) {
  var upper, lower, compare, upperNeedles, lowerNeedles, direction, nextKeySuffix, needlesLen = needles.length;
  if (!needles.every(function(s) {
    return typeof s === "string";
  })) {
    return fail(whereClause, STRING_EXPECTED);
  }
  function initDirection(dir) {
    upper = upperFactory(dir);
    lower = lowerFactory(dir);
    compare = dir === "next" ? simpleCompare : simpleCompareReverse;
    var needleBounds = needles.map(function(needle) {
      return { lower: lower(needle), upper: upper(needle) };
    }).sort(function(a, b) {
      return compare(a.lower, b.lower);
    });
    upperNeedles = needleBounds.map(function(nb) {
      return nb.upper;
    });
    lowerNeedles = needleBounds.map(function(nb) {
      return nb.lower;
    });
    direction = dir;
    nextKeySuffix = dir === "next" ? "" : suffix;
  }
  initDirection("next");
  var c = new whereClause.Collection(whereClause, function() {
    return createRange(upperNeedles[0], lowerNeedles[needlesLen - 1] + suffix);
  });
  c._ondirectionchange = function(direction2) {
    initDirection(direction2);
  };
  var firstPossibleNeedle = 0;
  c._addAlgorithm(function(cursor, advance, resolve) {
    var key = cursor.key;
    if (typeof key !== "string")
      return false;
    var lowerKey = lower(key);
    if (match(lowerKey, lowerNeedles, firstPossibleNeedle)) {
      return true;
    } else {
      var lowestPossibleCasing = null;
      for (var i = firstPossibleNeedle; i < needlesLen; ++i) {
        var casing = nextCasing(key, lowerKey, upperNeedles[i], lowerNeedles[i], compare, direction);
        if (casing === null && lowestPossibleCasing === null)
          firstPossibleNeedle = i + 1;
        else if (lowestPossibleCasing === null || compare(lowestPossibleCasing, casing) > 0) {
          lowestPossibleCasing = casing;
        }
      }
      if (lowestPossibleCasing !== null) {
        advance(function() {
          cursor.continue(lowestPossibleCasing + nextKeySuffix);
        });
      } else {
        advance(resolve);
      }
      return false;
    }
  });
  return c;
}
function createRange(lower, upper, lowerOpen, upperOpen) {
  return {
    type: 2,
    lower,
    upper,
    lowerOpen,
    upperOpen
  };
}
function rangeEqual(value) {
  return {
    type: 1,
    lower: value,
    upper: value
  };
}
var WhereClause = function() {
  function WhereClause2() {
  }
  Object.defineProperty(WhereClause2.prototype, "Collection", {
    get: function() {
      return this._ctx.table.db.Collection;
    },
    enumerable: false,
    configurable: true
  });
  WhereClause2.prototype.between = function(lower, upper, includeLower, includeUpper) {
    includeLower = includeLower !== false;
    includeUpper = includeUpper === true;
    try {
      if (this._cmp(lower, upper) > 0 || this._cmp(lower, upper) === 0 && (includeLower || includeUpper) && !(includeLower && includeUpper))
        return emptyCollection(this);
      return new this.Collection(this, function() {
        return createRange(lower, upper, !includeLower, !includeUpper);
      });
    } catch (e) {
      return fail(this, INVALID_KEY_ARGUMENT);
    }
  };
  WhereClause2.prototype.equals = function(value) {
    if (value == null)
      return fail(this, INVALID_KEY_ARGUMENT);
    return new this.Collection(this, function() {
      return rangeEqual(value);
    });
  };
  WhereClause2.prototype.above = function(value) {
    if (value == null)
      return fail(this, INVALID_KEY_ARGUMENT);
    return new this.Collection(this, function() {
      return createRange(value, void 0, true);
    });
  };
  WhereClause2.prototype.aboveOrEqual = function(value) {
    if (value == null)
      return fail(this, INVALID_KEY_ARGUMENT);
    return new this.Collection(this, function() {
      return createRange(value, void 0, false);
    });
  };
  WhereClause2.prototype.below = function(value) {
    if (value == null)
      return fail(this, INVALID_KEY_ARGUMENT);
    return new this.Collection(this, function() {
      return createRange(void 0, value, false, true);
    });
  };
  WhereClause2.prototype.belowOrEqual = function(value) {
    if (value == null)
      return fail(this, INVALID_KEY_ARGUMENT);
    return new this.Collection(this, function() {
      return createRange(void 0, value);
    });
  };
  WhereClause2.prototype.startsWith = function(str) {
    if (typeof str !== "string")
      return fail(this, STRING_EXPECTED);
    return this.between(str, str + maxString, true, true);
  };
  WhereClause2.prototype.startsWithIgnoreCase = function(str) {
    if (str === "")
      return this.startsWith(str);
    return addIgnoreCaseAlgorithm(this, function(x, a) {
      return x.indexOf(a[0]) === 0;
    }, [str], maxString);
  };
  WhereClause2.prototype.equalsIgnoreCase = function(str) {
    return addIgnoreCaseAlgorithm(this, function(x, a) {
      return x === a[0];
    }, [str], "");
  };
  WhereClause2.prototype.anyOfIgnoreCase = function() {
    var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
    if (set.length === 0)
      return emptyCollection(this);
    return addIgnoreCaseAlgorithm(this, function(x, a) {
      return a.indexOf(x) !== -1;
    }, set, "");
  };
  WhereClause2.prototype.startsWithAnyOfIgnoreCase = function() {
    var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
    if (set.length === 0)
      return emptyCollection(this);
    return addIgnoreCaseAlgorithm(this, function(x, a) {
      return a.some(function(n) {
        return x.indexOf(n) === 0;
      });
    }, set, maxString);
  };
  WhereClause2.prototype.anyOf = function() {
    var _this = this;
    var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
    var compare = this._cmp;
    try {
      set.sort(compare);
    } catch (e) {
      return fail(this, INVALID_KEY_ARGUMENT);
    }
    if (set.length === 0)
      return emptyCollection(this);
    var c = new this.Collection(this, function() {
      return createRange(set[0], set[set.length - 1]);
    });
    c._ondirectionchange = function(direction) {
      compare = direction === "next" ? _this._ascending : _this._descending;
      set.sort(compare);
    };
    var i = 0;
    c._addAlgorithm(function(cursor, advance, resolve) {
      var key = cursor.key;
      while (compare(key, set[i]) > 0) {
        ++i;
        if (i === set.length) {
          advance(resolve);
          return false;
        }
      }
      if (compare(key, set[i]) === 0) {
        return true;
      } else {
        advance(function() {
          cursor.continue(set[i]);
        });
        return false;
      }
    });
    return c;
  };
  WhereClause2.prototype.notEqual = function(value) {
    return this.inAnyRange([[minKey, value], [value, this.db._maxKey]], { includeLowers: false, includeUppers: false });
  };
  WhereClause2.prototype.noneOf = function() {
    var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
    if (set.length === 0)
      return new this.Collection(this);
    try {
      set.sort(this._ascending);
    } catch (e) {
      return fail(this, INVALID_KEY_ARGUMENT);
    }
    var ranges = set.reduce(function(res, val) {
      return res ? res.concat([[res[res.length - 1][1], val]]) : [[minKey, val]];
    }, null);
    ranges.push([set[set.length - 1], this.db._maxKey]);
    return this.inAnyRange(ranges, { includeLowers: false, includeUppers: false });
  };
  WhereClause2.prototype.inAnyRange = function(ranges, options) {
    var _this = this;
    var cmp2 = this._cmp, ascending = this._ascending, descending = this._descending, min = this._min, max = this._max;
    if (ranges.length === 0)
      return emptyCollection(this);
    if (!ranges.every(function(range) {
      return range[0] !== void 0 && range[1] !== void 0 && ascending(range[0], range[1]) <= 0;
    })) {
      return fail(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", exceptions.InvalidArgument);
    }
    var includeLowers = !options || options.includeLowers !== false;
    var includeUppers = options && options.includeUppers === true;
    function addRange2(ranges2, newRange) {
      var i = 0, l = ranges2.length;
      for (; i < l; ++i) {
        var range = ranges2[i];
        if (cmp2(newRange[0], range[1]) < 0 && cmp2(newRange[1], range[0]) > 0) {
          range[0] = min(range[0], newRange[0]);
          range[1] = max(range[1], newRange[1]);
          break;
        }
      }
      if (i === l)
        ranges2.push(newRange);
      return ranges2;
    }
    var sortDirection = ascending;
    function rangeSorter(a, b) {
      return sortDirection(a[0], b[0]);
    }
    var set;
    try {
      set = ranges.reduce(addRange2, []);
      set.sort(rangeSorter);
    } catch (ex) {
      return fail(this, INVALID_KEY_ARGUMENT);
    }
    var rangePos = 0;
    var keyIsBeyondCurrentEntry = includeUppers ? function(key) {
      return ascending(key, set[rangePos][1]) > 0;
    } : function(key) {
      return ascending(key, set[rangePos][1]) >= 0;
    };
    var keyIsBeforeCurrentEntry = includeLowers ? function(key) {
      return descending(key, set[rangePos][0]) > 0;
    } : function(key) {
      return descending(key, set[rangePos][0]) >= 0;
    };
    function keyWithinCurrentRange(key) {
      return !keyIsBeyondCurrentEntry(key) && !keyIsBeforeCurrentEntry(key);
    }
    var checkKey = keyIsBeyondCurrentEntry;
    var c = new this.Collection(this, function() {
      return createRange(set[0][0], set[set.length - 1][1], !includeLowers, !includeUppers);
    });
    c._ondirectionchange = function(direction) {
      if (direction === "next") {
        checkKey = keyIsBeyondCurrentEntry;
        sortDirection = ascending;
      } else {
        checkKey = keyIsBeforeCurrentEntry;
        sortDirection = descending;
      }
      set.sort(rangeSorter);
    };
    c._addAlgorithm(function(cursor, advance, resolve) {
      var key = cursor.key;
      while (checkKey(key)) {
        ++rangePos;
        if (rangePos === set.length) {
          advance(resolve);
          return false;
        }
      }
      if (keyWithinCurrentRange(key)) {
        return true;
      } else if (_this._cmp(key, set[rangePos][1]) === 0 || _this._cmp(key, set[rangePos][0]) === 0) {
        return false;
      } else {
        advance(function() {
          if (sortDirection === ascending)
            cursor.continue(set[rangePos][0]);
          else
            cursor.continue(set[rangePos][1]);
        });
        return false;
      }
    });
    return c;
  };
  WhereClause2.prototype.startsWithAnyOf = function() {
    var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
    if (!set.every(function(s) {
      return typeof s === "string";
    })) {
      return fail(this, "startsWithAnyOf() only works with strings");
    }
    if (set.length === 0)
      return emptyCollection(this);
    return this.inAnyRange(set.map(function(str) {
      return [str, str + maxString];
    }));
  };
  return WhereClause2;
}();
function createWhereClauseConstructor(db) {
  return makeClassConstructor(WhereClause.prototype, function WhereClause2(table, index, orCollection) {
    this.db = db;
    this._ctx = {
      table,
      index: index === ":id" ? null : index,
      or: orCollection
    };
    var indexedDB2 = db._deps.indexedDB;
    if (!indexedDB2)
      throw new exceptions.MissingAPI();
    this._cmp = this._ascending = indexedDB2.cmp.bind(indexedDB2);
    this._descending = function(a, b) {
      return indexedDB2.cmp(b, a);
    };
    this._max = function(a, b) {
      return indexedDB2.cmp(a, b) > 0 ? a : b;
    };
    this._min = function(a, b) {
      return indexedDB2.cmp(a, b) < 0 ? a : b;
    };
    this._IDBKeyRange = db._deps.IDBKeyRange;
  });
}
function eventRejectHandler(reject) {
  return wrap(function(event) {
    preventDefault(event);
    reject(event.target.error);
    return false;
  });
}
function preventDefault(event) {
  if (event.stopPropagation)
    event.stopPropagation();
  if (event.preventDefault)
    event.preventDefault();
}
var DEXIE_STORAGE_MUTATED_EVENT_NAME = "storagemutated";
var STORAGE_MUTATED_DOM_EVENT_NAME = "x-storagemutated-1";
var globalEvents = Events(null, DEXIE_STORAGE_MUTATED_EVENT_NAME);
var Transaction = function() {
  function Transaction2() {
  }
  Transaction2.prototype._lock = function() {
    assert(!PSD.global);
    ++this._reculock;
    if (this._reculock === 1 && !PSD.global)
      PSD.lockOwnerFor = this;
    return this;
  };
  Transaction2.prototype._unlock = function() {
    assert(!PSD.global);
    if (--this._reculock === 0) {
      if (!PSD.global)
        PSD.lockOwnerFor = null;
      while (this._blockedFuncs.length > 0 && !this._locked()) {
        var fnAndPSD = this._blockedFuncs.shift();
        try {
          usePSD(fnAndPSD[1], fnAndPSD[0]);
        } catch (e) {
        }
      }
    }
    return this;
  };
  Transaction2.prototype._locked = function() {
    return this._reculock && PSD.lockOwnerFor !== this;
  };
  Transaction2.prototype.create = function(idbtrans) {
    var _this = this;
    if (!this.mode)
      return this;
    var idbdb = this.db.idbdb;
    var dbOpenError = this.db._state.dbOpenError;
    assert(!this.idbtrans);
    if (!idbtrans && !idbdb) {
      switch (dbOpenError && dbOpenError.name) {
        case "DatabaseClosedError":
          throw new exceptions.DatabaseClosed(dbOpenError);
        case "MissingAPIError":
          throw new exceptions.MissingAPI(dbOpenError.message, dbOpenError);
        default:
          throw new exceptions.OpenFailed(dbOpenError);
      }
    }
    if (!this.active)
      throw new exceptions.TransactionInactive();
    assert(this._completion._state === null);
    idbtrans = this.idbtrans = idbtrans || (this.db.core ? this.db.core.transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability }) : idbdb.transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability }));
    idbtrans.onerror = wrap(function(ev) {
      preventDefault(ev);
      _this._reject(idbtrans.error);
    });
    idbtrans.onabort = wrap(function(ev) {
      preventDefault(ev);
      _this.active && _this._reject(new exceptions.Abort(idbtrans.error));
      _this.active = false;
      _this.on("abort").fire(ev);
    });
    idbtrans.oncomplete = wrap(function() {
      _this.active = false;
      _this._resolve();
      if ("mutatedParts" in idbtrans) {
        globalEvents.storagemutated.fire(idbtrans["mutatedParts"]);
      }
    });
    return this;
  };
  Transaction2.prototype._promise = function(mode, fn, bWriteLock) {
    var _this = this;
    if (mode === "readwrite" && this.mode !== "readwrite")
      return rejection(new exceptions.ReadOnly("Transaction is readonly"));
    if (!this.active)
      return rejection(new exceptions.TransactionInactive());
    if (this._locked()) {
      return new DexiePromise(function(resolve, reject) {
        _this._blockedFuncs.push([function() {
          _this._promise(mode, fn, bWriteLock).then(resolve, reject);
        }, PSD]);
      });
    } else if (bWriteLock) {
      return newScope(function() {
        var p2 = new DexiePromise(function(resolve, reject) {
          _this._lock();
          var rv = fn(resolve, reject, _this);
          if (rv && rv.then)
            rv.then(resolve, reject);
        });
        p2.finally(function() {
          return _this._unlock();
        });
        p2._lib = true;
        return p2;
      });
    } else {
      var p = new DexiePromise(function(resolve, reject) {
        var rv = fn(resolve, reject, _this);
        if (rv && rv.then)
          rv.then(resolve, reject);
      });
      p._lib = true;
      return p;
    }
  };
  Transaction2.prototype._root = function() {
    return this.parent ? this.parent._root() : this;
  };
  Transaction2.prototype.waitFor = function(promiseLike) {
    var root = this._root();
    var promise = DexiePromise.resolve(promiseLike);
    if (root._waitingFor) {
      root._waitingFor = root._waitingFor.then(function() {
        return promise;
      });
    } else {
      root._waitingFor = promise;
      root._waitingQueue = [];
      var store = root.idbtrans.objectStore(root.storeNames[0]);
      (function spin() {
        ++root._spinCount;
        while (root._waitingQueue.length)
          root._waitingQueue.shift()();
        if (root._waitingFor)
          store.get(-Infinity).onsuccess = spin;
      })();
    }
    var currentWaitPromise = root._waitingFor;
    return new DexiePromise(function(resolve, reject) {
      promise.then(function(res) {
        return root._waitingQueue.push(wrap(resolve.bind(null, res)));
      }, function(err) {
        return root._waitingQueue.push(wrap(reject.bind(null, err)));
      }).finally(function() {
        if (root._waitingFor === currentWaitPromise) {
          root._waitingFor = null;
        }
      });
    });
  };
  Transaction2.prototype.abort = function() {
    if (this.active) {
      this.active = false;
      if (this.idbtrans)
        this.idbtrans.abort();
      this._reject(new exceptions.Abort());
    }
  };
  Transaction2.prototype.table = function(tableName) {
    var memoizedTables = this._memoizedTables || (this._memoizedTables = {});
    if (hasOwn(memoizedTables, tableName))
      return memoizedTables[tableName];
    var tableSchema = this.schema[tableName];
    if (!tableSchema) {
      throw new exceptions.NotFound("Table " + tableName + " not part of transaction");
    }
    var transactionBoundTable = new this.db.Table(tableName, tableSchema, this);
    transactionBoundTable.core = this.db.core.table(tableName);
    memoizedTables[tableName] = transactionBoundTable;
    return transactionBoundTable;
  };
  return Transaction2;
}();
function createTransactionConstructor(db) {
  return makeClassConstructor(Transaction.prototype, function Transaction2(mode, storeNames, dbschema, chromeTransactionDurability, parent) {
    var _this = this;
    this.db = db;
    this.mode = mode;
    this.storeNames = storeNames;
    this.schema = dbschema;
    this.chromeTransactionDurability = chromeTransactionDurability;
    this.idbtrans = null;
    this.on = Events(this, "complete", "error", "abort");
    this.parent = parent || null;
    this.active = true;
    this._reculock = 0;
    this._blockedFuncs = [];
    this._resolve = null;
    this._reject = null;
    this._waitingFor = null;
    this._waitingQueue = null;
    this._spinCount = 0;
    this._completion = new DexiePromise(function(resolve, reject) {
      _this._resolve = resolve;
      _this._reject = reject;
    });
    this._completion.then(function() {
      _this.active = false;
      _this.on.complete.fire();
    }, function(e) {
      var wasActive = _this.active;
      _this.active = false;
      _this.on.error.fire(e);
      _this.parent ? _this.parent._reject(e) : wasActive && _this.idbtrans && _this.idbtrans.abort();
      return rejection(e);
    });
  });
}
function createIndexSpec(name, keyPath, unique, multi, auto, compound, isPrimKey) {
  return {
    name,
    keyPath,
    unique,
    multi,
    auto,
    compound,
    src: (unique && !isPrimKey ? "&" : "") + (multi ? "*" : "") + (auto ? "++" : "") + nameFromKeyPath(keyPath)
  };
}
function nameFromKeyPath(keyPath) {
  return typeof keyPath === "string" ? keyPath : keyPath ? "[" + [].join.call(keyPath, "+") + "]" : "";
}
function createTableSchema(name, primKey, indexes) {
  return {
    name,
    primKey,
    indexes,
    mappedClass: null,
    idxByName: arrayToObject(indexes, function(index) {
      return [index.name, index];
    })
  };
}
function safariMultiStoreFix(storeNames) {
  return storeNames.length === 1 ? storeNames[0] : storeNames;
}
var getMaxKey = function(IdbKeyRange) {
  try {
    IdbKeyRange.only([[]]);
    getMaxKey = function() {
      return [[]];
    };
    return [[]];
  } catch (e) {
    getMaxKey = function() {
      return maxString;
    };
    return maxString;
  }
};
function getKeyExtractor(keyPath) {
  if (keyPath == null) {
    return function() {
      return void 0;
    };
  } else if (typeof keyPath === "string") {
    return getSinglePathKeyExtractor(keyPath);
  } else {
    return function(obj) {
      return getByKeyPath(obj, keyPath);
    };
  }
}
function getSinglePathKeyExtractor(keyPath) {
  var split = keyPath.split(".");
  if (split.length === 1) {
    return function(obj) {
      return obj[keyPath];
    };
  } else {
    return function(obj) {
      return getByKeyPath(obj, keyPath);
    };
  }
}
function arrayify(arrayLike) {
  return [].slice.call(arrayLike);
}
var _id_counter = 0;
function getKeyPathAlias(keyPath) {
  return keyPath == null ? ":id" : typeof keyPath === "string" ? keyPath : "[" + keyPath.join("+") + "]";
}
function createDBCore(db, IdbKeyRange, tmpTrans) {
  function extractSchema(db2, trans) {
    var tables2 = arrayify(db2.objectStoreNames);
    return {
      schema: {
        name: db2.name,
        tables: tables2.map(function(table) {
          return trans.objectStore(table);
        }).map(function(store) {
          var keyPath = store.keyPath, autoIncrement = store.autoIncrement;
          var compound = isArray(keyPath);
          var outbound = keyPath == null;
          var indexByKeyPath = {};
          var result = {
            name: store.name,
            primaryKey: {
              name: null,
              isPrimaryKey: true,
              outbound,
              compound,
              keyPath,
              autoIncrement,
              unique: true,
              extractKey: getKeyExtractor(keyPath)
            },
            indexes: arrayify(store.indexNames).map(function(indexName) {
              return store.index(indexName);
            }).map(function(index) {
              var name = index.name, unique = index.unique, multiEntry = index.multiEntry, keyPath2 = index.keyPath;
              var compound2 = isArray(keyPath2);
              var result2 = {
                name,
                compound: compound2,
                keyPath: keyPath2,
                unique,
                multiEntry,
                extractKey: getKeyExtractor(keyPath2)
              };
              indexByKeyPath[getKeyPathAlias(keyPath2)] = result2;
              return result2;
            }),
            getIndexByKeyPath: function(keyPath2) {
              return indexByKeyPath[getKeyPathAlias(keyPath2)];
            }
          };
          indexByKeyPath[":id"] = result.primaryKey;
          if (keyPath != null) {
            indexByKeyPath[getKeyPathAlias(keyPath)] = result.primaryKey;
          }
          return result;
        })
      },
      hasGetAll: tables2.length > 0 && "getAll" in trans.objectStore(tables2[0]) && !(typeof navigator !== "undefined" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604)
    };
  }
  function makeIDBKeyRange(range) {
    if (range.type === 3)
      return null;
    if (range.type === 4)
      throw new Error("Cannot convert never type to IDBKeyRange");
    var lower = range.lower, upper = range.upper, lowerOpen = range.lowerOpen, upperOpen = range.upperOpen;
    var idbRange = lower === void 0 ? upper === void 0 ? null : IdbKeyRange.upperBound(upper, !!upperOpen) : upper === void 0 ? IdbKeyRange.lowerBound(lower, !!lowerOpen) : IdbKeyRange.bound(lower, upper, !!lowerOpen, !!upperOpen);
    return idbRange;
  }
  function createDbCoreTable(tableSchema) {
    var tableName = tableSchema.name;
    function mutate(_a3) {
      var trans = _a3.trans, type2 = _a3.type, keys2 = _a3.keys, values = _a3.values, range = _a3.range;
      return new Promise(function(resolve, reject) {
        resolve = wrap(resolve);
        var store = trans.objectStore(tableName);
        var outbound = store.keyPath == null;
        var isAddOrPut = type2 === "put" || type2 === "add";
        if (!isAddOrPut && type2 !== "delete" && type2 !== "deleteRange")
          throw new Error("Invalid operation type: " + type2);
        var length = (keys2 || values || { length: 1 }).length;
        if (keys2 && values && keys2.length !== values.length) {
          throw new Error("Given keys array must have same length as given values array.");
        }
        if (length === 0)
          return resolve({ numFailures: 0, failures: {}, results: [], lastResult: void 0 });
        var req;
        var reqs = [];
        var failures = [];
        var numFailures = 0;
        var errorHandler = function(event) {
          ++numFailures;
          preventDefault(event);
        };
        if (type2 === "deleteRange") {
          if (range.type === 4)
            return resolve({ numFailures, failures, results: [], lastResult: void 0 });
          if (range.type === 3)
            reqs.push(req = store.clear());
          else
            reqs.push(req = store.delete(makeIDBKeyRange(range)));
        } else {
          var _a4 = isAddOrPut ? outbound ? [values, keys2] : [values, null] : [keys2, null], args1 = _a4[0], args2 = _a4[1];
          if (isAddOrPut) {
            for (var i = 0; i < length; ++i) {
              reqs.push(req = args2 && args2[i] !== void 0 ? store[type2](args1[i], args2[i]) : store[type2](args1[i]));
              req.onerror = errorHandler;
            }
          } else {
            for (var i = 0; i < length; ++i) {
              reqs.push(req = store[type2](args1[i]));
              req.onerror = errorHandler;
            }
          }
        }
        var done = function(event) {
          var lastResult = event.target.result;
          reqs.forEach(function(req2, i2) {
            return req2.error != null && (failures[i2] = req2.error);
          });
          resolve({
            numFailures,
            failures,
            results: type2 === "delete" ? keys2 : reqs.map(function(req2) {
              return req2.result;
            }),
            lastResult
          });
        };
        req.onerror = function(event) {
          errorHandler(event);
          done(event);
        };
        req.onsuccess = done;
      });
    }
    function openCursor2(_a3) {
      var trans = _a3.trans, values = _a3.values, query2 = _a3.query, reverse = _a3.reverse, unique = _a3.unique;
      return new Promise(function(resolve, reject) {
        resolve = wrap(resolve);
        var index = query2.index, range = query2.range;
        var store = trans.objectStore(tableName);
        var source = index.isPrimaryKey ? store : store.index(index.name);
        var direction = reverse ? unique ? "prevunique" : "prev" : unique ? "nextunique" : "next";
        var req = values || !("openKeyCursor" in source) ? source.openCursor(makeIDBKeyRange(range), direction) : source.openKeyCursor(makeIDBKeyRange(range), direction);
        req.onerror = eventRejectHandler(reject);
        req.onsuccess = wrap(function(ev) {
          var cursor = req.result;
          if (!cursor) {
            resolve(null);
            return;
          }
          cursor.___id = ++_id_counter;
          cursor.done = false;
          var _cursorContinue = cursor.continue.bind(cursor);
          var _cursorContinuePrimaryKey = cursor.continuePrimaryKey;
          if (_cursorContinuePrimaryKey)
            _cursorContinuePrimaryKey = _cursorContinuePrimaryKey.bind(cursor);
          var _cursorAdvance = cursor.advance.bind(cursor);
          var doThrowCursorIsNotStarted = function() {
            throw new Error("Cursor not started");
          };
          var doThrowCursorIsStopped = function() {
            throw new Error("Cursor not stopped");
          };
          cursor.trans = trans;
          cursor.stop = cursor.continue = cursor.continuePrimaryKey = cursor.advance = doThrowCursorIsNotStarted;
          cursor.fail = wrap(reject);
          cursor.next = function() {
            var _this = this;
            var gotOne = 1;
            return this.start(function() {
              return gotOne-- ? _this.continue() : _this.stop();
            }).then(function() {
              return _this;
            });
          };
          cursor.start = function(callback) {
            var iterationPromise = new Promise(function(resolveIteration, rejectIteration) {
              resolveIteration = wrap(resolveIteration);
              req.onerror = eventRejectHandler(rejectIteration);
              cursor.fail = rejectIteration;
              cursor.stop = function(value) {
                cursor.stop = cursor.continue = cursor.continuePrimaryKey = cursor.advance = doThrowCursorIsStopped;
                resolveIteration(value);
              };
            });
            var guardedCallback = function() {
              if (req.result) {
                try {
                  callback();
                } catch (err) {
                  cursor.fail(err);
                }
              } else {
                cursor.done = true;
                cursor.start = function() {
                  throw new Error("Cursor behind last entry");
                };
                cursor.stop();
              }
            };
            req.onsuccess = wrap(function(ev2) {
              req.onsuccess = guardedCallback;
              guardedCallback();
            });
            cursor.continue = _cursorContinue;
            cursor.continuePrimaryKey = _cursorContinuePrimaryKey;
            cursor.advance = _cursorAdvance;
            guardedCallback();
            return iterationPromise;
          };
          resolve(cursor);
        }, reject);
      });
    }
    function query(hasGetAll2) {
      return function(request) {
        return new Promise(function(resolve, reject) {
          resolve = wrap(resolve);
          var trans = request.trans, values = request.values, limit = request.limit, query2 = request.query;
          var nonInfinitLimit = limit === Infinity ? void 0 : limit;
          var index = query2.index, range = query2.range;
          var store = trans.objectStore(tableName);
          var source = index.isPrimaryKey ? store : store.index(index.name);
          var idbKeyRange = makeIDBKeyRange(range);
          if (limit === 0)
            return resolve({ result: [] });
          if (hasGetAll2) {
            var req = values ? source.getAll(idbKeyRange, nonInfinitLimit) : source.getAllKeys(idbKeyRange, nonInfinitLimit);
            req.onsuccess = function(event) {
              return resolve({ result: event.target.result });
            };
            req.onerror = eventRejectHandler(reject);
          } else {
            var count_1 = 0;
            var req_1 = values || !("openKeyCursor" in source) ? source.openCursor(idbKeyRange) : source.openKeyCursor(idbKeyRange);
            var result_1 = [];
            req_1.onsuccess = function(event) {
              var cursor = req_1.result;
              if (!cursor)
                return resolve({ result: result_1 });
              result_1.push(values ? cursor.value : cursor.primaryKey);
              if (++count_1 === limit)
                return resolve({ result: result_1 });
              cursor.continue();
            };
            req_1.onerror = eventRejectHandler(reject);
          }
        });
      };
    }
    return {
      name: tableName,
      schema: tableSchema,
      mutate,
      getMany: function(_a3) {
        var trans = _a3.trans, keys2 = _a3.keys;
        return new Promise(function(resolve, reject) {
          resolve = wrap(resolve);
          var store = trans.objectStore(tableName);
          var length = keys2.length;
          var result = new Array(length);
          var keyCount = 0;
          var callbackCount = 0;
          var req;
          var successHandler = function(event) {
            var req2 = event.target;
            if ((result[req2._pos] = req2.result) != null)
              ;
            if (++callbackCount === keyCount)
              resolve(result);
          };
          var errorHandler = eventRejectHandler(reject);
          for (var i = 0; i < length; ++i) {
            var key = keys2[i];
            if (key != null) {
              req = store.get(keys2[i]);
              req._pos = i;
              req.onsuccess = successHandler;
              req.onerror = errorHandler;
              ++keyCount;
            }
          }
          if (keyCount === 0)
            resolve(result);
        });
      },
      get: function(_a3) {
        var trans = _a3.trans, key = _a3.key;
        return new Promise(function(resolve, reject) {
          resolve = wrap(resolve);
          var store = trans.objectStore(tableName);
          var req = store.get(key);
          req.onsuccess = function(event) {
            return resolve(event.target.result);
          };
          req.onerror = eventRejectHandler(reject);
        });
      },
      query: query(hasGetAll),
      openCursor: openCursor2,
      count: function(_a3) {
        var query2 = _a3.query, trans = _a3.trans;
        var index = query2.index, range = query2.range;
        return new Promise(function(resolve, reject) {
          var store = trans.objectStore(tableName);
          var source = index.isPrimaryKey ? store : store.index(index.name);
          var idbKeyRange = makeIDBKeyRange(range);
          var req = idbKeyRange ? source.count(idbKeyRange) : source.count();
          req.onsuccess = wrap(function(ev) {
            return resolve(ev.target.result);
          });
          req.onerror = eventRejectHandler(reject);
        });
      }
    };
  }
  var _a2 = extractSchema(db, tmpTrans), schema = _a2.schema, hasGetAll = _a2.hasGetAll;
  var tables = schema.tables.map(function(tableSchema) {
    return createDbCoreTable(tableSchema);
  });
  var tableMap = {};
  tables.forEach(function(table) {
    return tableMap[table.name] = table;
  });
  return {
    stack: "dbcore",
    transaction: db.transaction.bind(db),
    table: function(name) {
      var result = tableMap[name];
      if (!result)
        throw new Error("Table '" + name + "' not found");
      return tableMap[name];
    },
    MIN_KEY: -Infinity,
    MAX_KEY: getMaxKey(IdbKeyRange),
    schema
  };
}
function createMiddlewareStack(stackImpl, middlewares) {
  return middlewares.reduce(function(down, _a2) {
    var create = _a2.create;
    return __assign(__assign({}, down), create(down));
  }, stackImpl);
}
function createMiddlewareStacks(middlewares, idbdb, _a2, tmpTrans) {
  var IDBKeyRange = _a2.IDBKeyRange;
  _a2.indexedDB;
  var dbcore = createMiddlewareStack(createDBCore(idbdb, IDBKeyRange, tmpTrans), middlewares.dbcore);
  return {
    dbcore
  };
}
function generateMiddlewareStacks(_a2, tmpTrans) {
  var db = _a2._novip;
  var idbdb = tmpTrans.db;
  var stacks = createMiddlewareStacks(db._middlewares, idbdb, db._deps, tmpTrans);
  db.core = stacks.dbcore;
  db.tables.forEach(function(table) {
    var tableName = table.name;
    if (db.core.schema.tables.some(function(tbl) {
      return tbl.name === tableName;
    })) {
      table.core = db.core.table(tableName);
      if (db[tableName] instanceof db.Table) {
        db[tableName].core = table.core;
      }
    }
  });
}
function setApiOnPlace(_a2, objs, tableNames, dbschema) {
  var db = _a2._novip;
  tableNames.forEach(function(tableName) {
    var schema = dbschema[tableName];
    objs.forEach(function(obj) {
      var propDesc = getPropertyDescriptor(obj, tableName);
      if (!propDesc || "value" in propDesc && propDesc.value === void 0) {
        if (obj === db.Transaction.prototype || obj instanceof db.Transaction) {
          setProp(obj, tableName, {
            get: function() {
              return this.table(tableName);
            },
            set: function(value) {
              defineProperty(this, tableName, { value, writable: true, configurable: true, enumerable: true });
            }
          });
        } else {
          obj[tableName] = new db.Table(tableName, schema);
        }
      }
    });
  });
}
function removeTablesApi(_a2, objs) {
  var db = _a2._novip;
  objs.forEach(function(obj) {
    for (var key in obj) {
      if (obj[key] instanceof db.Table)
        delete obj[key];
    }
  });
}
function lowerVersionFirst(a, b) {
  return a._cfg.version - b._cfg.version;
}
function runUpgraders(db, oldVersion, idbUpgradeTrans, reject) {
  var globalSchema = db._dbSchema;
  var trans = db._createTransaction("readwrite", db._storeNames, globalSchema);
  trans.create(idbUpgradeTrans);
  trans._completion.catch(reject);
  var rejectTransaction = trans._reject.bind(trans);
  var transless = PSD.transless || PSD;
  newScope(function() {
    PSD.trans = trans;
    PSD.transless = transless;
    if (oldVersion === 0) {
      keys(globalSchema).forEach(function(tableName) {
        createTable(idbUpgradeTrans, tableName, globalSchema[tableName].primKey, globalSchema[tableName].indexes);
      });
      generateMiddlewareStacks(db, idbUpgradeTrans);
      DexiePromise.follow(function() {
        return db.on.populate.fire(trans);
      }).catch(rejectTransaction);
    } else
      updateTablesAndIndexes(db, oldVersion, trans, idbUpgradeTrans).catch(rejectTransaction);
  });
}
function updateTablesAndIndexes(_a2, oldVersion, trans, idbUpgradeTrans) {
  var db = _a2._novip;
  var queue = [];
  var versions = db._versions;
  var globalSchema = db._dbSchema = buildGlobalSchema(db, db.idbdb, idbUpgradeTrans);
  var anyContentUpgraderHasRun = false;
  var versToRun = versions.filter(function(v) {
    return v._cfg.version >= oldVersion;
  });
  versToRun.forEach(function(version) {
    queue.push(function() {
      var oldSchema = globalSchema;
      var newSchema = version._cfg.dbschema;
      adjustToExistingIndexNames(db, oldSchema, idbUpgradeTrans);
      adjustToExistingIndexNames(db, newSchema, idbUpgradeTrans);
      globalSchema = db._dbSchema = newSchema;
      var diff = getSchemaDiff(oldSchema, newSchema);
      diff.add.forEach(function(tuple) {
        createTable(idbUpgradeTrans, tuple[0], tuple[1].primKey, tuple[1].indexes);
      });
      diff.change.forEach(function(change) {
        if (change.recreate) {
          throw new exceptions.Upgrade("Not yet support for changing primary key");
        } else {
          var store_1 = idbUpgradeTrans.objectStore(change.name);
          change.add.forEach(function(idx) {
            return addIndex(store_1, idx);
          });
          change.change.forEach(function(idx) {
            store_1.deleteIndex(idx.name);
            addIndex(store_1, idx);
          });
          change.del.forEach(function(idxName) {
            return store_1.deleteIndex(idxName);
          });
        }
      });
      var contentUpgrade = version._cfg.contentUpgrade;
      if (contentUpgrade && version._cfg.version > oldVersion) {
        generateMiddlewareStacks(db, idbUpgradeTrans);
        trans._memoizedTables = {};
        anyContentUpgraderHasRun = true;
        var upgradeSchema_1 = shallowClone(newSchema);
        diff.del.forEach(function(table) {
          upgradeSchema_1[table] = oldSchema[table];
        });
        removeTablesApi(db, [db.Transaction.prototype]);
        setApiOnPlace(db, [db.Transaction.prototype], keys(upgradeSchema_1), upgradeSchema_1);
        trans.schema = upgradeSchema_1;
        var contentUpgradeIsAsync_1 = isAsyncFunction(contentUpgrade);
        if (contentUpgradeIsAsync_1) {
          incrementExpectedAwaits();
        }
        var returnValue_1;
        var promiseFollowed = DexiePromise.follow(function() {
          returnValue_1 = contentUpgrade(trans);
          if (returnValue_1) {
            if (contentUpgradeIsAsync_1) {
              var decrementor = decrementExpectedAwaits.bind(null, null);
              returnValue_1.then(decrementor, decrementor);
            }
          }
        });
        return returnValue_1 && typeof returnValue_1.then === "function" ? DexiePromise.resolve(returnValue_1) : promiseFollowed.then(function() {
          return returnValue_1;
        });
      }
    });
    queue.push(function(idbtrans) {
      if (!anyContentUpgraderHasRun || !hasIEDeleteObjectStoreBug) {
        var newSchema = version._cfg.dbschema;
        deleteRemovedTables(newSchema, idbtrans);
      }
      removeTablesApi(db, [db.Transaction.prototype]);
      setApiOnPlace(db, [db.Transaction.prototype], db._storeNames, db._dbSchema);
      trans.schema = db._dbSchema;
    });
  });
  function runQueue() {
    return queue.length ? DexiePromise.resolve(queue.shift()(trans.idbtrans)).then(runQueue) : DexiePromise.resolve();
  }
  return runQueue().then(function() {
    createMissingTables(globalSchema, idbUpgradeTrans);
  });
}
function getSchemaDiff(oldSchema, newSchema) {
  var diff = {
    del: [],
    add: [],
    change: []
  };
  var table;
  for (table in oldSchema) {
    if (!newSchema[table])
      diff.del.push(table);
  }
  for (table in newSchema) {
    var oldDef = oldSchema[table], newDef = newSchema[table];
    if (!oldDef) {
      diff.add.push([table, newDef]);
    } else {
      var change = {
        name: table,
        def: newDef,
        recreate: false,
        del: [],
        add: [],
        change: []
      };
      if ("" + (oldDef.primKey.keyPath || "") !== "" + (newDef.primKey.keyPath || "") || oldDef.primKey.auto !== newDef.primKey.auto && !isIEOrEdge) {
        change.recreate = true;
        diff.change.push(change);
      } else {
        var oldIndexes = oldDef.idxByName;
        var newIndexes = newDef.idxByName;
        var idxName = void 0;
        for (idxName in oldIndexes) {
          if (!newIndexes[idxName])
            change.del.push(idxName);
        }
        for (idxName in newIndexes) {
          var oldIdx = oldIndexes[idxName], newIdx = newIndexes[idxName];
          if (!oldIdx)
            change.add.push(newIdx);
          else if (oldIdx.src !== newIdx.src)
            change.change.push(newIdx);
        }
        if (change.del.length > 0 || change.add.length > 0 || change.change.length > 0) {
          diff.change.push(change);
        }
      }
    }
  }
  return diff;
}
function createTable(idbtrans, tableName, primKey, indexes) {
  var store = idbtrans.db.createObjectStore(tableName, primKey.keyPath ? { keyPath: primKey.keyPath, autoIncrement: primKey.auto } : { autoIncrement: primKey.auto });
  indexes.forEach(function(idx) {
    return addIndex(store, idx);
  });
  return store;
}
function createMissingTables(newSchema, idbtrans) {
  keys(newSchema).forEach(function(tableName) {
    if (!idbtrans.db.objectStoreNames.contains(tableName)) {
      createTable(idbtrans, tableName, newSchema[tableName].primKey, newSchema[tableName].indexes);
    }
  });
}
function deleteRemovedTables(newSchema, idbtrans) {
  [].slice.call(idbtrans.db.objectStoreNames).forEach(function(storeName) {
    return newSchema[storeName] == null && idbtrans.db.deleteObjectStore(storeName);
  });
}
function addIndex(store, idx) {
  store.createIndex(idx.name, idx.keyPath, { unique: idx.unique, multiEntry: idx.multi });
}
function buildGlobalSchema(db, idbdb, tmpTrans) {
  var globalSchema = {};
  var dbStoreNames = slice(idbdb.objectStoreNames, 0);
  dbStoreNames.forEach(function(storeName) {
    var store = tmpTrans.objectStore(storeName);
    var keyPath = store.keyPath;
    var primKey = createIndexSpec(nameFromKeyPath(keyPath), keyPath || "", false, false, !!store.autoIncrement, keyPath && typeof keyPath !== "string", true);
    var indexes = [];
    for (var j = 0; j < store.indexNames.length; ++j) {
      var idbindex = store.index(store.indexNames[j]);
      keyPath = idbindex.keyPath;
      var index = createIndexSpec(idbindex.name, keyPath, !!idbindex.unique, !!idbindex.multiEntry, false, keyPath && typeof keyPath !== "string", false);
      indexes.push(index);
    }
    globalSchema[storeName] = createTableSchema(storeName, primKey, indexes);
  });
  return globalSchema;
}
function readGlobalSchema(_a2, idbdb, tmpTrans) {
  var db = _a2._novip;
  db.verno = idbdb.version / 10;
  var globalSchema = db._dbSchema = buildGlobalSchema(db, idbdb, tmpTrans);
  db._storeNames = slice(idbdb.objectStoreNames, 0);
  setApiOnPlace(db, [db._allTables], keys(globalSchema), globalSchema);
}
function verifyInstalledSchema(db, tmpTrans) {
  var installedSchema = buildGlobalSchema(db, db.idbdb, tmpTrans);
  var diff = getSchemaDiff(installedSchema, db._dbSchema);
  return !(diff.add.length || diff.change.some(function(ch) {
    return ch.add.length || ch.change.length;
  }));
}
function adjustToExistingIndexNames(_a2, schema, idbtrans) {
  var db = _a2._novip;
  var storeNames = idbtrans.db.objectStoreNames;
  for (var i = 0; i < storeNames.length; ++i) {
    var storeName = storeNames[i];
    var store = idbtrans.objectStore(storeName);
    db._hasGetAll = "getAll" in store;
    for (var j = 0; j < store.indexNames.length; ++j) {
      var indexName = store.indexNames[j];
      var keyPath = store.index(indexName).keyPath;
      var dexieName = typeof keyPath === "string" ? keyPath : "[" + slice(keyPath).join("+") + "]";
      if (schema[storeName]) {
        var indexSpec = schema[storeName].idxByName[dexieName];
        if (indexSpec) {
          indexSpec.name = indexName;
          delete schema[storeName].idxByName[dexieName];
          schema[storeName].idxByName[indexName] = indexSpec;
        }
      }
    }
  }
  if (typeof navigator !== "undefined" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && _global.WorkerGlobalScope && _global instanceof _global.WorkerGlobalScope && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604) {
    db._hasGetAll = false;
  }
}
function parseIndexSyntax(primKeyAndIndexes) {
  return primKeyAndIndexes.split(",").map(function(index, indexNum) {
    index = index.trim();
    var name = index.replace(/([&*]|\+\+)/g, "");
    var keyPath = /^\[/.test(name) ? name.match(/^\[(.*)\]$/)[1].split("+") : name;
    return createIndexSpec(name, keyPath || null, /\&/.test(index), /\*/.test(index), /\+\+/.test(index), isArray(keyPath), indexNum === 0);
  });
}
var Version = function() {
  function Version2() {
  }
  Version2.prototype._parseStoresSpec = function(stores, outSchema) {
    keys(stores).forEach(function(tableName) {
      if (stores[tableName] !== null) {
        var indexes = parseIndexSyntax(stores[tableName]);
        var primKey = indexes.shift();
        if (primKey.multi)
          throw new exceptions.Schema("Primary key cannot be multi-valued");
        indexes.forEach(function(idx) {
          if (idx.auto)
            throw new exceptions.Schema("Only primary key can be marked as autoIncrement (++)");
          if (!idx.keyPath)
            throw new exceptions.Schema("Index must have a name and cannot be an empty string");
        });
        outSchema[tableName] = createTableSchema(tableName, primKey, indexes);
      }
    });
  };
  Version2.prototype.stores = function(stores) {
    var db = this.db;
    this._cfg.storesSource = this._cfg.storesSource ? extend(this._cfg.storesSource, stores) : stores;
    var versions = db._versions;
    var storesSpec = {};
    var dbschema = {};
    versions.forEach(function(version) {
      extend(storesSpec, version._cfg.storesSource);
      dbschema = version._cfg.dbschema = {};
      version._parseStoresSpec(storesSpec, dbschema);
    });
    db._dbSchema = dbschema;
    removeTablesApi(db, [db._allTables, db, db.Transaction.prototype]);
    setApiOnPlace(db, [db._allTables, db, db.Transaction.prototype, this._cfg.tables], keys(dbschema), dbschema);
    db._storeNames = keys(dbschema);
    return this;
  };
  Version2.prototype.upgrade = function(upgradeFunction) {
    this._cfg.contentUpgrade = promisableChain(this._cfg.contentUpgrade || nop, upgradeFunction);
    return this;
  };
  return Version2;
}();
function createVersionConstructor(db) {
  return makeClassConstructor(Version.prototype, function Version2(versionNumber) {
    this.db = db;
    this._cfg = {
      version: versionNumber,
      storesSource: null,
      dbschema: {},
      tables: {},
      contentUpgrade: null
    };
  });
}
function getDbNamesTable(indexedDB2, IDBKeyRange) {
  var dbNamesDB = indexedDB2["_dbNamesDB"];
  if (!dbNamesDB) {
    dbNamesDB = indexedDB2["_dbNamesDB"] = new Dexie$1(DBNAMES_DB, {
      addons: [],
      indexedDB: indexedDB2,
      IDBKeyRange
    });
    dbNamesDB.version(1).stores({ dbnames: "name" });
  }
  return dbNamesDB.table("dbnames");
}
function hasDatabasesNative(indexedDB2) {
  return indexedDB2 && typeof indexedDB2.databases === "function";
}
function getDatabaseNames(_a2) {
  var indexedDB2 = _a2.indexedDB, IDBKeyRange = _a2.IDBKeyRange;
  return hasDatabasesNative(indexedDB2) ? Promise.resolve(indexedDB2.databases()).then(function(infos) {
    return infos.map(function(info) {
      return info.name;
    }).filter(function(name) {
      return name !== DBNAMES_DB;
    });
  }) : getDbNamesTable(indexedDB2, IDBKeyRange).toCollection().primaryKeys();
}
function _onDatabaseCreated(_a2, name) {
  var indexedDB2 = _a2.indexedDB, IDBKeyRange = _a2.IDBKeyRange;
  !hasDatabasesNative(indexedDB2) && name !== DBNAMES_DB && getDbNamesTable(indexedDB2, IDBKeyRange).put({ name }).catch(nop);
}
function _onDatabaseDeleted(_a2, name) {
  var indexedDB2 = _a2.indexedDB, IDBKeyRange = _a2.IDBKeyRange;
  !hasDatabasesNative(indexedDB2) && name !== DBNAMES_DB && getDbNamesTable(indexedDB2, IDBKeyRange).delete(name).catch(nop);
}
function vip(fn) {
  return newScope(function() {
    PSD.letThrough = true;
    return fn();
  });
}
function idbReady() {
  var isSafari = !navigator.userAgentData && /Safari\//.test(navigator.userAgent) && !/Chrom(e|ium)\//.test(navigator.userAgent);
  if (!isSafari || !indexedDB.databases)
    return Promise.resolve();
  var intervalId;
  return new Promise(function(resolve) {
    var tryIdb = function() {
      return indexedDB.databases().finally(resolve);
    };
    intervalId = setInterval(tryIdb, 100);
    tryIdb();
  }).finally(function() {
    return clearInterval(intervalId);
  });
}
function dexieOpen(db) {
  var state = db._state;
  var indexedDB2 = db._deps.indexedDB;
  if (state.isBeingOpened || db.idbdb)
    return state.dbReadyPromise.then(function() {
      return state.dbOpenError ? rejection(state.dbOpenError) : db;
    });
  debug && (state.openCanceller._stackHolder = getErrorWithStack());
  state.isBeingOpened = true;
  state.dbOpenError = null;
  state.openComplete = false;
  var openCanceller = state.openCanceller;
  function throwIfCancelled() {
    if (state.openCanceller !== openCanceller)
      throw new exceptions.DatabaseClosed("db.open() was cancelled");
  }
  var resolveDbReady = state.dbReadyResolve, upgradeTransaction = null, wasCreated = false;
  return DexiePromise.race([openCanceller, (typeof navigator === "undefined" ? DexiePromise.resolve() : idbReady()).then(function() {
    return new DexiePromise(function(resolve, reject) {
      throwIfCancelled();
      if (!indexedDB2)
        throw new exceptions.MissingAPI();
      var dbName = db.name;
      var req = state.autoSchema ? indexedDB2.open(dbName) : indexedDB2.open(dbName, Math.round(db.verno * 10));
      if (!req)
        throw new exceptions.MissingAPI();
      req.onerror = eventRejectHandler(reject);
      req.onblocked = wrap(db._fireOnBlocked);
      req.onupgradeneeded = wrap(function(e) {
        upgradeTransaction = req.transaction;
        if (state.autoSchema && !db._options.allowEmptyDB) {
          req.onerror = preventDefault;
          upgradeTransaction.abort();
          req.result.close();
          var delreq = indexedDB2.deleteDatabase(dbName);
          delreq.onsuccess = delreq.onerror = wrap(function() {
            reject(new exceptions.NoSuchDatabase("Database " + dbName + " doesnt exist"));
          });
        } else {
          upgradeTransaction.onerror = eventRejectHandler(reject);
          var oldVer = e.oldVersion > Math.pow(2, 62) ? 0 : e.oldVersion;
          wasCreated = oldVer < 1;
          db._novip.idbdb = req.result;
          runUpgraders(db, oldVer / 10, upgradeTransaction, reject);
        }
      }, reject);
      req.onsuccess = wrap(function() {
        upgradeTransaction = null;
        var idbdb = db._novip.idbdb = req.result;
        var objectStoreNames = slice(idbdb.objectStoreNames);
        if (objectStoreNames.length > 0)
          try {
            var tmpTrans = idbdb.transaction(safariMultiStoreFix(objectStoreNames), "readonly");
            if (state.autoSchema)
              readGlobalSchema(db, idbdb, tmpTrans);
            else {
              adjustToExistingIndexNames(db, db._dbSchema, tmpTrans);
              if (!verifyInstalledSchema(db, tmpTrans)) {
                console.warn("Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Some queries may fail.");
              }
            }
            generateMiddlewareStacks(db, tmpTrans);
          } catch (e) {
          }
        connections.push(db);
        idbdb.onversionchange = wrap(function(ev) {
          state.vcFired = true;
          db.on("versionchange").fire(ev);
        });
        idbdb.onclose = wrap(function(ev) {
          db.on("close").fire(ev);
        });
        if (wasCreated)
          _onDatabaseCreated(db._deps, dbName);
        resolve();
      }, reject);
    });
  })]).then(function() {
    throwIfCancelled();
    state.onReadyBeingFired = [];
    return DexiePromise.resolve(vip(function() {
      return db.on.ready.fire(db.vip);
    })).then(function fireRemainders() {
      if (state.onReadyBeingFired.length > 0) {
        var remainders_1 = state.onReadyBeingFired.reduce(promisableChain, nop);
        state.onReadyBeingFired = [];
        return DexiePromise.resolve(vip(function() {
          return remainders_1(db.vip);
        })).then(fireRemainders);
      }
    });
  }).finally(function() {
    state.onReadyBeingFired = null;
    state.isBeingOpened = false;
  }).then(function() {
    return db;
  }).catch(function(err) {
    state.dbOpenError = err;
    try {
      upgradeTransaction && upgradeTransaction.abort();
    } catch (_a2) {
    }
    if (openCanceller === state.openCanceller) {
      db._close();
    }
    return rejection(err);
  }).finally(function() {
    state.openComplete = true;
    resolveDbReady();
  });
}
function awaitIterator(iterator) {
  var callNext = function(result) {
    return iterator.next(result);
  }, doThrow = function(error) {
    return iterator.throw(error);
  }, onSuccess = step(callNext), onError = step(doThrow);
  function step(getNext) {
    return function(val) {
      var next = getNext(val), value = next.value;
      return next.done ? value : !value || typeof value.then !== "function" ? isArray(value) ? Promise.all(value).then(onSuccess, onError) : onSuccess(value) : value.then(onSuccess, onError);
    };
  }
  return step(callNext)();
}
function extractTransactionArgs(mode, _tableArgs_, scopeFunc) {
  var i = arguments.length;
  if (i < 2)
    throw new exceptions.InvalidArgument("Too few arguments");
  var args = new Array(i - 1);
  while (--i)
    args[i - 1] = arguments[i];
  scopeFunc = args.pop();
  var tables = flatten(args);
  return [mode, tables, scopeFunc];
}
function enterTransactionScope(db, mode, storeNames, parentTransaction, scopeFunc) {
  return DexiePromise.resolve().then(function() {
    var transless = PSD.transless || PSD;
    var trans = db._createTransaction(mode, storeNames, db._dbSchema, parentTransaction);
    var zoneProps = {
      trans,
      transless
    };
    if (parentTransaction) {
      trans.idbtrans = parentTransaction.idbtrans;
    } else {
      try {
        trans.create();
        db._state.PR1398_maxLoop = 3;
      } catch (ex) {
        if (ex.name === errnames.InvalidState && db.isOpen() && --db._state.PR1398_maxLoop > 0) {
          console.warn("Dexie: Need to reopen db");
          db._close();
          return db.open().then(function() {
            return enterTransactionScope(db, mode, storeNames, null, scopeFunc);
          });
        }
        return rejection(ex);
      }
    }
    var scopeFuncIsAsync = isAsyncFunction(scopeFunc);
    if (scopeFuncIsAsync) {
      incrementExpectedAwaits();
    }
    var returnValue;
    var promiseFollowed = DexiePromise.follow(function() {
      returnValue = scopeFunc.call(trans, trans);
      if (returnValue) {
        if (scopeFuncIsAsync) {
          var decrementor = decrementExpectedAwaits.bind(null, null);
          returnValue.then(decrementor, decrementor);
        } else if (typeof returnValue.next === "function" && typeof returnValue.throw === "function") {
          returnValue = awaitIterator(returnValue);
        }
      }
    }, zoneProps);
    return (returnValue && typeof returnValue.then === "function" ? DexiePromise.resolve(returnValue).then(function(x) {
      return trans.active ? x : rejection(new exceptions.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn"));
    }) : promiseFollowed.then(function() {
      return returnValue;
    })).then(function(x) {
      if (parentTransaction)
        trans._resolve();
      return trans._completion.then(function() {
        return x;
      });
    }).catch(function(e) {
      trans._reject(e);
      return rejection(e);
    });
  });
}
function pad(a, value, count) {
  var result = isArray(a) ? a.slice() : [a];
  for (var i = 0; i < count; ++i)
    result.push(value);
  return result;
}
function createVirtualIndexMiddleware(down) {
  return __assign(__assign({}, down), { table: function(tableName) {
    var table = down.table(tableName);
    var schema = table.schema;
    var indexLookup = {};
    var allVirtualIndexes = [];
    function addVirtualIndexes(keyPath, keyTail, lowLevelIndex) {
      var keyPathAlias = getKeyPathAlias(keyPath);
      var indexList = indexLookup[keyPathAlias] = indexLookup[keyPathAlias] || [];
      var keyLength = keyPath == null ? 0 : typeof keyPath === "string" ? 1 : keyPath.length;
      var isVirtual = keyTail > 0;
      var virtualIndex = __assign(__assign({}, lowLevelIndex), { isVirtual, keyTail, keyLength, extractKey: getKeyExtractor(keyPath), unique: !isVirtual && lowLevelIndex.unique });
      indexList.push(virtualIndex);
      if (!virtualIndex.isPrimaryKey) {
        allVirtualIndexes.push(virtualIndex);
      }
      if (keyLength > 1) {
        var virtualKeyPath = keyLength === 2 ? keyPath[0] : keyPath.slice(0, keyLength - 1);
        addVirtualIndexes(virtualKeyPath, keyTail + 1, lowLevelIndex);
      }
      indexList.sort(function(a, b) {
        return a.keyTail - b.keyTail;
      });
      return virtualIndex;
    }
    var primaryKey = addVirtualIndexes(schema.primaryKey.keyPath, 0, schema.primaryKey);
    indexLookup[":id"] = [primaryKey];
    for (var _i = 0, _a2 = schema.indexes; _i < _a2.length; _i++) {
      var index = _a2[_i];
      addVirtualIndexes(index.keyPath, 0, index);
    }
    function findBestIndex(keyPath) {
      var result2 = indexLookup[getKeyPathAlias(keyPath)];
      return result2 && result2[0];
    }
    function translateRange(range, keyTail) {
      return {
        type: range.type === 1 ? 2 : range.type,
        lower: pad(range.lower, range.lowerOpen ? down.MAX_KEY : down.MIN_KEY, keyTail),
        lowerOpen: true,
        upper: pad(range.upper, range.upperOpen ? down.MIN_KEY : down.MAX_KEY, keyTail),
        upperOpen: true
      };
    }
    function translateRequest(req) {
      var index2 = req.query.index;
      return index2.isVirtual ? __assign(__assign({}, req), { query: {
        index: index2,
        range: translateRange(req.query.range, index2.keyTail)
      } }) : req;
    }
    var result = __assign(__assign({}, table), { schema: __assign(__assign({}, schema), { primaryKey, indexes: allVirtualIndexes, getIndexByKeyPath: findBestIndex }), count: function(req) {
      return table.count(translateRequest(req));
    }, query: function(req) {
      return table.query(translateRequest(req));
    }, openCursor: function(req) {
      var _a3 = req.query.index, keyTail = _a3.keyTail, isVirtual = _a3.isVirtual, keyLength = _a3.keyLength;
      if (!isVirtual)
        return table.openCursor(req);
      function createVirtualCursor(cursor) {
        function _continue(key) {
          key != null ? cursor.continue(pad(key, req.reverse ? down.MAX_KEY : down.MIN_KEY, keyTail)) : req.unique ? cursor.continue(cursor.key.slice(0, keyLength).concat(req.reverse ? down.MIN_KEY : down.MAX_KEY, keyTail)) : cursor.continue();
        }
        var virtualCursor = Object.create(cursor, {
          continue: { value: _continue },
          continuePrimaryKey: {
            value: function(key, primaryKey2) {
              cursor.continuePrimaryKey(pad(key, down.MAX_KEY, keyTail), primaryKey2);
            }
          },
          primaryKey: {
            get: function() {
              return cursor.primaryKey;
            }
          },
          key: {
            get: function() {
              var key = cursor.key;
              return keyLength === 1 ? key[0] : key.slice(0, keyLength);
            }
          },
          value: {
            get: function() {
              return cursor.value;
            }
          }
        });
        return virtualCursor;
      }
      return table.openCursor(translateRequest(req)).then(function(cursor) {
        return cursor && createVirtualCursor(cursor);
      });
    } });
    return result;
  } });
}
var virtualIndexMiddleware = {
  stack: "dbcore",
  name: "VirtualIndexMiddleware",
  level: 1,
  create: createVirtualIndexMiddleware
};
function getObjectDiff(a, b, rv, prfx) {
  rv = rv || {};
  prfx = prfx || "";
  keys(a).forEach(function(prop) {
    if (!hasOwn(b, prop)) {
      rv[prfx + prop] = void 0;
    } else {
      var ap = a[prop], bp = b[prop];
      if (typeof ap === "object" && typeof bp === "object" && ap && bp) {
        var apTypeName = toStringTag(ap);
        var bpTypeName = toStringTag(bp);
        if (apTypeName !== bpTypeName) {
          rv[prfx + prop] = b[prop];
        } else if (apTypeName === "Object") {
          getObjectDiff(ap, bp, rv, prfx + prop + ".");
        } else if (ap !== bp) {
          rv[prfx + prop] = b[prop];
        }
      } else if (ap !== bp)
        rv[prfx + prop] = b[prop];
    }
  });
  keys(b).forEach(function(prop) {
    if (!hasOwn(a, prop)) {
      rv[prfx + prop] = b[prop];
    }
  });
  return rv;
}
function getEffectiveKeys(primaryKey, req) {
  if (req.type === "delete")
    return req.keys;
  return req.keys || req.values.map(primaryKey.extractKey);
}
var hooksMiddleware = {
  stack: "dbcore",
  name: "HooksMiddleware",
  level: 2,
  create: function(downCore) {
    return __assign(__assign({}, downCore), { table: function(tableName) {
      var downTable = downCore.table(tableName);
      var primaryKey = downTable.schema.primaryKey;
      var tableMiddleware = __assign(__assign({}, downTable), { mutate: function(req) {
        var dxTrans = PSD.trans;
        var _a2 = dxTrans.table(tableName).hook, deleting = _a2.deleting, creating = _a2.creating, updating = _a2.updating;
        switch (req.type) {
          case "add":
            if (creating.fire === nop)
              break;
            return dxTrans._promise("readwrite", function() {
              return addPutOrDelete(req);
            }, true);
          case "put":
            if (creating.fire === nop && updating.fire === nop)
              break;
            return dxTrans._promise("readwrite", function() {
              return addPutOrDelete(req);
            }, true);
          case "delete":
            if (deleting.fire === nop)
              break;
            return dxTrans._promise("readwrite", function() {
              return addPutOrDelete(req);
            }, true);
          case "deleteRange":
            if (deleting.fire === nop)
              break;
            return dxTrans._promise("readwrite", function() {
              return deleteRange(req);
            }, true);
        }
        return downTable.mutate(req);
        function addPutOrDelete(req2) {
          var dxTrans2 = PSD.trans;
          var keys2 = req2.keys || getEffectiveKeys(primaryKey, req2);
          if (!keys2)
            throw new Error("Keys missing");
          req2 = req2.type === "add" || req2.type === "put" ? __assign(__assign({}, req2), { keys: keys2 }) : __assign({}, req2);
          if (req2.type !== "delete")
            req2.values = __spreadArray([], req2.values, true);
          if (req2.keys)
            req2.keys = __spreadArray([], req2.keys, true);
          return getExistingValues(downTable, req2, keys2).then(function(existingValues) {
            var contexts = keys2.map(function(key, i) {
              var existingValue = existingValues[i];
              var ctx = { onerror: null, onsuccess: null };
              if (req2.type === "delete") {
                deleting.fire.call(ctx, key, existingValue, dxTrans2);
              } else if (req2.type === "add" || existingValue === void 0) {
                var generatedPrimaryKey = creating.fire.call(ctx, key, req2.values[i], dxTrans2);
                if (key == null && generatedPrimaryKey != null) {
                  key = generatedPrimaryKey;
                  req2.keys[i] = key;
                  if (!primaryKey.outbound) {
                    setByKeyPath(req2.values[i], primaryKey.keyPath, key);
                  }
                }
              } else {
                var objectDiff = getObjectDiff(existingValue, req2.values[i]);
                var additionalChanges_1 = updating.fire.call(ctx, objectDiff, key, existingValue, dxTrans2);
                if (additionalChanges_1) {
                  var requestedValue_1 = req2.values[i];
                  Object.keys(additionalChanges_1).forEach(function(keyPath) {
                    if (hasOwn(requestedValue_1, keyPath)) {
                      requestedValue_1[keyPath] = additionalChanges_1[keyPath];
                    } else {
                      setByKeyPath(requestedValue_1, keyPath, additionalChanges_1[keyPath]);
                    }
                  });
                }
              }
              return ctx;
            });
            return downTable.mutate(req2).then(function(_a3) {
              var failures = _a3.failures, results = _a3.results, numFailures = _a3.numFailures, lastResult = _a3.lastResult;
              for (var i = 0; i < keys2.length; ++i) {
                var primKey = results ? results[i] : keys2[i];
                var ctx = contexts[i];
                if (primKey == null) {
                  ctx.onerror && ctx.onerror(failures[i]);
                } else {
                  ctx.onsuccess && ctx.onsuccess(req2.type === "put" && existingValues[i] ? req2.values[i] : primKey);
                }
              }
              return { failures, results, numFailures, lastResult };
            }).catch(function(error) {
              contexts.forEach(function(ctx) {
                return ctx.onerror && ctx.onerror(error);
              });
              return Promise.reject(error);
            });
          });
        }
        function deleteRange(req2) {
          return deleteNextChunk(req2.trans, req2.range, 1e4);
        }
        function deleteNextChunk(trans, range, limit) {
          return downTable.query({ trans, values: false, query: { index: primaryKey, range }, limit }).then(function(_a3) {
            var result = _a3.result;
            return addPutOrDelete({ type: "delete", keys: result, trans }).then(function(res) {
              if (res.numFailures > 0)
                return Promise.reject(res.failures[0]);
              if (result.length < limit) {
                return { failures: [], numFailures: 0, lastResult: void 0 };
              } else {
                return deleteNextChunk(trans, __assign(__assign({}, range), { lower: result[result.length - 1], lowerOpen: true }), limit);
              }
            });
          });
        }
      } });
      return tableMiddleware;
    } });
  }
};
function getExistingValues(table, req, effectiveKeys) {
  return req.type === "add" ? Promise.resolve([]) : table.getMany({ trans: req.trans, keys: effectiveKeys, cache: "immutable" });
}
function getFromTransactionCache(keys2, cache2, clone) {
  try {
    if (!cache2)
      return null;
    if (cache2.keys.length < keys2.length)
      return null;
    var result = [];
    for (var i = 0, j = 0; i < cache2.keys.length && j < keys2.length; ++i) {
      if (cmp(cache2.keys[i], keys2[j]) !== 0)
        continue;
      result.push(clone ? deepClone(cache2.values[i]) : cache2.values[i]);
      ++j;
    }
    return result.length === keys2.length ? result : null;
  } catch (_a2) {
    return null;
  }
}
var cacheExistingValuesMiddleware = {
  stack: "dbcore",
  level: -1,
  create: function(core) {
    return {
      table: function(tableName) {
        var table = core.table(tableName);
        return __assign(__assign({}, table), { getMany: function(req) {
          if (!req.cache) {
            return table.getMany(req);
          }
          var cachedResult = getFromTransactionCache(req.keys, req.trans["_cache"], req.cache === "clone");
          if (cachedResult) {
            return DexiePromise.resolve(cachedResult);
          }
          return table.getMany(req).then(function(res) {
            req.trans["_cache"] = {
              keys: req.keys,
              values: req.cache === "clone" ? deepClone(res) : res
            };
            return res;
          });
        }, mutate: function(req) {
          if (req.type !== "add")
            req.trans["_cache"] = null;
          return table.mutate(req);
        } });
      }
    };
  }
};
var _a;
function isEmptyRange(node) {
  return !("from" in node);
}
var RangeSet = function(fromOrTree, to) {
  if (this) {
    extend(this, arguments.length ? { d: 1, from: fromOrTree, to: arguments.length > 1 ? to : fromOrTree } : { d: 0 });
  } else {
    var rv = new RangeSet();
    if (fromOrTree && "d" in fromOrTree) {
      extend(rv, fromOrTree);
    }
    return rv;
  }
};
props(RangeSet.prototype, (_a = {
  add: function(rangeSet) {
    mergeRanges(this, rangeSet);
    return this;
  },
  addKey: function(key) {
    addRange(this, key, key);
    return this;
  },
  addKeys: function(keys2) {
    var _this = this;
    keys2.forEach(function(key) {
      return addRange(_this, key, key);
    });
    return this;
  }
}, _a[iteratorSymbol] = function() {
  return getRangeSetIterator(this);
}, _a));
function addRange(target2, from, to) {
  var diff = cmp(from, to);
  if (isNaN(diff))
    return;
  if (diff > 0)
    throw RangeError();
  if (isEmptyRange(target2))
    return extend(target2, { from, to, d: 1 });
  var left = target2.l;
  var right = target2.r;
  if (cmp(to, target2.from) < 0) {
    left ? addRange(left, from, to) : target2.l = { from, to, d: 1, l: null, r: null };
    return rebalance(target2);
  }
  if (cmp(from, target2.to) > 0) {
    right ? addRange(right, from, to) : target2.r = { from, to, d: 1, l: null, r: null };
    return rebalance(target2);
  }
  if (cmp(from, target2.from) < 0) {
    target2.from = from;
    target2.l = null;
    target2.d = right ? right.d + 1 : 1;
  }
  if (cmp(to, target2.to) > 0) {
    target2.to = to;
    target2.r = null;
    target2.d = target2.l ? target2.l.d + 1 : 1;
  }
  var rightWasCutOff = !target2.r;
  if (left && !target2.l) {
    mergeRanges(target2, left);
  }
  if (right && rightWasCutOff) {
    mergeRanges(target2, right);
  }
}
function mergeRanges(target2, newSet) {
  function _addRangeSet(target3, _a2) {
    var from = _a2.from, to = _a2.to, l = _a2.l, r = _a2.r;
    addRange(target3, from, to);
    if (l)
      _addRangeSet(target3, l);
    if (r)
      _addRangeSet(target3, r);
  }
  if (!isEmptyRange(newSet))
    _addRangeSet(target2, newSet);
}
function rangesOverlap(rangeSet1, rangeSet2) {
  var i1 = getRangeSetIterator(rangeSet2);
  var nextResult1 = i1.next();
  if (nextResult1.done)
    return false;
  var a = nextResult1.value;
  var i2 = getRangeSetIterator(rangeSet1);
  var nextResult2 = i2.next(a.from);
  var b = nextResult2.value;
  while (!nextResult1.done && !nextResult2.done) {
    if (cmp(b.from, a.to) <= 0 && cmp(b.to, a.from) >= 0)
      return true;
    cmp(a.from, b.from) < 0 ? a = (nextResult1 = i1.next(b.from)).value : b = (nextResult2 = i2.next(a.from)).value;
  }
  return false;
}
function getRangeSetIterator(node) {
  var state = isEmptyRange(node) ? null : { s: 0, n: node };
  return {
    next: function(key) {
      var keyProvided = arguments.length > 0;
      while (state) {
        switch (state.s) {
          case 0:
            state.s = 1;
            if (keyProvided) {
              while (state.n.l && cmp(key, state.n.from) < 0)
                state = { up: state, n: state.n.l, s: 1 };
            } else {
              while (state.n.l)
                state = { up: state, n: state.n.l, s: 1 };
            }
          case 1:
            state.s = 2;
            if (!keyProvided || cmp(key, state.n.to) <= 0)
              return { value: state.n, done: false };
          case 2:
            if (state.n.r) {
              state.s = 3;
              state = { up: state, n: state.n.r, s: 0 };
              continue;
            }
          case 3:
            state = state.up;
        }
      }
      return { done: true };
    }
  };
}
function rebalance(target2) {
  var _a2, _b;
  var diff = (((_a2 = target2.r) === null || _a2 === void 0 ? void 0 : _a2.d) || 0) - (((_b = target2.l) === null || _b === void 0 ? void 0 : _b.d) || 0);
  var r = diff > 1 ? "r" : diff < -1 ? "l" : "";
  if (r) {
    var l = r === "r" ? "l" : "r";
    var rootClone = __assign({}, target2);
    var oldRootRight = target2[r];
    target2.from = oldRootRight.from;
    target2.to = oldRootRight.to;
    target2[r] = oldRootRight[r];
    rootClone[r] = oldRootRight[l];
    target2[l] = rootClone;
    rootClone.d = computeDepth(rootClone);
  }
  target2.d = computeDepth(target2);
}
function computeDepth(_a2) {
  var r = _a2.r, l = _a2.l;
  return (r ? l ? Math.max(r.d, l.d) : r.d : l ? l.d : 0) + 1;
}
var observabilityMiddleware = {
  stack: "dbcore",
  level: 0,
  create: function(core) {
    var dbName = core.schema.name;
    var FULL_RANGE = new RangeSet(core.MIN_KEY, core.MAX_KEY);
    return __assign(__assign({}, core), { table: function(tableName) {
      var table = core.table(tableName);
      var schema = table.schema;
      var primaryKey = schema.primaryKey;
      var extractKey = primaryKey.extractKey, outbound = primaryKey.outbound;
      var tableClone = __assign(__assign({}, table), { mutate: function(req) {
        var trans = req.trans;
        var mutatedParts = trans.mutatedParts || (trans.mutatedParts = {});
        var getRangeSet = function(indexName) {
          var part = "idb://" + dbName + "/" + tableName + "/" + indexName;
          return mutatedParts[part] || (mutatedParts[part] = new RangeSet());
        };
        var pkRangeSet = getRangeSet("");
        var delsRangeSet = getRangeSet(":dels");
        var type2 = req.type;
        var _a2 = req.type === "deleteRange" ? [req.range] : req.type === "delete" ? [req.keys] : req.values.length < 50 ? [[], req.values] : [], keys2 = _a2[0], newObjs = _a2[1];
        var oldCache = req.trans["_cache"];
        return table.mutate(req).then(function(res) {
          if (isArray(keys2)) {
            if (type2 !== "delete")
              keys2 = res.results;
            pkRangeSet.addKeys(keys2);
            var oldObjs = getFromTransactionCache(keys2, oldCache);
            if (!oldObjs && type2 !== "add") {
              delsRangeSet.addKeys(keys2);
            }
            if (oldObjs || newObjs) {
              trackAffectedIndexes(getRangeSet, schema, oldObjs, newObjs);
            }
          } else if (keys2) {
            var range = { from: keys2.lower, to: keys2.upper };
            delsRangeSet.add(range);
            pkRangeSet.add(range);
          } else {
            pkRangeSet.add(FULL_RANGE);
            delsRangeSet.add(FULL_RANGE);
            schema.indexes.forEach(function(idx) {
              return getRangeSet(idx.name).add(FULL_RANGE);
            });
          }
          return res;
        });
      } });
      var getRange = function(_a2) {
        var _b, _c;
        var _d = _a2.query, index = _d.index, range = _d.range;
        return [
          index,
          new RangeSet((_b = range.lower) !== null && _b !== void 0 ? _b : core.MIN_KEY, (_c = range.upper) !== null && _c !== void 0 ? _c : core.MAX_KEY)
        ];
      };
      var readSubscribers = {
        get: function(req) {
          return [primaryKey, new RangeSet(req.key)];
        },
        getMany: function(req) {
          return [primaryKey, new RangeSet().addKeys(req.keys)];
        },
        count: getRange,
        query: getRange,
        openCursor: getRange
      };
      keys(readSubscribers).forEach(function(method) {
        tableClone[method] = function(req) {
          var subscr = PSD.subscr;
          if (subscr) {
            var getRangeSet = function(indexName) {
              var part = "idb://" + dbName + "/" + tableName + "/" + indexName;
              return subscr[part] || (subscr[part] = new RangeSet());
            };
            var pkRangeSet_1 = getRangeSet("");
            var delsRangeSet_1 = getRangeSet(":dels");
            var _a2 = readSubscribers[method](req), queriedIndex = _a2[0], queriedRanges = _a2[1];
            getRangeSet(queriedIndex.name || "").add(queriedRanges);
            if (!queriedIndex.isPrimaryKey) {
              if (method === "count") {
                delsRangeSet_1.add(FULL_RANGE);
              } else {
                var keysPromise_1 = method === "query" && outbound && req.values && table.query(__assign(__assign({}, req), { values: false }));
                return table[method].apply(this, arguments).then(function(res) {
                  if (method === "query") {
                    if (outbound && req.values) {
                      return keysPromise_1.then(function(_a3) {
                        var resultingKeys = _a3.result;
                        pkRangeSet_1.addKeys(resultingKeys);
                        return res;
                      });
                    }
                    var pKeys = req.values ? res.result.map(extractKey) : res.result;
                    if (req.values) {
                      pkRangeSet_1.addKeys(pKeys);
                    } else {
                      delsRangeSet_1.addKeys(pKeys);
                    }
                  } else if (method === "openCursor") {
                    var cursor_1 = res;
                    var wantValues_1 = req.values;
                    return cursor_1 && Object.create(cursor_1, {
                      key: {
                        get: function() {
                          delsRangeSet_1.addKey(cursor_1.primaryKey);
                          return cursor_1.key;
                        }
                      },
                      primaryKey: {
                        get: function() {
                          var pkey = cursor_1.primaryKey;
                          delsRangeSet_1.addKey(pkey);
                          return pkey;
                        }
                      },
                      value: {
                        get: function() {
                          wantValues_1 && pkRangeSet_1.addKey(cursor_1.primaryKey);
                          return cursor_1.value;
                        }
                      }
                    });
                  }
                  return res;
                });
              }
            }
          }
          return table[method].apply(this, arguments);
        };
      });
      return tableClone;
    } });
  }
};
function trackAffectedIndexes(getRangeSet, schema, oldObjs, newObjs) {
  function addAffectedIndex(ix) {
    var rangeSet = getRangeSet(ix.name || "");
    function extractKey(obj) {
      return obj != null ? ix.extractKey(obj) : null;
    }
    var addKeyOrKeys = function(key) {
      return ix.multiEntry && isArray(key) ? key.forEach(function(key2) {
        return rangeSet.addKey(key2);
      }) : rangeSet.addKey(key);
    };
    (oldObjs || newObjs).forEach(function(_, i) {
      var oldKey = oldObjs && extractKey(oldObjs[i]);
      var newKey = newObjs && extractKey(newObjs[i]);
      if (cmp(oldKey, newKey) !== 0) {
        if (oldKey != null)
          addKeyOrKeys(oldKey);
        if (newKey != null)
          addKeyOrKeys(newKey);
      }
    });
  }
  schema.indexes.forEach(addAffectedIndex);
}
var Dexie$1 = function() {
  function Dexie2(name, options) {
    var _this = this;
    this._middlewares = {};
    this.verno = 0;
    var deps = Dexie2.dependencies;
    this._options = options = __assign({
      addons: Dexie2.addons,
      autoOpen: true,
      indexedDB: deps.indexedDB,
      IDBKeyRange: deps.IDBKeyRange
    }, options);
    this._deps = {
      indexedDB: options.indexedDB,
      IDBKeyRange: options.IDBKeyRange
    };
    var addons = options.addons;
    this._dbSchema = {};
    this._versions = [];
    this._storeNames = [];
    this._allTables = {};
    this.idbdb = null;
    this._novip = this;
    var state = {
      dbOpenError: null,
      isBeingOpened: false,
      onReadyBeingFired: null,
      openComplete: false,
      dbReadyResolve: nop,
      dbReadyPromise: null,
      cancelOpen: nop,
      openCanceller: null,
      autoSchema: true,
      PR1398_maxLoop: 3
    };
    state.dbReadyPromise = new DexiePromise(function(resolve) {
      state.dbReadyResolve = resolve;
    });
    state.openCanceller = new DexiePromise(function(_, reject) {
      state.cancelOpen = reject;
    });
    this._state = state;
    this.name = name;
    this.on = Events(this, "populate", "blocked", "versionchange", "close", { ready: [promisableChain, nop] });
    this.on.ready.subscribe = override(this.on.ready.subscribe, function(subscribe) {
      return function(subscriber, bSticky) {
        Dexie2.vip(function() {
          var state2 = _this._state;
          if (state2.openComplete) {
            if (!state2.dbOpenError)
              DexiePromise.resolve().then(subscriber);
            if (bSticky)
              subscribe(subscriber);
          } else if (state2.onReadyBeingFired) {
            state2.onReadyBeingFired.push(subscriber);
            if (bSticky)
              subscribe(subscriber);
          } else {
            subscribe(subscriber);
            var db_1 = _this;
            if (!bSticky)
              subscribe(function unsubscribe() {
                db_1.on.ready.unsubscribe(subscriber);
                db_1.on.ready.unsubscribe(unsubscribe);
              });
          }
        });
      };
    });
    this.Collection = createCollectionConstructor(this);
    this.Table = createTableConstructor(this);
    this.Transaction = createTransactionConstructor(this);
    this.Version = createVersionConstructor(this);
    this.WhereClause = createWhereClauseConstructor(this);
    this.on("versionchange", function(ev) {
      if (ev.newVersion > 0)
        console.warn("Another connection wants to upgrade database '" + _this.name + "'. Closing db now to resume the upgrade.");
      else
        console.warn("Another connection wants to delete database '" + _this.name + "'. Closing db now to resume the delete request.");
      _this.close();
    });
    this.on("blocked", function(ev) {
      if (!ev.newVersion || ev.newVersion < ev.oldVersion)
        console.warn("Dexie.delete('" + _this.name + "') was blocked");
      else
        console.warn("Upgrade '" + _this.name + "' blocked by other connection holding version " + ev.oldVersion / 10);
    });
    this._maxKey = getMaxKey(options.IDBKeyRange);
    this._createTransaction = function(mode, storeNames, dbschema, parentTransaction) {
      return new _this.Transaction(mode, storeNames, dbschema, _this._options.chromeTransactionDurability, parentTransaction);
    };
    this._fireOnBlocked = function(ev) {
      _this.on("blocked").fire(ev);
      connections.filter(function(c) {
        return c.name === _this.name && c !== _this && !c._state.vcFired;
      }).map(function(c) {
        return c.on("versionchange").fire(ev);
      });
    };
    this.use(virtualIndexMiddleware);
    this.use(hooksMiddleware);
    this.use(observabilityMiddleware);
    this.use(cacheExistingValuesMiddleware);
    this.vip = Object.create(this, { _vip: { value: true } });
    addons.forEach(function(addon) {
      return addon(_this);
    });
  }
  Dexie2.prototype.version = function(versionNumber) {
    if (isNaN(versionNumber) || versionNumber < 0.1)
      throw new exceptions.Type("Given version is not a positive number");
    versionNumber = Math.round(versionNumber * 10) / 10;
    if (this.idbdb || this._state.isBeingOpened)
      throw new exceptions.Schema("Cannot add version when database is open");
    this.verno = Math.max(this.verno, versionNumber);
    var versions = this._versions;
    var versionInstance = versions.filter(function(v) {
      return v._cfg.version === versionNumber;
    })[0];
    if (versionInstance)
      return versionInstance;
    versionInstance = new this.Version(versionNumber);
    versions.push(versionInstance);
    versions.sort(lowerVersionFirst);
    versionInstance.stores({});
    this._state.autoSchema = false;
    return versionInstance;
  };
  Dexie2.prototype._whenReady = function(fn) {
    var _this = this;
    return this.idbdb && (this._state.openComplete || PSD.letThrough || this._vip) ? fn() : new DexiePromise(function(resolve, reject) {
      if (_this._state.openComplete) {
        return reject(new exceptions.DatabaseClosed(_this._state.dbOpenError));
      }
      if (!_this._state.isBeingOpened) {
        if (!_this._options.autoOpen) {
          reject(new exceptions.DatabaseClosed());
          return;
        }
        _this.open().catch(nop);
      }
      _this._state.dbReadyPromise.then(resolve, reject);
    }).then(fn);
  };
  Dexie2.prototype.use = function(_a2) {
    var stack = _a2.stack, create = _a2.create, level = _a2.level, name = _a2.name;
    if (name)
      this.unuse({ stack, name });
    var middlewares = this._middlewares[stack] || (this._middlewares[stack] = []);
    middlewares.push({ stack, create, level: level == null ? 10 : level, name });
    middlewares.sort(function(a, b) {
      return a.level - b.level;
    });
    return this;
  };
  Dexie2.prototype.unuse = function(_a2) {
    var stack = _a2.stack, name = _a2.name, create = _a2.create;
    if (stack && this._middlewares[stack]) {
      this._middlewares[stack] = this._middlewares[stack].filter(function(mw) {
        return create ? mw.create !== create : name ? mw.name !== name : false;
      });
    }
    return this;
  };
  Dexie2.prototype.open = function() {
    return dexieOpen(this);
  };
  Dexie2.prototype._close = function() {
    var state = this._state;
    var idx = connections.indexOf(this);
    if (idx >= 0)
      connections.splice(idx, 1);
    if (this.idbdb) {
      try {
        this.idbdb.close();
      } catch (e) {
      }
      this._novip.idbdb = null;
    }
    state.dbReadyPromise = new DexiePromise(function(resolve) {
      state.dbReadyResolve = resolve;
    });
    state.openCanceller = new DexiePromise(function(_, reject) {
      state.cancelOpen = reject;
    });
  };
  Dexie2.prototype.close = function() {
    this._close();
    var state = this._state;
    this._options.autoOpen = false;
    state.dbOpenError = new exceptions.DatabaseClosed();
    if (state.isBeingOpened)
      state.cancelOpen(state.dbOpenError);
  };
  Dexie2.prototype.delete = function() {
    var _this = this;
    var hasArguments = arguments.length > 0;
    var state = this._state;
    return new DexiePromise(function(resolve, reject) {
      var doDelete = function() {
        _this.close();
        var req = _this._deps.indexedDB.deleteDatabase(_this.name);
        req.onsuccess = wrap(function() {
          _onDatabaseDeleted(_this._deps, _this.name);
          resolve();
        });
        req.onerror = eventRejectHandler(reject);
        req.onblocked = _this._fireOnBlocked;
      };
      if (hasArguments)
        throw new exceptions.InvalidArgument("Arguments not allowed in db.delete()");
      if (state.isBeingOpened) {
        state.dbReadyPromise.then(doDelete);
      } else {
        doDelete();
      }
    });
  };
  Dexie2.prototype.backendDB = function() {
    return this.idbdb;
  };
  Dexie2.prototype.isOpen = function() {
    return this.idbdb !== null;
  };
  Dexie2.prototype.hasBeenClosed = function() {
    var dbOpenError = this._state.dbOpenError;
    return dbOpenError && dbOpenError.name === "DatabaseClosed";
  };
  Dexie2.prototype.hasFailed = function() {
    return this._state.dbOpenError !== null;
  };
  Dexie2.prototype.dynamicallyOpened = function() {
    return this._state.autoSchema;
  };
  Object.defineProperty(Dexie2.prototype, "tables", {
    get: function() {
      var _this = this;
      return keys(this._allTables).map(function(name) {
        return _this._allTables[name];
      });
    },
    enumerable: false,
    configurable: true
  });
  Dexie2.prototype.transaction = function() {
    var args = extractTransactionArgs.apply(this, arguments);
    return this._transaction.apply(this, args);
  };
  Dexie2.prototype._transaction = function(mode, tables, scopeFunc) {
    var _this = this;
    var parentTransaction = PSD.trans;
    if (!parentTransaction || parentTransaction.db !== this || mode.indexOf("!") !== -1)
      parentTransaction = null;
    var onlyIfCompatible = mode.indexOf("?") !== -1;
    mode = mode.replace("!", "").replace("?", "");
    var idbMode, storeNames;
    try {
      storeNames = tables.map(function(table) {
        var storeName = table instanceof _this.Table ? table.name : table;
        if (typeof storeName !== "string")
          throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
        return storeName;
      });
      if (mode == "r" || mode === READONLY)
        idbMode = READONLY;
      else if (mode == "rw" || mode == READWRITE)
        idbMode = READWRITE;
      else
        throw new exceptions.InvalidArgument("Invalid transaction mode: " + mode);
      if (parentTransaction) {
        if (parentTransaction.mode === READONLY && idbMode === READWRITE) {
          if (onlyIfCompatible) {
            parentTransaction = null;
          } else
            throw new exceptions.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");
        }
        if (parentTransaction) {
          storeNames.forEach(function(storeName) {
            if (parentTransaction && parentTransaction.storeNames.indexOf(storeName) === -1) {
              if (onlyIfCompatible) {
                parentTransaction = null;
              } else
                throw new exceptions.SubTransaction("Table " + storeName + " not included in parent transaction.");
            }
          });
        }
        if (onlyIfCompatible && parentTransaction && !parentTransaction.active) {
          parentTransaction = null;
        }
      }
    } catch (e) {
      return parentTransaction ? parentTransaction._promise(null, function(_, reject) {
        reject(e);
      }) : rejection(e);
    }
    var enterTransaction = enterTransactionScope.bind(null, this, idbMode, storeNames, parentTransaction, scopeFunc);
    return parentTransaction ? parentTransaction._promise(idbMode, enterTransaction, "lock") : PSD.trans ? usePSD(PSD.transless, function() {
      return _this._whenReady(enterTransaction);
    }) : this._whenReady(enterTransaction);
  };
  Dexie2.prototype.table = function(tableName) {
    if (!hasOwn(this._allTables, tableName)) {
      throw new exceptions.InvalidTable("Table " + tableName + " does not exist");
    }
    return this._allTables[tableName];
  };
  return Dexie2;
}();
var symbolObservable = typeof Symbol !== "undefined" && "observable" in Symbol ? Symbol.observable : "@@observable";
var Observable = function() {
  function Observable2(subscribe) {
    this._subscribe = subscribe;
  }
  Observable2.prototype.subscribe = function(x, error, complete) {
    return this._subscribe(!x || typeof x === "function" ? { next: x, error, complete } : x);
  };
  Observable2.prototype[symbolObservable] = function() {
    return this;
  };
  return Observable2;
}();
function extendObservabilitySet(target2, newSet) {
  keys(newSet).forEach(function(part) {
    var rangeSet = target2[part] || (target2[part] = new RangeSet());
    mergeRanges(rangeSet, newSet[part]);
  });
  return target2;
}
function liveQuery(querier) {
  return new Observable(function(observer) {
    var scopeFuncIsAsync = isAsyncFunction(querier);
    function execute(subscr) {
      if (scopeFuncIsAsync) {
        incrementExpectedAwaits();
      }
      var exec = function() {
        return newScope(querier, { subscr, trans: null });
      };
      var rv = PSD.trans ? usePSD(PSD.transless, exec) : exec();
      if (scopeFuncIsAsync) {
        rv.then(decrementExpectedAwaits, decrementExpectedAwaits);
      }
      return rv;
    }
    var closed = false;
    var accumMuts = {};
    var currentObs = {};
    var subscription = {
      get closed() {
        return closed;
      },
      unsubscribe: function() {
        closed = true;
        globalEvents.storagemutated.unsubscribe(mutationListener);
      }
    };
    observer.start && observer.start(subscription);
    var querying = false, startedListening = false;
    function shouldNotify() {
      return keys(currentObs).some(function(key) {
        return accumMuts[key] && rangesOverlap(accumMuts[key], currentObs[key]);
      });
    }
    var mutationListener = function(parts) {
      extendObservabilitySet(accumMuts, parts);
      if (shouldNotify()) {
        doQuery();
      }
    };
    var doQuery = function() {
      if (querying || closed)
        return;
      accumMuts = {};
      var subscr = {};
      var ret = execute(subscr);
      if (!startedListening) {
        globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, mutationListener);
        startedListening = true;
      }
      querying = true;
      Promise.resolve(ret).then(function(result) {
        querying = false;
        if (closed)
          return;
        if (shouldNotify()) {
          doQuery();
        } else {
          accumMuts = {};
          currentObs = subscr;
          observer.next && observer.next(result);
        }
      }, function(err) {
        querying = false;
        observer.error && observer.error(err);
        subscription.unsubscribe();
      });
    };
    doQuery();
    return subscription;
  });
}
var domDeps;
try {
  domDeps = {
    indexedDB: _global.indexedDB || _global.mozIndexedDB || _global.webkitIndexedDB || _global.msIndexedDB,
    IDBKeyRange: _global.IDBKeyRange || _global.webkitIDBKeyRange
  };
} catch (e) {
  domDeps = { indexedDB: null, IDBKeyRange: null };
}
var Dexie = Dexie$1;
props(Dexie, __assign(__assign({}, fullNameExceptions), {
  delete: function(databaseName) {
    var db = new Dexie(databaseName, { addons: [] });
    return db.delete();
  },
  exists: function(name) {
    return new Dexie(name, { addons: [] }).open().then(function(db) {
      db.close();
      return true;
    }).catch("NoSuchDatabaseError", function() {
      return false;
    });
  },
  getDatabaseNames: function(cb) {
    try {
      return getDatabaseNames(Dexie.dependencies).then(cb);
    } catch (_a2) {
      return rejection(new exceptions.MissingAPI());
    }
  },
  defineClass: function() {
    function Class(content) {
      extend(this, content);
    }
    return Class;
  },
  ignoreTransaction: function(scopeFunc) {
    return PSD.trans ? usePSD(PSD.transless, scopeFunc) : scopeFunc();
  },
  vip,
  async: function(generatorFn) {
    return function() {
      try {
        var rv = awaitIterator(generatorFn.apply(this, arguments));
        if (!rv || typeof rv.then !== "function")
          return DexiePromise.resolve(rv);
        return rv;
      } catch (e) {
        return rejection(e);
      }
    };
  },
  spawn: function(generatorFn, args, thiz) {
    try {
      var rv = awaitIterator(generatorFn.apply(thiz, args || []));
      if (!rv || typeof rv.then !== "function")
        return DexiePromise.resolve(rv);
      return rv;
    } catch (e) {
      return rejection(e);
    }
  },
  currentTransaction: {
    get: function() {
      return PSD.trans || null;
    }
  },
  waitFor: function(promiseOrFunction, optionalTimeout) {
    var promise = DexiePromise.resolve(typeof promiseOrFunction === "function" ? Dexie.ignoreTransaction(promiseOrFunction) : promiseOrFunction).timeout(optionalTimeout || 6e4);
    return PSD.trans ? PSD.trans.waitFor(promise) : promise;
  },
  Promise: DexiePromise,
  debug: {
    get: function() {
      return debug;
    },
    set: function(value) {
      setDebug(value, value === "dexie" ? function() {
        return true;
      } : dexieStackFrameFilter);
    }
  },
  derive,
  extend,
  props,
  override,
  Events,
  on: globalEvents,
  liveQuery,
  extendObservabilitySet,
  getByKeyPath,
  setByKeyPath,
  delByKeyPath,
  shallowClone,
  deepClone,
  getObjectDiff,
  cmp,
  asap: asap$1,
  minKey,
  addons: [],
  connections,
  errnames,
  dependencies: domDeps,
  semVer: DEXIE_VERSION,
  version: DEXIE_VERSION.split(".").map(function(n) {
    return parseInt(n);
  }).reduce(function(p, c, i) {
    return p + c / Math.pow(10, i * 2);
  })
}));
Dexie.maxKey = getMaxKey(Dexie.dependencies.IDBKeyRange);
if (typeof dispatchEvent !== "undefined" && typeof addEventListener !== "undefined") {
  globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, function(updatedParts) {
    if (!propagatingLocally) {
      var event_1;
      if (isIEOrEdge) {
        event_1 = document.createEvent("CustomEvent");
        event_1.initCustomEvent(STORAGE_MUTATED_DOM_EVENT_NAME, true, true, updatedParts);
      } else {
        event_1 = new CustomEvent(STORAGE_MUTATED_DOM_EVENT_NAME, {
          detail: updatedParts
        });
      }
      propagatingLocally = true;
      dispatchEvent(event_1);
      propagatingLocally = false;
    }
  });
  addEventListener(STORAGE_MUTATED_DOM_EVENT_NAME, function(_a2) {
    var detail = _a2.detail;
    if (!propagatingLocally) {
      propagateLocally(detail);
    }
  });
}
function propagateLocally(updateParts) {
  var wasMe = propagatingLocally;
  try {
    propagatingLocally = true;
    globalEvents.storagemutated.fire(updateParts);
  } finally {
    propagatingLocally = wasMe;
  }
}
var propagatingLocally = false;
if (typeof BroadcastChannel !== "undefined") {
  var bc_1 = new BroadcastChannel(STORAGE_MUTATED_DOM_EVENT_NAME);
  globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, function(changedParts) {
    if (!propagatingLocally) {
      bc_1.postMessage(changedParts);
    }
  });
  bc_1.onmessage = function(ev) {
    if (ev.data)
      propagateLocally(ev.data);
  };
} else if (typeof self !== "undefined" && typeof navigator !== "undefined") {
  globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, function(changedParts) {
    try {
      if (!propagatingLocally) {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem(STORAGE_MUTATED_DOM_EVENT_NAME, JSON.stringify({
            trig: Math.random(),
            changedParts
          }));
        }
        if (typeof self["clients"] === "object") {
          __spreadArray([], self["clients"].matchAll({ includeUncontrolled: true }), true).forEach(function(client) {
            return client.postMessage({
              type: STORAGE_MUTATED_DOM_EVENT_NAME,
              changedParts
            });
          });
        }
      }
    } catch (_a2) {
    }
  });
  addEventListener("storage", function(ev) {
    if (ev.key === STORAGE_MUTATED_DOM_EVENT_NAME) {
      var data = JSON.parse(ev.newValue);
      if (data)
        propagateLocally(data.changedParts);
    }
  });
  var swContainer = self.document && navigator.serviceWorker;
  if (swContainer) {
    swContainer.addEventListener("message", propagateMessageLocally);
  }
}
function propagateMessageLocally(_a2) {
  var data = _a2.data;
  if (data && data.type === STORAGE_MUTATED_DOM_EVENT_NAME) {
    propagateLocally(data.changedParts);
  }
}
DexiePromise.rejectionMapper = mapError;
setDebug(debug, dexieStackFrameFilter);
var KTX2Worker_bundle_default = '(() => {\n  var __create = Object.create;\n  var __defProp = Object.defineProperty;\n  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;\n  var __getOwnPropNames = Object.getOwnPropertyNames;\n  var __getProtoOf = Object.getPrototypeOf;\n  var __hasOwnProp = Object.prototype.hasOwnProperty;\n  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });\n  var __commonJS = (cb, mod) => function __require() {\n    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;\n  };\n  var __reExport = (target, module, copyDefault, desc) => {\n    if (module && typeof module === "object" || typeof module === "function") {\n      for (let key of __getOwnPropNames(module))\n        if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))\n          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });\n    }\n    return target;\n  };\n  var __toESM = (module, isNodeMode) => {\n    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", !isNodeMode && module && module.__esModule ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);\n  };\n\n  // (disabled):../../node_modules/@loaders.gl/worker-utils/dist/esm/lib/node/require-utils.node\n  var require_require_utils = __commonJS({\n    "(disabled):../../node_modules/@loaders.gl/worker-utils/dist/esm/lib/node/require-utils.node"() {\n    }\n  });\n\n  // ../../node_modules/@loaders.gl/textures/dist/esm/lib/utils/version.js\n  var VERSION = true ? "3.1.4" : "latest";\n\n  // ../../node_modules/@loaders.gl/worker-utils/dist/esm/lib/env-utils/assert.js\n  function assert(condition, message) {\n    if (!condition) {\n      throw new Error(message || "loaders.gl assertion failed.");\n    }\n  }\n\n  // ../../node_modules/@loaders.gl/worker-utils/dist/esm/lib/env-utils/globals.js\n  var globals = {\n    self: typeof self !== "undefined" && self,\n    window: typeof window !== "undefined" && window,\n    global: typeof global !== "undefined" && global,\n    document: typeof document !== "undefined" && document\n  };\n  var self_ = globals.self || globals.window || globals.global || {};\n  var window_ = globals.window || globals.self || globals.global || {};\n  var global_ = globals.global || globals.self || globals.window || {};\n  var document_ = globals.document || {};\n  var isBrowser = typeof process !== "object" || String(process) !== "[object process]" || process.browser;\n  var isWorker = typeof importScripts === "function";\n  var isMobile = typeof window !== "undefined" && typeof window.orientation !== "undefined";\n  var matches = typeof process !== "undefined" && process.version && /v([0-9]*)/.exec(process.version);\n  var nodeVersion = matches && parseFloat(matches[1]) || 0;\n\n  // ../../node_modules/@loaders.gl/worker-utils/dist/esm/lib/library-utils/library-utils.js\n  var node = __toESM(require_require_utils());\n  var VERSION2 = true ? "3.1.4" : LATEST;\n  var loadLibraryPromises = {};\n  async function loadLibrary(libraryUrl, moduleName = null, options = {}) {\n    if (moduleName) {\n      libraryUrl = getLibraryUrl(libraryUrl, moduleName, options);\n    }\n    loadLibraryPromises[libraryUrl] = loadLibraryPromises[libraryUrl] || loadLibraryFromFile(libraryUrl);\n    return await loadLibraryPromises[libraryUrl];\n  }\n  function getLibraryUrl(library, moduleName, options) {\n    if (library.startsWith("http")) {\n      return library;\n    }\n    const modules = options.modules || {};\n    if (modules[library]) {\n      return modules[library];\n    }\n    if (!isBrowser) {\n      return "modules/".concat(moduleName, "/dist/libs/").concat(library);\n    }\n    if (options.CDN) {\n      assert(options.CDN.startsWith("http"));\n      return "".concat(options.CDN, "/").concat(moduleName, "@").concat(VERSION2, "/dist/libs/").concat(library);\n    }\n    if (isWorker) {\n      return "../src/libs/".concat(library);\n    }\n    return "modules/".concat(moduleName, "/src/libs/").concat(library);\n  }\n  async function loadLibraryFromFile(libraryUrl) {\n    if (libraryUrl.endsWith("wasm")) {\n      const response2 = await fetch(libraryUrl);\n      return await response2.arrayBuffer();\n    }\n    if (!isBrowser) {\n      try {\n        return node && node.requireFromFile && await node.requireFromFile(libraryUrl);\n      } catch {\n        return null;\n      }\n    }\n    if (isWorker) {\n      return importScripts(libraryUrl);\n    }\n    const response = await fetch(libraryUrl);\n    const scriptSource = await response.text();\n    return loadLibraryFromString(scriptSource, libraryUrl);\n  }\n  function loadLibraryFromString(scriptSource, id) {\n    if (!isBrowser) {\n      return node.requireFromString && node.requireFromString(scriptSource, id);\n    }\n    if (isWorker) {\n      eval.call(global_, scriptSource);\n      return null;\n    }\n    const script = document.createElement("script");\n    script.id = id;\n    try {\n      script.appendChild(document.createTextNode(scriptSource));\n    } catch (e) {\n      script.text = scriptSource;\n    }\n    document.body.appendChild(script);\n    return null;\n  }\n\n  // ../../node_modules/@loaders.gl/textures/dist/esm/lib/parsers/basis-module-loader.js\n  var VERSION3 = true ? "3.1.4" : "latest";\n  var BASIS_CDN_ENCODER_WASM = "https://unpkg.com/@loaders.gl/textures@".concat(VERSION3, "/dist/libs/basis_encoder.wasm");\n  var BASIS_CDN_ENCODER_JS = "https://unpkg.com/@loaders.gl/textures@".concat(VERSION3, "/dist/libs/basis_encoder.js");\n  var loadBasisEncoderPromise;\n  async function loadBasisEncoderModule(options) {\n    const modules = options.modules || {};\n    if (modules.basisEncoder) {\n      return modules.basisEncoder;\n    }\n    loadBasisEncoderPromise = loadBasisEncoderPromise || loadBasisEncoder(options);\n    return await loadBasisEncoderPromise;\n  }\n  async function loadBasisEncoder(options) {\n    let BASIS_ENCODER = null;\n    let wasmBinary = null;\n    [BASIS_ENCODER, wasmBinary] = await Promise.all([await loadLibrary(BASIS_CDN_ENCODER_JS, "textures", options), await loadLibrary(BASIS_CDN_ENCODER_WASM, "textures", options)]);\n    BASIS_ENCODER = BASIS_ENCODER || globalThis.BASIS;\n    return await initializeBasisEncoderModule(BASIS_ENCODER, wasmBinary);\n  }\n  function initializeBasisEncoderModule(BasisEncoderModule, wasmBinary) {\n    const options = {};\n    if (wasmBinary) {\n      options.wasmBinary = wasmBinary;\n    }\n    return new Promise((resolve) => {\n      BasisEncoderModule(options).then((module) => {\n        const {\n          BasisFile,\n          KTX2File,\n          initializeBasis,\n          BasisEncoder\n        } = module;\n        initializeBasis();\n        resolve({\n          BasisFile,\n          KTX2File,\n          BasisEncoder\n        });\n      });\n    });\n  }\n\n  // ../../node_modules/@loaders.gl/textures/dist/esm/lib/encoders/encode-ktx2-basis-texture.js\n  async function encodeKTX2BasisTexture(image, options = {}) {\n    const {\n      useSRGB = false,\n      qualityLevel = 10,\n      encodeUASTC = false,\n      mipmaps = false\n    } = options;\n    const {\n      BasisEncoder\n    } = await loadBasisEncoderModule(options);\n    const basisEncoder = new BasisEncoder();\n    try {\n      const basisFileData = new Uint8Array(image.width * image.height * 4);\n      basisEncoder.setCreateKTX2File(true);\n      basisEncoder.setKTX2UASTCSupercompression(true);\n      basisEncoder.setKTX2SRGBTransferFunc(true);\n      basisEncoder.setSliceSourceImage(0, image.data, image.width, image.height, false);\n      basisEncoder.setPerceptual(useSRGB);\n      basisEncoder.setMipSRGB(useSRGB);\n      basisEncoder.setQualityLevel(qualityLevel);\n      basisEncoder.setUASTC(encodeUASTC);\n      basisEncoder.setMipGen(mipmaps);\n      const numOutputBytes = basisEncoder.encode(basisFileData);\n      const actualKTX2FileData = basisFileData.subarray(0, numOutputBytes).buffer;\n      return actualKTX2FileData;\n    } catch (error) {\n      console.error("Basis Universal Supercompressed GPU Texture encoder Error: ", error);\n      throw error;\n    } finally {\n      basisEncoder.delete();\n    }\n  }\n\n  // ../../node_modules/@loaders.gl/textures/dist/esm/ktx2-basis-universal-texture-writer.js\n  var KTX2BasisUniversalTextureWriter = {\n    name: "Basis Universal Supercompressed GPU Texture",\n    id: "ktx2-basis-supercompressed-texture",\n    module: "textures",\n    version: VERSION,\n    extensions: ["ktx2"],\n    options: {\n      useSRGB: false,\n      qualityLevel: 10,\n      encodeUASTC: false,\n      mipmaps: false\n    },\n    encode: encodeKTX2BasisTexture\n  };\n\n  // core/textures/KTX2Worker.ts\n  var worker = self;\n  worker.onmessage = async (msg) => {\n    try {\n      const texture = await KTX2BasisUniversalTextureWriter.encode(msg.data, {\n        useSRGB: true,\n        encodeUASTC: true,\n        mipmaps: true\n      });\n      const response = { texture };\n      worker.postMessage(response, [texture]);\n    } catch (err) {\n      worker.postMessage({ error: err.message });\n    }\n  };\n})();\n';
var workerBlob = new Blob([KTX2Worker_bundle_default], { type: "text/javascript" });
URL.createObjectURL(workerBlob);
const byteToHex = new Array(255);
for (let n = 0; n <= 255; ++n) {
  const hexOctet = n.toString(16).padStart(2, "0");
  byteToHex[n] = hexOctet;
}
var decoder;
try {
  decoder = new TextDecoder();
} catch (error) {
}
var src;
var srcEnd;
var position$1 = 0;
var currentUnpackr = {};
var currentStructures;
var srcString;
var srcStringStart = 0;
var srcStringEnd = 0;
var bundledStrings$1;
var referenceMap;
var currentExtensions = [];
var dataView;
var defaultOptions = {
  useRecords: false,
  mapsAsObjects: true
};
class C1Type {
}
const C1 = new C1Type();
C1.name = "MessagePack 0xC1";
var sequentialMode = false;
class Unpackr {
  constructor(options) {
    if (options) {
      if (options.useRecords === false && options.mapsAsObjects === void 0)
        options.mapsAsObjects = true;
      if (options.structures)
        options.structures.sharedLength = options.structures.length;
      else if (options.getStructures) {
        (options.structures = []).uninitialized = true;
        options.structures.sharedLength = 0;
      }
    }
    Object.assign(this, options);
  }
  unpack(source, end) {
    if (src) {
      return saveState(() => {
        clearSource();
        return this ? this.unpack(source, end) : Unpackr.prototype.unpack.call(defaultOptions, source, end);
      });
    }
    srcEnd = end > -1 ? end : source.length;
    position$1 = 0;
    srcStringEnd = 0;
    srcString = null;
    bundledStrings$1 = null;
    src = source;
    try {
      dataView = source.dataView || (source.dataView = new DataView(source.buffer, source.byteOffset, source.byteLength));
    } catch (error) {
      src = null;
      if (source instanceof Uint8Array)
        throw error;
      throw new Error("Source must be a Uint8Array or Buffer but was a " + (source && typeof source == "object" ? source.constructor.name : typeof source));
    }
    if (this instanceof Unpackr) {
      currentUnpackr = this;
      if (this.structures) {
        currentStructures = this.structures;
        return checkedRead();
      } else if (!currentStructures || currentStructures.length > 0) {
        currentStructures = [];
      }
    } else {
      currentUnpackr = defaultOptions;
      if (!currentStructures || currentStructures.length > 0)
        currentStructures = [];
    }
    return checkedRead();
  }
  unpackMultiple(source, forEach) {
    let values, lastPosition = 0;
    try {
      sequentialMode = true;
      let size2 = source.length;
      let value = this ? this.unpack(source, size2) : defaultUnpackr.unpack(source, size2);
      if (forEach) {
        forEach(value);
        while (position$1 < size2) {
          lastPosition = position$1;
          if (forEach(checkedRead()) === false) {
            return;
          }
        }
      } else {
        values = [value];
        while (position$1 < size2) {
          lastPosition = position$1;
          values.push(checkedRead());
        }
        return values;
      }
    } catch (error) {
      error.lastPosition = lastPosition;
      error.values = values;
      throw error;
    } finally {
      sequentialMode = false;
      clearSource();
    }
  }
  _mergeStructures(loadedStructures, existingStructures) {
    loadedStructures = loadedStructures || [];
    for (let i = 0, l = loadedStructures.length; i < l; i++) {
      let structure = loadedStructures[i];
      if (structure) {
        structure.isShared = true;
        if (i >= 32)
          structure.highByte = i - 32 >> 5;
      }
    }
    loadedStructures.sharedLength = loadedStructures.length;
    for (let id in existingStructures || []) {
      if (id >= 0) {
        let structure = loadedStructures[id];
        let existing = existingStructures[id];
        if (existing) {
          if (structure)
            (loadedStructures.restoreStructures || (loadedStructures.restoreStructures = []))[id] = structure;
          loadedStructures[id] = existing;
        }
      }
    }
    return this.structures = loadedStructures;
  }
  decode(source, end) {
    return this.unpack(source, end);
  }
}
function checkedRead() {
  try {
    if (!currentUnpackr.trusted && !sequentialMode) {
      let sharedLength = currentStructures.sharedLength || 0;
      if (sharedLength < currentStructures.length)
        currentStructures.length = sharedLength;
    }
    let result = read();
    if (bundledStrings$1)
      position$1 = bundledStrings$1.postBundlePosition;
    if (position$1 == srcEnd) {
      if (currentStructures.restoreStructures)
        restoreStructures();
      currentStructures = null;
      src = null;
      if (referenceMap)
        referenceMap = null;
    } else if (position$1 > srcEnd) {
      let error = new Error("Unexpected end of MessagePack data");
      error.incomplete = true;
      throw error;
    } else if (!sequentialMode) {
      throw new Error("Data read, but end of buffer not reached");
    }
    return result;
  } catch (error) {
    if (currentStructures.restoreStructures)
      restoreStructures();
    clearSource();
    if (error instanceof RangeError || error.message.startsWith("Unexpected end of buffer")) {
      error.incomplete = true;
    }
    throw error;
  }
}
function restoreStructures() {
  for (let id in currentStructures.restoreStructures) {
    currentStructures[id] = currentStructures.restoreStructures[id];
  }
  currentStructures.restoreStructures = null;
}
function read() {
  let token = src[position$1++];
  if (token < 160) {
    if (token < 128) {
      if (token < 64)
        return token;
      else {
        let structure = currentStructures[token & 63] || currentUnpackr.getStructures && loadStructures()[token & 63];
        if (structure) {
          if (!structure.read) {
            structure.read = createStructureReader(structure, token & 63);
          }
          return structure.read();
        } else
          return token;
      }
    } else if (token < 144) {
      token -= 128;
      if (currentUnpackr.mapsAsObjects) {
        let object = {};
        for (let i = 0; i < token; i++) {
          object[readKey()] = read();
        }
        return object;
      } else {
        let map = /* @__PURE__ */ new Map();
        for (let i = 0; i < token; i++) {
          map.set(read(), read());
        }
        return map;
      }
    } else {
      token -= 144;
      let array = new Array(token);
      for (let i = 0; i < token; i++) {
        array[i] = read();
      }
      return array;
    }
  } else if (token < 192) {
    let length = token - 160;
    if (srcStringEnd >= position$1) {
      return srcString.slice(position$1 - srcStringStart, (position$1 += length) - srcStringStart);
    }
    if (srcStringEnd == 0 && srcEnd < 140) {
      let string = length < 16 ? shortStringInJS(length) : longStringInJS(length);
      if (string != null)
        return string;
    }
    return readFixedString(length);
  } else {
    let value;
    switch (token) {
      case 192:
        return null;
      case 193:
        if (bundledStrings$1) {
          value = read();
          if (value > 0)
            return bundledStrings$1[1].slice(bundledStrings$1.position1, bundledStrings$1.position1 += value);
          else
            return bundledStrings$1[0].slice(bundledStrings$1.position0, bundledStrings$1.position0 -= value);
        }
        return C1;
      case 194:
        return false;
      case 195:
        return true;
      case 196:
        return readBin(src[position$1++]);
      case 197:
        value = dataView.getUint16(position$1);
        position$1 += 2;
        return readBin(value);
      case 198:
        value = dataView.getUint32(position$1);
        position$1 += 4;
        return readBin(value);
      case 199:
        return readExt(src[position$1++]);
      case 200:
        value = dataView.getUint16(position$1);
        position$1 += 2;
        return readExt(value);
      case 201:
        value = dataView.getUint32(position$1);
        position$1 += 4;
        return readExt(value);
      case 202:
        value = dataView.getFloat32(position$1);
        if (currentUnpackr.useFloat32 > 2) {
          let multiplier = mult10[(src[position$1] & 127) << 1 | src[position$1 + 1] >> 7];
          position$1 += 4;
          return (multiplier * value + (value > 0 ? 0.5 : -0.5) >> 0) / multiplier;
        }
        position$1 += 4;
        return value;
      case 203:
        value = dataView.getFloat64(position$1);
        position$1 += 8;
        return value;
      case 204:
        return src[position$1++];
      case 205:
        value = dataView.getUint16(position$1);
        position$1 += 2;
        return value;
      case 206:
        value = dataView.getUint32(position$1);
        position$1 += 4;
        return value;
      case 207:
        if (currentUnpackr.int64AsNumber) {
          value = dataView.getUint32(position$1) * 4294967296;
          value += dataView.getUint32(position$1 + 4);
        } else
          value = dataView.getBigUint64(position$1);
        position$1 += 8;
        return value;
      case 208:
        return dataView.getInt8(position$1++);
      case 209:
        value = dataView.getInt16(position$1);
        position$1 += 2;
        return value;
      case 210:
        value = dataView.getInt32(position$1);
        position$1 += 4;
        return value;
      case 211:
        if (currentUnpackr.int64AsNumber) {
          value = dataView.getInt32(position$1) * 4294967296;
          value += dataView.getUint32(position$1 + 4);
        } else
          value = dataView.getBigInt64(position$1);
        position$1 += 8;
        return value;
      case 212:
        value = src[position$1++];
        if (value == 114) {
          return recordDefinition(src[position$1++] & 63);
        } else {
          let extension = currentExtensions[value];
          if (extension) {
            if (extension.read) {
              position$1++;
              return extension.read(read());
            } else if (extension.noBuffer) {
              position$1++;
              return extension();
            } else
              return extension(src.subarray(position$1, ++position$1));
          } else
            throw new Error("Unknown extension " + value);
        }
      case 213:
        value = src[position$1];
        if (value == 114) {
          position$1++;
          return recordDefinition(src[position$1++] & 63, src[position$1++]);
        } else
          return readExt(2);
      case 214:
        return readExt(4);
      case 215:
        return readExt(8);
      case 216:
        return readExt(16);
      case 217:
        value = src[position$1++];
        if (srcStringEnd >= position$1) {
          return srcString.slice(position$1 - srcStringStart, (position$1 += value) - srcStringStart);
        }
        return readString8(value);
      case 218:
        value = dataView.getUint16(position$1);
        position$1 += 2;
        if (srcStringEnd >= position$1) {
          return srcString.slice(position$1 - srcStringStart, (position$1 += value) - srcStringStart);
        }
        return readString16(value);
      case 219:
        value = dataView.getUint32(position$1);
        position$1 += 4;
        if (srcStringEnd >= position$1) {
          return srcString.slice(position$1 - srcStringStart, (position$1 += value) - srcStringStart);
        }
        return readString32(value);
      case 220:
        value = dataView.getUint16(position$1);
        position$1 += 2;
        return readArray(value);
      case 221:
        value = dataView.getUint32(position$1);
        position$1 += 4;
        return readArray(value);
      case 222:
        value = dataView.getUint16(position$1);
        position$1 += 2;
        return readMap(value);
      case 223:
        value = dataView.getUint32(position$1);
        position$1 += 4;
        return readMap(value);
      default:
        if (token >= 224)
          return token - 256;
        if (token === void 0) {
          let error = new Error("Unexpected end of MessagePack data");
          error.incomplete = true;
          throw error;
        }
        throw new Error("Unknown MessagePack token " + token);
    }
  }
}
const validName = /^[a-zA-Z_$][a-zA-Z\d_$]*$/;
function createStructureReader(structure, firstId) {
  function readObject() {
    if (readObject.count++ > 2) {
      let readObject2 = structure.read = new Function("r", "return function(){return {" + structure.map((key) => validName.test(key) ? key + ":r()" : "[" + JSON.stringify(key) + "]:r()").join(",") + "}}")(read);
      if (structure.highByte === 0)
        structure.read = createSecondByteReader(firstId, structure.read);
      return readObject2();
    }
    let object = {};
    for (let i = 0, l = structure.length; i < l; i++) {
      let key = structure[i];
      object[key] = read();
    }
    return object;
  }
  readObject.count = 0;
  if (structure.highByte === 0) {
    return createSecondByteReader(firstId, readObject);
  }
  return readObject;
}
const createSecondByteReader = (firstId, read0) => {
  return function() {
    let highByte = src[position$1++];
    if (highByte === 0)
      return read0();
    let id = firstId < 32 ? -(firstId + (highByte << 5)) : firstId + (highByte << 5);
    let structure = currentStructures[id] || loadStructures()[id];
    if (!structure) {
      throw new Error("Record id is not defined for " + id);
    }
    if (!structure.read)
      structure.read = createStructureReader(structure, firstId);
    return structure.read();
  };
};
function loadStructures() {
  let loadedStructures = saveState(() => {
    src = null;
    return currentUnpackr.getStructures();
  });
  return currentStructures = currentUnpackr._mergeStructures(loadedStructures, currentStructures);
}
var readFixedString = readStringJS;
var readString8 = readStringJS;
var readString16 = readStringJS;
var readString32 = readStringJS;
function readStringJS(length) {
  let result;
  if (length < 16) {
    if (result = shortStringInJS(length))
      return result;
  }
  if (length > 64 && decoder)
    return decoder.decode(src.subarray(position$1, position$1 += length));
  const end = position$1 + length;
  const units = [];
  result = "";
  while (position$1 < end) {
    const byte1 = src[position$1++];
    if ((byte1 & 128) === 0) {
      units.push(byte1);
    } else if ((byte1 & 224) === 192) {
      const byte2 = src[position$1++] & 63;
      units.push((byte1 & 31) << 6 | byte2);
    } else if ((byte1 & 240) === 224) {
      const byte2 = src[position$1++] & 63;
      const byte3 = src[position$1++] & 63;
      units.push((byte1 & 31) << 12 | byte2 << 6 | byte3);
    } else if ((byte1 & 248) === 240) {
      const byte2 = src[position$1++] & 63;
      const byte3 = src[position$1++] & 63;
      const byte4 = src[position$1++] & 63;
      let unit = (byte1 & 7) << 18 | byte2 << 12 | byte3 << 6 | byte4;
      if (unit > 65535) {
        unit -= 65536;
        units.push(unit >>> 10 & 1023 | 55296);
        unit = 56320 | unit & 1023;
      }
      units.push(unit);
    } else {
      units.push(byte1);
    }
    if (units.length >= 4096) {
      result += fromCharCode.apply(String, units);
      units.length = 0;
    }
  }
  if (units.length > 0) {
    result += fromCharCode.apply(String, units);
  }
  return result;
}
function readArray(length) {
  let array = new Array(length);
  for (let i = 0; i < length; i++) {
    array[i] = read();
  }
  return array;
}
function readMap(length) {
  if (currentUnpackr.mapsAsObjects) {
    let object = {};
    for (let i = 0; i < length; i++) {
      object[readKey()] = read();
    }
    return object;
  } else {
    let map = /* @__PURE__ */ new Map();
    for (let i = 0; i < length; i++) {
      map.set(read(), read());
    }
    return map;
  }
}
var fromCharCode = String.fromCharCode;
function longStringInJS(length) {
  let start = position$1;
  let bytes = new Array(length);
  for (let i = 0; i < length; i++) {
    const byte = src[position$1++];
    if ((byte & 128) > 0) {
      position$1 = start;
      return;
    }
    bytes[i] = byte;
  }
  return fromCharCode.apply(String, bytes);
}
function shortStringInJS(length) {
  if (length < 4) {
    if (length < 2) {
      if (length === 0)
        return "";
      else {
        let a = src[position$1++];
        if ((a & 128) > 1) {
          position$1 -= 1;
          return;
        }
        return fromCharCode(a);
      }
    } else {
      let a = src[position$1++];
      let b = src[position$1++];
      if ((a & 128) > 0 || (b & 128) > 0) {
        position$1 -= 2;
        return;
      }
      if (length < 3)
        return fromCharCode(a, b);
      let c = src[position$1++];
      if ((c & 128) > 0) {
        position$1 -= 3;
        return;
      }
      return fromCharCode(a, b, c);
    }
  } else {
    let a = src[position$1++];
    let b = src[position$1++];
    let c = src[position$1++];
    let d = src[position$1++];
    if ((a & 128) > 0 || (b & 128) > 0 || (c & 128) > 0 || (d & 128) > 0) {
      position$1 -= 4;
      return;
    }
    if (length < 6) {
      if (length === 4)
        return fromCharCode(a, b, c, d);
      else {
        let e = src[position$1++];
        if ((e & 128) > 0) {
          position$1 -= 5;
          return;
        }
        return fromCharCode(a, b, c, d, e);
      }
    } else if (length < 8) {
      let e = src[position$1++];
      let f = src[position$1++];
      if ((e & 128) > 0 || (f & 128) > 0) {
        position$1 -= 6;
        return;
      }
      if (length < 7)
        return fromCharCode(a, b, c, d, e, f);
      let g = src[position$1++];
      if ((g & 128) > 0) {
        position$1 -= 7;
        return;
      }
      return fromCharCode(a, b, c, d, e, f, g);
    } else {
      let e = src[position$1++];
      let f = src[position$1++];
      let g = src[position$1++];
      let h = src[position$1++];
      if ((e & 128) > 0 || (f & 128) > 0 || (g & 128) > 0 || (h & 128) > 0) {
        position$1 -= 8;
        return;
      }
      if (length < 10) {
        if (length === 8)
          return fromCharCode(a, b, c, d, e, f, g, h);
        else {
          let i = src[position$1++];
          if ((i & 128) > 0) {
            position$1 -= 9;
            return;
          }
          return fromCharCode(a, b, c, d, e, f, g, h, i);
        }
      } else if (length < 12) {
        let i = src[position$1++];
        let j = src[position$1++];
        if ((i & 128) > 0 || (j & 128) > 0) {
          position$1 -= 10;
          return;
        }
        if (length < 11)
          return fromCharCode(a, b, c, d, e, f, g, h, i, j);
        let k = src[position$1++];
        if ((k & 128) > 0) {
          position$1 -= 11;
          return;
        }
        return fromCharCode(a, b, c, d, e, f, g, h, i, j, k);
      } else {
        let i = src[position$1++];
        let j = src[position$1++];
        let k = src[position$1++];
        let l = src[position$1++];
        if ((i & 128) > 0 || (j & 128) > 0 || (k & 128) > 0 || (l & 128) > 0) {
          position$1 -= 12;
          return;
        }
        if (length < 14) {
          if (length === 12)
            return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l);
          else {
            let m = src[position$1++];
            if ((m & 128) > 0) {
              position$1 -= 13;
              return;
            }
            return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l, m);
          }
        } else {
          let m = src[position$1++];
          let n = src[position$1++];
          if ((m & 128) > 0 || (n & 128) > 0) {
            position$1 -= 14;
            return;
          }
          if (length < 15)
            return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l, m, n);
          let o = src[position$1++];
          if ((o & 128) > 0) {
            position$1 -= 15;
            return;
          }
          return fromCharCode(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o);
        }
      }
    }
  }
}
function readOnlyJSString() {
  let token = src[position$1++];
  let length;
  if (token < 192) {
    length = token - 160;
  } else {
    switch (token) {
      case 217:
        length = src[position$1++];
        break;
      case 218:
        length = dataView.getUint16(position$1);
        position$1 += 2;
        break;
      case 219:
        length = dataView.getUint32(position$1);
        position$1 += 4;
        break;
      default:
        throw new Error("Expected string");
    }
  }
  return readStringJS(length);
}
function readBin(length) {
  return currentUnpackr.copyBuffers ? Uint8Array.prototype.slice.call(src, position$1, position$1 += length) : src.subarray(position$1, position$1 += length);
}
function readExt(length) {
  let type2 = src[position$1++];
  if (currentExtensions[type2]) {
    return currentExtensions[type2](src.subarray(position$1, position$1 += length));
  } else
    throw new Error("Unknown extension type " + type2);
}
var keyCache = new Array(4096);
function readKey() {
  let length = src[position$1++];
  if (length >= 160 && length < 192) {
    length = length - 160;
    if (srcStringEnd >= position$1)
      return srcString.slice(position$1 - srcStringStart, (position$1 += length) - srcStringStart);
    else if (!(srcStringEnd == 0 && srcEnd < 180))
      return readFixedString(length);
  } else {
    position$1--;
    return read();
  }
  let key = (length << 5 ^ (length > 1 ? dataView.getUint16(position$1) : length > 0 ? src[position$1] : 0)) & 4095;
  let entry = keyCache[key];
  let checkPosition = position$1;
  let end = position$1 + length - 3;
  let chunk;
  let i = 0;
  if (entry && entry.bytes == length) {
    while (checkPosition < end) {
      chunk = dataView.getUint32(checkPosition);
      if (chunk != entry[i++]) {
        checkPosition = 1879048192;
        break;
      }
      checkPosition += 4;
    }
    end += 3;
    while (checkPosition < end) {
      chunk = src[checkPosition++];
      if (chunk != entry[i++]) {
        checkPosition = 1879048192;
        break;
      }
    }
    if (checkPosition === end) {
      position$1 = checkPosition;
      return entry.string;
    }
    end -= 3;
    checkPosition = position$1;
  }
  entry = [];
  keyCache[key] = entry;
  entry.bytes = length;
  while (checkPosition < end) {
    chunk = dataView.getUint32(checkPosition);
    entry.push(chunk);
    checkPosition += 4;
  }
  end += 3;
  while (checkPosition < end) {
    chunk = src[checkPosition++];
    entry.push(chunk);
  }
  let string = length < 16 ? shortStringInJS(length) : longStringInJS(length);
  if (string != null)
    return entry.string = string;
  return entry.string = readFixedString(length);
}
const recordDefinition = (id, highByte) => {
  var structure = read();
  let firstByte = id;
  if (highByte !== void 0) {
    id = id < 32 ? -((highByte << 5) + id) : (highByte << 5) + id;
    structure.highByte = highByte;
  }
  let existingStructure = currentStructures[id];
  if (existingStructure && existingStructure.isShared) {
    (currentStructures.restoreStructures || (currentStructures.restoreStructures = []))[id] = existingStructure;
  }
  currentStructures[id] = structure;
  structure.read = createStructureReader(structure, firstByte);
  return structure.read();
};
var glbl = typeof self == "object" ? self : global;
currentExtensions[0] = () => {
};
currentExtensions[0].noBuffer = true;
currentExtensions[101] = () => {
  let data = read();
  return (glbl[data[0]] || Error)(data[1]);
};
currentExtensions[105] = (data) => {
  let id = dataView.getUint32(position$1 - 4);
  if (!referenceMap)
    referenceMap = /* @__PURE__ */ new Map();
  let token = src[position$1];
  let target2;
  if (token >= 144 && token < 160 || token == 220 || token == 221)
    target2 = [];
  else
    target2 = {};
  let refEntry = { target: target2 };
  referenceMap.set(id, refEntry);
  let targetProperties = read();
  if (refEntry.used)
    return Object.assign(target2, targetProperties);
  refEntry.target = targetProperties;
  return targetProperties;
};
currentExtensions[112] = (data) => {
  let id = dataView.getUint32(position$1 - 4);
  let refEntry = referenceMap.get(id);
  refEntry.used = true;
  return refEntry.target;
};
currentExtensions[115] = () => new Set(read());
const typedArrays = ["Int8", "Uint8", "Uint8Clamped", "Int16", "Uint16", "Int32", "Uint32", "Float32", "Float64", "BigInt64", "BigUint64"].map((type2) => type2 + "Array");
currentExtensions[116] = (data) => {
  let typeCode = data[0];
  let typedArrayName = typedArrays[typeCode];
  if (!typedArrayName)
    throw new Error("Could not find typed array for code " + typeCode);
  return new glbl[typedArrayName](Uint8Array.prototype.slice.call(data, 1).buffer);
};
currentExtensions[120] = () => {
  let data = read();
  return new RegExp(data[0], data[1]);
};
const TEMP_BUNDLE = [];
currentExtensions[98] = (data) => {
  let dataSize = (data[0] << 24) + (data[1] << 16) + (data[2] << 8) + data[3];
  let dataPosition = position$1;
  position$1 += dataSize - data.length;
  bundledStrings$1 = TEMP_BUNDLE;
  bundledStrings$1 = [readOnlyJSString(), readOnlyJSString()];
  bundledStrings$1.position0 = 0;
  bundledStrings$1.position1 = 0;
  bundledStrings$1.postBundlePosition = position$1;
  position$1 = dataPosition;
  return read();
};
currentExtensions[255] = (data) => {
  if (data.length == 4)
    return new Date((data[0] * 16777216 + (data[1] << 16) + (data[2] << 8) + data[3]) * 1e3);
  else if (data.length == 8)
    return new Date(((data[0] << 22) + (data[1] << 14) + (data[2] << 6) + (data[3] >> 2)) / 1e6 + ((data[3] & 3) * 4294967296 + data[4] * 16777216 + (data[5] << 16) + (data[6] << 8) + data[7]) * 1e3);
  else if (data.length == 12)
    return new Date(((data[0] << 24) + (data[1] << 16) + (data[2] << 8) + data[3]) / 1e6 + ((data[4] & 128 ? -281474976710656 : 0) + data[6] * 1099511627776 + data[7] * 4294967296 + data[8] * 16777216 + (data[9] << 16) + (data[10] << 8) + data[11]) * 1e3);
  else
    return new Date("invalid");
};
function saveState(callback) {
  let savedSrcEnd = srcEnd;
  let savedPosition = position$1;
  let savedSrcStringStart = srcStringStart;
  let savedSrcStringEnd = srcStringEnd;
  let savedSrcString = srcString;
  let savedReferenceMap = referenceMap;
  let savedBundledStrings = bundledStrings$1;
  let savedSrc = new Uint8Array(src.slice(0, srcEnd));
  let savedStructures = currentStructures;
  let savedStructuresContents = currentStructures.slice(0, currentStructures.length);
  let savedPackr = currentUnpackr;
  let savedSequentialMode = sequentialMode;
  let value = callback();
  srcEnd = savedSrcEnd;
  position$1 = savedPosition;
  srcStringStart = savedSrcStringStart;
  srcStringEnd = savedSrcStringEnd;
  srcString = savedSrcString;
  referenceMap = savedReferenceMap;
  bundledStrings$1 = savedBundledStrings;
  src = savedSrc;
  sequentialMode = savedSequentialMode;
  currentStructures = savedStructures;
  currentStructures.splice(0, currentStructures.length, ...savedStructuresContents);
  currentUnpackr = savedPackr;
  dataView = new DataView(src.buffer, src.byteOffset, src.byteLength);
  return value;
}
function clearSource() {
  src = null;
  referenceMap = null;
  currentStructures = null;
}
const mult10 = new Array(147);
for (let i = 0; i < 256; i++) {
  mult10[i] = +("1e" + Math.floor(45.15 - i * 0.30103));
}
var defaultUnpackr = new Unpackr({ useRecords: false });
defaultUnpackr.unpack;
defaultUnpackr.unpackMultiple;
defaultUnpackr.unpack;
let f32Array = new Float32Array(1);
new Uint8Array(f32Array.buffer, 0, 4);
let textEncoder;
try {
  textEncoder = new TextEncoder();
} catch (error) {
}
let extensions, extensionClasses;
const hasNodeBuffer = typeof Buffer !== "undefined";
const ByteArrayAllocate = hasNodeBuffer ? Buffer.allocUnsafeSlow : Uint8Array;
const ByteArray = hasNodeBuffer ? Buffer : Uint8Array;
const MAX_BUFFER_SIZE = hasNodeBuffer ? 4294967296 : 2144337920;
let target, keysTarget;
let targetView;
let position = 0;
let safeEnd;
let bundledStrings = null;
const MAX_BUNDLE_SIZE = 61440;
const hasNonLatin = /[\u0080-\uFFFF]/;
const RECORD_SYMBOL = Symbol("record-id");
class Packr extends Unpackr {
  constructor(options) {
    super(options);
    this.offset = 0;
    let start;
    let hasSharedUpdate;
    let structures;
    let referenceMap2;
    let lastSharedStructuresLength = 0;
    let encodeUtf8 = ByteArray.prototype.utf8Write ? function(string, position2, maxBytes) {
      return target.utf8Write(string, position2, maxBytes);
    } : textEncoder && textEncoder.encodeInto ? function(string, position2) {
      return textEncoder.encodeInto(string, target.subarray(position2)).written;
    } : false;
    let packr = this;
    if (!options)
      options = {};
    let isSequential = options && options.sequential;
    let hasSharedStructures = options.structures || options.saveStructures;
    let maxSharedStructures = options.maxSharedStructures;
    if (maxSharedStructures == null)
      maxSharedStructures = hasSharedStructures ? 32 : 0;
    if (maxSharedStructures > 8160)
      throw new Error("Maximum maxSharedStructure is 8160");
    let maxOwnStructures = options.maxOwnStructures;
    if (maxOwnStructures == null)
      maxOwnStructures = hasSharedStructures ? 32 : 64;
    if (!this.structures && options.useRecords != false)
      this.structures = [];
    let useTwoByteRecords = maxSharedStructures > 32 || maxOwnStructures + maxSharedStructures > 64;
    let sharedLimitId = maxSharedStructures + 64;
    let maxStructureId = maxSharedStructures + maxOwnStructures + 64;
    if (maxStructureId > 8256) {
      throw new Error("Maximum maxSharedStructure + maxOwnStructure is 8192");
    }
    let recordIdsToRemove = [];
    let transitionsCount = 0;
    let serializationsSinceTransitionRebuild = 0;
    this.pack = this.encode = function(value, encodeOptions) {
      if (!target) {
        target = new ByteArrayAllocate(8192);
        targetView = new DataView(target.buffer, 0, 8192);
        position = 0;
      }
      safeEnd = target.length - 10;
      if (safeEnd - position < 2048) {
        target = new ByteArrayAllocate(target.length);
        targetView = new DataView(target.buffer, 0, target.length);
        safeEnd = target.length - 10;
        position = 0;
      } else
        position = position + 7 & 2147483640;
      start = position;
      referenceMap2 = packr.structuredClone ? /* @__PURE__ */ new Map() : null;
      if (packr.bundleStrings && typeof value !== "string") {
        bundledStrings = [];
        bundledStrings.size = Infinity;
      } else
        bundledStrings = null;
      structures = packr.structures;
      if (structures) {
        if (structures.uninitialized)
          structures = packr._mergeStructures(packr.getStructures());
        let sharedLength = structures.sharedLength || 0;
        if (sharedLength > maxSharedStructures) {
          throw new Error("Shared structures is larger than maximum shared structures, try increasing maxSharedStructures to " + structures.sharedLength);
        }
        if (!structures.transitions) {
          structures.transitions = /* @__PURE__ */ Object.create(null);
          for (let i = 0; i < sharedLength; i++) {
            let keys2 = structures[i];
            if (!keys2)
              continue;
            let nextTransition, transition = structures.transitions;
            for (let j = 0, l = keys2.length; j < l; j++) {
              let key = keys2[j];
              nextTransition = transition[key];
              if (!nextTransition) {
                nextTransition = transition[key] = /* @__PURE__ */ Object.create(null);
              }
              transition = nextTransition;
            }
            transition[RECORD_SYMBOL] = i + 64;
          }
          lastSharedStructuresLength = sharedLength;
        }
        if (!isSequential) {
          structures.nextId = sharedLength + 64;
        }
      }
      if (hasSharedUpdate)
        hasSharedUpdate = false;
      try {
        pack(value);
        if (bundledStrings) {
          writeBundles(start, pack);
        }
        packr.offset = position;
        if (referenceMap2 && referenceMap2.idsToInsert) {
          position += referenceMap2.idsToInsert.length * 6;
          if (position > safeEnd)
            makeRoom(position);
          packr.offset = position;
          let serialized = insertIds(target.subarray(start, position), referenceMap2.idsToInsert);
          referenceMap2 = null;
          return serialized;
        }
        if (encodeOptions & REUSE_BUFFER_MODE) {
          target.start = start;
          target.end = position;
          return target;
        }
        return target.subarray(start, position);
      } finally {
        if (structures) {
          if (serializationsSinceTransitionRebuild < 10)
            serializationsSinceTransitionRebuild++;
          let sharedLength = structures.sharedLength || maxSharedStructures;
          if (structures.length > sharedLength)
            structures.length = sharedLength;
          if (transitionsCount > 1e4) {
            structures.transitions = null;
            serializationsSinceTransitionRebuild = 0;
            transitionsCount = 0;
            if (recordIdsToRemove.length > 0)
              recordIdsToRemove = [];
          } else if (recordIdsToRemove.length > 0 && !isSequential) {
            for (let i = 0, l = recordIdsToRemove.length; i < l; i++) {
              recordIdsToRemove[i][RECORD_SYMBOL] = 0;
            }
            recordIdsToRemove = [];
          }
          if (hasSharedUpdate && packr.saveStructures) {
            let returnBuffer = target.subarray(start, position);
            if (packr.saveStructures(structures, lastSharedStructuresLength) === false) {
              packr._mergeStructures(packr.getStructures());
              return packr.pack(value);
            }
            lastSharedStructuresLength = sharedLength;
            return returnBuffer;
          }
        }
        if (encodeOptions & RESET_BUFFER_MODE)
          position = start;
      }
    };
    const pack = (value) => {
      if (position > safeEnd)
        target = makeRoom(position);
      var type2 = typeof value;
      var length;
      if (type2 === "string") {
        let strLength = value.length;
        if (bundledStrings && strLength >= 4 && strLength < 4096) {
          if ((bundledStrings.size += strLength) > MAX_BUNDLE_SIZE) {
            let extStart;
            let maxBytes2 = (bundledStrings[0] ? bundledStrings[0].length * 3 + bundledStrings[1].length : 0) + 10;
            if (position + maxBytes2 > safeEnd)
              target = makeRoom(position + maxBytes2);
            if (bundledStrings.position) {
              target[position] = 200;
              position += 3;
              target[position++] = 98;
              extStart = position - start;
              position += 4;
              writeBundles(start, pack);
              targetView.setUint16(extStart + start - 3, position - start - extStart);
            } else {
              target[position++] = 214;
              target[position++] = 98;
              extStart = position - start;
              position += 4;
            }
            bundledStrings = ["", ""];
            bundledStrings.size = 0;
            bundledStrings.position = extStart;
          }
          let twoByte = hasNonLatin.test(value);
          bundledStrings[twoByte ? 0 : 1] += value;
          target[position++] = 193;
          pack(twoByte ? -strLength : strLength);
          return;
        }
        let headerSize;
        if (strLength < 32) {
          headerSize = 1;
        } else if (strLength < 256) {
          headerSize = 2;
        } else if (strLength < 65536) {
          headerSize = 3;
        } else {
          headerSize = 5;
        }
        let maxBytes = strLength * 3;
        if (position + maxBytes > safeEnd)
          target = makeRoom(position + maxBytes);
        if (strLength < 64 || !encodeUtf8) {
          let i, c1, c2, strPosition = position + headerSize;
          for (i = 0; i < strLength; i++) {
            c1 = value.charCodeAt(i);
            if (c1 < 128) {
              target[strPosition++] = c1;
            } else if (c1 < 2048) {
              target[strPosition++] = c1 >> 6 | 192;
              target[strPosition++] = c1 & 63 | 128;
            } else if ((c1 & 64512) === 55296 && ((c2 = value.charCodeAt(i + 1)) & 64512) === 56320) {
              c1 = 65536 + ((c1 & 1023) << 10) + (c2 & 1023);
              i++;
              target[strPosition++] = c1 >> 18 | 240;
              target[strPosition++] = c1 >> 12 & 63 | 128;
              target[strPosition++] = c1 >> 6 & 63 | 128;
              target[strPosition++] = c1 & 63 | 128;
            } else {
              target[strPosition++] = c1 >> 12 | 224;
              target[strPosition++] = c1 >> 6 & 63 | 128;
              target[strPosition++] = c1 & 63 | 128;
            }
          }
          length = strPosition - position - headerSize;
        } else {
          length = encodeUtf8(value, position + headerSize, maxBytes);
        }
        if (length < 32) {
          target[position++] = 160 | length;
        } else if (length < 256) {
          if (headerSize < 2) {
            target.copyWithin(position + 2, position + 1, position + 1 + length);
          }
          target[position++] = 217;
          target[position++] = length;
        } else if (length < 65536) {
          if (headerSize < 3) {
            target.copyWithin(position + 3, position + 2, position + 2 + length);
          }
          target[position++] = 218;
          target[position++] = length >> 8;
          target[position++] = length & 255;
        } else {
          if (headerSize < 5) {
            target.copyWithin(position + 5, position + 3, position + 3 + length);
          }
          target[position++] = 219;
          targetView.setUint32(position, length);
          position += 4;
        }
        position += length;
      } else if (type2 === "number") {
        if (value >>> 0 === value) {
          if (value < 64) {
            target[position++] = value;
          } else if (value < 256) {
            target[position++] = 204;
            target[position++] = value;
          } else if (value < 65536) {
            target[position++] = 205;
            target[position++] = value >> 8;
            target[position++] = value & 255;
          } else {
            target[position++] = 206;
            targetView.setUint32(position, value);
            position += 4;
          }
        } else if (value >> 0 === value) {
          if (value >= -32) {
            target[position++] = 256 + value;
          } else if (value >= -128) {
            target[position++] = 208;
            target[position++] = value + 256;
          } else if (value >= -32768) {
            target[position++] = 209;
            targetView.setInt16(position, value);
            position += 2;
          } else {
            target[position++] = 210;
            targetView.setInt32(position, value);
            position += 4;
          }
        } else {
          let useFloat32;
          if ((useFloat32 = this.useFloat32) > 0 && value < 4294967296 && value >= -2147483648) {
            target[position++] = 202;
            targetView.setFloat32(position, value);
            let xShifted;
            if (useFloat32 < 4 || (xShifted = value * mult10[(target[position] & 127) << 1 | target[position + 1] >> 7]) >> 0 === xShifted) {
              position += 4;
              return;
            } else
              position--;
          }
          target[position++] = 203;
          targetView.setFloat64(position, value);
          position += 8;
        }
      } else if (type2 === "object") {
        if (!value)
          target[position++] = 192;
        else {
          if (referenceMap2) {
            let referee = referenceMap2.get(value);
            if (referee) {
              if (!referee.id) {
                let idsToInsert = referenceMap2.idsToInsert || (referenceMap2.idsToInsert = []);
                referee.id = idsToInsert.push(referee);
              }
              target[position++] = 214;
              target[position++] = 112;
              targetView.setUint32(position, referee.id);
              position += 4;
              return;
            } else
              referenceMap2.set(value, { offset: position - start });
          }
          let constructor = value.constructor;
          if (constructor === Object) {
            writeObject(value, true);
          } else if (constructor === Array) {
            length = value.length;
            if (length < 16) {
              target[position++] = 144 | length;
            } else if (length < 65536) {
              target[position++] = 220;
              target[position++] = length >> 8;
              target[position++] = length & 255;
            } else {
              target[position++] = 221;
              targetView.setUint32(position, length);
              position += 4;
            }
            for (let i = 0; i < length; i++) {
              pack(value[i]);
            }
          } else if (constructor === Map) {
            length = value.size;
            if (length < 16) {
              target[position++] = 128 | length;
            } else if (length < 65536) {
              target[position++] = 222;
              target[position++] = length >> 8;
              target[position++] = length & 255;
            } else {
              target[position++] = 223;
              targetView.setUint32(position, length);
              position += 4;
            }
            for (let [key, entryValue] of value) {
              pack(key);
              pack(entryValue);
            }
          } else {
            for (let i = 0, l = extensions.length; i < l; i++) {
              let extensionClass = extensionClasses[i];
              if (value instanceof extensionClass) {
                let extension = extensions[i];
                if (extension.write) {
                  if (extension.type) {
                    target[position++] = 212;
                    target[position++] = extension.type;
                    target[position++] = 0;
                  }
                  pack(extension.write.call(this, value));
                  return;
                }
                let currentTarget = target;
                let currentTargetView = targetView;
                let currentPosition = position;
                target = null;
                let result;
                try {
                  result = extension.pack.call(this, value, (size2) => {
                    target = currentTarget;
                    currentTarget = null;
                    position += size2;
                    if (position > safeEnd)
                      makeRoom(position);
                    return {
                      target,
                      targetView,
                      position: position - size2
                    };
                  }, pack);
                } finally {
                  if (currentTarget) {
                    target = currentTarget;
                    targetView = currentTargetView;
                    position = currentPosition;
                    safeEnd = target.length - 10;
                  }
                }
                if (result) {
                  if (result.length + position > safeEnd)
                    makeRoom(result.length + position);
                  position = writeExtensionData(result, target, position, extension.type);
                }
                return;
              }
            }
            writeObject(value, !value.hasOwnProperty);
          }
        }
      } else if (type2 === "boolean") {
        target[position++] = value ? 195 : 194;
      } else if (type2 === "bigint") {
        if (value < BigInt(1) << BigInt(63) && value >= -(BigInt(1) << BigInt(63))) {
          target[position++] = 211;
          targetView.setBigInt64(position, value);
        } else if (value < BigInt(1) << BigInt(64) && value > 0) {
          target[position++] = 207;
          targetView.setBigUint64(position, value);
        } else {
          if (this.largeBigIntToFloat) {
            target[position++] = 203;
            targetView.setFloat64(position, Number(value));
          } else {
            throw new RangeError(value + " was too large to fit in MessagePack 64-bit integer format, set largeBigIntToFloat to convert to float-64");
          }
        }
        position += 8;
      } else if (type2 === "undefined") {
        if (this.encodeUndefinedAsNil)
          target[position++] = 192;
        else {
          target[position++] = 212;
          target[position++] = 0;
          target[position++] = 0;
        }
      } else if (type2 === "function") {
        pack(this.writeFunction && this.writeFunction());
      } else {
        throw new Error("Unknown type: " + type2);
      }
    };
    const writeObject = this.useRecords === false ? this.variableMapSize ? (object) => {
      let keys2 = Object.keys(object);
      let length = keys2.length;
      if (length < 16) {
        target[position++] = 128 | length;
      } else if (length < 65536) {
        target[position++] = 222;
        target[position++] = length >> 8;
        target[position++] = length & 255;
      } else {
        target[position++] = 223;
        targetView.setUint32(position, length);
        position += 4;
      }
      let key;
      for (let i = 0; i < length; i++) {
        pack(key = keys2[i]);
        pack(object[key]);
      }
    } : (object, safePrototype) => {
      target[position++] = 222;
      let objectOffset = position - start;
      position += 2;
      let size2 = 0;
      for (let key in object) {
        if (safePrototype || object.hasOwnProperty(key)) {
          pack(key);
          pack(object[key]);
          size2++;
        }
      }
      target[objectOffset++ + start] = size2 >> 8;
      target[objectOffset + start] = size2 & 255;
    } : options.progressiveRecords && !useTwoByteRecords ? (object, safePrototype) => {
      let nextTransition, transition = structures.transitions || (structures.transitions = /* @__PURE__ */ Object.create(null));
      let objectOffset = position++ - start;
      let wroteKeys;
      for (let key in object) {
        if (safePrototype || object.hasOwnProperty(key)) {
          nextTransition = transition[key];
          if (nextTransition)
            transition = nextTransition;
          else {
            let keys2 = Object.keys(object);
            let lastTransition = transition;
            transition = structures.transitions;
            let newTransitions = 0;
            for (let i = 0, l = keys2.length; i < l; i++) {
              let key2 = keys2[i];
              nextTransition = transition[key2];
              if (!nextTransition) {
                nextTransition = transition[key2] = /* @__PURE__ */ Object.create(null);
                newTransitions++;
              }
              transition = nextTransition;
            }
            if (objectOffset + start + 1 == position) {
              position--;
              newRecord(transition, keys2, newTransitions);
            } else
              insertNewRecord(transition, keys2, objectOffset, newTransitions);
            wroteKeys = true;
            transition = lastTransition[key];
          }
          pack(object[key]);
        }
      }
      if (!wroteKeys) {
        let recordId = transition[RECORD_SYMBOL];
        if (recordId)
          target[objectOffset + start] = recordId;
        else
          insertNewRecord(transition, Object.keys(object), objectOffset, 0);
      }
    } : (object, safePrototype) => {
      let nextTransition, transition = structures.transitions || (structures.transitions = /* @__PURE__ */ Object.create(null));
      let newTransitions = 0;
      for (let key in object)
        if (safePrototype || object.hasOwnProperty(key)) {
          nextTransition = transition[key];
          if (!nextTransition) {
            nextTransition = transition[key] = /* @__PURE__ */ Object.create(null);
            newTransitions++;
          }
          transition = nextTransition;
        }
      let recordId = transition[RECORD_SYMBOL];
      if (recordId) {
        if (recordId >= 96 && useTwoByteRecords) {
          target[position++] = ((recordId -= 96) & 31) + 96;
          target[position++] = recordId >> 5;
        } else
          target[position++] = recordId;
      } else {
        newRecord(transition, transition.__keys__ || Object.keys(object), newTransitions);
      }
      for (let key in object)
        if (safePrototype || object.hasOwnProperty(key))
          pack(object[key]);
    };
    const makeRoom = (end) => {
      let newSize;
      if (end > 16777216) {
        if (end - start > MAX_BUFFER_SIZE)
          throw new Error("Packed buffer would be larger than maximum buffer size");
        newSize = Math.min(MAX_BUFFER_SIZE, Math.round(Math.max((end - start) * (end > 67108864 ? 1.25 : 2), 4194304) / 4096) * 4096);
      } else
        newSize = (Math.max(end - start << 2, target.length - 1) >> 12) + 1 << 12;
      let newBuffer = new ByteArrayAllocate(newSize);
      targetView = new DataView(newBuffer.buffer, 0, newSize);
      if (target.copy)
        target.copy(newBuffer, 0, start, end);
      else
        newBuffer.set(target.slice(start, end));
      position -= start;
      start = 0;
      safeEnd = newBuffer.length - 10;
      return target = newBuffer;
    };
    const newRecord = (transition, keys2, newTransitions) => {
      let recordId = structures.nextId;
      if (!recordId)
        recordId = 64;
      if (recordId < sharedLimitId && this.shouldShareStructure && !this.shouldShareStructure(keys2)) {
        recordId = structures.nextOwnId;
        if (!(recordId < maxStructureId))
          recordId = sharedLimitId;
        structures.nextOwnId = recordId + 1;
      } else {
        if (recordId >= maxStructureId)
          recordId = sharedLimitId;
        structures.nextId = recordId + 1;
      }
      let highByte = keys2.highByte = recordId >= 96 && useTwoByteRecords ? recordId - 96 >> 5 : -1;
      transition[RECORD_SYMBOL] = recordId;
      transition.__keys__ = keys2;
      structures[recordId - 64] = keys2;
      if (recordId < sharedLimitId) {
        keys2.isShared = true;
        structures.sharedLength = recordId - 63;
        hasSharedUpdate = true;
        if (highByte >= 0) {
          target[position++] = (recordId & 31) + 96;
          target[position++] = highByte;
        } else {
          target[position++] = recordId;
        }
      } else {
        if (highByte >= 0) {
          target[position++] = 213;
          target[position++] = 114;
          target[position++] = (recordId & 31) + 96;
          target[position++] = highByte;
        } else {
          target[position++] = 212;
          target[position++] = 114;
          target[position++] = recordId;
        }
        if (newTransitions)
          transitionsCount += serializationsSinceTransitionRebuild * newTransitions;
        if (recordIdsToRemove.length >= maxOwnStructures)
          recordIdsToRemove.shift()[RECORD_SYMBOL] = 0;
        recordIdsToRemove.push(transition);
        pack(keys2);
      }
    };
    const insertNewRecord = (transition, keys2, insertionOffset, newTransitions) => {
      let mainTarget = target;
      let mainPosition = position;
      let mainSafeEnd = safeEnd;
      let mainStart = start;
      target = keysTarget;
      position = 0;
      start = 0;
      if (!target)
        keysTarget = target = new ByteArrayAllocate(8192);
      safeEnd = target.length - 10;
      newRecord(transition, keys2, newTransitions);
      keysTarget = target;
      let keysPosition = position;
      target = mainTarget;
      position = mainPosition;
      safeEnd = mainSafeEnd;
      start = mainStart;
      if (keysPosition > 1) {
        let newEnd = position + keysPosition - 1;
        if (newEnd > safeEnd)
          makeRoom(newEnd);
        let insertionPosition = insertionOffset + start;
        target.copyWithin(insertionPosition + keysPosition, insertionPosition + 1, position);
        target.set(keysTarget.slice(0, keysPosition), insertionPosition);
        position = newEnd;
      } else {
        target[insertionOffset + start] = keysTarget[0];
      }
    };
  }
  useBuffer(buffer) {
    target = buffer;
    targetView = new DataView(target.buffer, target.byteOffset, target.byteLength);
    position = 0;
  }
  clearSharedData() {
    if (this.structures)
      this.structures = [];
  }
}
extensionClasses = [Date, Set, Error, RegExp, ArrayBuffer, Object.getPrototypeOf(Uint8Array.prototype).constructor, C1Type];
extensions = [{
  pack(date, allocateForWrite, pack) {
    let seconds = date.getTime() / 1e3;
    if ((this.useTimestamp32 || date.getMilliseconds() === 0) && seconds >= 0 && seconds < 4294967296) {
      let { target: target2, targetView: targetView2, position: position2 } = allocateForWrite(6);
      target2[position2++] = 214;
      target2[position2++] = 255;
      targetView2.setUint32(position2, seconds);
    } else if (seconds > 0 && seconds < 17179869184) {
      let { target: target2, targetView: targetView2, position: position2 } = allocateForWrite(10);
      target2[position2++] = 215;
      target2[position2++] = 255;
      targetView2.setUint32(position2, date.getMilliseconds() * 4e6 + (seconds / 1e3 / 4294967296 >> 0));
      targetView2.setUint32(position2 + 4, seconds);
    } else if (isNaN(seconds)) {
      if (this.onInvalidDate) {
        allocateForWrite(0);
        return pack(this.onInvalidDate());
      }
      let { target: target2, targetView: targetView2, position: position2 } = allocateForWrite(3);
      target2[position2++] = 212;
      target2[position2++] = 255;
      target2[position2++] = 255;
    } else {
      let { target: target2, targetView: targetView2, position: position2 } = allocateForWrite(15);
      target2[position2++] = 199;
      target2[position2++] = 12;
      target2[position2++] = 255;
      targetView2.setUint32(position2, date.getMilliseconds() * 1e6);
      targetView2.setBigInt64(position2 + 4, BigInt(Math.floor(seconds)));
    }
  }
}, {
  pack(set, allocateForWrite, pack) {
    let array = Array.from(set);
    let { target: target2, position: position2 } = allocateForWrite(this.structuredClone ? 3 : 0);
    if (this.structuredClone) {
      target2[position2++] = 212;
      target2[position2++] = 115;
      target2[position2++] = 0;
    }
    pack(array);
  }
}, {
  pack(error, allocateForWrite, pack) {
    let { target: target2, position: position2 } = allocateForWrite(this.structuredClone ? 3 : 0);
    if (this.structuredClone) {
      target2[position2++] = 212;
      target2[position2++] = 101;
      target2[position2++] = 0;
    }
    pack([error.name, error.message]);
  }
}, {
  pack(regex, allocateForWrite, pack) {
    let { target: target2, position: position2 } = allocateForWrite(this.structuredClone ? 3 : 0);
    if (this.structuredClone) {
      target2[position2++] = 212;
      target2[position2++] = 120;
      target2[position2++] = 0;
    }
    pack([regex.source, regex.flags]);
  }
}, {
  pack(arrayBuffer, allocateForWrite) {
    if (this.structuredClone)
      writeExtBuffer(arrayBuffer, 16, allocateForWrite);
    else
      writeBuffer(hasNodeBuffer ? Buffer.from(arrayBuffer) : new Uint8Array(arrayBuffer), allocateForWrite);
  }
}, {
  pack(typedArray, allocateForWrite) {
    let constructor = typedArray.constructor;
    if (constructor !== ByteArray && this.structuredClone)
      writeExtBuffer(typedArray, typedArrays.indexOf(constructor.name), allocateForWrite);
    else
      writeBuffer(typedArray, allocateForWrite);
  }
}, {
  pack(c1, allocateForWrite) {
    let { target: target2, position: position2 } = allocateForWrite(1);
    target2[position2] = 193;
  }
}];
function writeExtBuffer(typedArray, type2, allocateForWrite, encode) {
  let length = typedArray.byteLength;
  if (length + 1 < 256) {
    var { target: target2, position: position2 } = allocateForWrite(4 + length);
    target2[position2++] = 199;
    target2[position2++] = length + 1;
  } else if (length + 1 < 65536) {
    var { target: target2, position: position2 } = allocateForWrite(5 + length);
    target2[position2++] = 200;
    target2[position2++] = length + 1 >> 8;
    target2[position2++] = length + 1 & 255;
  } else {
    var { target: target2, position: position2, targetView: targetView2 } = allocateForWrite(7 + length);
    target2[position2++] = 201;
    targetView2.setUint32(position2, length + 1);
    position2 += 4;
  }
  target2[position2++] = 116;
  target2[position2++] = type2;
  target2.set(new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength), position2);
}
function writeBuffer(buffer, allocateForWrite) {
  let length = buffer.byteLength;
  var target2, position2;
  if (length < 256) {
    var { target: target2, position: position2 } = allocateForWrite(length + 2);
    target2[position2++] = 196;
    target2[position2++] = length;
  } else if (length < 65536) {
    var { target: target2, position: position2 } = allocateForWrite(length + 3);
    target2[position2++] = 197;
    target2[position2++] = length >> 8;
    target2[position2++] = length & 255;
  } else {
    var { target: target2, position: position2, targetView: targetView2 } = allocateForWrite(length + 5);
    target2[position2++] = 198;
    targetView2.setUint32(position2, length);
    position2 += 4;
  }
  target2.set(buffer, position2);
}
function writeExtensionData(result, target2, position2, type2) {
  let length = result.length;
  switch (length) {
    case 1:
      target2[position2++] = 212;
      break;
    case 2:
      target2[position2++] = 213;
      break;
    case 4:
      target2[position2++] = 214;
      break;
    case 8:
      target2[position2++] = 215;
      break;
    case 16:
      target2[position2++] = 216;
      break;
    default:
      if (length < 256) {
        target2[position2++] = 199;
        target2[position2++] = length;
      } else if (length < 65536) {
        target2[position2++] = 200;
        target2[position2++] = length >> 8;
        target2[position2++] = length & 255;
      } else {
        target2[position2++] = 201;
        target2[position2++] = length >> 24;
        target2[position2++] = length >> 16 & 255;
        target2[position2++] = length >> 8 & 255;
        target2[position2++] = length & 255;
      }
  }
  target2[position2++] = type2;
  target2.set(result, position2);
  position2 += length;
  return position2;
}
function insertIds(serialized, idsToInsert) {
  let nextId;
  let distanceToMove = idsToInsert.length * 6;
  let lastEnd = serialized.length - distanceToMove;
  idsToInsert.sort((a, b) => a.offset > b.offset ? 1 : -1);
  while (nextId = idsToInsert.pop()) {
    let offset = nextId.offset;
    let id = nextId.id;
    serialized.copyWithin(offset + distanceToMove, offset, lastEnd);
    distanceToMove -= 6;
    let position2 = offset + distanceToMove;
    serialized[position2++] = 214;
    serialized[position2++] = 105;
    serialized[position2++] = id >> 24;
    serialized[position2++] = id >> 16 & 255;
    serialized[position2++] = id >> 8 & 255;
    serialized[position2++] = id & 255;
    lastEnd = offset;
  }
  return serialized;
}
function writeBundles(start, pack) {
  targetView.setUint32(bundledStrings.position + start, position - bundledStrings.position - start);
  let writeStrings = bundledStrings;
  bundledStrings = null;
  pack(writeStrings[0]);
  pack(writeStrings[1]);
}
let defaultPackr = new Packr({ useRecords: false });
defaultPackr.pack;
defaultPackr.pack;
const REUSE_BUFFER_MODE = 512;
const RESET_BUFFER_MODE = 1024;
new Vector3();
new Vector3();
