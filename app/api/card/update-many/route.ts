import { PrismaClient } from '@prisma/client';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import type { FilteredValues, UpdateCardMultipleBodyType } from '@/app/types';

/**
  Construct SQl query:
 
  UPDATE "Cards" AS Cards SET
    id = Temp.id,
    description = Temp.description,
    position = Temp.position
  FROM (VALUES
      (uuid('cf8d69c3-4b7f-4f41-90b3-2733f70a3d1c'), 'test', 100),
      (uuid('fbf317bc-10df-4caa-8859-c5ed0a80a11c'), 'test', 100)
  ) AS Temp(id, description, position)
  WHERE Cards.id::text = Temp.id;



  PUT body example:

  {
    "ids": ["cf8d69c3-4b7f-4f41-90b3-2733f70a3d1c", "fbf317bc-10df-4caa-8859-c5ed0a80a11c"],
    "fields": ["position", "description"],
    "values": [
        {
            "position": -1,
            "description": "Test 1"
        },
        {
            "position": -1,
            "description": "Test 2"
        }
    ]
  }
 */
export const PUT = async (req: NextRequest) => {
  const prisma = new PrismaClient();

  try {
    const { ids, fields, values } = (await req.json()) as UpdateCardMultipleBodyType;

    if (!ids) {
      return NextResponse.json(
        { error: `The required query param 'ids' was not provided` },
        { status: 422 },
      );
    }

    if (ids.length !== values.length) {
      return NextResponse.json({ error: `Incorrect body` }, { status: 422 });
    }

    const generateUpdateSection = (fieldsArr: string[]) => {
      let sql = ``;

      for (let i = 0; i < fieldsArr.length; i++) {
        const field = fieldsArr[i];

        const end = i === fieldsArr.length - 1 ? '' : ',';

        sql = `${sql}"${field}" = Temp."${field}"${end}\n\t`;
      }

      return sql.trim();
    };

    const generateAsSection = (fieldsArr: string[]) => {
      return fieldsArr.map((item) => `"${item}"`).toString();
    };

    const generateValuesSection = (
      cardIds: string[],
      fieldsArr: string[],
      valuesArr: Record<string, string | number>[],
    ) => {
      let str = ``;

      for (let i = 0; i < cardIds.length; i++) {
        const id = cardIds[i];

        const endI = i === cardIds.length - 1 ? '' : ',';

        str = `${str}('${id}',...)${endI}`;

        let innerString = ``;

        for (let k = 0; k < fieldsArr.length; k++) {
          const field = fieldsArr[k];
          let value = valuesArr[i][field];

          if (typeof value === 'string') {
            const isUUID = field.indexOf('Id') !== -1;

            if (isUUID) {
              value = `uuid('${value}')`;
            } else {
              value = `'${value}'`;
            }
          }

          const endK = k === fieldsArr.length - 1 ? '' : ',';

          innerString = `${innerString}${value}${endK}`;
        }

        str = str.replace('...', innerString);
      }

      return str;
    };

    const updateSectionFields = generateUpdateSection(fields);
    const asSectionFields = generateAsSection(fields);
    const valuesSection = generateValuesSection(ids, fields, values as FilteredValues[]);

    const finalSql = `UPDATE "Card" AS Card SET
      ${updateSectionFields}
FROM (
  VALUES
    ${valuesSection}
  ) 
AS Temp(id,${asSectionFields})
WHERE Card.id::text = Temp.id;`;

    // Transaction
    const updated = await prisma.$transaction(async (tx) => {
      await tx.$queryRawUnsafe(finalSql);

      const res = await prisma.card.findMany({
        where: {
          id: { in: ids },
        },
      });

      return res;
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error, message: (error as Error).message }, { status: 500 });
  } finally {
    prisma.$disconnect;
  }
};
