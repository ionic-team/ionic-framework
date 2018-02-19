/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

const subscriptions = new Map();
class Events {
    subscribe(topic, handler) {
        const handlers = subscriptions.get(topic) || [];
        handlers.push(handler);
        subscriptions.set(topic, handlers);
    }
    unsubscribe(topic, handler) {
        const handlers = subscriptions.get(topic) || [];
        const newHandlers = handlers.filter(fun => fun !== handler);
        subscriptions.set(topic, newHandlers);
    }
    publish(topic, event) {
        return publishImpl(topic, event);
    }
    online(event) {
        return publishImpl(`app:${event.type}`, event);
    }
    statusTap(event) {
        return publishImpl(`app:${event.type}`, event);
    }
    static get is() { return "ion-events"; }
    static get properties() { return { "publish": { "method": true }, "subscribe": { "method": true }, "unsubscribe": { "method": true } }; }
}
// make this method async just to give the browser a chance to chill and do what it needs to do before firing this off
function publishImpl(topic, event) {
    return Promise.resolve().then(() => {
        const handlers = subscriptions.get(topic) || [];
        for (const handler of handlers) {
            handler(event);
        }
    });
}

export { Events as IonEvents };
