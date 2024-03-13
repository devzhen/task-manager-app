import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import type { UpdateCardMultipleBodyType } from '@/app/types';

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
  WHERE Cards.id::text = Temp.id::text;



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
  const prisma = new PrismaClient({ log: ['query'] });

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

    let sql = `
      UPDATE "Cards" AS Cards SET
        id = Temp.id,
        ...fields
      FROM (VALUES
          ...values
      ) AS Temp(id,...Temp.fields)
      WHERE Cards.id::text = Temp.id::text;`;

    let fieldsSql = ``;
    let tempFieldsSql = ``;
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];

      fieldsSql = `${fieldsSql}
        ${field} = Temp.${field}${i === fields.length - 1 ? '' : ','}`;

      tempFieldsSql = `${tempFieldsSql} ${field}${i === fields.length - 1 ? '' : ','}`;
    }
    sql = sql.replace('...fields', fieldsSql).replace('...Temp.fields', tempFieldsSql);

    let valuesSql = ``;
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      valuesSql = `${valuesSql}
        (uuid('${id}'), `;

      const valuesObj = values[i];
      for (let k = 0; k < fields.length; k++) {
        const field = fields[k];

        const value = valuesObj[field];

        if (!value || (typeof value !== 'string' && typeof value !== 'number')) {
          return NextResponse.json(
            { error: `Incorrect body - ${field} = ${value}` },
            { status: 422 },
          );
        }

        valuesSql = `${valuesSql}${typeof value === 'string' ? `'${value}'` : value}${k === fields.length - 1 ? '' : ', '}`;
      }
      valuesSql = `${valuesSql}${i === ids.length - 1 ? ')' : '),'}`;
    }
    sql = sql.replace('...values', valuesSql);

    await prisma.$queryRawUnsafe(sql);

    const result = await prisma.cards.findMany({
      where: {
        OR: ids.map((id) => ({ id })),
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error, message: (error as Error).message }, { status: 500 });
  } finally {
    prisma.$disconnect;
  }
};
