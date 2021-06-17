import { AbstractControl, AbstractControlOptions, AsyncValidatorFn, FormArray, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';

export abstract class TypedAbstractControl<T> extends AbstractControl {
  value!: T;
  patchValue!: (value: Partial<T>, options?: ChangeValueOptions) => void;
  setValue!: (value: T, options?: ChangeValueOptions) => void;
  valueChanges!: Observable<T>;
  getTyped<K>(key: string) {
    return this.get(key) as TypedAbstractControl<K>;
  }
}

export class TypedFormGroup<T extends Object> extends FormGroup {
  value!: T;
  valueChanges!: Observable<T>;
  controls!: {
        [key in keyof T]: TypedAbstractControl<T[key]>;
    };
  patchValue!: (value: Partial<T>, options?: ChangeValueOptions) => void;
  setValue!: (value: T, options?: ChangeValueOptions) => void;
  getRawValue!: () => T;
  getTyped<K>(key: string) {
    return this.get(key) as TypedAbstractControl<K>;
  }
  constructor(
    controls: {[key in keyof T]: TypedAbstractControl<T[key]>},
    validatorsOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions,
    asyncValidators?: AsyncValidatorFn | AsyncValidatorFn[]) {
      super(controls, validatorsOrOpts, asyncValidators);
    }
}

export class TypedFormArray<T> extends FormArray {
  value!: T[];
  patchValue!: (value: T[], options?: ChangeValueOptions) => void;
  setValue!: (value: T[], options?: ChangeValueOptions) => void;
  getRawValue!: () => T[];
  valueChanges!: Observable<T[]>;
  at!: (index: number) => TypedAbstractControl<T>;
  push!: (control: TypedAbstractControl<T>) => void;
  controls!: Array<TypedAbstractControl<T>>;
  getTyped<K>(key: string) {
    return this.get(key) as TypedAbstractControl<K>;
  }
  constructor(value: Array<TypedAbstractControl<T>>,
    validatorsOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions,
    asyncValidators?: AsyncValidatorFn | AsyncValidatorFn[]) {
    super(value, validatorsOrOpts, asyncValidators);
  }
}



export class TypedFormControl<T> extends FormControl {
  value!: T;
  patchValue!: (value: Partial<T>, options?: ChangeValueOptions) => void;
  setValue!: (value: T, options?: ChangeValueOptions) => void;
  valueChanges!: Observable<T>;
  getTyped<K>(key: string) {
    return this.get(key) as TypedAbstractControl<K>;
  }
  constructor(
    value: T | {value: T, disabled: boolean},
    validatorsOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions,
    asyncValidators?: AsyncValidatorFn | AsyncValidatorFn[]
  ) {
    super(value, validatorsOrOpts, asyncValidators);
  }
}

interface ChangeValueOptions {
  emitEvent?: boolean;
  emitModelToViewChange?: boolean;
  emitViewToModelChange?: boolean;
  onlySelf?: boolean;
}
