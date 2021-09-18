export function groupArray<T>(arr: T[], size: number): T[][] {
    const result: T[][] = [];
    let pos = 0;
    while (pos < arr.length) {
        result.push(arr.slice(pos, pos + size));
        pos += size;
    }
    return result;
}
