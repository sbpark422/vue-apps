import App from "./App.vue";
import HubsAppProto from "../HubsApp";
import {data as SharedData, Store} from "./shared"


class HubsApp extends HubsAppProto {

    shared: Store


    // constructor (params: any = {}) {
    //     super(App, 400, 225, params);
    //     this.isInteractive = true;

    // }

    constructor (width: number, height: number, public params: any = {}) {
        super(App, width, height, params)
         //this.isInteractive = true;

        // create our shared data object that will
        // share data between vue and hubs
        this.shared = new Store(this)
        this.vueApp.provide('shared', this.shared)

        this.isInteractive = true;
        this.isNetworked = true;
        this.isStatic = false;
         
    }

    // change the label of the node
    async setLabel(text: string, color: string) {
        this.params.text = text
        this.params.color = color

        // return a promise that resolves when the label is set
        // and updated
        return this.waitForReady()
    }

    updateSharedData(dataObject: SharedData) {
        super.updateSharedData(dataObject)
        this.shared.updateSharedData(dataObject)
    }

    getSharedData() {
        return this.shared.state;
    }
}

var init = function(params: any = {}) {
    let app = new HubsApp(0, 0, params)
    app.mount()
    return app
}

export default init




