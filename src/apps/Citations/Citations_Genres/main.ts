import WebAppProto from "../../WebApp";
import App from './App.vue'

class WebApp extends WebAppProto {
    constructor () {
        super(App, 1000, 900)
    }
}

let app = new WebApp()
app.mount()

app.vueRoot!.$el.style.border = "solid 0.1em"