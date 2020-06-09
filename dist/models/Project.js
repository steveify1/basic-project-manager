/**
 * Creates a new project with empty data
 */
export default class Project {
    constructor(_title, _description, _people) {
        this._title = _title;
        this._description = _description;
        this._people = _people;
        this._state = 'active';
        this._id = `${Date.now().toString()}`;
    }
    /**
     * A static method that creates and returns a new `Project` instance
     */
    static create(title, description, people) {
        return new Project(title, description, people);
    }
    get state() {
        return this._state;
    }
    get id() {
        return this._id;
    }
    get title() {
        return this._title;
    }
    get description() {
        return this._description;
    }
    get people() {
        return this._people;
    }
    set people(n) {
        this.people = n;
    }
    markAsComplete() {
        this._state = 'completed';
    }
    markAsActive() {
        this._state = 'active';
    }
}
//# sourceMappingURL=Project.js.map