import { Application } from "./Application.js";

export type ActionType = {
    dataStorage?: any;
    apply(arg? : any): void;
    revert(arg? : any): void;
}

export class Action{
    private dataStorage : any;
    public apply : (arg? :any) => void;
    public revert : (arg? :any) => void;

    public static create(from: ActionType) : void {
        let action = new Action(from);
    }

    private constructor(args:ActionType){
        this.dataStorage = args.dataStorage;
        this.apply = args.apply;
        this.revert = args.revert;
    }
}


// class Editor {
//     public testAction: Action = makeAction({
//             apply: this.testFn,
//             revert() {
//                 console.log("revert");
//             }
//         });
//     private testFn(){}    
// }

// export function makeAction(input :ActionType): Action{
//     const fn = (() => fn.apply()) as Action;

//     fn.apply = () => {
//         input.apply(input.internalState);    // or do I need to have input.apply.call(fn)  ?
//         console.log("I just applied something");
//         Application.registerAction(fn);
//     };
//     fn.revert = () => {
//         input.revert(input.internalState);
//         console.log("I just reverted something");
//         Application.registerReversion(fn);
//     };
//     fn.internalState = input.internalState;

//     return fn;
// }

class ShearX implements ActionType{
    internalState: number;
    apply(){
        console.log(23423);
    }
    revert(){}

    public constructor(amount :number){
        this.internalState = amount;
    }

}


function setField<T, K extends keyof T>(
  obj: T,
  key: K,
  value: T[K]
): void {
  obj[key] = value;
}

// Example
const user = {
  name: "Alice",
  age: 30,
};

setField(user, "name", "Bob");






