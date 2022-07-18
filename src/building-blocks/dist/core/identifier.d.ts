export declare abstract class Identifier<ValueType> {
    readonly value: ValueType;
    constructor(value: ValueType);
    equals(id: Identifier<ValueType>): any;
}
