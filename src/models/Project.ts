namespace App {
  /**
   * Creates a new project with empty data
   */
  export class Project implements IProject {
    private _state: 'active' | 'completed' = 'active';
    private _id: string;

    /**
     * A static method that creates and returns a new `Project` instance
     */
    static create(title: string, description: string, people: number): Project {
      return new Project(title, description, people);
    }

    private constructor(
      private _title: string,
      private _description: string,
      private _people: number
    ) {
      this._id = `${Date.now().toString()}`;
    }

    get state(): string {
      return this._state;
    }

    get id(): string {
      return this._id;
    }

    get title(): string {
      return this._title;
    }
    get description(): string {
      return this._description;
    }
    get people(): number {
      return this._people;
    }

    set people(n: number) {
      this.people = n;
    }

    markAsComplete() {
      this._state = 'completed';
    }

    markAsActive() {
      this._state = 'active';
    }
  }
}
