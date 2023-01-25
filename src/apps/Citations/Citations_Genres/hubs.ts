import App from "./App.vue";
import HubsAppProto from "../../HubsApp";

class HubsApp extends HubsAppProto {
    constructor (width: number, height: number, params: any = {}) {
        super(App, width, height, params)
      //  this.isInteractive = true;
    }
}

var init = function(params: any = {}) {
    let app = new HubsApp(1000,900, params)
    app.mount()
    return app
}

export default init