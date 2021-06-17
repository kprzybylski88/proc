export const addZeros = (value: string): string => {
    let zeros = '';
    for (let i = 0; i < 4 - value.length; ++i) zeros += '0';
    return zeros + value;
}