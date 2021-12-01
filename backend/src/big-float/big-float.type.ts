import {
  Type,
  Platform,
  EntityProperty,
  ValidationError,
} from '@mikro-orm/core';
import Big from 'big.js';

export class BigFloatType extends Type<Big, string> {
  convertToDatabaseValue(
    value: Big | string | undefined,
    platform: Platform,
  ): string {
    try {
      return new Big(value as string).toString();
    } catch (e) {
      throw ValidationError.invalidType(BigFloatType, value, 'JS');
    }
  }

  convertToJSValue(value: Big | string | undefined, platform: Platform): Big {
    try {
      const big = new Big(value as string);
      return big;
    } catch (e) {
      throw ValidationError.invalidType(BigFloatType, value, 'database');
    }
  }

  getColumnType(prop: EntityProperty, platform: Platform) {
    return 'NUMERIC';
  }
}
