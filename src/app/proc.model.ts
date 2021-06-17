export interface ProcModel {
    ax: string;
    bx: string;
    cx: string;
    dx: string;
    si: string;
    di: string;
    bp: string;
    sp: string;
    disp: string;
}

export const PROC_FORM_FIELD_NAMES: {[key in keyof ProcModel]: key} = {
    ax: 'ax',
    bp: 'bp',
    bx: 'bx',
    cx: 'cx',
    di: 'di',
    disp: 'disp',
    dx: 'dx',
    si: 'si',
    sp: 'sp'
}

export type RegNames = Pick<ProcModel, 'ax' | 'bx' | 'cx' | 'dx'>;

export const regNames: {[key in keyof RegNames]: key} = {
    ax: 'ax',
    bx: 'bx',
    cx: 'cx',
    dx: 'dx'
}

export type BaseRegNames = Pick<ProcModel, 'bx' | 'bp'>

export const getBaseRegNamesArr = (): Array<keyof BaseRegNames> => ['bx', 'bp'];

export type IndexRegNames = Pick<ProcModel, 'di' | 'si'>;

export const getIndexRegNamesArr = (): Array<keyof IndexRegNames> => ['di', 'si']

export const getFieldNamesArr = (): Array<keyof RegNames> => (Object.keys(regNames) as Array<keyof RegNames>);

export interface ProcActions {
    regFrom: keyof RegNames,
    regTo: keyof RegNames,
    stackReg: keyof RegNames,
    memReg: keyof RegNames,
    baseAddr: keyof BaseRegNames,
    indexAddr: keyof IndexRegNames,
    addresingType: AddressingType,
}

export const PROC_ACTION_NAMES: {[key in keyof ProcActions]: key} = {
    addresingType: 'addresingType',
    baseAddr: 'baseAddr',
    indexAddr: 'indexAddr',
    memReg: 'memReg',
    regFrom: 'regFrom',
    regTo: 'regTo',
    stackReg: 'stackReg'
}

export enum AddressingType {
    BASE = 0,
    INDEX = 1,
    BASE_INDEX = 2
}

export const addressingTypesArr = (): Array<AddressingType> => [
    AddressingType.BASE,
    AddressingType.INDEX,
    AddressingType.BASE_INDEX
]
