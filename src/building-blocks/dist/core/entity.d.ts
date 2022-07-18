import { BusinessRule } from './business-rule';
import { UniqueEntityID } from './unique-entity-id';
import { MyForumError } from '../errors/my-forum.error';
export declare abstract class Entity<PropsType extends object = {}> {
    protected readonly props: PropsType;
    protected readonly id: UniqueEntityID;
    constructor(props: PropsType, id?: UniqueEntityID);
    protected static checkRule(rule: BusinessRule, ErrorType?: typeof MyForumError): Promise<void> | void;
    equals(object: Entity<PropsType>): any;
}
