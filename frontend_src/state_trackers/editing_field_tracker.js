class EditingFieldTrackerClass
{
    constructor()
    {
        this.editId = 0;
        this.edits = new Set();
        this.editClearListenerCallbacks = [];
    }

    currentlyEditingField = () =>
    {
        return this.edits.size > 0;
    }

    forceClearEdits = () =>
    {
        this.edits.clear();
        for (const cb of this.editClearListenerCallbacks)
        {
            cb();
        }
    }

    addCurrentlyEditing = () =>
    {
        const newEditId = this.editId++;
        this.edits.add(newEditId);
        return newEditId;
    }

    completeEdit = (editId) =>
    {
        if (!this.edits.delete(editId))
        {
            throw `Edit id ${editId} not found, unable to complete request`;
        }
    }

    addEditClearListenerCallback = (cb) =>
    {
        this.editClearListenerCallbacks.push(cb);
    }
}

let EditingFieldTracker = new EditingFieldTrackerClass();
export default EditingFieldTracker;