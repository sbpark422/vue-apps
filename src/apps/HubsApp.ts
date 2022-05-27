import { createApp, App, Component, ComponentPublicInstance } from "vue";
import { Scene, Entity } from 'aframe'
//import { EtherealLayoutSystem } from "ethereal";
import { WebContainer3D, WebLayerManager } from "@etherealjs/web-layer/three"; 
//import { WebContainer3D, WebLayerManager } from "@blairmacintyre/web-layer-blair/three";

import { detectOS, detect } from "detect-browser";

import VueApp  from "./VueApp"
 
// create init method for ethereal
//import * as ethereal from 'ethereal'
// import { createPrinter, ThisExpression, ThrowStatement } from "node_modules/typescript/lib/typescript";
// import { create } from "mathjs";

function floorFixed(num: number) {
    let n = Math.floor(num * 100) / 100;
    return n.toFixed(2)
}
export function initializeEthereal() {
    HubsApp.initializeEthereal()
}

//THREE.Object3D.DefaultMatrixAutoUpdate = true;

export function systemTick(time: number, deltaTime: number) {
   HubsApp.systemTick(time, deltaTime)
}

var maxTextureSize = 1024
console.log("User Agent: " + navigator.userAgent)
const browser = detect();
if (browser) {
    if (browser.os == "Linux") {
        if (navigator.userAgent.search(/OculusBrowser/) >= 0) {
            //@ts-ignore
            browser.name = "oculus";
            if (navigator.userAgent.search(/Quest 2/) >= 0) {
                //@ts-ignore
                browser.os = "LinuxQuest2"
                maxTextureSize = 512
            } else {
                //@ts-ignore
                browser.os = "LinuxQuest"
                maxTextureSize = 256
            }
        }
    } else if (browser.os == "iOS") {
        if (navigator.userAgent.search(/iPad/) >= 0) {
            //@ts-ignore
            browser.os = "iOSiPad"
            maxTextureSize = 512
        } else {
            //@ts-ignore
            browser.os = "iOSiPhone"
            maxTextureSize = 256
        }
    }
    console.log("Running on OS '" + browser.os + "' in browser '" + browser.name + "' version '" + browser.version + "'") 
} else {
    console.log("Browser Detect didn't work?!")
}
export async function loadCache(url: string) {
    // const detectedOS = detectOS(navigator.userAgent);
    // const browser = detect();

    let retVal = null;
    if (browser) {
        console.log ("loading weblayer cache: " + url + "-" + browser.name + "-" + browser.os + ".cache")
        retVal = await WebLayerManager.instance.importCache(url + "-" + browser.name + "-" + browser.os + ".cache")
        if (!retVal) {
            console.log ("failed: loading weblayer cache: " + url + "-" + browser.name + ".cache")
            retVal = await WebLayerManager.instance.importCache(url + "-" + browser.name + ".cache")
            if (!retVal) {
                console.log ("failed: loading weblayer cache: " + url + "-" + browser.os + ".cache")
                retVal = await WebLayerManager.instance.importCache(url + "-" + browser.os + ".cache")
                if (!retVal) {
                    console.log ("failed: loading weblayer cache: " + url + "-" + maxTextureSize.toFixed() + ".cache")
                    retVal = await WebLayerManager.instance.importCache(url + "-" + maxTextureSize.toFixed() + ".cache")
                }
            }
        }
    }
    if (!retVal) {
        console.log ("loading weblayer cache: " + url + ".cache")
        retVal = await WebLayerManager.instance.importCache(url + ".cache")
    }
    if (!retVal) {
        console.log("failed: no cache for url '" + url + "'")
    }
}

export const downloadBlob = function (blob: Blob, filename: string) {
    //@ts-ignore
    const a = document.createElement('a') as HTMLAnchorElement;
    a.download = filename;
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = ['application/octet-stream', a.download, a.href].join(':');
    a.click();
};

export async function exportCache(url: string, states: Array<string> | undefined) {
    await WebLayerManager.instance.saveStore()
    let blob = await WebLayerManager.instance.exportCache(states)

    if (browser) {
        console.log ("downloading weblayer cache: " + url + "-" + browser.name + "-" + browser.os + ".cache")
        downloadBlob(blob, url + "-" + browser.name + "-" + browser.os + ".cache");
    } else {
        console.log ("downloading weblayer cache: " + url + ".cache")
        downloadBlob(blob, url + "-" + ".cache" );
    }
}

function copyCamera(source: THREE.PerspectiveCamera, target: THREE.PerspectiveCamera) {
    source.updateMatrixWorld()
    //let oldName = target.name
    //target.copy(source, false)
    //target.name = oldName

    target.fov = source.fov;
    target.zoom = source.zoom;

    target.near = source.near;
    target.far = source.far;

    target.aspect = source.aspect;

    // target.matrixWorldInverse.copy( source.matrixWorldInverse );
    // target.projectionMatrix.copy( source.projectionMatrix );
    // target.projectionMatrixInverse.copy( source.projectionMatrixInverse );

    // target.up.copy( source.up );

    // target.matrix.copy( source.matrix );
    // target.matrixWorld.copy( source.matrixWorld );

    // target.matrixAutoUpdate = source.matrixAutoUpdate;
    // target.matrixWorldNeedsUpdate = source.matrixWorldNeedsUpdate;

    source.matrixWorld.decompose( target.position, target.quaternion, target.scale)
    // @ts-ignore
    target.rotation.setFromQuaternion( target.quaternion, undefined, false );
    target.updateMatrix()
    target.updateMatrixWorld(true)
}

export default class HubsApp extends VueApp {
    //static system: ethereal.EtherealLayoutSystem;
    //static etherealCamera = new THREE.PerspectiveCamera()
    //static playerCamera: THREE.PerspectiveCamera;

    isEthereal: boolean
    isInteractive: boolean
    isNetworked: boolean
    isStatic: boolean

    private updateTime: number
    private raycaster: THREE.Raycaster

    tempV: THREE.Vector3 = new THREE.Vector3()

    size: {
        width: number,
        height: number
    }
    pixelRatio = 1.0

    //takeOwnership:  () => boolean
    //setSharedData: (object: {}) => boolean
    //width: number
    //height: number
    //vueApp: App
    //vueRoot: ComponentPublicInstance | undefined 

    webLayer3D: WebContainer3D | undefined
    needsUpdate: boolean = false

    headDiv: Element

    readyPromise: Promise<void> | null = null

    static initializeEthereal() {
        let scene: Scene = window.APP.scene;
        WebLayerManager.initialize(scene.renderer)
        //WebLayerManager.instance.ktx2Encoder.pool.setWorkerLimit(0)
        //@ts-ignore
        if (browser && browser.name == "oculus") {
            WebLayerManager.instance.MAX_SERIALIZE_TASK_COUNT = 5;
            WebLayerManager.instance.MAX_RASTERIZE_TASK_COUNT = 1;
        }
        // WebLayerManager.instance.MAX_RASTERIZE_TASK_COUNT = 25;
        // WebLayerManager.instance.MAX_SERIALIZE_TASK_COUNT = 25;

        // this.etherealCamera.matrixAutoUpdate = true;
        //this.etherealCamera.visible = false;

        //scene.setObject3D("etherealCamera", this.etherealCamera)

        // this.playerCamera = (document.getElementById("viewing-camera") as Entity).getObject3D("camera") as THREE.PerspectiveCamera;

        // just in case "viewing-camera" isn't set up yet ... which it 
        // should be, but just to be careful
        // this.system = ethereal.createLayoutSystem(this.playerCamera ? this.playerCamera : scene.camera)
        // window.ethSystem = this.system

        // can customize easing etc
        // system.transition.duration = 1.5
        // system.transition.delay = 0
        // system.transition.maxWait = 4
        // system.transition.easing = ethereal.easing.easeOut
    }

    static systemTick(time: number, deltaTime: number) {
        let scene = window.APP.scene;

        // if (!this.playerCamera) {
        //     this.playerCamera = (document.getElementById("viewing-camera") as Entity).getObject3D("camera") as THREE.PerspectiveCamera;
        // }
        
        // if (!this.playerCamera) return;
    
        // copyCamera(this.playerCamera, this.etherealCamera)

        // if (this.etherealCamera != this.system.viewNode) {
        //     this.system.viewNode = this.etherealCamera
        // }

        // scene.renderer.getSize(HubsApp.system.viewResolution)
        // this.system.viewFrustum.setFromPerspectiveProjectionMatrix(this.etherealCamera.projectionMatrix)

        // // tick method for ethereal
        // this.system.update(deltaTime, time)
    }

    constructor (App: Component, width: number, height: number, params: any = {}, createOptions: any ={}) {
        if (params.width && params.height && params.width > 0 && params.height > 0) {
            // reset both
            width = params.width   
            height = params.height
        } else if ((params.width && params.width > 0) || (params.height && params.height > 0)) {
            // set one and scale the other
            if (params.width && params.width > 0) {
                height = (params.width / width) * height    
                width = params.width   
            }
            if (params.height && params.height > 0) {
                width = (params.height / height) * height
                height = params.height
            }

        }
        //@ts-ignore
        if (browser && browser.name == "oculus") {

        }
        super(App, width, height, createOptions)
        this.isEthereal = false;

        this.vueApp.provide('params', params)

        this.isInteractive = false;
        this.isNetworked = false;
        this.isStatic = true;
        this.updateTime = 100
        this.raycaster = new THREE.Raycaster()
        this.size = { width: width/1000, height: height/1000}

        this.headDiv = document.createElement("div")
    }

    mount(useEthereal?: boolean) {
        this.isEthereal = useEthereal === true
        this.vueRoot = this.vueApp.mount(this.headDiv);

        var style = ""
        if (this.width > 0) {
            style = "width: " + this.width + "px; "
            if (this.width > maxTextureSize) {
                this.pixelRatio = (maxTextureSize-1) / this.width
            }
        } else {
            this.pixelRatio = 0.01
            style = "width: fit-content; "
        }
        if (this.height > 0) {
            style = style + "height: " + this.height + "px; ";
            if (this.height > maxTextureSize) { 
                this.pixelRatio = Math.min((maxTextureSize-1) / this.height, this.pixelRatio)
            }
        } else {
            this.pixelRatio = Math.min(this.pixelRatio, 0.01);
            style = style + "height: fit-content; "
        }
        console.log("setting style: ", style)
        console.log("setting pixelRatio = ", floorFixed(this.pixelRatio));
        this.vueRoot.$el.setAttribute("style", style)
        this.vueRoot.$el.setAttribute("xr-pixel-ratio", floorFixed(this.pixelRatio));

        // // add a link to the shared css
        let l = document.createElement("link")
        l.setAttribute("href", "https://resources.realitymedia.digital/vue-apps/dist/hubs.css")
        l.setAttribute("rel", "stylesheet")
        l.setAttribute("crossorigin","anonymous")
        this.vueRoot.$el.insertBefore(l, this.vueRoot.$el.firstChild)

        // move this into method
        this.webLayer3D = new WebContainer3D(this.vueRoot?.$el, {
            autoRefresh: true,
            onLayerCreate: useEthereal ? 
            (layer) => {
                layer.desiredPseudoStates.hover = true;
                // const adapter = HubsApp.system.getAdapter(layer)
                // adapter.opacity.enabled = true
                // adapter.onUpdate = () => layer.update()
            } :
            (layer) => { layer.desiredPseudoStates.hover = true },
            onLayerPaint: (layer) => {
                if (this.isStatic) { this.needsUpdate = true }
            },
            //textureEncoding: THREE.sRGBEncoding,
            renderOrderOffset: 0
        });

        // make sure the CSS has been loaded before we do 
        // anything else
        const createOnLoadPromise = (htmlElement: HTMLElement) =>
            new Promise((resolve) => {
                htmlElement.onload = resolve;
            });
        
        this.readyPromise = createOnLoadPromise(l).then(() => {
            let rect = this.vueRoot?.$el.getBoundingClientRect()
            console.log("mounted has rect: ", rect)

            this.height = this.height > 0 ? this.height : Math.ceil(rect.height*1.05)
            this.width = this.width > 0 ? this.width : Math.ceil(rect.width*1.05)
            this.size = { width: this.width/1000, height: this.height/1000}

            this.pixelRatio = 1.0
            if (this.width > maxTextureSize) {
                this.pixelRatio = (maxTextureSize-1) / this.width
            }
            if (this.height > maxTextureSize) { 
                this.pixelRatio = Math.min((maxTextureSize-1) / this.height, this.pixelRatio)
            }
            style = "width: " + this.width + "px; height: " + this.height + "px; "

            console.log("setting style: ", style)
            console.log("setting pixelRatio = ", floorFixed(this.pixelRatio));

            this.vueRoot?.$el.setAttribute("style", style)
            this.vueRoot?.$el.setAttribute("xr-pixel-ratio", floorFixed(this.pixelRatio));
            this.webLayer3D?.rootLayer.setNeedsRefresh();
        })
    }

    async waitForReady() {
        this.webLayer3D?.rootLayer.setNeedsRefresh();
        await this.readyPromise;
        await this.webLayer3D?.updateUntilReady();

        // need to do a few layers.  here's how to do hover.
        // first, find all children of the root layer that have "xrlink" class
        // layer.desiredPseudoState.hover = true
        // 

        var linkNodes = this.webLayer3D?.rootLayer.querySelectorAll('.xrlink');
        if (linkNodes) {
            for (var i = 0; i < linkNodes.length; i++) {
                linkNodes[i].desiredPseudoStates.hover = true;
                await this.webLayer3D?.updateUntilReady()
                linkNodes[i].desiredPseudoStates.hover = false
            }
        }
        this.webLayer3D?.rootLayer.setNeedsRefresh();
    }

    setNetworkMethods(takeOwnership: () => boolean, setSharedData: ({}) => boolean) {
        this.takeOwnership = takeOwnership;
        this.setSharedData = setSharedData;
    }

    // dummy functions, just to avoid errors if they get called before
    // networking is initialized, or called when networked is false
    // takeOwnershipProto(): boolean {
    //     return true;
    // }

    // setSharedDataProto(object: {}) {
    //     return true;
    // }

    // receive data updates.  should be overridden by subclasses, also requests
    // update next tick
    updateSharedData(dataObject: {}) {
        this.needsUpdate = true
    }

    getSize() {
        // if (!this.compStyles) {
        //     this.compStyles = window.getComputedStyle(this.vueRoot.$el);
        // }
        // var width = this.compStyles.getPropertyValue('width')
        // width = width && width.length > 0 ? parseFloat(width) / 1000: 1
        // var height = this.compStyles.getPropertyValue('height')
        // height = height && height.length > 0 ? parseFloat(height) / 1000: 1
        // this.size = { width: width, height: height}
        console.log ("div size: {" + this.size.width + ", " + this.size.height + "}")
        return this.size
    }

    // receive data updates.  should be overridden by subclasses
    getSharedData(dataObject: {}) {
        throw new Error("getSharedData should be overridden by subclasses")
    }
    
    // override to check for your own 3D objects that aren't webLayers
    clicked(evt: {object3D: THREE.Object3D}) {
        if (!this.isInteractive) { return }
        
        const obj = evt.object3D
        const dir = this.webLayer3D!.getWorldDirection(new THREE.Vector3()).negate()
        this.tempV.copy(obj.position)
        this.tempV.addScaledVector(dir, -0.1)
        this.raycaster.ray.set(this.tempV, dir)
        const hit = this.webLayer3D!.hitTest(this.raycaster.ray)
        if (hit) {
          hit.target.click()
          hit.target.focus()
          console.log('hit', hit.target, hit.layer)
        }   
    }

    dragStart(evt: {}) {
        // nothing here ... subclass should override
    }

    dragEnd (evt: {}) {
        // nothing here ... subclass should override
    }

    play() {
        // if we can figure out how to pause, then restart here
    }

    pause() {
        // perhaps figure out how to pause the Vue component?
    }

    destroy() {
        //  clean up weblayer
        // if (this.vueRoot && this.vueRoot.$el) {
        //     let parent = this.vueRoot.$el.parentElement
        //     parent ? parent.removeChild(this.vueRoot.$el) : null
        // }

        // if (this.headDiv) {
        //     let parent = this.headDiv.parentElement
        //     parent ? parent.removeChild(this.headDiv) : null
        // }

        if (this.webLayer3D) {
            // let parent = (this.webLayer3D.rootLayer.element.getRootNode() as ShadowRoot).host;
            // parent ? parent.remove() : null
            
            // this.webLayer3D.removeFromParent()
            // this.webLayer3D.rootLayer.dispose()

            this.webLayer3D.destroy()
            // this.webLayer3D = null
        }

        this.vueApp.unmount()
        // this.vueRoot = null
        // this.vueApp = null
    }

    tick(time: number) {
        if (this.isEthereal) {

        } else {
            var needsUpdate = this.needsUpdate
            this.needsUpdate = false
            // if (this.isStatic && this.updateTime < time) {
            //     needsUpdate = true
            //     // wait a bit and do it again.  May get rid of this some day, we'll see
            //     this.updateTime = Math.random() * 2000 + 1000;
            // }

            // if (!this.isStatic) {
                this.updateTime = time
                needsUpdate = true
           // }
            if (needsUpdate) {
                this.webLayer3D!.update();
            }
        }
    }
}

async function logAndFollow(id: string | null, url: string) {
    //@ts-ignore
    await window.APP.scene.systems["data-logging"].logLink(id, url);
    //@ts-ignore
    
    if (url.length > 0) {
        //@ts-ignore
        await window.APP.utils.handleExitTo2DInterstitial(false, () => {}, true);
        window.open(url, "_blank");
    }
}

//@ts-ignore
window.APP.utils.followLinkClick = function (event: MouseEvent) {
    // Get url from the target element (<a>) href attribute
    var url: string = "";
    event.preventDefault();
    let target = event.currentTarget;
    if (target instanceof HTMLElement) {
        if (target instanceof HTMLAnchorElement) {
            url = (target as HTMLAnchorElement).href;
            // Prevent default action (e.g. following the link)
        } else { //if (target instanceof HTMLSpanElement) {
            let child = target.childNodes[0]
            if (child instanceof HTMLAnchorElement) {
                url = (child as HTMLAnchorElement).href;;
            }
        }
        logAndFollow(target.id, url);
    }
}

