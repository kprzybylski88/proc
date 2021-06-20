import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Memory } from './mem';
import { AddressingType, BaseRegNames, getBaseRegNamesArr, getFieldNamesArr, getIndexRegNamesArr, IndexRegNames, ProcActions, ProcModel, PROC_ACTION_NAMES, PROC_FORM_FIELD_NAMES, RegNames } from './proc.model';
import { Stack } from './stack';
import { TypedFormControl, TypedFormGroup } from './typed-forms';
import { addZeros } from './utils/string.utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  public form: TypedFormGroup<ProcModel> = new TypedFormGroup({
    ax: new TypedFormControl<string>('0000', {validators: [Validators.required, Validators.minLength(4)]}),
    bx: new TypedFormControl<string>('0000', {validators: [Validators.required, Validators.minLength(4)]}),
    cx: new TypedFormControl<string>('0000', {validators: [Validators.required, Validators.minLength(4)]}),
    dx: new TypedFormControl<string>('0000', {validators: [Validators.required, Validators.minLength(4)]}),
    di: new TypedFormControl<string>('0000', {validators: [Validators.required, Validators.minLength(4)]}),
    disp: new TypedFormControl<string>('0000', {validators: [Validators.required, Validators.minLength(4)]}),
    si: new TypedFormControl<string>('0000', {validators: [Validators.required, Validators.minLength(4)]}),
    sp: new TypedFormControl<string>({value: '0000', disabled: true}),
    bp: new TypedFormControl<string>('0000', {validators: [Validators.required, Validators.minLength(4)]}),
  });

  public formAction = new TypedFormGroup<ProcActions>({
    regFrom: new TypedFormControl<keyof RegNames>('ax'),
    regTo: new TypedFormControl<keyof RegNames>('bx'),
    stackReg: new TypedFormControl<keyof RegNames>('ax'),
    memReg: new TypedFormControl<keyof RegNames>('ax'),
    baseAddr: new TypedFormControl<keyof BaseRegNames>('bx'),
    indexAddr: new TypedFormControl<keyof IndexRegNames>({value: 'di', disabled: true}),
    addresingType: new TypedFormControl<AddressingType>(AddressingType.BASE)
  });

  public fieldNames = PROC_FORM_FIELD_NAMES;
  
  public actionNames = PROC_ACTION_NAMES;

  public memControl = new TypedFormControl<string>('0000');

  public fieldNamesArr = getFieldNamesArr();

  public baseRegNamesArr = getBaseRegNamesArr();

  public indexRegNamesArr = getIndexRegNamesArr();

  private stack = new Stack();

  private memory = new Memory();

  private _subManager = new Subscription();

  public mem = this.memory.getMemSlice('0000');

  public memAddr: string = '';

  public stackDmp = this.stack.stack;

  public regFromOpts: Array<keyof RegNames> = ['ax', 'cx', 'dx'];

  public regToOpts: Array<keyof RegNames> = ['bx', 'cx', 'dx'];

  public memTooHigh = false;

  ngOnInit() {

    this._subManager.add(this.formAction.controls.regFrom.valueChanges.subscribe(v => {
      const fromControlValue = this.formAction.controls.regFrom.value;
      const toControlValue = this.formAction.controls.regTo.value;


      if (this.regToOpts.includes(v)) {
        this.regToOpts = getFieldNamesArr().filter(val => val !== v);
        if (fromControlValue === toControlValue) this.formAction.controls.regTo.setValue(this.regToOpts[0]);
      }
    }));

    this._subManager.add(this.formAction.controls.regTo.valueChanges.subscribe(v => {
      const fromControlValue = this.formAction.controls.regFrom.value;
      const toControlValue = this.formAction.controls.regTo.value;


      if (this.regFromOpts.includes(v)) {
        this.regFromOpts = getFieldNamesArr().filter(val => val !== v);
        if (fromControlValue === toControlValue) this.formAction.controls.regFrom.setValue(this.regFromOpts[0]);
      }
    }));



    this._subManager.add(this.form.valueChanges.subscribe(() => this.memAddr = addZeros(this._getMemAddr())));
    this._subManager.add(this.formAction.valueChanges.subscribe(() => this.memAddr = addZeros(this._getMemAddr())));
    this._subManager.add(this.formAction.controls.addresingType.valueChanges.pipe(map(v => +v)).subscribe(addrType => {
      this.formAction.controls.baseAddr.disable();
      this.formAction.controls.indexAddr.disable();
      switch(addrType) {
        case AddressingType.BASE: {
          this.formAction.controls.baseAddr.enable();
          break;
        }
        case AddressingType.INDEX: {
          this.formAction.controls.indexAddr.enable();
          break;
        }
        case AddressingType.BASE_INDEX: {
          this.formAction.controls.indexAddr.enable();
          this.formAction.controls.baseAddr.enable();
        }
      }
    }));
    this.memAddr = addZeros(this._getMemAddr());
  }

  ngOnDestroy() {
    this._subManager.unsubscribe();
  }

  public movReg() {
    const regFrom=this.formAction.controls.regFrom.value;
    const regTo = this.formAction.controls.regTo.value;
    if (!regFrom?.length || !regTo?.length) return;
    const v = this.form.controls[regFrom].value;
    this.form.controls[regTo].setValue(v);
  }

  public xchgReg() {
    const regFrom = this.formAction.controls.regFrom.value;
    const regTo = this.formAction.controls.regTo.value;
    if (!regFrom?.length || !regTo?.length) return;
    const v1 = this.form.controls[regFrom].value;
    const v2 = this.form.controls[regTo].value;
    this.form.controls[regFrom].setValue(v2);
    this.form.controls[regTo].setValue(v1);
  }

  public pushToStack() {
    const stackReg = this.formAction.controls.stackReg.value;
    if (!stackReg?.length) return;
    const val = this.form.controls[stackReg].value;
    this.stack.pushToStack(val);
    this.form.controls.sp.setValue(this.stack.stackPointer.toString(16));
    this.stackDmp = this.stack.stack;
  }

  public popFromStack() {
    const stackReg = this.formAction.controls.stackReg.value;
    const val = this.stack.popFromStack();
    if (!val || !stackReg?.length) return;
    this.form.controls[stackReg].setValue(val);
    this.form.controls.sp.setValue(this.stack.stackPointer.toString(16));
    this.stackDmp = this.stack.stack;
  }

  public movMem(regMem: boolean) {

    const addr = this._getMemAddr();
    
    const valueReg = this.formAction.controls.memReg.value;
    if (regMem) {
      const value = this.form.controls[valueReg].value;
      this.memory.write(value, addr);
      this.mem = this.memory.getMemSlice(this.memControl.value);
    } else {
      const value = this.memory.read(addr);
      if (value) this.form.controls[valueReg].setValue(value);
    }
  }

  public xchgMem() {

    const addr = this._getMemAddr();

    const valueReg = this.formAction.controls.memReg.value;
    const regValue = this.form.controls[valueReg].value;
    const memValue = this.memory.read(addr);
    if (!memValue) return;
    this.form.controls[valueReg].setValue(memValue);
    this.memory.write(regValue, addr);
    this.mem = this.memory.getMemSlice(this.memControl.value);
  }

  private _getMemAddr() {
    const addressingType = this.formAction.controls.addresingType.value;
    const indexReg = this.formAction.controls.indexAddr.value;
    const baseReg = this.formAction.controls.baseAddr.value;
    const displacementVal = this.form.controls.disp.value;
    const indexVal = this.form.controls[indexReg].value;
    const baseValue = this.form.controls[baseReg].value;
    let addr10 = 0;
    switch (+addressingType) {
      case AddressingType.BASE:  {
        addr10 = parseInt(baseValue, 16) + parseInt(displacementVal, 16);
        break;
      }
      case AddressingType.INDEX: {
        addr10 = parseInt(indexVal, 16) + parseInt(displacementVal, 16);
        break;
      }
      case AddressingType.BASE_INDEX: {
        addr10 = parseInt(baseValue, 16) + parseInt(indexVal, 16) + parseInt(displacementVal, 16);
        break;
      }
    }

    this.memTooHigh = addr10 >= this.memory.maxMem;
    return addr10.toString(16);
  }

  public getMem() {
    this.mem = [...this.memory.getMemSlice(this.memControl.value)];
  }

  public reset() {
    (Object.keys(this.form.controls) as Array<keyof ProcModel>).forEach((ctrName) => this.form.controls[ctrName].setValue('0000'));
    this.memory.clear();
    this.stack.clear();
    this.stackDmp = this.stack.stack;
    this.getMem();
  }

  public random() {
    (Object.keys(this.form.controls) as Array<keyof ProcModel>).filter(c => c !== 'sp').forEach(ctn => {
      const rnd = Math.floor(Math.random() * this.memory.maxMem).toString(16).toUpperCase();
      this.form.controls[ctn].setValue(rnd);
    })
  }


}
