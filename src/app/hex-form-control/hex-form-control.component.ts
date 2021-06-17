import { Component, forwardRef, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TypedFormControl } from '../typed-forms';
import { addZeros } from '../utils/string.utils';

@Component({
    templateUrl: 'hex-form-control.component.html',
    selector: 'app-hex-form-control',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => HexFormControlComponent),
            multi: true
        }
    ]
})
export class HexFormControlComponent implements ControlValueAccessor, OnInit, OnDestroy {

    public fieldControl = new TypedFormControl<string>('');

    private _sub = new Subscription();

    ngOnInit() {
        this._sub.add(this.fieldControl.valueChanges.subscribe(v => this.propagateChange(v)));
    }

    ngOnDestroy() {
        this._sub.unsubscribe();
    }

    writeValue(value: string): void {
        if (!this._checkIfHex(value)) return;
        
        this.fieldControl.setValue(addZeros(value));
    }

    setDisabledState?(isDisabled: boolean): void {
        this.fieldControl[isDisabled ? 'disable' : 'enable']({emitEvent: false});
    }

    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }
    
    registerOnTouched(fn: any): void {
        this.touchField = fn;
    }

    propagateChange = (_: any) => {};
    touchField = (_: any) => {};

    public writeToInput(event: KeyboardEvent) {
        const target = event.target as HTMLInputElement;
        let key = event.key;
        if (key !== 'Backspace' && key !== 'Delete' && (key.length > 1 || event.ctrlKey)) return;
        const selectionStart = target.selectionStart || 0;
        const selectionEnd = target.selectionEnd || 0
        const selectionLength = selectionEnd - selectionStart;
        const currentFieldValue = target.value;
        let cutStart = selectionStart;
        let cutEnd = selectionEnd;
        let updatedString = '';
        if (key === 'Backspace' && !selectionLength) cutStart = cutStart - 1;
        if (key === 'Delete' && !selectionLength) cutEnd = cutEnd + 1;
        if (key === 'Backspace' || key === 'Delete') key = '';
        updatedString = this._spliceText(currentFieldValue, cutStart, cutEnd, key);
        if (!this._checkIfHex(updatedString)) event.preventDefault();
    }

    public paste(event: ClipboardEvent) {
        const pastedText = event?.clipboardData?.getData('text');
        const target = event.target as HTMLInputElement;
        const updatedString = this._spliceText(target.value, target.selectionStart || 0, target.selectionEnd || 0, pastedText || '');
        if (!this._checkIfHex(updatedString)) event.preventDefault();
    }

    public onBlur(event: FocusEvent) {
        const val = addZeros(this.fieldControl.value);
        if (val === this.fieldControl.value) return;
        this.fieldControl.setValue(val); 
    }
    
    private _checkIfHex(text: string) {
        if (!text.length) return true;
        const regText = new RegExp('^[0-9A-Fa-f]+$');
        return  regText.test(text);
    }

    private _spliceText(inputText: string, cutStart: number, cutEnd: number, replacementText: string): string {
        const text1 = inputText.slice(0, cutStart);
        const text2 = inputText.slice(cutEnd, inputText.length);
        return text1 + replacementText + text2;
    }


}