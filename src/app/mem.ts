import { addZeros } from './utils/string.utils';

export class Memory {

    public readonly maxMem = 65536;

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
        
        if (parseInt(address, 16) > this.maxMem || parseInt(address, 16) < 0) {
            alert('adres poza pamięcią!');
            return;
        }
        if (!value || !this._memory[address.toUpperCase()]) return;
        this._memory[address.toUpperCase()] = value;
    }

    public read(address: string): string | null {
        if (parseInt(address, 16) > this.maxMem) {
            alert('adres poza pamięcią');
            return null;
        }
        return this._memory[address.toUpperCase()];
    }

 

    public clear() {
        for(let i = 0; i < this.maxMem; ++i) this._memory[i.toString(16).toUpperCase()] = '0000';
    }

}

