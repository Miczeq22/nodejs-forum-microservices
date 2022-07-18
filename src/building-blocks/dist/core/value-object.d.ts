import { MyForumError } from '../errors/my-forum.error';
import { BusinessRule } from './business-rule';
export declare abstract class ValueObject<PropsType extends object = {}> {
    readonly props: PropsType;
    constructor(props: PropsType);
    protected static checkRule(rule: BusinessRule, ErrorType?: typeof MyForumError): Promise<void> | void;
    equals(object: ValueObject<PropsType>): any;
}
