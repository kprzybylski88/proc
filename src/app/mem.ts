import { addZeros } from './utils/string.utils';

export class Memory {

    private readonly maxMem = 65536;

    constructor() {
        this.clear();
    }

    private _memory: {[key: string]: string} = {};
    

   public getMemSlice(start: string): string[] {
       const st = parseInt(start, 16);
       const mem: string[] = [];
       for (let i = st; i <st +64; ++i) {
           const val = this._memory[i.toString(16).toUpperCase()];
           if (val) mem.push(`${addZeros(i.toString(16).toUpperCase())}:  ${addZeros(val).toUpperCase()}`);
       }
       return mem;
   }

    public write(value: string, address: string) {
        
        if (!value || !this._memory[address.toUpperCase()]) return;
        if (parseInt(address, 16) > this.maxMem || parseInt(address, 16) < 0) {
            alert('adres poza pamięcią!');
        }
        this._memory[address.toUpperCase()] = value;
    }

    public read(address: string): string {
        return this._memory[address];
    }

 

    public clear() {
        for(let i = 0; i < this.maxMem; ++i) this._memory[i.toString(16).toUpperCase()] = '0000';
    }

}

