import { addZeros } from './utils/string.utils';

export class Stack {
    
    private _stack: string[] = [];
    
    public get stack() {
        return this._stack.map((s, i) => `${addZeros(s)}`).reverse()
    }

    private _stackPointer = 0;

    public get stackPointer() {
        return this._stackPointer;
    }

   

    public pushToStack(value: string) {
        this._stackPointer += 2;
        this._stack.push(value);
    }

    public popFromStack(): string | undefined {
        if (this._stackPointer) this._stackPointer -= 2;
        return this._stack.pop();
    }

    public clear() {
        this._stack = [];
        this._stackPointer = 0;
    }

    

}