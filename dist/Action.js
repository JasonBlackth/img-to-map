import { Application } from "./Application.js";
export class Action {
    static create(from) {
        let action = new Action(from);
    }
    constructor(args) {
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
class ShearX {
    apply() {
        console.log(23423);
    }
    revert() { }
    constructor(amount) {
        this.internalState = amount;
    }
}
function setField(obj, key, value) {
    obj[key] = value;
}
// Example
const user = {
    name: "Alice",
    age: 30,
};
setField(user, "name", "Bob");
//# sourceMappingURL=Action.js.map