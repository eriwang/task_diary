class OngoingChangeRequestTrackerClass
{
    constructor()
    {
        this.requestId = 0;
        this.requests = new Set();
        this.listenerCallbacks = [];
    }

    addRequest = () =>
    {
        const newRequestId = this.requestId++;
        this.requests.add(newRequestId);
        this._onChange();
        return newRequestId;
    }

    completeRequest = (requestId) =>
    {
        if (!this.requests.delete(requestId))
        {
            throw `Request id ${requestId} not found, unable to complete request`;
        }
        this._onChange();
    }

    addListenerCallback = (cb) =>
    {
        this.listenerCallbacks.push(cb);
    }

    _onChange = () =>
    {
        const requestsAreInProgress = (this.requests.size > 0);
        for (const cb of this.listenerCallbacks)
        {
            cb(requestsAreInProgress);
        }
    }
}

let OngoingChangeRequestTracker = new OngoingChangeRequestTrackerClass();
export default OngoingChangeRequestTracker;