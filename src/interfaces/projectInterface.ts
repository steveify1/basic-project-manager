namespace App {
  export interface IProject {
    id?: string;
    title: string;
    description: string;
    people: number;
    state?: string;
  }

  export interface IProjectWithTemplate extends IProject {
    template: any;
  }
}
