// shared.ts

import { reactive, readonly } from "vue";
import VueApp from "../VueApp";

export interface data {
    aiReply: string
}

export class Store {
    _state: data
    state: data
    app: VueApp
    constructor(app: VueApp) {
        this._state = reactive({
            aiReply: ""
        })
        this.app = app
        this.state = readonly(this._state)
    }    

    setAiReply(reply: string) {
        if (this.app.takeOwnership()) {
            this._state.aiReply = reply;
            this.app.setSharedData(this.state)
        }
    }
    
    updateSharedData(dataObject: data) {
        // need to update the elements within the state, because otherwise
        // the data won't flow to the components
        this._state.aiReply = dataObject.aiReply
    }
}
