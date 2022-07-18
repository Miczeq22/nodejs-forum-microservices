import { BusinessRule } from '@core/business-rule';
import { UniqueEntityID } from '@core/unique-entity-id';
import { BusinessRuleValidationError } from '@errors/business-rule-validation.error';
import { MyForumError } from '@errors/my-forum.error';
import { AsyncFunction } from '@tools/async-function';

export abstract class Entity<PropsType extends object = {}> {
  constructor(
    protected readonly props: PropsType,
    protected readonly id: UniqueEntityID = new UniqueEntityID(),
  ) {}

  protected static checkRule(
    rule: BusinessRule,
    ErrorType: typeof MyForumError = BusinessRuleValidationError,
  ): Promise<void> | void {
    if (rule.isBroken instanceof Promise || rule.isBroken instanceof AsyncFunction) {
      return (rule.isBroken() as Promise<boolean>).then((isBroken) => {
        if (isBroken) {
          throw new ErrorType(rule.message);
        }
      });
    }

    if (rule.isBroken()) {
      throw new ErrorType(rule.message);
    }
  }

  public equals(object: Entity<PropsType>) {
    if (!object) {
      return false;
    }

    if (!(object instanceof Entity)) {
      return false;
    }

    return object.id.equals(this.id);
  }
}
