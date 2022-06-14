import { d as detect } from "./vendor.js";
import "three";
var NetworkedHelloWorld_vue_vue_type_style_index_0_scoped_true_lang = "";
var top = "";
var room = "";
console.log("User Agent: " + navigator.userAgent);
const browser = detect();
if (browser) {
  if (browser.os == "Linux") {
    if (navigator.userAgent.search(/OculusBrowser/) >= 0) {
      browser.name = "oculus";
      if (navigator.userAgent.search(/Quest 2/) >= 0) {
        browser.os = "LinuxQuest2";
      } else {
        browser.os = "LinuxQuest";
      }
    }
  } else if (browser.os == "iOS") {
    if (navigator.userAgent.search(/iPad/) >= 0) {
      browser.os = "iOSiPad";
    } else {
      browser.os = "iOSiPhone";
    }
  }
  console.log("Running on OS '" + browser.os + "' in browser '" + browser.name + "' version '" + browser.version + "'");
} else {
  console.log("Browser Detect didn't work?!");
}
async function logAndFollow(id, url) {
  await window.APP.scene.systems["data-logging"].logLink(id, url);
  if (url.length > 0) {
    await window.APP.utils.handleExitTo2DInterstitial(false, () => {
    }, true);
    window.open(url, "_blank");
  }
}
window.APP.utils.followLinkClick = function(event) {
  var url = "";
  event.preventDefault();
  let target = event.currentTarget;
  if (target instanceof HTMLElement) {
    if (target instanceof HTMLAnchorElement) {
      url = target.href;
    } else {
      let child = target.childNodes[0];
      if (child instanceof HTMLAnchorElement) {
        url = child.href;
      }
    }
    logAndFollow(target.id, url);
  }
};
var HelloWorld_vue_vue_type_style_index_0_scoped_true_lang = "";
var App_vue_vue_type_style_index_0_scoped_true_lang$8 = "";
var App_vue_vue_type_style_index_0_scoped_true_lang$7 = "";
var App_vue_vue_type_style_index_0_scoped_true_lang$6 = "";
var App_vue_vue_type_style_index_0_scoped_true_lang$5 = "";
var App_vue_vue_type_style_index_0_scoped_true_lang$4 = "";
var App_vue_vue_type_style_index_0_scoped_true_lang$3 = "";
var App_vue_vue_type_style_index_0_scoped_true_lang$2 = "";
var App_vue_vue_type_style_index_0_scoped_true_lang$1 = "";
var App_vue_vue_type_style_index_0_scoped_true_lang = "";
