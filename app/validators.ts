/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { isEmpty } from 'ramda';
import * as yup from 'yup';

declare module 'yup' {
  interface ArraySchema<
    TIn extends any[] | null | undefined,
    TContext,
    TDefault = undefined,
    TFlags extends yup.Flags = '',
  > {
    uniqueItemProperty(path: string, message: string): this;
  }
}

yup.addMethod(yup.array, 'uniqueItemProperty', function (path: string, message: string) {
  return this.test('unique', message, (array, ctx) => {
    if (Array.isArray(array)) {
      const errors: yup.ValidationError[] = [];

      // Construct values
      const values = array.map((i) => {
        const value = i[path];
        if (typeof value === 'string') {
          return value.toLowerCase().trim();
        }

        return value;
      });

      const duplicates: number[] = [];
      const uniqueElements = new Set();

      values.forEach((propertyValue, index) => {
        if (uniqueElements.has(propertyValue)) {
          duplicates.push(index);
        } else {
          uniqueElements.add(propertyValue);
        }
      });

      duplicates.forEach((item) => {
        errors.push(
          ctx.createError({
            path: `${ctx.path}[${item}].${path}`,
            message,
          }),
        );
      });

      if (!isEmpty(errors)) {
        return new yup.ValidationError(errors);
      }
    }

    return true;
  });
});
